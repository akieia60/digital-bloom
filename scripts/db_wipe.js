
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function wipe() {
    console.log('💥 Wiping Digital Art products...');

    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('category', 'digital-art');

    console.log(`Deleted ${count} rows. Error: ${error?.message || 'None'}`);
}

wipe();
