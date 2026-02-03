
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function wipe() {
    console.log('💥 Restoration Sync: Wiping digital products...');
    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .or('category.eq.digital-art,product_type.eq.digital');

    if (error) console.error('❌ Error:', error.message);
    else console.log(`✅ Deleted ${count} records.`);
}

wipe();
