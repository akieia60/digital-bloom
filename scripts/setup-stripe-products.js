#!/usr/bin/env node
/**
 * Digital Bloom — Stripe Product Catalog Setup Script
 * =====================================================
 * Creates the 4 pricing tier products and prices in Stripe (TEST MODE).
 *
 * USAGE:
 *   1. Make sure your .env file contains STRIPE_SECRET_KEY (test key starts with sk_test_)
 *   2. Run:  node scripts/setup-stripe-products.js
 *   3. Copy the output IDs into your .env file and src/config/pricingTiers.js
 *
 * REQUIREMENTS:
 *   npm install stripe dotenv   (already in package.json)
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('\n❌  STRIPE_SECRET_KEY is not set in your .env file.');
  console.error('    Add it and re-run this script.\n');
  process.exit(1);
}

if (!stripeKey.startsWith('sk_test_')) {
  console.warn('\n⚠️  WARNING: This does not look like a TEST mode key (sk_test_...).');
  console.warn('    Make sure you are using your TEST secret key.\n');
}

const stripe = new Stripe(stripeKey);

// ─── Product Definitions ────────────────────────────────────────────────────

const PRODUCTS = [
  {
    tier: 1,
    key: 'single_bloom',
    name: 'Single Bloom',
    description: 'One bloom video, standard length (8–10 seconds). Perfect for a quick, heartfelt digital gesture.',
    price_cents: 199,
    metadata: {
      tier: '1',
      duration_min: '8',
      duration_max: '10',
      product_type: 'digital_bloom',
    },
  },
  {
    tier: 2,
    key: 'bloom_experience',
    name: 'Bloom Experience',
    description: 'Multi-scene stitched experience (25–35 seconds). A flowing narrative of blooms crafted for deeper emotion.',
    price_cents: 499,
    metadata: {
      tier: '2',
      duration_min: '25',
      duration_max: '35',
      product_type: 'digital_bloom',
    },
  },
  {
    tier: 3,
    key: 'premium_bloom',
    name: 'Premium Bloom',
    description: 'Full cinematic experience (35–45 seconds). Elevated production with rich visuals and immersive storytelling.',
    price_cents: 999,
    metadata: {
      tier: '3',
      duration_min: '35',
      duration_max: '45',
      product_type: 'digital_bloom',
    },
  },
  {
    tier: 4,
    key: 'signature_collection',
    name: 'Signature Collection',
    description: 'Top-tier cinematic bloom experience — the longest and most premium offering. Bespoke artistry at its finest.',
    price_cents: 1999,
    metadata: {
      tier: '4',
      duration_min: '45',
      duration_max: '60',
      product_type: 'digital_bloom',
    },
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌸  Digital Bloom — Stripe Product Catalog Setup');
  console.log('================================================');
  console.log(`🔑  Using key: ${stripeKey.slice(0, 14)}...`);
  console.log(`📦  Creating ${PRODUCTS.length} products in TEST MODE\n`);

  const results = [];

  for (const def of PRODUCTS) {
    try {
      console.log(`⏳  Creating Tier ${def.tier}: ${def.name} ($${(def.price_cents / 100).toFixed(2)})...`);

      // Create the Stripe product
      const product = await stripe.products.create({
        name: def.name,
        description: def.description,
        metadata: def.metadata,
        statement_descriptor: 'DIGITALBLOOM',
      });

      // Create the one-time price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: def.price_cents,
        currency: 'usd',
        metadata: {
          tier: String(def.tier),
          key: def.key,
        },
      });

      console.log(`   ✅  Product ID : ${product.id}`);
      console.log(`   ✅  Price ID   : ${price.id}`);

      results.push({
        tier: def.tier,
        key: def.key,
        name: def.name,
        price_cents: def.price_cents,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      });
    } catch (err) {
      console.error(`   ❌  Failed for Tier ${def.tier}: ${err.message}`);
    }
  }

  // ── Print env var block ──────────────────────────────────────────────────
  console.log('\n\n══════════════════════════════════════════════════════════');
  console.log('  📋  ADD THESE TO YOUR .env FILE (and Vercel env vars):');
  console.log('══════════════════════════════════════════════════════════\n');

  for (const r of results) {
    console.log(`# Tier ${r.tier} — ${r.name}`);
    console.log(`VITE_STRIPE_PRODUCT_TIER${r.tier}=${r.stripe_product_id}`);
    console.log(`VITE_STRIPE_PRICE_TIER${r.tier}=${r.stripe_price_id}`);
    console.log('');
  }

  // ── Write results JSON ───────────────────────────────────────────────────
  const outputPath = path.join(__dirname, '..', 'stripe-product-ids.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾  Results saved to: stripe-product-ids.json`);
  console.log('    (This file is gitignored — do not commit it)\n');

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════════════');
  console.log('  ✅  SETUP COMPLETE');
  console.log('══════════════════════════════════════════════════════════');
  console.log(`  Products created : ${results.length}`);
  console.log(`  Mode             : TEST`);
  console.log('');
  console.log('  NEXT STEPS:');
  console.log('  1. Copy the env vars above into your .env file');
  console.log('  2. Add the same vars to your Vercel project settings');
  console.log('  3. Run the Supabase seed to insert tiers into the products table');
  console.log('  4. Deploy to Vercel\n');
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
