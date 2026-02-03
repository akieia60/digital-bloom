
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

async function bulkImport() {
    console.log('🚀 Restoration Sync: Importing videos...');

    if (!fs.existsSync(VIDEOS_DIR)) {
        console.error(`❌ Missing public/videos`);
        return;
    }

    const files = fs.readdirSync(VIDEOS_DIR).filter(file => file.toLowerCase().endsWith('.mp4'));
    console.log(`📂 Found ${files.length} videos.`);

    for (const file of files) {
        const title = `Digital Art: ${file.replace('.mp4', '').replace(/[_-]/g, ' ')}`;
        const slug = `restored-${file.substring(0, 10)}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const videoUrl = `/videos/${file}`;

        const productData = {
            name: title,
            slug: slug,
            price: 4.99,
            description: 'Restored from master collection. Exclusive AI-generated luxury digital art.',
            category: 'digital-art',
            product_type: 'digital',
            stock: 9999,
            video_url: videoUrl,
            video_file_url: videoUrl,
            image_url: '/images/AI Video Generator.png',
            occasions: ['romance', 'viral-content']
        };

        const { error } = await supabase.from('products').insert([productData]);
        if (error) console.error(`❌ Error importing ${file}:`, error.message);
        else console.log(`✅ Imported: ${title}`);
    }
}

bulkImport();
