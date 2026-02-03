
-- Allow INSERT access to the products table
-- Only run this if you want to allow creating products from scripts/API without login

CREATE POLICY "Allow Public Insert"
ON products FOR INSERT
WITH CHECK ( true );

-- Also allow updates if we need to modify them later
CREATE POLICY "Allow Public Update"
ON products FOR UPDATE
USING ( true );
