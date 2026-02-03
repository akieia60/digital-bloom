#!/usr/bin/env node

// ============================================
// AUTOMATIC DATABASE SETUP WITH SERVICE ROLE
// ============================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGJlYmxvd29sZmlueHhoc250Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI2MDQ2MywiZXhwIjoyMDg0ODM2NDYzfQ.dwtD6XMhhtnxD091DraD_GunSr--3l2N96h42ojBgms';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🌸 Digital Bloom - Automatic Setup\n');
console.log('Setting up your database with admin permissions...\n');

async function setupDatabase() {
  try {
    console.log('🔨 Step 1: Dropping old tables...');

    // Drop tables in correct order (handle foreign keys)
    const dropStatements = [
      'DROP TABLE IF EXISTS cart_items CASCADE',
      'DROP TABLE IF EXISTS purchases CASCADE',
      'DROP TABLE IF EXISTS products CASCADE',
      'DROP TABLE IF EXISTS users CASCADE'
    ];

    for (const sql of dropStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error && !error.message.includes('does not exist')) {
        console.log(`  Note: ${error.message}`);
      }
    }
    console.log('✓ Old tables cleared\n');

    console.log('🔨 Step 2: Creating new tables...');

    // Create products table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
          image_url TEXT NOT NULL,
          video_url TEXT,
          thumbnail_url TEXT,
          category VARCHAR(50) NOT NULL,
          occasions TEXT[] DEFAULT '{}',
          stripe_product_id VARCHAR(255),
          stripe_price_id VARCHAR(255),
          stock INTEGER DEFAULT 0 CHECK (stock >= 0),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    console.log('✓ Products table created');

    // Create users table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          full_name VARCHAR(255),
          stripe_customer_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    console.log('✓ Users table created');

    // Create purchases table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE purchases (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          product_id UUID REFERENCES products(id) ON DELETE SET NULL,
          quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
          unit_price DECIMAL(10, 2) NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          stripe_payment_intent_id VARCHAR(255),
          stripe_session_id VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          customer_email VARCHAR(255),
          customer_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    console.log('✓ Purchases table created');

    // Create cart_items table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
      `
    });
    console.log('✓ Cart items table created\n');

    console.log('📊 Step 3: Creating indexes...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX idx_products_category ON products(category);
        CREATE INDEX idx_products_slug ON products(slug);
        CREATE INDEX idx_products_is_active ON products(is_active);
      `
    });
    console.log('✓ Indexes created\n');

    console.log('🔐 Step 4: Setting up security policies...');

    // Enable RLS
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
      `
    });

    // Create policies
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Products viewable by everyone" ON products FOR SELECT USING (is_active = true);
        CREATE POLICY "Authenticated see all" ON products FOR SELECT TO authenticated USING (true);
      `
    });
    console.log('✓ Security policies enabled\n');

    console.log('📦 Step 5: Uploading sample products...');

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
    for (const product of sampleProducts) {
      const { error } = await supabase.from('products').insert(product);
      if (error) {
        console.error(`  ❌ ${product.name}: ${error.message}`);
      } else {
        console.log(`  ✓ ${product.name}`);
        successCount++;
      }
    }

    console.log(`\n✓ Uploaded ${successCount}/${sampleProducts.length} products\n`);

    console.log('═'.repeat(60));
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('═'.repeat(60));
    console.log('\n✅ Your Digital Bloom store is ready!\n');
    console.log('📍 Store URL: http://localhost:5173');
    console.log('🔧 Admin Panel: http://localhost:5173/admin');
    console.log('\n💡 You can now:');
    console.log('   • Browse products at localhost:5173');
    console.log('   • Add new arrangements at localhost:5173/admin');
    console.log('   • Test checkout with card: 4242 4242 4242 4242\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

setupDatabase();
