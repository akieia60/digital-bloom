/**
 * Digital Bloom — Pricing Tier Configuration
 *
 * This file is the single source of truth for all product tiers,
 * prices, and Stripe IDs. Never hardcode prices in components.
 *
 * After running the Stripe setup script (scripts/setup-stripe-products.js),
 * replace the placeholder STRIPE_PRICE_ID and STRIPE_PRODUCT_ID values
 * below with the real IDs from your Stripe Dashboard or the script output.
 *
 * Environment variable overrides (recommended for production):
 *   VITE_STRIPE_PRICE_TIER1  — Single Bloom price ID
 *   VITE_STRIPE_PRICE_TIER2  — Bloom Experience price ID
 *   VITE_STRIPE_PRICE_TIER3  — Premium Bloom price ID
 *   VITE_STRIPE_PRICE_TIER4  — Signature Collection price ID
 */

export const PRICING_TIERS = [
  {
    tier: 1,
    key: 'single_bloom',
    name: 'Single Bloom',
    tagline: 'One bloom video, standard length',
    description: 'One bloom video, standard length (8–10 seconds). Perfect for a quick, heartfelt digital gesture.',
    price: 1.99,
    price_cents: 199,
    duration_seconds_min: 8,
    duration_seconds_max: 10,
    stripe_product_id: import.meta.env.VITE_STRIPE_PRODUCT_TIER1 || 'REPLACE_WITH_STRIPE_PRODUCT_ID_TIER1',
    stripe_price_id: import.meta.env.VITE_STRIPE_PRICE_TIER1 || 'REPLACE_WITH_STRIPE_PRICE_ID_TIER1',
    badge: null,
    popular: false,
  },
  {
    tier: 2,
    key: 'bloom_experience',
    name: 'Bloom Experience',
    tagline: 'Multi-scene stitched experience',
    description: 'Multi-scene stitched experience (25–35 seconds). A flowing narrative of blooms crafted for deeper emotion.',
    price: 4.99,
    price_cents: 499,
    duration_seconds_min: 25,
    duration_seconds_max: 35,
    stripe_product_id: import.meta.env.VITE_STRIPE_PRODUCT_TIER2 || 'REPLACE_WITH_STRIPE_PRODUCT_ID_TIER2',
    stripe_price_id: import.meta.env.VITE_STRIPE_PRICE_TIER2 || 'REPLACE_WITH_STRIPE_PRICE_ID_TIER2',
    badge: 'Popular',
    popular: true,
  },
  {
    tier: 3,
    key: 'premium_bloom',
    name: 'Premium Bloom',
    tagline: 'Full cinematic experience',
    description: 'Full cinematic experience (35–45 seconds). Elevated production with rich visuals and immersive storytelling.',
    price: 9.99,
    price_cents: 999,
    duration_seconds_min: 35,
    duration_seconds_max: 45,
    stripe_product_id: import.meta.env.VITE_STRIPE_PRODUCT_TIER3 || 'REPLACE_WITH_STRIPE_PRODUCT_ID_TIER3',
    stripe_price_id: import.meta.env.VITE_STRIPE_PRICE_TIER3 || 'REPLACE_WITH_STRIPE_PRICE_ID_TIER3',
    badge: 'Premium',
    popular: false,
  },
  {
    tier: 4,
    key: 'signature_collection',
    name: 'Signature Collection',
    tagline: 'Top-tier cinematic bloom experience',
    description: 'Top-tier cinematic bloom experience — the longest and most premium offering. Bespoke artistry at its finest.',
    price: 19.99,
    price_cents: 1999,
    duration_seconds_min: 45,
    duration_seconds_max: 60,
    stripe_product_id: import.meta.env.VITE_STRIPE_PRODUCT_TIER4 || 'REPLACE_WITH_STRIPE_PRODUCT_ID_TIER4',
    stripe_price_id: import.meta.env.VITE_STRIPE_PRICE_TIER4 || 'REPLACE_WITH_STRIPE_PRICE_ID_TIER4',
    badge: 'Signature',
    popular: false,
  },
];

/**
 * Get a single tier by tier number (1–4)
 * @param {number} tierNumber
 * @returns {object|undefined}
 */
export const getTierByNumber = (tierNumber) =>
  PRICING_TIERS.find((t) => t.tier === tierNumber);

/**
 * Get a single tier by its key
 * @param {string} key  e.g. 'single_bloom'
 * @returns {object|undefined}
 */
export const getTierByKey = (key) =>
  PRICING_TIERS.find((t) => t.key === key);

/**
 * Get the Stripe price ID for a given tier number
 * @param {number} tierNumber
 * @returns {string}
 */
export const getStripePriceId = (tierNumber) => {
  const tier = getTierByNumber(tierNumber);
  return tier?.stripe_price_id || '';
};

export default PRICING_TIERS;
