
-- Fix names for the recently auto-published products
-- We identify them by their generic names or recent creation time

UPDATE products
SET name = 'Shattered Backboard (Basketball/Rose)',
    slug = 'shattered-backboard-basketball-rose',
    category = 'sports'
WHERE name LIKE 'Viral Reveal%' 
  AND created_at > NOW() - INTERVAL '10 minutes'
  AND id = 'e2806ee5-f6bd-48dd-87a4-a34bf4161165'; -- ID from previous step output

UPDATE products
SET name = 'Bond of Brothers (Handshake/Gold)',
    slug = 'bond-of-brothers-handshake-gold',
    category = 'masculine-collection'
WHERE name LIKE 'Viral Reveal%'
  AND created_at > NOW() - INTERVAL '10 minutes'
  AND id = '867a0f5e-84a5-4705-ac6a-b372599136d2'; -- ID from previous step output
