import { applyCors } from './_lib/cors.js';
import { createCheckoutSessionResult } from './_lib/checkoutSession.js';

function buildRedirectUrl(baseUrl, errorMessage) {
  const fallback = 'https://digitalbloom.store/shop';

  try {
    const url = new URL(baseUrl || fallback, fallback);
    url.searchParams.set('checkout_error', errorMessage);
    url.searchParams.set('cart', 'open');
    return url.toString();
  } catch (error) {
    const url = new URL(fallback);
    url.searchParams.set('checkout_error', errorMessage);
    url.searchParams.set('cart', 'open');
    return url.toString();
  }
}

async function readRawBody(req) {
  if (typeof req.body === 'string') {
    return req.body;
  }

  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function parseCheckoutPayload(req) {
  const rawBody = await readRawBody(req);

  if (rawBody && typeof rawBody === 'object') {
    if (typeof rawBody.payload === 'string') {
      return JSON.parse(rawBody.payload);
    }
    return rawBody;
  }

  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody || '{}');
  }

  const params = new URLSearchParams(rawBody || '');
  const payload = params.get('payload');
  if (!payload) {
    throw new Error('Missing checkout payload');
  }

  return JSON.parse(payload);
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (process.env.VERCEL_ENV === 'production' && process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
    console.error('CRITICAL: Production using test Stripe keys');
    return res.status(503).json({ error: 'Payment system is being configured.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const wantsRedirect = req.query?.mode === 'redirect';
  let payload = null;

  try {
    payload = await parseCheckoutPayload(req);
    const {
      cartItems,
      successUrl,
      cancelUrl,
      customerEmail,
      reservation_id,
      remaining_due_cents,
      metadata = {},
      delivery = null,
    } = payload;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const result = await createCheckoutSessionResult({
      req,
      cartItems,
      successUrl,
      cancelUrl,
      customerEmail,
      reservation_id,
      remaining_due_cents,
      metadata,
      delivery,
    });

    if (wantsRedirect) {
      return res.redirect(303, result.url);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (wantsRedirect) {
      const cancelUrl = payload?.cancelUrl || 'https://digitalbloom.store/shop';
      return res.redirect(303, buildRedirectUrl(cancelUrl, error.message || 'Unable to start checkout'));
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
