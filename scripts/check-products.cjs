
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, video_url, video_file_url, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('Recent 10 Products:');
    data.forEach(product => {
        console.log(`- [${product.id}] ${product.name}`);
        console.log(`  Video URL (legacy): ${product.video_url || 'MISSING'}`);
        console.log(`  Video File URL (new): ${product.video_file_url || 'MISSING'}`);
    });
}

checkProducts();
