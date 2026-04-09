ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS download_storage_path TEXT;

CREATE INDEX IF NOT EXISTS idx_purchases_download_storage_path
  ON purchases(download_storage_path);

INSERT INTO storage.buckets (id, name, public)
VALUES ('bloom-deliveries', 'bloom-deliveries', false)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

