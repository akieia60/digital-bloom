/**
 * Digital Bloom — One-Time Stripe Product Setup Endpoint
 * =======================================================
 * POST /api/setup/create-products
 *
 * Creates the 4 pricing tier products and prices in Stripe (TEST MODE).
 * Protect this endpoint with a setup secret before deploying.
 *
 * USAGE (run once after deploying):
 *   curl -X POST https://your-vercel-url.vercel.app/api/setup/create-products \
 *     -H "Content-Type: application/json" \
 *     -d '{"setup_secret": "YOUR_SETUP_SECRET"}'
 *
 * Set SETUP_SECRET in your Vercel environment variables.
 * After running, add the returned IDs to your Vercel env vars and redeploy.
 *
 * ⚠️  DISABLE OR DELETE THIS ENDPOINT AFTER FIRST USE.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PRODUCTS = [
  {
    tier: 1,
    key: 'single_bloom',
    name: 'Single Bloom',
    description: 'One bloom video, standard length (8–10 seconds). Perfect for a quick, heartfelt digital gesture.',
    price_cents: 199,
    metadata: { tier: '1', duration_min: '8', duration_max: '10', product_type: 'digital_bloom' },
  },
  {
    tier: 2,
    key: 'bloom_experience',
    name: 'Bloom Experience',
    description: 'Multi-scene stitched experience (25–35 seconds). A flowing narrative of blooms crafted for deeper emotion.',
    price_cents: 499,
    metadata: { tier: '2', duration_min: '25', duration_max: '35', product_type: 'digital_bloom' },
  },
  {
    tier: 3,
    key: 'premium_bloom',
    name: 'Premium Bloom',
    description: 'Full cinematic experience (35–45 seconds). Elevated production with rich visuals and immersive storytelling.',
    price_cents: 999,
    metadata: { tier: '3', duration_min: '35', duration_max: '45', product_type: 'digital_bloom' },
  },
  {
    tier: 4,
    key: 'signature_collection',
    name: 'Signature Collection',
    description: 'Top-tier cinematic bloom experience — the longest and most premium offering. Bespoke artistry at its finest.',
    price_cents: 1999,
    metadata: { tier: '4', duration_min: '45', duration_max: '60', product_type: 'digital_bloom' },
  },
];

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Guard with setup secret
  const setupSecret = process.env.SETUP_SECRET;
  const { setup_secret } = req.body || {};

  if (!setupSecret || setup_secret !== setupSecret) {
    return res.status(401).json({ error: 'Unauthorized — invalid setup_secret' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' });
  }

  const results = [];
  const errors = [];

  for (const def of PRODUCTS) {
    try {
      const product = await stripe.products.create({
        name: def.name,
        description: def.description,
        metadata: def.metadata,
        statement_descriptor: 'DIGITALBLOOM',
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: def.price_cents,
        currency: 'usd',
        metadata: { tier: String(def.tier), key: def.key },
      });

      results.push({
        tier: def.tier,
        key: def.key,
        name: def.name,
        price_dollars: (def.price_cents / 100).toFixed(2),
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        env_var_product: `VITE_STRIPE_PRODUCT_TIER${def.tier}=${product.id}`,
        env_var_price: `VITE_STRIPE_PRICE_TIER${def.tier}=${price.id}`,
      });
    } catch (err) {
      errors.push({ tier: def.tier, name: def.name, error: err.message });
    }
  }

  const envBlock = results
    .map(
      (r) =>
        `# Tier ${r.tier} — ${r.name}\n${r.env_var_product}\n${r.env_var_price}`
    )
    .join('\n\n');

  return res.status(200).json({
    success: true,
    message: `Created ${results.length} products in Stripe TEST MODE. Copy the env_vars_block into your Vercel environment variables and redeploy.`,
    products_created: results.length,
    errors_count: errors.length,
    results,
    errors,
    env_vars_block: envBlock,
  });
}
