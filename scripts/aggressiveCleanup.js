/**
 * AGGRESSIVE CLEANUP - Delete everything except Gesture videos
 * This targets by product NAME, not just video URL
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Names of fake placeholder products to delete
const PLACEHOLDER_NAMES = [
    'Ethereal Rose Pulse',
    'Luxury Diamond Bloom',
    'Velvet Night Garden',
    'Emerald Leaf Dance',
    'Golden Starlight Roses',
    'Crystal Flower Symphony',
    'Midnight Rose',
    'Crystal Rose',
    'Golden Rose',
    'Diamond Rose',
    'Emerald Rose',
    'Sapphire Rose',
    'Celestial Rose',
    'Royal Rose',
    'Imperial Rose',
    'Silver Rose',
];

async function aggressiveCleanup() {
    console.log('🔥 AGGRESSIVE CLEANUP - Deleting ALL fake products\n');

    // Get all products
    const { data: allProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name, video_file_url');

    if (fetchError) {
        console.error('Error fetching products:', fetchError.message);
        return;
    }

    console.log(`Found ${allProducts.length} total products\n`);

    let deleted = 0;
    let kept = 0;

    for (const product of allProducts) {
        const name = product.name || '';
        const videoUrl = product.video_file_url || '';

        // Keep if it has Gesture in the video URL or name
        const isGesture = videoUrl.includes('Gesture') ||
            name.includes('Gesture') ||
            name.includes('Basketball') ||
            name.includes('Pink Balloons') ||
            name.includes('Grok') ||
            name.includes('Seconds Pink') ||
            name.includes('Digital Bloom Intro') ||
            name.includes('Pink Velvet Box');

        if (isGesture) {
            console.log(`✅ KEEP: ${name}`);
            kept++;
        } else {
            // Delete this fake product
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

            if (deleteError) {
                console.error(`❌ Error deleting ${name}: ${deleteError.message}`);
            } else {
                console.log(`🗑️  DELETED: ${name}`);
                deleted++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Cleanup Complete!');
    console.log(`Deleted: ${deleted} fake products`);
    console.log(`Kept: ${kept} real Gesture videos`);
    console.log('='.repeat(50));
    console.log('\n⚠️  Now hard refresh your browser: Cmd+Shift+R');
}

aggressiveCleanup().catch(console.error);
