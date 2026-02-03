
-- Allow public access to the digital-products bucket
-- (Or at least allow authenticated users to upload)

-- 1. Ensure the bucket is public (already verified by user, but good to be safe)
UPDATE storage.buckets
SET public = true
WHERE name = 'digital-products';

-- 2. Create Policy to allow SELECT (Public View) - if not exists
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'digital-products' );

-- 3. Create Policy to allow INSERT (Upload)
-- For development speed, we'll allow Anon uploads (be careful in production!)
-- Or ideally changing checks to role = 'anon' or 'service_role'
-- Since we are using an anon key in the script, we need anon insert access.
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'digital-products' );

-- 4. Allow Updates (for file overwrites)
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'digital-products' );
