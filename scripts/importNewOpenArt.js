/**
 * Import new OpenArt videos from the "open art digital bloom" folder
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

const SOURCE_DIR = '/Users/akieiamoniquedavis/Desktop/sora 2 videos/open art digital bloom';
const PUBLIC_VIDEOS_DIR = path.join(__dirname, '../public/videos');

// Curated product catalog for the new videos
const NEW_VIDEOS = [
    { file: 'gift box 4k (grey 2).mp4', name: 'Gray Gift Reveal 🎁', price: 4.99, gesture: 'reveal' },
    { file: 'gift box 4k (grey 3.0).mp4', name: 'Elegant Surprise ✨', price: 4.99, gesture: 'reveal' },
    { file: 'gift box 4k (grey).mp4', name: 'Luxury Gift Box 🖤', price: 4.99, gesture: 'reveal' },
    { file: 'grave gift box flowers spilling out.mp4', name: 'Flowers Spilling 🌸', price: 3.99, gesture: 'reveal' },
    { file: 'gray gift box. 4.0 .mp4', name: 'Quick Gift 🎁', price: 1.99, gesture: 'reveal' },
    { file: 'Beautiful Lily.mp4', name: 'Beautiful Lily 🌺', price: 2.99, gesture: 'offer' },
    { file: 'Pink love. Digital bloom. 1 minute and 1 second.mp4', name: 'Pink Love Extended 💕', price: 4.99, gesture: 'expansion' },
    { file: 'black man presenting flowers.mp4', name: 'His Love Gift 💐', price: 2.99, gesture: 'offer' },
    { file: 'hands bloom into a beautiful bouquet.mp4', name: 'Blooming Hands ✨', price: 3.99, gesture: 'assembly' },
    { file: 'one flower expanded full screen.mp4', name: 'Single Rose Bloom 🌹', price: 2.99, gesture: 'expansion' },
    { file: 'red balloons to red roses.mp4', name: 'Red Balloon Magic ❤️', price: 2.99, gesture: 'transformation' },
    { file: 'white couple balloons to white orchids.mp4', name: 'White Elegance 🤍', price: 2.99, gesture: 'transformation' },
    { file: 'openart-video_03ef1304_1769652059157.mp4', name: 'OpenArt Bloom 1', price: 1.99, gesture: 'transformation' },
    { file: 'openart-video_pTzy9rKu3FUQjBAn1lP9_1769653840383_1769653840490.mp4', name: 'OpenArt Extended ✨', price: 3.99, gesture: 'transformation' },
];

async function importNewVideos() {
    console.log('🌸 Importing New OpenArt Videos\n');
    console.log('='.repeat(50));

    let imported = 0;
    let copied = 0;
    let skipped = 0;

    for (const video of NEW_VIDEOS) {
        const sourcePath = path.join(SOURCE_DIR, video.file);

        if (!fs.existsSync(sourcePath)) {
            console.log(`⚠️  File not found: ${video.file}`);
            continue;
        }

        // Copy to public/videos
        const targetPath = path.join(PUBLIC_VIDEOS_DIR, video.file);
        if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`📁 Copied: ${video.file}`);
            copied++;
        }

        const videoUrl = `/videos/${video.file}`;

        // Check if already exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('video_file_url', videoUrl)
            .single();

        if (existing) {
            console.log(`⏭️  Already exists: ${video.name}`);
            skipped++;
            continue;
        }

        // Create product
        const slug = `digital-bloom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        const productData = {
            name: video.name,
            slug: slug,
            price: video.price,
            description: `A moment of intention. Perfect for TikTok, Instagram, or as a digital gift. Instant MP4 download.`,
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
            console.error(`❌ Error: ${video.name} - ${error.message}`);
        } else {
            console.log(`✅ ${video.name} - $${video.price.toFixed(2)}`);
            imported++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 IMPORT COMPLETE!\n');
    console.log(`   📁 Files copied: ${copied}`);
    console.log(`   ✅ Products added: ${imported}`);
    console.log(`   ⏭️  Already existed: ${skipped}`);
    console.log('\n👉 Refresh browser to see new products!');
}

importNewVideos().catch(console.error);
