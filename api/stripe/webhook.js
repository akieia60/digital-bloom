import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { waitUntil } from '@vercel/functions';
import { captureReservedCredit } from '../_lib/creditReservations.js';
import { finalizePurchasesBySession } from '../_lib/purchaseFlow.js';
import { processBloomDeliveryEmails } from '../_lib/bloomDeliveryEmail.js';
import { sendBloomCreditEmail } from '../_lib/creditEmail.js';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf-8');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function isAlreadyProcessed(stripeSessionId) {
  const { data, error } = await supabase
    .from('experience_credits')
    .select('id')
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle();

  if (error) {
    console.error('Idempotency check error:', error);
    return true;
  }

  return !!data;
}

async function handleCreditPurchase(session, metadata) {
  const { code, amount_cents, purchaser_email, recipient_email, recipient_name, delivery_date, note } = metadata;

  const { data: credit, error: creditError } = await supabase
    .from('experience_credits')
    .insert({
      code,
      initial_amount_cents: parseInt(amount_cents, 10),
      remaining_amount_cents: parseInt(amount_cents, 10),
      purchaser_email,
      recipient_email: recipient_email || purchaser_email,
      status: 'active',
      stripe_session_id: session.id,
    })
    .select()
    .single();

  if (creditError) throw creditError;

  await supabase.from('experience_credit_ledger').insert({
    credit_id: credit.id,
    reason: 'purchase',
    delta_cents: parseInt(amount_cents, 10),
    related_order_id: session.id,
  });

  if (delivery_date && new Date(delivery_date) > new Date()) {
    await supabase.from('scheduled_credit_emails').insert({
      credit_id: credit.id,
      recipient_email: recipient_email || purchaser_email,
      delivery_date,
      status: 'pending',
    });
  } else {
    try {
      await sendBloomCreditEmail({
        req: { headers: { origin: session.success_url ? new URL(session.success_url).origin : undefined } },
        to: recipient_email || purchaser_email,
        code: credit.code,
        amountCents: parseInt(amount_cents, 10),
        remainingAmountCents: credit.remaining_amount_cents,
        recipientName: recipient_name,
        purchaserEmail: purchaser_email,
        note,
      });
    } catch (emailError) {
      console.error('Bloom Credit email send failed:', emailError);
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  const metadata = session.metadata || {};

  try {
    if (metadata.type === 'experience_credit') {
      const alreadyDone = await isAlreadyProcessed(session.id);
      if (alreadyDone) {
        return res.status(200).json({ received: true, duplicate: true });
      }

      await handleCreditPurchase(session, metadata);
    }

    if (metadata.reservation_id) {
      await captureReservedCredit(metadata.reservation_id, session.id);
    }

    const purchases = await finalizePurchasesBySession(session.id, session.payment_intent || null);

    // Deliver emails in the background — return 200 to Stripe immediately.
    // This prevents the webhook from timing out on Vercel serverless (10s limit).
    const deliveryTask = processBloomDeliveryEmails({
      supabase,
      purchases,
      req: { headers: { origin: session.success_url ? new URL(session.success_url).origin : undefined } },
      explicitTestMode: session.livemode === false,
    }).catch((emailError) => {
      console.error('Bloom delivery email processing failed (background):', emailError);
    });

    try {
      waitUntil(deliveryTask);
    } catch {
      void deliveryTask;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
