#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🔍 Checking database structure...\n');

async function checkDatabase() {
  try {
    // Try to get one product to see what columns exist
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✓ Found existing product');
      console.log('\nCurrent columns:');
      Object.keys(data[0]).forEach(col => {
        console.log(`  - ${col}`);
      });
    } else {
      console.log('⚠️  No products found in database');
    }

    console.log('\n📋 Required columns for new schema:');
    const requiredColumns = [
      'id', 'name', 'slug', 'description', 'price',
      'image_url', 'video_url', 'thumbnail_url',
      'category', 'occasions', 'stripe_product_id',
      'stripe_price_id', 'stock', 'is_active',
      'created_at', 'updated_at'
    ];
    requiredColumns.forEach(col => console.log(`  - ${col}`));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();
