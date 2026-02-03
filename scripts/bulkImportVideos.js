
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Directory where videos are stored
const VIDEOS_DIR = path.join(__dirname, '../public/videos');

async function bulkImport() {
    console.log('🚀 Starting Bulk Video Import...\n');

    if (!fs.existsSync(VIDEOS_DIR)) {
        console.error(`❌ Directory not found: ${VIDEOS_DIR}`);
        return;
    }

    const files = fs.readdirSync(VIDEOS_DIR).filter(file => file.toLowerCase().endsWith('.mp4'));
    console.log(`📂 Found ${files.length} video files in public/videos\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of files) {
        const ELEGANT_PREFIXES = ["Midnight", "Crystal", "Golden", "Diamond", "Emerald", "Sapphire", "Celestial", "Royal", "Imperial", "Silver"];
        const ELEGANT_NOUNS = ["Rose", "Bloom", "Lily", "Heart", "Garden", "Blossom", "Flora", "Tulip", "Orchid", "Petal"];

        const randomPrefix = ELEGANT_PREFIXES[Math.floor(Math.random() * ELEGANT_PREFIXES.length)];
        const randomNoun = ELEGANT_NOUNS[Math.floor(Math.random() * ELEGANT_NOUNS.length)];

        const namePart = file.replace('.mp4', '').replace('.MP4', '');
        const title = `${randomPrefix} ${randomNoun} - ${namePart.substring(0, 6)}`;
        const slug = `digital-art-${namePart.substring(0, 10)}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]/g, '-');

        // Check if video URL already exists to avoid duplicates
        const videoUrl = `/videos/${file}`;

        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('video_file_url', videoUrl)
            .single();

        if (existing) {
            console.log(`⏭️  Skipping existing: ${file}`);
            skipCount++;
            continue;
        }

        // Insert new product
        const productData = {
            name: title,
            slug: slug,
            price: 4.99, // Default price
            description: 'Exclusive AI-generated luxury digital art. High-quality MP4 download provided instantly after purchase. Perfect for social media content.',
            category: 'digital-art',
            product_type: 'digital',
            stock: 9999, // Unlimited virtual stock
            video_url: videoUrl,     // For preview player
            video_file_url: videoUrl,// For download
            image_url: '/images/AI Video Generator.png', // Default placeholder thumbnail
            occasions: ['viral-content', 'social-media'],
            luxury_features: {
                imported: true,
                original_filename: file
            }
        };

        const { error } = await supabase
            .from('products')
            .insert([productData]);

        if (error) {
            console.error(`❌ Error importing ${file}:`, error.message);
            errorCount++;
        } else {
            console.log(`✅ Imported: ${title}`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Bulk Import Complete!');
    console.log(`✅ Added: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log('='.repeat(50) + '\n');
}

bulkImport().catch(console.error);
