import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Allowed credit amounts in cents
const ALLOWED_AMOUNTS = [1000, 2500, 5000, 10000, 15000, 20000];

function generateCreditCode() {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `DBLOOM-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount_cents,
      purchaser_email,
      recipient_email = null,
      delivery_date = null,
      note = null
    } = req.body;

    // Validate amount
    if (!ALLOWED_AMOUNTS.includes(amount_cents)) {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    // Validate email
    if (!purchaser_email || !purchaser_email.includes('@')) {
      return res.status(400).json({ error: 'Valid purchaser email required' });
    }

    // Generate credit code
    const code = generateCreditCode();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `DigitalBloom Experience Credit - $${amount_cents / 100}`,
              description: 'Prepaid access to digital multimedia experiences',
            },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/credits`,
      customer_email: purchaser_email,
      metadata: {
        type: 'experience_credit',
        code,
        amount_cents: amount_cents.toString(),
        purchaser_email,
        recipient_email: recipient_email || purchaser_email,
        delivery_date: delivery_date || '',
        note: note || ''
      },
    });

    res.status(200).json({ url: session.url, code });
  } catch (error) {
    console.error('Error creating credit checkout:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
