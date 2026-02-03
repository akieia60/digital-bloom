#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGJlYmxvd29sZmlueHhoc250Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI2MDQ2MywiZXhwIjoyMDg0ODM2NDYzfQ.dwtD6XMhhtnxD091DraD_GunSr--3l2N96h42ojBgms';

// Create fresh client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🌸 Uploading products to Digital Bloom...\n');

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

async function uploadProducts() {
  try {
    let successCount = 0;

    for (const product of sampleProducts) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();

      if (error) {
        console.error(`❌ ${product.name}: ${error.message}`);
      } else {
        console.log(`✓ ${product.name} uploaded successfully`);
        successCount++;
      }
    }

    console.log(`\n═══════════════════════════════════`);
    console.log(`✅ Uploaded ${successCount}/${sampleProducts.length} products`);
    console.log(`═══════════════════════════════════\n`);

    if (successCount > 0) {
      console.log('🎉 Products are live!');
      console.log('Visit: http://localhost:5173\n');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

uploadProducts();
