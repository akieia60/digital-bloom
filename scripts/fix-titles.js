
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ELEGANT_NAMES = [
    "Midnight Velvet Rose",
    "Crystal Bloom Symphony",
    "Golden Ethereal Lily",
    "Diamond Heart Pulse",
    "Emerald Garden Dance",
    "Sapphire Night Blossom",
    "Celestial Rose Glow",
    "Royal Pearl Tulip",
    "Imperial Gold Bloom",
    "Silver Starlight Flora",
    "Mystic Orchid Drift",
    "Opal Petal Rhythm",
    "Jade Leaf Serenity",
    "Amethyst Floral Mist",
    "Ruby Sunset Rose",
    "Platinum Petal Pulse",
    "Silk Ribbon Bloom",
    "Prism Petal Wave",
    "Luminous Garden Sway",
    "Velvet Twilight Rose"
];

async function fixTitles() {
    console.log('✨ Starting to fix messy product titles...\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, video_file_url')
        .eq('category', 'digital-art');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`🔍 Found ${products.length} digital art products.\n`);

    let count = 0;
    for (const product of products) {
        // Only fix titles that look like raw hashes or placeholders
        if (product.name.includes('video ') || product.name.includes('Digital Art:')) {
            const randomName = ELEGANT_NAMES[Math.floor(Math.random() * ELEGANT_NAMES.length)];
            const uniqueName = `${randomName} #${product.id.toString().substring(0, 4)}`;

            const { error: updateError } = await supabase
                .from('products')
                .update({ name: uniqueName })
                .eq('id', product.id);

            if (updateError) {
                console.error(`❌ Error updating ${product.id}:`, updateError.message);
            } else {
                console.log(`✅ Updated ${product.id}: "${product.name}" -> "${uniqueName}"`);
                count++;
            }
        }
    }

    console.log(`\n🎉 Finished fixing ${count} titles.`);
}

fixTitles().catch(console.error);
