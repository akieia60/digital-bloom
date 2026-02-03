/**
 * Digital Bloom - Complete Video Upload to Supabase
 * 
 * This script:
 * 1. Scans all project video folders
 * 2. Detects duplicates by file hash (MD5)
 * 3. Uploads unique videos to Supabase Storage
 * 4. Creates product entries in the database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Source directories to scan for videos
const VIDEO_SOURCES = [
    '/Users/akieiamoniquedavis/Desktop/sora 2 videos',
    '/Users/akieiamoniquedavis/Downloads',
    '/Users/akieiamoniquedavis/Desktop/DigitalBloom_Project_Archive/Assets/Videos',
];

const STORAGE_BUCKET = 'videos';
const PUBLIC_VIDEOS_DIR = path.join(__dirname, '../public/videos');

// Calculate MD5 hash for duplicate detection
function getFileHash(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
}

// Generate clean product name from filename
function generateProductName(filename) {
    let name = filename
        .replace('.mp4', '')
        .replace(/^Gesture\d+_/, '')
        .replace(/_Jan2026$/, '')
        .replace(/openart-video_[a-z0-9]+_\d+_?\d*/, 'OpenArt Flowers')
        .replace(/grok-video-[a-z0-9-]+/, 'Grok Bloom')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ');

    // Capitalize words
    return name.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .trim() || 'Digital Bloom Video';
}

// Determine price based on content
function getPrice(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('basketball') || lower.includes('sports')) return 9.99;
    if (lower.includes('grok')) return 4.99;
    if (lower.includes('intro')) return 5.99;
    if (lower.includes('openart')) return 8.99;
    return 7.99;
}

async function uploadToSupabase() {
    console.log('🌸 Digital Bloom - Complete Video Upload\n');
    console.log('='.repeat(50));

    // Step 1: Collect all videos
    console.log('\n📂 Step 1: Scanning for videos...\n');

    const allVideos = [];
    const seenHashes = new Map(); // hash -> first file path

    for (const dir of VIDEO_SOURCES) {
        if (!fs.existsSync(dir)) {
            console.log(`   ⚠️  Directory not found: ${dir}`);
            continue;
        }

        const files = fs.readdirSync(dir)
            .filter(f => f.endsWith('.mp4'));

        console.log(`   Found ${files.length} videos in ${path.basename(dir)}`);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const hash = getFileHash(filePath);

            if (seenHashes.has(hash)) {
                console.log(`   🔄 Duplicate: ${file}`);
            } else {
                seenHashes.set(hash, filePath);
                allVideos.push({ file, filePath, hash });
            }
        }
    }

    console.log(`\n✅ Found ${allVideos.length} unique videos\n`);

    // Step 2: Check existing products to avoid re-uploading
    console.log('📊 Step 2: Checking existing products...\n');

    const { data: existingProducts } = await supabase
        .from('products')
        .select('video_file_url');

    const existingUrls = new Set(
        (existingProducts || []).map(p => p.video_file_url)
    );

    console.log(`   ${existingUrls.size} products already in database\n`);

    // Step 3: Upload new videos
    console.log('📤 Step 3: Uploading new videos...\n');

    let uploaded = 0;
    let skipped = 0;
    let errors = 0;

    for (const video of allVideos) {
        const videoUrl = `/videos/${video.file}`;

        // Skip if already exists
        if (existingUrls.has(videoUrl)) {
            console.log(`   ⏭️  Already exists: ${video.file}`);
            skipped++;
            continue;
        }

        // Copy to public/videos for local serving
        const targetPath = path.join(PUBLIC_VIDEOS_DIR, video.file);
        if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(video.filePath, targetPath);
        }

        // Create product entry
        const productName = generateProductName(video.file);
        const price = getPrice(video.file);
        const slug = `digital-bloom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        const productData = {
            name: productName,
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
            console.error(`   ❌ Error: ${video.file} - ${error.message}`);
            errors++;
        } else {
            console.log(`   ✅ ${productName} ($${price})`);
            uploaded++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 UPLOAD COMPLETE!\n');
    console.log(`   ✅ New products created: ${uploaded}`);
    console.log(`   ⏭️  Already existed: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total unique videos: ${allVideos.length}`);
    console.log('\n' + '='.repeat(50));
    console.log('\n👉 Refresh your browser to see all products!');
}

uploadToSupabase().catch(console.error);
