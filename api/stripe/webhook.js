import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const body = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      body,
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
      if (metadata.type === 'experience_credit') {
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

// Helper to get raw body for webhook signature verification
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
