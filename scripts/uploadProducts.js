#!/usr/bin/env node

// ============================================
// PRODUCT UPLOAD UTILITY
// ============================================
// This script uploads products from your data file to Supabase
// Usage: node scripts/uploadProducts.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample products to upload
const sampleProducts = [
  {
    name: "Red Rose Bouquet",
    slug: "red-rose-bouquet",
    description: "A classic bouquet of 12 premium red roses, symbolizing love and romance. Perfect for expressing deep emotions.",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop",
    video_url: "/videos/red-rose-bouquet.mp4",
    thumbnail_url: null,
    category: "roses",
    occasions: ["anniversary", "romance", "valentine"],
    stock: 15,
    is_active: true,
    stripe_product_id: null,
    stripe_price_id: null
  },
  {
    name: "Pink Tulip Bunch",
    slug: "pink-tulip-bunch",
    description: "Fresh pink tulips arranged beautifully. These elegant flowers bring a touch of spring to any occasion.",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=800&fit=crop",
    video_url: "/videos/pink-tulip-bunch.mp4",
    thumbnail_url: null,
    category: "tulips",
    occasions: ["birthday", "thank-you", "just-because"],
    stock: 20,
    is_active: true,
    stripe_product_id: null,
    stripe_price_id: null
  },
  {
    name: "White Lily Arrangement",
    slug: "white-lily-arrangement",
    description: "Sophisticated white lilies arranged with greenery. Symbolizes purity and refined beauty.",
    price: 59.99,
    image_url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=800&fit=crop",
    video_url: "/videos/white-lily-arrangement.mp4",
    thumbnail_url: null,
    category: "lilies",
    occasions: ["sympathy", "wedding", "anniversary"],
    stock: 10,
    is_active: true,
    stripe_product_id: null,
    stripe_price_id: null
  },
  {
    name: "Sunflower Delight",
    slug: "sunflower-delight",
    description: "Bright and cheerful sunflowers that bring sunshine into any room. Perfect for lifting spirits.",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1597848212624-e530a4d4d8e1?w=800&h=800&fit=crop",
    video_url: "/videos/sunflower-delight.mp4",
    thumbnail_url: null,
    category: "mixed",
    occasions: ["birthday", "get-well", "thank-you"],
    stock: 18,
    is_active: true,
    stripe_product_id: null,
    stripe_price_id: null
  },
  {
    name: "Lavender Dreams",
    slug: "lavender-dreams",
    description: "Calming lavender blooms with delicate purple hues. Creates a peaceful and relaxing atmosphere.",
    price: 44.99,
    image_url: "https://images.unsplash.com/photo-1499852848443-3004d6dc4cfc?w=800&h=800&fit=crop",
    video_url: "/videos/lavender-dreams.mp4",
    thumbnail_url: null,
    category: "mixed",
    occasions: ["thank-you", "just-because", "sympathy"],
    stock: 12,
    is_active: true,
    stripe_product_id: null,
    stripe_price_id: null
  }
];

async function uploadProducts() {
  console.log('🌸 Starting product upload to Supabase...\n');

  try {
    // Check if products table exists
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('slug')
      .limit(1);

    if (checkError) {
      console.error('❌ Error accessing products table:', checkError.message);
      console.error('\nMake sure you have:');
      console.error('1. Run the database schema (supabase/schemas/01_initial_schema.sql)');
      console.error('2. Configured your Supabase credentials in .env');
      process.exit(1);
    }

    console.log('✓ Connected to Supabase successfully\n');

    // Upload each product
    let successCount = 0;
    let skipCount = 0;

    for (const product of sampleProducts) {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();

      if (existing) {
        console.log(`⊘ Skipping "${product.name}" (already exists)`);
        skipCount++;
        continue;
      }

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to upload "${product.name}":`, error.message);
      } else {
        console.log(`✓ Uploaded "${product.name}" (ID: ${data.id.substring(0, 8)})`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Upload Summary:`);
    console.log(`   ✓ Uploaded: ${successCount} products`);
    console.log(`   ⊘ Skipped: ${skipCount} products`);
    console.log(`   Total: ${sampleProducts.length} products`);
    console.log('='.repeat(50));

    if (successCount > 0) {
      console.log('\n🎉 Products uploaded successfully!');
      console.log('\nNext steps:');
      console.log('1. Add your Stripe Product IDs and Price IDs to the products');
      console.log('2. Upload your custom videos to /public/videos/');
      console.log('3. Start your dev server: npm run dev');
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadProducts();
