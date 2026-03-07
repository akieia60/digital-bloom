-- ============================================================
-- Digital Bloom Tracker — Database Migration
-- Run this in your Supabase SQL Editor to create the tables.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. shared_prompts — Shared prompt library for collaboration
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shared_prompts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_text   TEXT NOT NULL,
  theme         TEXT,
  sequence_name TEXT,
  created_by    TEXT NOT NULL DEFAULT 'founder',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by theme and sequence
CREATE INDEX IF NOT EXISTS idx_shared_prompts_theme ON shared_prompts (theme);
CREATE INDEX IF NOT EXISTS idx_shared_prompts_sequence ON shared_prompts (sequence_name);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_shared_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_shared_prompts_updated_at ON shared_prompts;
CREATE TRIGGER trg_shared_prompts_updated_at
  BEFORE UPDATE ON shared_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_shared_prompts_updated_at();

-- RLS: Only authenticated users can read; only admin can write
ALTER TABLE shared_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read shared_prompts"
  ON shared_prompts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert shared_prompts"
  ON shared_prompts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );

CREATE POLICY "Admin can update shared_prompts"
  ON shared_prompts FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );

CREATE POLICY "Admin can delete shared_prompts"
  ON shared_prompts FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );


-- ──────────────────────────────────────────────────────────────
-- 2. activity_log — Track user actions for audit trail
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name   TEXT NOT NULL,
  action      TEXT NOT NULL,
  prompt_id   UUID REFERENCES shared_prompts(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for recent activity queries
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log (user_name);

-- RLS: Only admin can read/write
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read activity_log"
  ON activity_log FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );

CREATE POLICY "Admin can insert activity_log"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );


-- ──────────────────────────────────────────────────────────────
-- 3. video_ratings — Rate and favorite generated videos
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_ratings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL,
  video_url   TEXT NOT NULL,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one rating per user per video
CREATE UNIQUE INDEX IF NOT EXISTS idx_video_ratings_user_video
  ON video_ratings (user_id, video_url);

-- Index for favorites lookup
CREATE INDEX IF NOT EXISTS idx_video_ratings_favorites
  ON video_ratings (is_favorite) WHERE is_favorite = TRUE;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_video_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_video_ratings_updated_at ON video_ratings;
CREATE TRIGGER trg_video_ratings_updated_at
  BEFORE UPDATE ON video_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_video_ratings_updated_at();

-- RLS: Users can manage their own ratings; admin can see all
ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own video_ratings"
  ON video_ratings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all video_ratings"
  ON video_ratings FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('akieia60@gmail.com', 'akieia.davis@gmail.com', 'admin@digitalbloom.art')
  );

CREATE POLICY "Users can insert own video_ratings"
  ON video_ratings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own video_ratings"
  ON video_ratings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own video_ratings"
  ON video_ratings FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ============================================================
-- Done! Three tables created:
--   - shared_prompts
--   - activity_log
--   - video_ratings
-- ============================================================
