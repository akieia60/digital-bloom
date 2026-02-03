-- ============================================
-- DIGITAL BLOOM - LUXURY DIGITAL ART DATABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CREATE PROMPT LIBRARY TABLE
-- Stores all your AI prompts for generating luxury rose videos
CREATE TABLE IF NOT EXISTS prompt_library (
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

-- 2. ADD COLUMNS TO PRODUCTS TABLE
-- Extend existing products table to support digital products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'physical';
-- Values: 'physical' or 'digital'

ALTER TABLE products
ADD COLUMN IF NOT EXISTS video_file_url TEXT;
-- For digital products: the downloadable video file

ALTER TABLE products
ADD COLUMN IF NOT EXISTS prompt_used TEXT;
-- Store which AI prompt was used to create this

ALTER TABLE products
ADD COLUMN IF NOT EXISTS animation_style TEXT;
-- e.g., 'heartbeat-pulse', 'wave-effect', 'love-story'

ALTER TABLE products
ADD COLUMN IF NOT EXISTS luxury_features JSONB;
-- Store styling details: {"trim": "gold", "embellishments": "diamond"}

-- 3. CREATE DIGITAL DOWNLOADS TABLE
-- Track customer downloads and enforce limits
CREATE TABLE IF NOT EXISTS digital_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    product_id UUID REFERENCES products(id),
    purchase_id UUID,

    download_url TEXT NOT NULL,
    download_count INT DEFAULT 0,
    max_downloads INT DEFAULT 5,
    -- Allow 5 downloads per purchase

    expires_at TIMESTAMPTZ,
    -- Downloads expire after 30 days

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_downloads ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES

-- Prompt Library: Anyone can view
CREATE POLICY "Anyone can view prompts" ON prompt_library
    FOR SELECT USING (true);

-- Prompt Library: Service role can manage
CREATE POLICY "Service role can manage prompts" ON prompt_library
    FOR ALL USING (true);

-- Downloads: Users can view their own downloads
CREATE POLICY "Users can view their downloads" ON digital_downloads
    FOR SELECT USING (true);

-- Downloads: Service role can manage
CREATE POLICY "Service role can manage downloads" ON digital_downloads
    FOR ALL USING (true);

-- 6. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_animation ON products(animation_style);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompt_library(prompt_category);
CREATE INDEX IF NOT EXISTS idx_prompts_animation ON prompt_library(animation_type);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON digital_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_product ON digital_downloads(product_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Add a sample digital product
INSERT INTO products (
    name,
    slug,
    price,
    stock,
    category,
    occasions,
    description,
    image_url,
    video_url,
    product_type,
    animation_style,
    luxury_features
) VALUES (
    'Diamond Heart Pulse Roses',
    'diamond-heart-pulse-roses',
    14.99,
    999,
    'digital-art',
    ARRAY['romance', 'valentine', 'anniversary'],
    'Luxury 3D animated roses with diamond-encrusted edges, arranged in a perfect heart shape with mesmerizing heartbeat pulse effect. Perfect for TikTok and Instagram declarations of love! Download as MP4 and share with your signature song.',
    '/images/diamond-heart-thumb.jpg',
    '/videos/diamond-heart-pulse.mp4',
    'digital',
    'heartbeat-pulse',
    '{"trim": "diamond", "embellishments": "diamond-crust", "arrangement": "heart"}'::jsonb
);

-- ============================================
-- SUCCESS!
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Then run: node scripts/uploadPrompts.js
-- to populate your prompt library
-- ============================================
