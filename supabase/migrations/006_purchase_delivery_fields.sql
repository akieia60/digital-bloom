ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS bloom_slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS composition_manifest JSONB;

CREATE INDEX IF NOT EXISTS idx_purchases_bloom_slug ON purchases(bloom_slug);
