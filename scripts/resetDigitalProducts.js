
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetDigitalProducts() {
    console.log('🗑️  Starting Digital Products Reset...');

    // Delete all products with product_type = 'digital'
    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('product_type', 'digital');

    if (error) {
        console.error('❌ Error resetting products:', error.message);
    } else {
        console.log(`✅ Successfully deleted ${count} digital products from database.`);
    }
}

resetDigitalProducts().catch(console.error);
