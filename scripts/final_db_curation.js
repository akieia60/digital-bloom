import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const curatedSlugs = [
  'rose-stiletto-luxury',
  'ethereal-rose-pulse',
  'luxury-diamond-bloom',
  'velvet-night-garden',
  'golden-starlight-roses',
  'crystal-flower-symphony',
  'midnight-mist-roses',
  'opulent-floral-motion',
  'enchanted-garden',
  'infinity-roses'
];

async function curateDatabase() {
  console.log('🌸 Starting Final Database Curation...');

  try {
    // 1. Get all products from database
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${allProducts.length} items in database.`);

    // 2. Identify products NOT in our curated list
    const productsToDelete = allProducts.filter(p => !curatedSlugs.includes(p.slug));

    if (productsToDelete.length === 0) {
      console.log('✅ Database is already perfectly curated. No items to delete.');
      return;
    }

    console.log(`🗑️ Identified ${productsToDelete.length} items to remove:`);
    productsToDelete.forEach(p => console.log(`   - ${p.name} (${p.slug})`));

    // 3. Delete products
    const idsToDelete = productsToDelete.map(p => p.id);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) throw deleteError;

    console.log(`✨ Successfully removed ${productsToDelete.length} items.`);
    console.log('✅ Your Digital Bloom Gallery is now perfectly curated (10 items).');

  } catch (error) {
    console.error('❌ Curation failed:', error.message);
  }
}

curateDatabase();
