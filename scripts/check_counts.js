
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCounts() {
    const { data, error } = await supabase
        .from('products')
        .select('category, product_type');

    if (error) {
        console.error(error);
        return;
    }

    const counts = {};
    data.forEach(p => {
        const key = `${p.category} (${p.product_type})`;
        counts[key] = (counts[key] || 0) + 1;
    });

    console.log('Product Counts:', counts);
    console.log('Total:', data.length);
}

checkCounts();
