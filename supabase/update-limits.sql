-- Enforce stricter limits for Digital Products
-- Run this in Supabase SQL Editor

-- 1. Update default values for future rows
ALTER TABLE digital_downloads 
ALTER COLUMN max_downloads SET DEFAULT 1;

ALTER TABLE digital_downloads 
ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '48 hours');

-- 2. Update logic description (optional comment)
COMMENT ON COLUMN digital_downloads.max_downloads IS 'Strict limit: 1 download per purchase';
