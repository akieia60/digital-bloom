const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function listProducts() {
    try {
        console.log('Fetching products from Supabase...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            process.exit(1);
        }

        if (!data || data.length === 0) {
            console.log('No products found in the database.');
            process.exit(0);
        }

        console.log(`Found ${data.length} products total.`);
        
        // Save full audit to JSON
        fs.writeFileSync('product_audit.json', JSON.stringify(data, null, 2));
        console.log('Saved product data to product_audit.json');

        process.exit(0);
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

listProducts();
