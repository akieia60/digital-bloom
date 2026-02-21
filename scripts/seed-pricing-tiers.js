#!/usr/bin/env node
/**
 * Digital Bloom — Supabase Pricing Tier Seed Script
 * ==================================================
 * Inserts the 4 pricing tier rows into the `products` table in Supabase.
 * Run this AFTER running setup-stripe-products.js and adding the IDs to .env.
 *
 * USAGE:
 *   node scripts/seed-pricing-tiers.js
 *
 * REQUIRES in .env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (or VITE_SUPABASE_ANON_KEY if RLS allows inserts)
 *   VITE_STRIPE_PRODUCT_TIER1, VITE_STRIPE_PRICE_TIER1
 *   VITE_STRIPE_PRODUCT_TIER2, VITE_STRIPE_PRICE_TIER2
 *   VITE_STRIPE_PRODUCT_TIER3, VITE_STRIPE_PRICE_TIER3
 *   VITE_STRIPE_PRODUCT_TIER4, VITE_STRIPE_PRICE_TIER4
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TIERS = [
  {
    name: 'Single Bloom',
    description: 'One bloom video, standard length (8–10 seconds). Perfect for a quick, heartfelt digital gesture.',
    tier: 1,
    price: 1.99,
    price_cents: 199,
    duration_seconds_min: 8,
    duration_seconds_max: 10,
    stripe_product_id: process.env.VITE_STRIPE_PRODUCT_TIER1 || null,
    stripe_price_id: process.env.VITE_STRIPE_PRICE_TIER1 || null,
    product_type: 'digital',
    is_active: true,
    category: 'tier',
    slug: 'single-bloom',
  },
  {
    name: 'Bloom Experience',
    description: 'Multi-scene stitched experience (25–35 seconds). A flowing narrative of blooms crafted for deeper emotion.',
    tier: 2,
    price: 4.99,
    price_cents: 499,
    duration_seconds_min: 25,
    duration_seconds_max: 35,
    stripe_product_id: process.env.VITE_STRIPE_PRODUCT_TIER2 || null,
    stripe_price_id: process.env.VITE_STRIPE_PRICE_TIER2 || null,
    product_type: 'digital',
    is_active: true,
    category: 'tier',
    slug: 'bloom-experience',
  },
  {
    name: 'Premium Bloom',
    description: 'Full cinematic experience (35–45 seconds). Elevated production with rich visuals and immersive storytelling.',
    tier: 3,
    price: 9.99,
    price_cents: 999,
    duration_seconds_min: 35,
    duration_seconds_max: 45,
    stripe_product_id: process.env.VITE_STRIPE_PRODUCT_TIER3 || null,
    stripe_price_id: process.env.VITE_STRIPE_PRICE_TIER3 || null,
    product_type: 'digital',
    is_active: true,
    category: 'tier',
    slug: 'premium-bloom',
  },
  {
    name: 'Signature Collection',
    description: 'Top-tier cinematic bloom experience — the longest and most premium offering. Bespoke artistry at its finest.',
    tier: 4,
    price: 19.99,
    price_cents: 1999,
    duration_seconds_min: 45,
    duration_seconds_max: 60,
    stripe_product_id: process.env.VITE_STRIPE_PRODUCT_TIER4 || null,
    stripe_price_id: process.env.VITE_STRIPE_PRICE_TIER4 || null,
    product_type: 'digital',
    is_active: true,
    category: 'tier',
    slug: 'signature-collection',
  },
];

async function main() {
  console.log('\n🌸  Digital Bloom — Supabase Pricing Tier Seed');
  console.log('================================================\n');

  for (const tier of TIERS) {
    // Check if a tier row already exists (by slug) to avoid duplicates
    const { data: existing } = await supabase
      .from('products')
      .select('id, name, tier')
      .eq('slug', tier.slug)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️   Tier ${tier.tier} (${tier.name}) already exists — updating Stripe IDs...`);
      const { error } = await supabase
        .from('products')
        .update({
          stripe_product_id: tier.stripe_product_id,
          stripe_price_id: tier.stripe_price_id,
          price: tier.price,
          price_cents: tier.price_cents,
        })
        .eq('id', existing.id);

      if (error) {
        console.error(`   ❌  Update failed: ${error.message}`);
      } else {
        console.log(`   ✅  Updated successfully`);
      }
    } else {
      console.log(`⏳   Inserting Tier ${tier.tier}: ${tier.name} ($${tier.price})...`);
      const { error } = await supabase.from('products').insert(tier);

      if (error) {
        console.error(`   ❌  Insert failed: ${error.message}`);
      } else {
        console.log(`   ✅  Inserted successfully`);
      }
    }
  }

  console.log('\n✅  Seed complete!\n');
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
