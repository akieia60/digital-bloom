
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function wipe() {
    console.log('💥 Wiping ALL Digital Art products to fix sync issues...');

    // Delete where category is digital-art OR product_type is digital
    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .or('category.eq.digital-art,product_type.eq.digital');

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log(`✅ Deleted ${count} records. Database is clean.`);
    }
}

wipe();
