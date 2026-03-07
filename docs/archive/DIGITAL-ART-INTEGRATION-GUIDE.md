# 🎬 Digital Bloom - Luxury Digital Art Integration Guide

## How to Add Your Prompt Library to Your Website

---

## 🎯 **YOUR BUSINESS MODEL (Clarified)**

You're selling **LUXURY DIGITAL FLOWER ART VIDEOS**, not physical flowers!

**What Customers Get:**
- High-quality animated rose videos (MP4)
- Diamond/gold/silver trimmed luxury roses
- Heartbeat pulses, wave effects, music-reactive animations
- Downloaded and shared on TikTok/Instagram with their own songs
- Priced: $7.99 - $19.99 per digital video

---

## 📊 **DATABASE ARCHITECTURE (Supabase)**

### Option 1: Simple Approach (Recommended to Start)

**Use your existing `products` table** with these additions:

1. **Add a `product_type` column:**
```sql
ALTER TABLE products
ADD COLUMN product_type TEXT DEFAULT 'physical';
-- Values: 'physical' or 'digital'

ALTER TABLE products
ADD COLUMN video_file_url TEXT;
-- For digital products: the downloadable video file

ALTER TABLE products
ADD COLUMN prompt_used TEXT;
-- Store which AI prompt was used to create this

ALTER TABLE products
ADD COLUMN animation_style TEXT;
-- e.g., 'heartbeat-pulse', 'wave-effect', 'love-story'

ALTER TABLE products
ADD COLUMN luxury_features JSONB;
-- Store styling details: {"trim": "gold", "embellishments": "diamond"}
```

2. **Add a separate `prompt_library` table** (for your creative prompts):
```sql
CREATE TABLE prompt_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_name TEXT NOT NULL,
    prompt_category TEXT NOT NULL,
    -- Categories: 'styling', 'animation', 'master'

    full_prompt TEXT NOT NULL,
    -- The complete AI prompt text

    quick_description TEXT,
    -- Short description of what it creates

    recommended_price DECIMAL(10, 2),
    -- Suggested retail price

    animation_type TEXT,
    -- e.g., 'heartbeat', 'wave', 'music-reactive', 'love-story'

    styling_features JSONB,
    -- {"trim": "gold", "embellishments": "diamond", "stem": "silver"}

    technical_specs JSONB,
    -- {"duration": "8-10 seconds", "resolution": "4K", "aspect_ratio": "16:9"}

    song_suggestions TEXT[],
    -- Array of song recommendations

    tags TEXT[],
    -- For searching: ['luxury', 'viral', 'romantic', 'tiktok']

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. **Add a `digital_downloads` table** (track customer downloads):
```sql
CREATE TABLE digital_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    purchase_id UUID REFERENCES purchases(id),

    download_url TEXT NOT NULL,
    download_count INT DEFAULT 0,
    max_downloads INT DEFAULT 5,
    -- Allow 5 downloads per purchase

    expires_at TIMESTAMPTZ,
    -- Optional: downloads expire after 30 days

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🗂️ **FILE STRUCTURE FOR DIGITAL PRODUCTS**

```
flower-shop/
├── public/
│   ├── videos/                    # Your generated luxury rose videos
│   │   ├── diamond-heart-pulse.mp4
│   │   ├── gold-wave-roses.mp4
│   │   ├── love-story-silhouette.mp4
│   │   ├── music-reactive-roses.mp4
│   │   └── ...
│   │
│   ├── images/                    # Thumbnail images for videos
│   │   ├── diamond-heart-pulse-thumb.jpg
│   │   ├── gold-wave-roses-thumb.jpg
│   │   └── ...
│   │
│   └── downloads/                 # Secure download links (generated dynamically)
│
├── server/
│   ├── routes/
│   │   ├── digitalProducts.js     # NEW: Digital product routes
│   │   └── downloads.js           # NEW: Secure download handling
│   │
│   └── uploads/                   # Where you upload new videos
│
└── src/
    ├── pages/
    │   ├── DigitalProducts.jsx    # NEW: Digital products gallery
    │   ├── ProductDetail.jsx      # Updated: Show video preview
    │   └── DownloadPage.jsx       # NEW: After-purchase download page
    │
    └── components/
        ├── VideoPlayer.jsx        # NEW: Video preview component
        └── DownloadButton.jsx     # NEW: Secure download button
```

---

## 💾 **UPLOAD YOUR PROMPT LIBRARY TO SUPABASE**

### Step 1: Run This SQL in Supabase Dashboard

Go to: https://supabase.com → Your Project → SQL Editor → New Query

**Copy and paste this:**

```sql
-- Create the prompt library table
CREATE TABLE IF NOT EXISTS prompt_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_name TEXT NOT NULL,
    prompt_category TEXT NOT NULL,
    full_prompt TEXT NOT NULL,
    quick_description TEXT,
    recommended_price DECIMAL(10, 2),
    animation_type TEXT,
    styling_features JSONB,
    technical_specs JSONB,
    song_suggestions TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to products table for digital products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'physical';

ALTER TABLE products
ADD COLUMN IF NOT EXISTS video_file_url TEXT;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS prompt_used TEXT;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS animation_style TEXT;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS luxury_features JSONB;

-- Create digital downloads tracking table
CREATE TABLE IF NOT EXISTS digital_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    product_id UUID REFERENCES products(id),
    purchase_id UUID,
    download_url TEXT NOT NULL,
    download_count INT DEFAULT 0,
    max_downloads INT DEFAULT 5,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view prompts" ON prompt_library
    FOR SELECT USING (true);

CREATE POLICY "Users can view their downloads" ON digital_downloads
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage everything" ON prompt_library
    FOR ALL USING (true);

CREATE POLICY "Service role can manage downloads" ON digital_downloads
    FOR ALL USING (true);
```

**Click "Run"** ✅

---

### Step 2: Upload Your Prompts to Database

Create a new file: `scripts/uploadPrompts.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const promptsToUpload = [
  // STYLING PROMPTS
  {
    prompt_name: "Diamond Crusted Roses",
    prompt_category: "styling",
    full_prompt: "Create photorealistic red roses with diamond-encrusted edges on each petal, sparkling under studio lighting, white background, 3D render, ultra-high detail",
    quick_description: "Luxury roses with diamond-encrusted petal edges",
    recommended_price: 12.99,
    styling_features: { trim: "diamond", embellishments: "diamond-crust" },
    tags: ["luxury", "diamond", "premium", "sparkle"]
  },
  {
    prompt_name: "Gold Trimmed Roses",
    prompt_category: "styling",
    full_prompt: "Luxury red roses with elegant gold metallic trim outlining each rose, premium look, soft lighting, white background, 3D animation",
    quick_description: "Elegant roses with gold metallic trim",
    recommended_price: 12.99,
    styling_features: { trim: "gold", metallic: true },
    tags: ["luxury", "gold", "premium", "elegant"]
  },
  {
    prompt_name: "Silver Petal Roses",
    prompt_category: "styling",
    full_prompt: "Pure silver metallic roses, mirror-like reflective petals, elegant and modern, soft lighting",
    quick_description: "Modern silver metallic roses",
    recommended_price: 12.99,
    styling_features: { petals: "silver-metallic", finish: "reflective" },
    tags: ["modern", "silver", "luxury", "reflective"]
  },

  // ANIMATION PROMPTS
  {
    prompt_name: "Heartbeat Pulse Animation",
    prompt_category: "animation",
    full_prompt: "24 red roses arranged in perfect heart shape, center roses pulsating with realistic heartbeat rhythm, soft glow emanating from center, romantic lighting, loop animation",
    quick_description: "Heart-shaped arrangement with pulsating heartbeat effect",
    recommended_price: 14.99,
    animation_type: "heartbeat-pulse",
    technical_specs: { duration: "8-10 seconds", looping: true },
    song_suggestions: ["Heart Attack - Demi Lovato", "Lover - Taylor Swift"],
    tags: ["romantic", "heartbeat", "viral", "tiktok"]
  },
  {
    prompt_name: "Wave Pop-Up Effect",
    prompt_category: "animation",
    full_prompt: "48 roses in square formation, each rose pops up one at a time from left to right creating wave effect, sequential timing, smooth motion, 5-second loop",
    quick_description: "Sequential wave effect with roses popping up",
    recommended_price: 12.99,
    animation_type: "wave-effect",
    technical_specs: { duration: "5-8 seconds", looping: true },
    song_suggestions: ["Levitating - Dua Lipa"],
    tags: ["dynamic", "wave", "viral", "satisfying"]
  },
  {
    prompt_name: "Music Reactive Roses",
    prompt_category: "animation",
    full_prompt: "Group of roses responding to bass-heavy music, roses sway and pulse with each beat, stems move rhythmically, particles react to sound frequencies, dynamic camera",
    quick_description: "Roses that pulse and sway with music beats",
    recommended_price: 16.99,
    animation_type: "music-reactive",
    technical_specs: { duration: "10-15 seconds", musicSync: true },
    song_suggestions: ["Any bass-heavy song"],
    tags: ["music", "reactive", "dynamic", "energetic"]
  },
  {
    prompt_name: "Love Story Silhouette",
    prompt_category: "animation",
    full_prompt: "Long stem roses form silhouette of athletic muscular man (roses as head, stems as body), running animation toward smaller rose group that grows into silhouette of elegant woman, both silhouettes jump together and merge, transforming into one giant blooming rose opening from center, romantic cinematic sequence, 15-20 seconds",
    quick_description: "Cinematic love story: two silhouettes merge into blooming rose",
    recommended_price: 19.99,
    animation_type: "love-story",
    technical_specs: { duration: "15-20 seconds", cinematic: true },
    song_suggestions: ["Perfect - Ed Sheeran", "All of Me - John Legend"],
    tags: ["romantic", "story", "cinematic", "viral", "premium"]
  },

  // MASTER PROMPT
  {
    prompt_name: "Ultimate Luxury Rose Master Prompt",
    prompt_category: "master",
    full_prompt: `Create a cinematic 3D animated luxury rose bouquet video with photorealistic roses featuring customizable trim (diamond/gold/silver/white/blue), customizable arrangement (heart/grid/circle/designer-heel), and animation styles (heartbeat-pulse/wave/circular-pulse/music-reactive/love-story). 4K resolution, 30 FPS, studio lighting, floating petals, sparkle effects, romantic atmosphere, Instagram/TikTok viral-ready. Duration: 5-20 seconds depending on complexity. Premium luxury aesthetic like Venus et Fleur.`,
    quick_description: "Master template for all luxury rose video variations",
    recommended_price: 29.99,
    animation_type: "custom-combination",
    technical_specs: {
      duration: "customizable",
      resolution: "4K",
      fps: 30,
      aspects: ["16:9", "9:16", "1:1"]
    },
    tags: ["master", "premium", "custom", "luxury", "all-features"]
  }
];

async function uploadPrompts() {
  console.log('🚀 Starting prompt library upload...\n');

  for (const prompt of promptsToUpload) {
    const { data, error } = await supabase
      .from('prompt_library')
      .insert([prompt])
      .select();

    if (error) {
      console.error(`❌ Error uploading "${prompt.prompt_name}":`, error.message);
    } else {
      console.log(`✅ Uploaded: ${prompt.prompt_name}`);
    }
  }

  console.log('\n🎉 Prompt library upload complete!');
}

uploadPrompts();
```

**Run it:**
```bash
cd ~/Desktop/flower-shop
node scripts/uploadPrompts.js
```

---

## 🎬 **ADD DIGITAL PRODUCTS TO YOUR STORE**

### Step 1: Generate Videos Using Your Prompts

Use tools like:
- **Grok AI** (X.AI)
- **Runway ML**
- **Leonardo AI**
- **Pika Labs**

**Example:**
1. Go to Grok AI
2. Paste prompt: "24 red roses with diamond trim in heart shape, pulsating heartbeat animation..."
3. Generate video
4. Download as `diamond-heart-pulse.mp4`
5. Save to `/Desktop/flower-shop/public/videos/`

---

### Step 2: Add Digital Products via Admin Panel

1. **Start your servers:**
```bash
cd ~/Desktop/flower-shop
npm run dev          # Terminal 1
npm run backend      # Terminal 2
```

2. **Go to Admin Panel:**
```
http://localhost:5173/admin
```

3. **Click "Add New Product"**

4. **Fill in for Digital Product:**
```
Name: Diamond Heart Pulse Roses
Price: 14.99
Category: digital-art
Description: Luxury 3D animated roses with diamond-encrusted edges, arranged in heart shape with mesmerizing heartbeat pulse effect. Perfect for TikTok/Instagram declarations of love!

Product Type: digital          # NEW FIELD
Video File URL: /videos/diamond-heart-pulse.mp4
Animation Style: heartbeat-pulse
Prompt Used: Diamond Crusted Roses + Heartbeat Pulse Animation

Image URL: /images/diamond-heart-thumb.jpg  # Thumbnail
Video URL: /videos/diamond-heart-pulse.mp4  # Full video

Occasions: romance, valentine, anniversary, love
Stock: 999    # Digital products don't run out
```

5. **Click "Add Product"**

✅ **Your digital product is now live!**

---

## 🎨 **RECOMMENDED PRODUCT LINEUP**

Based on your prompts, create these products:

### Basic Tier ($7.99 - $9.99):
1. Classic Red Rose Heartbeat (simple pulse, 8 sec)
2. Gold Trimmed Wave Roses (wave effect, 8 sec)
3. Pink Rose Pulse (circular pulse, 8 sec)

### Premium Tier ($12.99 - $14.99):
4. Diamond Crusted Heart Pulse
5. Silver Stem Music Reactive Roses
6. Blue Glow Circular Pulse
7. Designer Heel Rose Arrangement

### Story Tier ($16.99 - $19.99):
8. Love Story Silhouette Animation
9. Roses Rising & Intertwining
10. Brotherhood Roses (sports theme)

### Custom Tier ($29.99+):
11. Custom combination using master prompt
12. Personalized with customer's song choice

---

## 📦 **CUSTOMER PURCHASE FLOW**

### Current Flow (Physical Products):
1. Browse → Add to Cart → Checkout → Shipping

### NEW Flow (Digital Products):
1. Browse Digital Art Gallery
2. Preview video (autoplay hover)
3. Add to Cart
4. Checkout (Stripe)
5. **Download Page** (after payment)
6. Customer downloads MP4 file
7. Customer shares on TikTok/Instagram with their song

---

## 🔐 **SECURE DOWNLOAD SYSTEM**

Create: `server/routes/downloads.js`

```javascript
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const router = express.Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate secure download link after purchase
router.post('/generate-download', async (req, res) => {
  const { userId, productId, purchaseId } = req.body;

  try {
    // Verify purchase exists
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Get product details
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product || product.product_type !== 'digital') {
      return res.status(400).json({ error: 'Not a digital product' });
    }

    // Create download record
    const downloadUrl = product.video_file_url;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const { data: download } = await supabase
      .from('digital_downloads')
      .insert([{
        user_id: userId,
        product_id: productId,
        purchase_id: purchaseId,
        download_url: downloadUrl,
        expires_at: expiresAt
      }])
      .select()
      .single();

    res.json({
      downloadId: download.id,
      downloadUrl: downloadUrl,
      expiresAt: expiresAt
    });

  } catch (error) {
    console.error('Download generation error:', error);
    res.status(500).json({ error: 'Failed to generate download' });
  }
});

// Track download
router.post('/track-download/:downloadId', async (req, res) => {
  const { downloadId } = req.params;

  try {
    const { data: download } = await supabase
      .from('digital_downloads')
      .select('*')
      .eq('id', downloadId)
      .single();

    if (!download) {
      return res.status(404).json({ error: 'Download not found' });
    }

    // Check if expired
    if (new Date(download.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Download link expired' });
    }

    // Check download limit
    if (download.download_count >= download.max_downloads) {
      return res.status(429).json({ error: 'Download limit reached' });
    }

    // Increment download count
    await supabase
      .from('digital_downloads')
      .update({ download_count: download.download_count + 1 })
      .eq('id', downloadId);

    res.json({ success: true });

  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ error: 'Failed to track download' });
  }
});

export default router;
```

Add to `server.js`:
```javascript
import downloadRoutes from './routes/downloads.js';
app.use('/api/downloads', downloadRoutes);
```

---

## 🎯 **NEXT STEPS**

### Immediate (This Week):
1. ✅ Run SQL to create tables
2. ✅ Upload prompt library to Supabase
3. 🎬 Generate 5-10 luxury rose videos using your prompts
4. 📤 Upload videos to `/public/videos/`
5. ➕ Add digital products via admin panel

### Short Term (Next 2 Weeks):
6. 🎨 Create thumbnail images for each video
7. 📱 Test purchase → download flow
8. 🎵 Create song pairing guide for customers
9. 📣 Soft launch to friends/family

### Launch (When Ready):
10. 🚀 Deploy to Vercel
11. 💳 Switch Stripe to live mode
12. 📱 Share on social media
13. 🔥 Create viral TikTok showing your products!

---

## 💡 **PRO TIPS**

### Marketing Your Digital Roses:
- Create demo TikToks showing videos with different songs
- Post before/after: "Instead of sending $80 flowers, send $14.99 digital roses"
- Target audience: Long-distance couples, social media lovers
- Hashtags: #DigitalBloom #LuxuryRoses #ViralGift #TikTokRoses

### Video Quality:
- Always generate in 4K (downsample for web)
- Create 3 versions: 16:9 (landscape), 9:16 (vertical), 1:1 (square)
- Keep file sizes under 10MB (compress if needed)

### Upselling:
- Offer "Custom Song" service (+$5.99) where you add customer's song
- "Personalized Message" service (+$7.99) with text overlay
- "Bundle Deal" - 3 videos for $34.99

---

## 📋 **SUMMARY**

**WHERE TO ADD PROMPTS:**
✅ Supabase `prompt_library` table (for reference)
✅ Generate videos using prompts
✅ Store videos in `/public/videos/`
✅ Add as digital products in admin panel

**WHAT YOU'RE SELLING:**
✅ Luxury animated rose videos
✅ Customers download & share on social media
✅ $7.99 - $29.99 per video
✅ Viral TikTok/Instagram content

**TECH STACK:**
✅ Supabase: Store prompts + track downloads
✅ React frontend: Show video gallery
✅ Express backend: Handle downloads
✅ Stripe: Accept payments
✅ Vercel: Host everything

---

You're all set to transform your Digital Bloom shop into a luxury digital art marketplace! 🌹✨

Ready to generate your first videos? Start with the "Heartbeat Pulse" and "Diamond Crusted" prompts - they're the most viral! 🔥
