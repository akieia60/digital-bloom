import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const { data, count, error } = await supabase
        .from('products')
        .select('name', { count: 'exact' });

    if (error) {
        console.log('Error:', error.message);
        return;
    }

    console.log(`\n📊 Total products in database: ${count}\n`);
    console.log('Sample product names:');
    if (data) {
        data.slice(0, 15).forEach(p => console.log(`  - ${p.name}`));
    }
}

check();
