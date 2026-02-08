import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const verifiedProducts = [
  {
    "id": "31c4661f-0a5c-4d72-861e-ec51901e1b5a",
    "name": "valentines ",
    "slug": "valentines",
    "description": "Premium Digital Bloom animated flower arrangement: valentines grok. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456134626_valentines_grok.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "7365e013-63b3-4412-90e7-a29545143fb2",
    "name": "happy birthday",
    "slug": "happy-birthday",
    "description": "Premium Digital Bloom animated flower arrangement: grokt3 transition. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456133861_grokt3_transition.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "a235b2b9-c854-4f98-93d3-656c29579300",
    "name": "thinking of you? Roses/lilies.",
    "slug": "thinking-of-you-roses-lilies",
    "description": "Premium Digital Bloom animated flower arrangement: grokdigitalbloomingtransition.. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456133351_grokdigitalbloomingtransition..mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "d97a39c8-924c-4025-b223-a2413e726485",
    "name": "pink love",
    "slug": "pink-love",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-efd0ad0c-ea72-4d10-a1ac-311dd3ae90b7. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456132729_grok-video-efd0ad0c-ea72-4d10-a1ac-311dd3ae90b7.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "a5e72640-7498-475b-8e56-818c5a136975",
    "name": "pink to you with love",
    "slug": "pink-to-you-with-love",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-eeb99322-c327-44cd-94a3-e7c39418cf43. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456131609_grok-video-eeb99322-c327-44cd-94a3-e7c39418cf43.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "108c131c-d5a8-4f01-8487-55f7535658c9",
    "name": "pink to yellow with love.",
    "slug": "pink-to-yellow-with-love",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-eeb99322-c327-44cd-94a3-e7c39418cf43 (3). Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456131059_grok-video-eeb99322-c327-44cd-94a3-e7c39418cf43_(3).mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "81f4886f-cdc9-4960-b77c-28bff38d2187",
    "name": "Red Bloom",
    "slug": "red-bloom",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-e8c0c26b-344c-40e0-8e7e-f5d911685bc2 (2). Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456129150_grok-video-e8c0c26b-344c-40e0-8e7e-f5d911685bc2_(2).mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "52119677-2415-4017-a66f-30b8838bfa60",
    "name": "Blush Pink bloom. ",
    "slug": "blush-pink-bloom",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-bf0ff7dc-d6fc-4cb0-9632-aa5c386796c6. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456125203_grok-video-bf0ff7dc-d6fc-4cb0-9632-aa5c386796c6.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "1ca44e7b-e270-4335-adb7-06c77b91ffef",
    "name": "basketball love",
    "slug": "basketball-love",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-a30d38d7-0534-43ee-92f1-2636e5617903 (1). Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456121270_grok-video-a30d38d7-0534-43ee-92f1-2636e5617903_(1).mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "0a8be9cf-7a46-4227-b9a5-56bbc3b02c93",
    "name": "red bloom gold trim. ",
    "slug": "red-bloom-gold-trim",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-4cb70927-21ed-42a1-babc-e5daa168da11. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456118501_grok-video-4cb70927-21ed-42a1-babc-e5daa168da11.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "c0573765-ab30-4565-9be1-a7f98e812e17",
    "name": "Pink box white lily bloom.",
    "slug": "pink-box-white-lily-bloom",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-4246961b-f726-427f-ab9b-df74f30bccbb (1). Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456116763_grok-video-4246961b-f726-427f-ab9b-df74f30bccbb_(1).mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "dd7acfbe-7d24-4062-8fbe-77662dfcc665",
    "name": "white gold and silver card pink roses",
    "slug": "white-gold-and-silver-card-pink-roses",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-0f4e4682-aa13-422d-9fc5-42b57b129179. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456114799_grok-video-0f4e4682-aa13-422d-9fc5-42b57b129179.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "2ed916c3-91bb-41c6-b652-630eed77345f",
    "name": "thank you, transition",
    "slug": "thank-you-transition",
    "description": "Premium Digital Bloom animated flower arrangement: grok-video-0c7c9d41-3fea-46be-a5a7-eb888f165b06. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456114407_grok-video-0c7c9d41-3fea-46be-a5a7-eb888f165b06.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "2e6dd4b2-ea58-463e-b21f-7dc12bfb896a",
    "name": "happy birthday transition 3",
    "slug": "happy-birthday-transition-3",
    "description": "Premium Digital Bloom animated flower arrangement: groak happy birthday transition 3. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456110516_groak_happy_birthday_transition_3.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "cc63d118-cfee-4b7b-8f78-37eceb45f27e",
    "name": " happy birthday transition 2",
    "slug": "happy-birthday-transition-2",
    "description": "Premium Digital Bloom animated flower arrangement: groak happy birthday transition 2. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456109384_groak_happy_birthday_transition_2.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "fcdb6fe7-c72a-4c60-b7aa-b015338bb9a1",
    "name": "Valentine's  too",
    "slug": "valentine-s-too",
    "description": "Premium Digital Bloom animated flower arrangement: Valentine's grok  too. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456108877_Valentine's_grok_too.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "56b936a4-ec3f-4625-a2a0-a5a06897ed3e",
    "name": "Valentine's ",
    "slug": "valentine-s",
    "description": "Premium Digital Bloom animated flower arrangement: Valentine's Grok4. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456108367_Valentine's_GROK4.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "535359a0-f839-4c28-a6ec-8462d94ffb39",
    "name": "Valentine's  3",
    "slug": "valentine-s-3",
    "description": "Premium Digital Bloom animated flower arrangement: Valentine's Grok 3. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456107843_Valentine's_GROK_3.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "c7a494e6-d514-452d-bd4a-47a504409dfc",
    "name": "Mother's Day, 1",
    "slug": "mother-s-day-1",
    "description": "Premium Digital Bloom animated flower arrangement: Mother's Day, Grok1. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456107341_Mother's_Day,_GROK1.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "fcca4622-715e-48f1-92aa-5d75c28f6ede",
    "name": "Mother's Day 2",
    "slug": "mother-s-day-2",
    "description": "Premium Digital Bloom animated flower arrangement: Mother's Day Grok 2. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456106835_Mother's_Day_GROK_2.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "aae2e295-600d-4a7a-aa28-6024ce2c0cd9",
    "name": "I love you, 4",
    "slug": "i-love-you-4",
    "description": "Premium Digital Bloom animated flower arrangement: I love you, Grok4. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456106009_I_love_you,_GROK4.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "cf0e61da-e826-4d8f-a96e-f959691aebcd",
    "name": "I love you, 1",
    "slug": "i-love-you-1",
    "description": "Premium Digital Bloom animated flower arrangement: I love you, Grok1. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456105378_I_love_you,_GROK1.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "d9afc7c1-ec87-4b9a-814a-40f1bfed435b",
    "name": "transition 3",
    "slug": "transition-3",
    "description": "Premium Digital Bloom animated flower arrangement: Grok transition 3. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456104672_GROK_transition_3.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "f21000cc-53ca-4e4a-9960-8351a9d3679a",
    "name": " Transition 2",
    "slug": "transition-2",
    "description": "Premium Digital Bloom animated flower arrangement: Grok Transition 2. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456104149_GROK_Transition_2.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  },
  {
    "id": "15fb1cc0-04b5-4880-bb37-c76579bc7ef7",
    "name": " Happy Birthday 3",
    "slug": "happy-birthday-3",
    "description": "Premium Digital Bloom animated flower arrangement: Grok Happy Birthday. Featuring smooth transitions and vibrant GROK aesthetics.",
    "price": 19.99,
    "image_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
    "video_url": "https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/videos/grok_1770456103322_GROK_Happy_Birthday.mp4",
    "category": "digital-art",
    "stock": 999,
    "is_active": true,
    "product_type": "digital"
  }
];

async function restoreBespokeProducts() {
  console.log('🌸 Starting Surgical Restoration of 25 Bespoke Products...');
  console.log('---------------------------------------------------------');

  try {
    let successCount = 0;

    for (const product of verifiedProducts) {
      // We use upsert to handle cases where ID might already exist (though we confirmed DB is empty)
      const { data, error } = await supabase
        .from('products')
        .upsert(product)
        .select();

      if (error) {
        console.error(`❌ Failed to restore ${product.name}:`, error.message);
      } else {
        console.log(`✅ Restored: ${product.name}`);
        successCount++;
      }
    }

    console.log('---------------------------------------------------------');
    console.log(`✨ SUCCESS: Restored ${successCount} items to your Digital Gallery.`);
    console.log('🚀 Your work is back and better than ever!');

  } catch (error) {
    console.error('❌ Critical Restoration Failure:', error.message);
  }
}

restoreBespokeProducts();
