import { createClient } from '@supabase/supabase-js';
import { flowers } from './src/data/flowers.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncProducts() {
  console.log('🌹 Starting product sync to Supabase...\n');

  try {
    // Clear existing products
    console.log('🗑️  Clearing old products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all

    if (deleteError) {
      console.error('Error clearing products:', deleteError);
    }

    // Insert new products
    console.log('📦 Inserting products with videos...\n');

    for (const flower of flowers) {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: flower.name,
          slug: flower.slug,
          price: flower.price,
          category: flower.category,
          description: flower.description,
          occasions: flower.occasions,
          video_url: flower.video_url,
          image_url: flower.image_url,
          stock: flower.stock,
          is_active: flower.is_active
        }]);

      if (error) {
        console.error(`❌ Error inserting ${flower.name}:`, error.message);
      } else {
        console.log(`✅ Added: ${flower.name}`);
      }
    }

    console.log('\n✨ Sync complete! All products updated in Supabase.');

  } catch (err) {
    console.error('❌ Sync failed:', err);
  }
}

syncProducts();
