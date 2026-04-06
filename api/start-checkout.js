import { applyCors } from './_lib/cors.js';
import { createCheckoutSessionResult } from './_lib/checkoutSession.js';

function buildRedirectUrl(baseUrl, errorMessage) {
  const fallback = 'https://digitabloom.com/shop';

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

async function parsePayload(req) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload = null;
  try {
    payload = await parsePayload(req);
    const result = await createCheckoutSessionResult(payload);
    return res.redirect(303, result.url);
  } catch (error) {
    console.error('Error starting hosted checkout:', error);
    const cancelUrl = payload?.cancelUrl || 'https://digitabloom.com/shop';
    return res.redirect(303, buildRedirectUrl(cancelUrl, error.message || 'Unable to start checkout'));
  }
}
