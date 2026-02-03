# Supabase Database Setup

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait for it to initialize

## Step 2: Run Database Schema

1. Go to your project dashboard
2. Click **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `schemas/01_initial_schema.sql`
5. Click **Run** to execute the schema

This will create:
- `products` table
- `users` table
- `purchases` table
- `cart_items` table
- All necessary indexes
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps

## Step 3: Set Up Storage for Media Files

### Option A: Use Storage Buckets (Recommended for Large Files)

1. Go to **Storage** in the left sidebar
2. Click **Create new bucket**
3. Name it `product-media`
4. Set it to **Public**
5. Click **Save**

#### Upload Files to Storage:
```javascript
// Use the upload utility (see /src/utils/uploadProduct.js)
// Or upload manually via Supabase Dashboard > Storage
```

### Option B: Use Public Folder (Simpler, for Development)

Just place files in your `/public` folder as described in `/public/MEDIA_STRUCTURE.md`

## Step 4: Get Your API Keys

1. Go to **Project Settings** (gear icon)
2. Click **API** in the left menu
3. Copy these values to your `.env` file:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## Step 5: Add Products to Database

You have two options:

### Option A: Use the Upload Utility Script
```bash
npm run upload-products
```

This will seed your database with sample products.

### Option B: Add Products Manually

Use the Supabase Dashboard:
1. Go to **Table Editor** → `products`
2. Click **Insert row**
3. Fill in the fields:
   - name, description, price
   - image_url, video_url (paths to your media files)
   - category, occasions
   - stock

### Option C: Insert via SQL

```sql
INSERT INTO products (name, slug, description, price, image_url, video_url, category, occasions, stock)
VALUES (
  'Red Rose Bouquet',
  'red-rose-bouquet',
  'A classic bouquet of 12 premium red roses',
  49.99,
  '/images/products/red-rose-bouquet.jpg',
  '/videos/red-rose-bouquet.mp4',
  'roses',
  ARRAY['anniversary', 'romance', 'valentine'],
  15
);
```

## Step 6: Configure Stripe Products

For each product in your database:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create a product
3. Create a price for that product
4. Copy the **Product ID** (starts with `prod_`)
5. Copy the **Price ID** (starts with `price_`)
6. Update your database:

```sql
UPDATE products
SET
  stripe_product_id = 'prod_xxxxx',
  stripe_price_id = 'price_xxxxx'
WHERE slug = 'red-rose-bouquet';
```

## Verification

Run these queries to verify your setup:

```sql
-- Check products
SELECT id, name, price, category, stock FROM products;

-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Troubleshooting

### Products not showing up?
- Check RLS policies are enabled
- Make sure `is_active = true` on your products
- Verify your Supabase URL and anon key in `.env`

### Can't upload to storage?
- Make sure the bucket is set to **Public**
- Check storage policies are enabled
- Try uploading via the Dashboard first

### Stripe integration not working?
- Verify your Stripe keys in `.env`
- Make sure `stripe_price_id` is set on products
- Check Stripe Dashboard for any errors
