import { applyCors } from './_lib/cors.js';
import { createCheckoutSessionResult } from './_lib/checkoutSession.js';

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      cartItems,
      successUrl,
      cancelUrl,
      customerEmail,
      reservation_id,
      remaining_due_cents,
      metadata = {},
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const result = await createCheckoutSessionResult({
      cartItems,
      successUrl,
      cancelUrl,
      customerEmail,
      reservation_id,
      remaining_due_cents,
      metadata,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
