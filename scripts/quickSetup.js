#!/usr/bin/env node

// ============================================
// QUICK DATABASE SETUP
// ============================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🌸 Digital Bloom - Quick Setup\n');

async function quickSetup() {
  try {
    console.log('📋 Checking database status...\n');

    // Try to query the products table
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('⚠️  Database tables not found!\n');
        console.log('📝 Please set up your database manually:\n');
        console.log('1. Go to: https://yhdbeblowolfinxxhsnt.supabase.co');
        console.log('2. Click "SQL Editor" in the left sidebar');
        console.log('3. Click "New Query"');
        console.log('4. Copy all contents from: supabase/schemas/01_initial_schema.sql');
        console.log('5. Paste and click "RUN"\n');
        console.log('Then run this script again to upload products.\n');
        process.exit(1);
      } else {
        throw error;
      }
    }

    console.log('✓ Database tables exist!\n');

    // Upload sample products
    console.log('📦 Uploading sample products...\n');

    const sampleProducts = [
      {
        name: "Red Rose Bouquet",
        slug: "red-rose-bouquet",
        description: "A classic bouquet of 12 premium red roses, symbolizing love and romance. Perfect for expressing deep emotions.",
        price: 49.99,
        image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop",
        video_url: "/videos/red-rose-bouquet.mp4",
        category: "roses",
        occasions: ["anniversary", "romance", "valentine"],
        stock: 15,
        is_active: true
      },
      {
        name: "Pink Tulip Bunch",
        slug: "pink-tulip-bunch",
        description: "Fresh pink tulips arranged beautifully. These elegant flowers bring a touch of spring to any occasion.",
        price: 34.99,
        image_url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=800&fit=crop",
        video_url: "/videos/pink-tulip-bunch.mp4",
        category: "tulips",
        occasions: ["birthday", "thank-you", "just-because"],
        stock: 20,
        is_active: true
      },
      {
        name: "White Lily Arrangement",
        slug: "white-lily-arrangement",
        description: "Sophisticated white lilies arranged with greenery. Symbolizes purity and refined beauty.",
        price: 59.99,
        image_url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=800&fit=crop",
        video_url: "/videos/white-lily-arrangement.mp4",
        category: "lilies",
        occasions: ["sympathy", "wedding", "anniversary"],
        stock: 10,
        is_active: true
      },
      {
        name: "Sunflower Delight",
        slug: "sunflower-delight",
        description: "Bright and cheerful sunflowers that bring sunshine into any room. Perfect for lifting spirits.",
        price: 39.99,
        image_url: "https://images.unsplash.com/photo-1597848212624-e530a4d4d8e1?w=800&h=800&fit=crop",
        video_url: "/videos/sunflower-delight.mp4",
        category: "mixed",
        occasions: ["birthday", "get-well", "thank-you"],
        stock: 18,
        is_active: true
      },
      {
        name: "Lavender Dreams",
        slug: "lavender-dreams",
        description: "Calming lavender blooms with delicate purple hues. Creates a peaceful and relaxing atmosphere.",
        price: 44.99,
        image_url: "https://images.unsplash.com/photo-1499852848443-3004d6dc4cfc?w=800&h=800&fit=crop",
        video_url: "/videos/lavender-dreams.mp4",
        category: "mixed",
        occasions: ["thank-you", "just-because", "sympathy"],
        stock: 12,
        is_active: true
      }
    ];

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
      const { error: insertError } = await supabase
        .from('products')
        .insert(product);

      if (insertError) {
        console.error(`❌ Failed to upload "${product.name}":`, insertError.message);
      } else {
        console.log(`✓ Uploaded "${product.name}"`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✓ Uploaded: ${successCount} products`);
    console.log(`   ⊘ Skipped: ${skipCount} products`);
    console.log(`   Total: ${sampleProducts.length} products`);
    console.log('='.repeat(50));

    console.log('\n🎉 Setup complete!');
    console.log('\nYour store is ready at: http://localhost:5173');
    console.log('Admin panel: http://localhost:5173/admin\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

quickSetup();
