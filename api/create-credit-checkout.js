import Stripe from 'stripe';
import crypto from 'crypto';
import { applyCors } from './_lib/cors.js';
import { resolvePublicBaseUrl } from './_lib/publicBaseUrl.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
// Allowed credit amounts in cents
const ALLOWED_AMOUNTS = [1000, 2500, 5000, 10000, 15000, 20000];
const CREDIT_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCreditCode() {
  const bytes = crypto.randomBytes(8);
  const randomPart = Array.from(bytes)
    .map((byte) => CREDIT_CODE_CHARS[byte % CREDIT_CODE_CHARS.length])
    .join('');
  return `DBLOOM-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}`;
}

export default async function handler(req, res) {
  // FIX #6 — CORS hardening (replaces wildcard origin)
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount_cents,
      purchaser_email,
      recipient_email = null,
      recipient_name = null,
      delivery_date = null,
      note = null
    } = req.body;

    // Validate amount (ensure it's an integer)
    const amountCentsInt = parseInt(amount_cents, 10);
    
    if (!Number.isInteger(amountCentsInt) || !ALLOWED_AMOUNTS.includes(amountCentsInt)) {
      console.error('Invalid amount:', { amount_cents, amountCentsInt, allowed: ALLOWED_AMOUNTS });
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    // Validate email
    if (!purchaser_email || !purchaser_email.includes('@')) {
      return res.status(400).json({ error: 'Valid purchaser email required' });
    }

    // Generate credit code
    const code = generateCreditCode();
    const appBaseUrl = resolvePublicBaseUrl(req);

    // Create Stripe checkout session
    const sessionConfig = {
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Digital Bloom Credit - $${amountCentsInt / 100}`,
              description: 'Prepaid Bloom Credit for digital gifting and checkout',
            },
            unit_amount: amountCentsInt,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/credits`,
      customer_email: purchaser_email,
      metadata: {
        type: 'experience_credit',
        code,
        amount_cents: amountCentsInt.toString(),
        purchaser_email,
        recipient_email: recipient_email || purchaser_email,
        recipient_name: recipient_name || '',
        delivery_date: delivery_date || '',
        note: note || ''
      },
    };

    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionConfig);
    } catch (stripeError) {
      if (stripeError.message && stripeError.message.includes('automatic_payment_methods')) {
        delete sessionConfig.automatic_payment_methods;
        sessionConfig.payment_method_types = ['card'];
        session = await stripe.checkout.sessions.create(sessionConfig);
      } else {
        throw stripeError;
      }
    }

    if (!session || !session.url) {
      console.error('Stripe session created but no checkout URL returned:', session);
      return res.status(500).json({ error: 'Checkout session created but no redirect URL was returned. Please try again.' });
    }

    res.status(200).json({ url: session.url, code });
  } catch (error) {
    console.error('Error creating credit checkout:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
