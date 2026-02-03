/**
 * Remove old placeholder products, keep only real Gesture videos
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupProducts() {
    console.log('🧹 Cleaning up old placeholder products...\n');

    // Get count of all products
    const { count: totalBefore } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    console.log(`Total products before cleanup: ${totalBefore}`);

    // Delete products that DON'T have Gesture in the video URL
    // These are the old placeholder products
    const { error, count: deleted } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .not('video_file_url', 'like', '%Gesture%');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    // Get new count
    const { count: totalAfter } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Cleanup complete!`);
    console.log(`Removed: ${deleted || 0} old placeholder products`);
    console.log(`Remaining: ${totalAfter} Gesture videos`);
}

cleanupProducts().catch(console.error);
