-- ============================================
-- EXPERIENCE CUSTOMIZATIONS TABLE
-- ============================================
-- Run this in Supabase SQL Editor to add customization support

CREATE TABLE IF NOT EXISTS experience_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  
  -- Customization options
  custom_message_short TEXT,
  custom_message_long TEXT,
  color_theme TEXT DEFAULT 'original',
  occasion TEXT,
  
  -- Gifting options
  is_gift BOOLEAN DEFAULT false,
  recipient_name TEXT,
  recipient_email TEXT,
  delivery_date TIMESTAMP,
  gift_message TEXT,
  
  -- Delivery tracking
  delivery_status TEXT DEFAULT 'pending',
  delivery_link TEXT,
  delivered_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customizations_product ON experience_customizations(product_id);
CREATE INDEX IF NOT EXISTS idx_customizations_user ON experience_customizations(user_email);
CREATE INDEX IF NOT EXISTS idx_customizations_recipient ON experience_customizations(recipient_email);
CREATE INDEX IF NOT EXISTS idx_customizations_delivery ON experience_customizations(delivery_link);

-- Enable Row Level Security
ALTER TABLE experience_customizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own customizations
CREATE POLICY "Users can view own customizations" ON experience_customizations
  FOR SELECT USING (auth.email() = user_email OR auth.email() = recipient_email);

-- Policy: Users can insert their own customizations
CREATE POLICY "Users can create customizations" ON experience_customizations
  FOR INSERT WITH CHECK (auth.email() = user_email);

-- Policy: Users can update their own customizations
CREATE POLICY "Users can update own customizations" ON experience_customizations
  FOR UPDATE USING (auth.email() = user_email);
