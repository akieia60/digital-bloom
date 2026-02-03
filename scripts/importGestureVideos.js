/**
 * Digital Bloom - Gesture-Based Video Import Script
 * Imports all renamed Gesture videos to Supabase
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

// Source: Renamed videos location
const SOURCE_DIR = '/Users/akieiamoniquedavis/Desktop/sora 2 videos';

// Target: Where website looks for videos
const TARGET_DIR = path.join(__dirname, '../public/videos');

// Gesture name mappings
const GESTURE_NAMES = {
    'Gesture1': { name: 'The Offer', category: 'appreciation' },
    'Gesture2': { name: 'The Transformation', category: 'celebrations' },
    'Gesture3': { name: 'The Assembly', category: 'gratitude' },
    'Gesture4': { name: 'The Reveal', category: 'gifts' },
    'Gesture5': { name: 'The Shared Moment', category: 'relationships' },
    'Gesture6': { name: 'The Expansion', category: 'celebrations' }
};

// Price tiers
const PRICE_TIERS = {
    'Sports': 9.99,
    'Basketball': 9.99,
    'grok': 4.99,
    'default': 7.99
};

function getPrice(filename) {
    for (const [keyword, price] of Object.entries(PRICE_TIERS)) {
        if (filename.toLowerCase().includes(keyword.toLowerCase())) {
            return price;
        }
    }
    return PRICE_TIERS.default;
}

function getProductName(filename) {
    // Extract readable name from Gesture filename
    // Gesture2_15_seconds_pink_balloons_to_pink_roses_Jan2026.mp4
    const parts = filename.replace('.mp4', '').split('_');
    parts.shift(); // Remove GestureX
    parts.pop();   // Remove Jan2026

    return parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getGestureInfo(filename) {
    const match = filename.match(/^Gesture(\d)/);
    if (match) {
        const gestureKey = `Gesture${match[1]}`;
        return GESTURE_NAMES[gestureKey] || GESTURE_NAMES['Gesture2'];
    }
    return GESTURE_NAMES['Gesture2'];
}

async function importGestureVideos() {
    console.log('🌸 Digital Bloom - Gesture Video Import\n');
    console.log(`📂 Source: ${SOURCE_DIR}`);
    console.log(`📂 Target: ${TARGET_DIR}\n`);

    // Ensure target directory exists
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // Get all Gesture-named videos
    const gestureVideos = fs.readdirSync(SOURCE_DIR)
        .filter(f => f.startsWith('Gesture') && f.endsWith('.mp4'));

    console.log(`Found ${gestureVideos.length} Gesture videos to import\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of gestureVideos) {
        const sourcePath = path.join(SOURCE_DIR, file);
        const targetPath = path.join(TARGET_DIR, file);
        const videoUrl = `/videos/${file}`;

        // Check if already exists in database
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('video_file_url', videoUrl)
            .single();

        if (existing) {
            console.log(`⏭️  Already exists: ${file}`);
            skipCount++;
            continue;
        }

        // Copy video to public folder
        if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`📁 Copied: ${file}`);
        }

        // Get metadata
        const gestureInfo = getGestureInfo(file);
        const productName = getProductName(file);
        const price = getPrice(file);

        const slug = `gesture-${file.replace('.mp4', '').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

        const productData = {
            name: productName,
            slug: slug,
            price: price,
            description: `${gestureInfo.name} - A moment of intention. Exclusive AI-generated digital art perfect for social media, TikTok, and emotional storytelling.`,
            category: gestureInfo.category,
            product_type: 'digital',
            stock: 9999,
            video_url: videoUrl,
            video_file_url: videoUrl,
            image_url: '/images/AI Video Generator.png',
            occasions: ['viral-content', 'social-media', 'gift'],
            luxury_features: {
                gesture: gestureInfo.name,
                original_filename: file,
                imported_date: new Date().toISOString()
            }
        };

        const { error } = await supabase
            .from('products')
            .insert([productData]);

        if (error) {
            console.error(`❌ Error: ${file} - ${error.message}`);
            errorCount++;
        } else {
            console.log(`✅ Imported: ${productName} ($${price})`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Gesture Import Complete!');
    console.log(`✅ Added: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log('='.repeat(50) + '\n');
}

importGestureVideos().catch(console.error);
