/**
 * Import new Grok and OpenArt generations to Digital Bloom
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

const DOWNLOADS_DIR = '/Users/akieiamoniquedavis/Downloads';
const PUBLIC_VIDEOS_DIR = path.join(__dirname, '../public/videos');

// Product names for new generations
const PRODUCT_NAMES = [
    'Elegant Card Reveal 💌',
    'Love Letter Bloom 💕',
    'Gift Box Magic ✨',
    'Rose Cascade 🌹',
    'Petal Dance 🌸',
    'Romantic Reveal 💝',
    'Flower Burst 🎆',
    'Sweet Surprise 🎁',
    'Heart Bloom ❤️',
    'Velvet Rose 🖤',
    'Golden Petals ✨',
    'Pink Dream 💗',
    'Midnight Bloom 🌙',
    'Crystal Rose 💎',
    'Soft Petals 🌷',
];

async function importNewGenerations() {
    console.log('🌸 Importing New Grok/OpenArt Generations\n');
    console.log('='.repeat(50));

    // Find all grok and new openart videos
    const files = fs.readdirSync(DOWNLOADS_DIR)
        .filter(f =>
            (f.startsWith('grok-video-') && f.endsWith('.mp4')) ||
            (f.startsWith('openart-video_') && f.includes('176995') && f.endsWith('.mp4'))
        );

    console.log(`Found ${files.length} new videos to import\n`);

    let imported = 0;
    let skipped = 0;
    let nameIndex = 0;

    for (const file of files) {
        const sourcePath = path.join(DOWNLOADS_DIR, file);
        const targetPath = path.join(PUBLIC_VIDEOS_DIR, file);
        const videoUrl = `/videos/${file}`;

        // Check if already exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('video_file_url', videoUrl)
            .single();

        if (existing) {
            console.log(`⏭️  Already exists: ${file.substring(0, 30)}...`);
            skipped++;
            continue;
        }

        // Copy to public videos
        if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(sourcePath, targetPath);
        }

        // Create product with rotating name
        const productName = PRODUCT_NAMES[nameIndex % PRODUCT_NAMES.length];
        nameIndex++;

        const slug = `digital-bloom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const price = 1.99 + (Math.random() * 2).toFixed(2) * 1; // $1.99 - $3.99

        const productData = {
            name: productName,
            slug: slug,
            price: parseFloat(price.toFixed(2)),
            description: 'A moment of intention. Perfect for TikTok, Instagram, or as a digital gift. Instant MP4 download.',
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
            console.error(`❌ Error: ${file.substring(0, 30)}... - ${error.message}`);
        } else {
            console.log(`✅ ${productName} - $${price.toFixed(2)}`);
            imported++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 IMPORT COMPLETE!\n');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${files.length}`);
    console.log('\n👉 Refresh browser to see new products!');
}

importNewGenerations().catch(console.error);
