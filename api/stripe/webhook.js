import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

/**
 * FIX #1 — Disable Vercel's default body parser so we receive the raw body.
 * Stripe signature verification requires the raw (unparsed) request body.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Collect the raw body from the request stream.
 * Works on Vercel when bodyParser is disabled via the config export above.
 */
async function getRawBody(req) {
  // If Vercel already provides the raw body as a Buffer, use it directly
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  // If it's a string (Vercel sometimes does this), convert to Buffer
  if (typeof req.body === 'string') {
    return Buffer.from(req.body, 'utf-8');
  }
  // Otherwise, stream-read the body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * FIX #2 — Idempotency check.
 * Returns true if this stripe_session_id has already been processed,
 * preventing duplicate credit creation on webhook retries.
 */
async function isAlreadyProcessed(stripeSessionId) {
  const { data, error } = await supabase
    .from('experience_credits')
    .select('id')
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle();

  if (error) {
    console.error('Idempotency check error:', error);
    // On error, err on the side of caution — do NOT re-process
    return true;
  }
  return !!data;
}

// ── Business Logic ───────────────────────────────────────────────────────────

async function handleCreditPurchase(session, metadata) {
  const { code, amount_cents, purchaser_email, recipient_email, delivery_date, note } = metadata;

  // Create credit record
  const { data: credit, error: creditError } = await supabase
    .from('experience_credits')
    .insert({
      code,
      initial_amount_cents: parseInt(amount_cents),
      remaining_amount_cents: parseInt(amount_cents),
      purchaser_email,
      recipient_email: recipient_email || purchaser_email,
      status: 'active',
      stripe_session_id: session.id
    })
    .select()
    .single();

  if (creditError) throw creditError;

  // Create ledger entry
  await supabase.from('experience_credit_ledger').insert({
    credit_id: credit.id,
    type: 'purchase',
    amount_cents: parseInt(amount_cents),
    description: `Credit purchased for $${parseInt(amount_cents) / 100}`
  });

  // Schedule email if delivery_date is in the future
  if (delivery_date && new Date(delivery_date) > new Date()) {
    await supabase.from('scheduled_credit_emails').insert({
      credit_id: credit.id,
      recipient_email: recipient_email || purchaser_email,
      delivery_date,
      status: 'pending'
    });
  }
}

async function captureReservation(reservationId, stripeSessionId) {
  // Get reservation
  const { data: reservation, error: resError } = await supabase
    .from('experience_credit_reservations')
    .select('*, experience_credits(*)')
    .eq('id', reservationId)
    .single();

  if (resError || !reservation) throw new Error('Reservation not found');

  // Update credit balance
  const newBalance = reservation.experience_credits.remaining_amount_cents - reservation.reserved_cents;
  const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

  await supabase
    .from('experience_credits')
    .update({
      remaining_amount_cents: newBalance,
      status: newStatus
    })
    .eq('id', reservation.credit_id);

  // Create ledger entry
  await supabase.from('experience_credit_ledger').insert({
    credit_id: reservation.credit_id,
    type: 'redemption',
    amount_cents: -reservation.reserved_cents,
    description: `Credit applied to purchase`,
    stripe_session_id: stripeSessionId
  });

  // Mark reservation as captured
  await supabase
    .from('experience_credit_reservations')
    .update({
      status: 'captured',
      stripe_session_id: stripeSessionId
    })
    .eq('id', reservationId);
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    try {
      // FIX #2 — Idempotency: skip if this session was already processed
      if (metadata.type === 'experience_credit') {
        const alreadyDone = await isAlreadyProcessed(session.id);
        if (alreadyDone) {
          console.log(`Skipping duplicate webhook for session ${session.id}`);
          return res.status(200).json({ received: true, duplicate: true });
        }
        await handleCreditPurchase(session, metadata);
      }

      if (metadata.reservation_id) {
        await captureReservation(metadata.reservation_id, session.id);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).json({ received: true });
  }
}
