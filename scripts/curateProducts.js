/**
 * Digital Bloom - Curated Product Catalog
 * 
 * This script:
 * 1. Cleans database - removes non-project videos
 * 2. Keeps only curated flower/bloom videos
 * 3. Applies new $0.99-$4.99 pricing tiers
 * 4. Renames products with emotional names
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Curated product catalog with emotional names and pricing
const PRODUCT_CATALOG = {
    // === GESTURE 1: THE OFFER ($0.99-$1.99) ===
    'Basketball_love_15_seconds': { name: 'Sports Love 🏀', price: 1.99, gesture: 'offer' },
    'Basketball_love_45_seconds': { name: 'Game Day Romance 🏀', price: 2.99, gesture: 'offer' },
    'Basketball_you_are_all_I_need': { name: 'You Complete Me 💕', price: 2.99, gesture: 'offer' },

    // === GESTURE 2: THE TRANSFORMATION ($1.99-$2.99) ===
    '15_second_digital_bloom_intro': { name: 'Digital Bloom Intro ✨', price: 0.99, gesture: 'transformation' },
    '15_seconds_pink_balloons_pink_roses': { name: 'Pink Surprise 💕', price: 1.99, gesture: 'transformation' },
    '15_seconds_pink_balloons_to_pink_roses': { name: 'Balloon Magic 🎈', price: 1.99, gesture: 'transformation' },
    '15_seconds_pink_balloons_to_red_heart': { name: 'Love Blooms ❤️', price: 1.99, gesture: 'transformation' },
    '30_seconds_Pink_balloons_to_pink_roses': { name: 'Pink Dreams 🌸', price: 2.99, gesture: 'transformation' },
    '32nd_Digital_Bloom_Intro': { name: 'Digital Bloom Extended', price: 1.99, gesture: 'transformation' },
    'Duplicate_10_seconds_pink_roses': { name: 'Quick Romance 💐', price: 0.99, gesture: 'transformation' },
    'Gold_trimmed_red_roses_10_seconds': { name: 'Golden Rose ✨', price: 2.99, gesture: 'transformation' },
    'Golden_balloons_to_red_roses_10_seconds': { name: 'Golden Surprise 🎈', price: 2.99, gesture: 'transformation' },
    'Golden_overlay_pink_balloons_red_roses': { name: 'Royal Bloom 👑', price: 3.99, gesture: 'transformation' },
    'Man_black_balloon_to_red_rose': { name: 'His Love 🖤', price: 1.99, gesture: 'transformation' },
    'Pink_pop_out_to_black_and_red': { name: 'Bold Love 🖤', price: 1.99, gesture: 'transformation' },
    'Red_rose_trimmed_in_rhinestones': { name: 'Diamond Rose 💎', price: 3.99, gesture: 'transformation' },
    'cartoon_balloon_roses': { name: 'Playful Love 🎈', price: 0.99, gesture: 'transformation' },
    'pink_balloon_flowers': { name: 'Pink Party 🎀', price: 1.99, gesture: 'transformation' },

    // === GESTURE 4: THE REVEAL ($2.99-$4.99) ===
    'pink_velvet_box': { name: 'Gift Reveal 🎁', price: 4.99, gesture: 'reveal' },

    // === GROK RENDERS (Budget tier $0.99-$1.99) ===
    'grok': { name: 'Midnight Bloom', price: 0.99, gesture: 'transformation', isPrefix: true },
};

// Keywords that indicate a video belongs to Digital Bloom
const KEEP_KEYWORDS = [
    'balloon', 'rose', 'flower', 'bloom', 'pink', 'heart',
    'basketball', 'love', 'gesture', 'velvet', 'box', 'golden',
    'rhinestone', 'diamond', 'grok', 'intro'
];

// Keywords that indicate a video should be REMOVED
const REMOVE_KEYWORDS = [
    'kionna', 'song', 'bump', 'cover', 'music',
    'stilletto', 'stiletto', 'shoe'
];

function shouldKeepProduct(name, videoUrl) {
    const combined = (name + ' ' + videoUrl).toLowerCase();

    // Remove if matches remove keywords
    for (const keyword of REMOVE_KEYWORDS) {
        if (combined.includes(keyword)) return false;
    }

    // Keep if matches keep keywords
    for (const keyword of KEEP_KEYWORDS) {
        if (combined.includes(keyword)) return true;
    }

    return false;
}

function getProductInfo(videoUrl) {
    const filename = videoUrl.split('/').pop().replace('.mp4', '');

    // Check exact matches first
    for (const [pattern, info] of Object.entries(PRODUCT_CATALOG)) {
        if (info.isPrefix && filename.toLowerCase().includes(pattern.toLowerCase())) {
            // For prefix matches (like grok), generate unique name
            return {
                name: info.name + ' ' + Math.floor(Math.random() * 100),
                price: info.price,
                gesture: info.gesture
            };
        }
        if (filename.includes(pattern)) {
            return info;
        }
    }

    // Default pricing based on filename analysis
    let price = 1.99;
    let name = filename.replace(/_/g, ' ').replace(/Jan2026/gi, '').trim();

    if (filename.includes('30_seconds') || filename.includes('45_seconds')) price = 2.99;
    if (filename.includes('Golden') || filename.includes('Diamond')) price = 3.99;
    if (filename.includes('10_seconds') || filename.includes('15_seconds')) price = 1.99;
    if (filename.includes('grok')) price = 0.99;

    // Clean up the name
    name = name
        .replace(/Gesture\d+_?/gi, '')
        .replace(/\d+_seconds?/gi, '')
        .split(' ')
        .filter(w => w.length > 1)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .trim() || 'Digital Bloom';

    return { name, price, gesture: 'transformation' };
}

async function curateProducts() {
    console.log('🌸 Digital Bloom - Product Curation\n');
    console.log('='.repeat(50));

    // Step 1: Get all current products
    console.log('\n📊 Step 1: Analyzing current products...\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error.message);
        return;
    }

    console.log(`Found ${products.length} products in database\n`);

    let kept = 0;
    let removed = 0;
    let updated = 0;

    // Step 2: Process each product
    console.log('📝 Step 2: Curating products...\n');

    for (const product of products) {
        const videoUrl = product.video_url || product.video_file_url || '';

        if (!shouldKeepProduct(product.name, videoUrl)) {
            // Remove this product
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

            if (!deleteError) {
                console.log(`🗑️  Removed: ${product.name}`);
                removed++;
            }
            continue;
        }

        // Keep and update this product
        const info = getProductInfo(videoUrl);

        const updateData = {
            name: info.name,
            price: info.price,
            description: `A moment of intention. Perfect for sharing on TikTok, Instagram, or as a digital gift. Instant MP4 download.`,
            category: 'digital-art',
            product_type: 'digital'
        };

        const { error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', product.id);

        if (!updateError) {
            console.log(`✅ ${info.name} - $${info.price.toFixed(2)}`);
            kept++;
            updated++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 CURATION COMPLETE!\n');
    console.log(`   ✅ Products kept: ${kept}`);
    console.log(`   🗑️  Products removed: ${removed}`);
    console.log(`   📝 Products updated: ${updated}`);
    console.log('\n' + '='.repeat(50));
    console.log('\n👉 Refresh your browser to see the curated catalog!');
}

curateProducts().catch(console.error);
