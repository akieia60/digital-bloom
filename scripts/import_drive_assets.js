
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DRIVE_ASSETS = [
  {
    title: "Grok Masterpiece: Ethereal Bloom",
    description: "A stunning, AI-generated floral masterpiece featuring intricate blooming animations.",
    filename: "grok-video-efd0ad0c-ea72-4d10-a1ac-311dd3ae90b7 (1).mp4",
    price: 49.99,
    category: "Masterpiece",
    tags: ["grok", "ai-generated", "bloom", "luxury"]
  },
  {
    title: "I Love You - Grok Edition",
    description: "Express your love with this unique, tech-infused floral animation.",
    filename: "I love you. G-R-O-K 3.mp4",
    price: 39.99,
    category: "Romance",
    tags: ["love", "romance", "grok", "gift"]
  },
  {
    title: "Mother's Day Special",
    description: "The perfect digital gift for Mother's Day, featuring a warm and gentle blooming sequence.",
    filename: "Mother's Day, GROK1.mp4",
    price: 39.99,
    category: "Occasions",
    tags: ["mothers-day", "holiday", "grok", "family"]
  },
  {
    title: "Valentine's Edition - Grok Style",
    description: "A romantic and modern take on the classic Valentine's rose.",
    filename: "Valentine's GROK4.mp4",
    price: 45.00,
    category: "Romance",
    tags: ["valentines", "love", "grok", "holiday"]
  },
  {
    title: "Grok Transition: Kinetic Flow",
    description: "A mesmerizing transition effect suitable for digital displays and art installations.",
    filename: "GROK transition 3.mp4",
    price: 29.99,
    category: "Abstract",
    tags: ["transition", "abstract", "grok", "art"]
  },
  {
    title: "Birthday Celebration - Grok",
    description: "Celebrate in style with this dynamic birthday animation.",
    filename: "grook happy birthday transition..mp4",
    price: 35.00,
    category: "Occasions",
    tags: ["birthday", "celebration", "grok", "party"]
  }
];

async function importDriveAssets() {
  console.log(`Starting import of ${DRIVE_ASSETS.length} assets from 'akt1no.com' Drive...`);

  for (const asset of DRIVE_ASSETS) {
    // 1. Check if product exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('title', asset.title)
      .single();

    if (existing) {
      console.log(`Updating: ${asset.title}`);
      // Update logic if needed, e.g., fixing filenames
      await supabase
        .from('products')
        .update({ 
          video_url: `/videos/${encodeURIComponent(asset.filename)}`,
          price: asset.price 
        })
        .eq('id', existing.id);
    } else {
      console.log(`Creating: ${asset.title}`);
      const { error } = await supabase
        .from('products')
        .insert({
          title: asset.title,
          description: asset.description,
          price: asset.price,
          video_url: `/videos/${encodeURIComponent(asset.filename)}`, // Placeholder until file sync
          thumbnail_url: `/images/placeholders/luxury-thumb-${Math.floor(Math.random() * 5) + 1}.jpg`, // Fallback
          category: asset.category,
          tags: asset.tags,
          is_featured: true
        });

      if (error) console.error(`Error inserting ${asset.title}:`, error.message);
    }
  }

  console.log('Import complete! Products are now linked to the Drive filenames.');
}

importDriveAssets();
