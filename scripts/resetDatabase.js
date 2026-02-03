/**
 * Complete database reset - delete ALL products, then re-import only Gesture videos
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

async function resetAndImport() {
    console.log('🔄 COMPLETE DATABASE RESET\n');

    // Step 1: Delete ALL products
    console.log('Step 1: Deleting ALL existing products...');
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

    if (deleteError) {
        console.error('Delete error:', deleteError.message);
    } else {
        console.log('✅ All old products deleted\n');
    }

    // Step 2: Re-import only Gesture videos
    console.log('Step 2: Importing Gesture videos...\n');

    const gestureVideos = fs.readdirSync(VIDEOS_DIR)
        .filter(f => f.startsWith('Gesture') && f.endsWith('.mp4'));

    console.log(`Found ${gestureVideos.length} Gesture videos\n`);

    let imported = 0;
    for (const file of gestureVideos) {
        const videoUrl = `/videos/${file}`;

        // Parse filename for product info
        const parts = file.replace('.mp4', '').split('_');
        const gestureNum = parts[0].replace('Gesture', '');
        parts.shift(); // Remove GestureX
        parts.pop();   // Remove Jan2026

        const productName = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const slug = `gesture-${file.replace('.mp4', '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        // Determine price
        let price = 7.99;
        if (file.toLowerCase().includes('basketball')) price = 9.99;
        if (file.toLowerCase().includes('grok')) price = 4.99;

        // Determine category
        let category = 'digital-art';
        if (file.toLowerCase().includes('basketball')) category = 'sports';

        const productData = {
            name: productName,
            slug: slug,
            price: price,
            description: `Exclusive AI-generated digital art video. High-quality MP4 instant download.`,
            category: category,
            product_type: 'digital',
            stock: 9999,
            video_url: videoUrl,
            video_file_url: videoUrl,
            image_url: null,
            occasions: ['viral-content', 'social-media'],
        };

        const { error } = await supabase
            .from('products')
            .insert([productData]);

        if (error) {
            console.error(`❌ ${file}: ${error.message}`);
        } else {
            console.log(`✅ ${productName} ($${price})`);
            imported++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Done! Imported ${imported} Gesture videos`);
    console.log('='.repeat(50));
    console.log('\n⚠️  IMPORTANT: Hard refresh your browser (Cmd+Shift+R)');
}

resetAndImport().catch(console.error);
