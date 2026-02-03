/**
 * NUCLEAR RESET - Delete EVERYTHING, then reimport ONLY Gesture videos
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VIDEOS_DIR = path.join(__dirname, '../public/videos');

async function nuclearReset() {
    console.log('💥 NUCLEAR RESET - Wiping entire database\n');

    // STEP 1: Delete ALL products - no exceptions
    console.log('Step 1: Deleting ALL products from database...');

    const { data: allProducts } = await supabase
        .from('products')
        .select('id');

    if (allProducts && allProducts.length > 0) {
        for (const product of allProducts) {
            await supabase.from('products').delete().eq('id', product.id);
        }
        console.log(`   Deleted ${allProducts.length} products\n`);
    } else {
        console.log('   No products to delete\n');
    }

    // STEP 2: Reimport ONLY Gesture videos
    console.log('Step 2: Importing Gesture videos...\n');

    const gestureVideos = fs.readdirSync(VIDEOS_DIR)
        .filter(f => f.startsWith('Gesture') && f.endsWith('.mp4'));

    console.log(`Found ${gestureVideos.length} Gesture videos\n`);

    let imported = 0;
    for (const file of gestureVideos) {
        const videoUrl = `/videos/${file}`;

        // Parse filename for product name
        const parts = file.replace('.mp4', '').split('_');
        parts.shift(); // Remove GestureX
        parts.pop();   // Remove Jan2026

        const productName = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const slug = `digital-bloom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Price based on content
        let price = 7.99;
        if (file.toLowerCase().includes('basketball')) price = 9.99;
        if (file.toLowerCase().includes('grok')) price = 4.99;
        if (file.toLowerCase().includes('intro')) price = 5.99;

        const productData = {
            name: productName || file.replace('.mp4', ''),
            slug: slug,
            price: price,
            description: 'Exclusive AI-generated digital art video. High-quality MP4 instant download.',
            category: 'digital-art',
            product_type: 'digital',
            stock: 9999,
            video_url: videoUrl,
            video_file_url: videoUrl,
            image_url: 'https://images.unsplash.com/photo-1518882605630-8ebedness4e0?w=400',
            is_active: true
        };

        const { error } = await supabase.from('products').insert([productData]);

        if (error) {
            console.error(`❌ ${file}: ${error.message}`);
        } else {
            console.log(`✅ ${productName} ($${price})`);
            imported++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 NUCLEAR RESET COMPLETE!');
    console.log(`Imported: ${imported} Gesture videos`);
    console.log('='.repeat(50));
    console.log('\n👉 Now hard refresh browser: Cmd+Shift+R');
}

nuclearReset().catch(console.error);
