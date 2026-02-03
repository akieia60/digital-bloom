/**
 * Quick check of Supabase products
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProducts() {
    // Count total products
    const { count: total } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // Count gesture products
    const { data: gestureProducts, count: gestureCount } = await supabase
        .from('products')
        .select('name, price, category', { count: 'exact' })
        .like('video_file_url', '%Gesture%');

    console.log('📊 Database Check');
    console.log('='.repeat(40));
    console.log(`Total products: ${total}`);
    console.log(`Gesture products: ${gestureCount || 0}`);

    if (gestureProducts && gestureProducts.length > 0) {
        console.log('\nSample Gesture products:');
        gestureProducts.slice(0, 5).forEach(p => {
            console.log(`  - ${p.name} ($${p.price}) [${p.category}]`);
        });
    }
}

checkProducts().catch(console.error);
