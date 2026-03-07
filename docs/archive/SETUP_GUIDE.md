# 🌸 Flower Shop - Complete Setup Guide

Welcome! This guide will help you set up your production-ready flower shop with Stripe payments, Supabase database, and custom videos.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Stripe Integration](#stripe-integration)
5. [Adding Your Media Files](#adding-your-media-files)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env and add your credentials (see below)

# 4. Run development server
npm run dev

# 5. In another terminal, run the API server
npm run server:dev
```

Visit http://localhost:5173 to see your flower shop!

---

## 🔧 Environment Setup

### Step 1: Copy the Environment Template

```bash
cp .env.example .env
```

### Step 2: Fill in Your Credentials

Open `.env` and add your keys:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Application URLs
VITE_APP_URL=http://localhost:5173
VITE_STRIPE_SUCCESS_URL=http://localhost:5173/success
VITE_STRIPE_CANCEL_URL=http://localhost:5173
```

**Where to find these:**
- **Supabase**: https://app.supabase.com/project/_/settings/api
- **Stripe**: https://dashboard.stripe.com/test/apikeys

---

## 🗄️ Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in details and wait for initialization

### Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase/schemas/01_initial_schema.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **Run**

This creates:
- `products` table
- `users` table
- `purchases` table
- `cart_items` table
- All indexes and security policies

### Step 3: Upload Products to Database

Option A: **Use the Upload Script (Recommended)**

```bash
npm run upload-products
```

This uploads sample products to get you started.

Option B: **Add Products Manually**

Go to Supabase Dashboard → Table Editor → products → Insert Row

**Required fields:**
- `name`: Product name
- `slug`: URL-friendly name (e.g., "red-rose-bouquet")
- `description`: Product description
- `price`: Numeric price (e.g., 49.99)
- `image_url`: Path to image (e.g., "/images/products/roses.jpg")
- `category`: roses | tulips | lilies | mixed
- `occasions`: Array like `["anniversary", "birthday"]`
- `stock`: Number of items available

**Optional fields:**
- `video_url`: Path to video (e.g., "/videos/roses.mp4")
- `thumbnail_url`: Path to thumbnail
- `stripe_product_id`: From Stripe (see below)
- `stripe_price_id`: From Stripe (see below)

### Step 4: Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy **Project URL** → Paste as `VITE_SUPABASE_URL` in `.env`
3. Copy **anon public key** → Paste as `VITE_SUPABASE_ANON_KEY` in `.env`

---

## 💳 Stripe Integration

### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Create an account
3. Switch to **Test Mode** (toggle in top right)

### Step 2: Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`
3. Click **Reveal** on Secret key → Copy → `STRIPE_SECRET_KEY` in `.env`

### Step 3: Create Products in Stripe

For each flower in your database:

1. Go to https://dashboard.stripe.com/test/products
2. Click **Add Product**
3. Fill in:
   - **Name**: Same as your product name
   - **Description**: Product description
   - **Price**: Same as your database price
   - **Currency**: USD (or your currency)
4. Click **Save product**
5. Copy the **Product ID** (starts with `prod_`)
6. Copy the **Price ID** (starts with `price_`)

### Step 4: Link Stripe IDs to Database

In Supabase SQL Editor, run:

```sql
UPDATE products
SET
  stripe_product_id = 'prod_xxxxx',
  stripe_price_id = 'price_xxxxx'
WHERE slug = 'red-rose-bouquet';
```

Repeat for each product.

### Step 5: Set Up Webhook (Optional, for Production)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/webhook`
4. Select events: `checkout.session.completed`, `checkout.session.expired`
5. Copy **Signing secret** → Add to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## 🎬 Adding Your Media Files

### Video Files

1. Place your luxury flower videos in:
   ```
   public/videos/
   ```

2. Naming convention:
   ```
   red-rose-bouquet.mp4
   pink-tulip-bunch.mp4
   white-lily-arrangement.mp4
   ```

3. Recommended format: **MP4 (H.264)**

4. In your database, set `video_url`:
   ```
   /videos/red-rose-bouquet.mp4
   ```

### Image Files

1. Place high-resolution product images in:
   ```
   public/images/products/
   ```

2. Naming convention:
   ```
   red-rose-bouquet.jpg
   pink-tulip-bunch.jpg
   ```

3. Recommended size: **1000x1000px** (square)

4. In your database, set `image_url`:
   ```
   /images/products/red-rose-bouquet.jpg
   ```

### Thumbnails (Optional)

1. Place thumbnails in:
   ```
   public/images/thumbnails/
   ```

2. Naming convention:
   ```
   red-rose-bouquet-thumb.jpg
   ```

3. Recommended size: **400x400px**

See `public/MEDIA_STRUCTURE.md` for more details.

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Runs at http://localhost:5173

**Terminal 2 - API Server:**
```bash
npm run server:dev
```
Runs at http://localhost:3001

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Run production API server
npm run server
```

### Project Structure

```
flower-shop/
├── public/
│   ├── videos/              # Your video files
│   └── images/
│       ├── products/        # Product images
│       └── thumbnails/      # Thumbnail images
├── server/
│   └── index.js            # Stripe API server
├── src/
│   ├── components/         # React components
│   ├── context/            # Cart context
│   ├── data/               # Mock data (fallback)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Supabase & Stripe config
│   ├── pages/              # Page components
│   └── App.jsx             # Main app
├── supabase/
│   └── schemas/            # Database schema
├── scripts/
│   └── uploadProducts.js   # Upload utility
└── .env                    # Your credentials (DO NOT COMMIT)
```

---

## 🔍 Testing Your Setup

### 1. Check Frontend

Visit http://localhost:5173

**Expected:**
- Products display in grid
- Search works
- Filters work
- Can add items to cart

**If using mock data:**
- Yellow banner appears: "Using Demo Data"
- This means Supabase is not configured yet

### 2. Check Video Playback

- Hover over a product card
- Video should auto-play
- If video doesn't play, check:
  - Video file exists in `public/videos/`
  - `video_url` in database is correct
  - Video format is MP4

### 3. Test Stripe Checkout

1. Add items to cart
2. Click "Proceed to Checkout"
3. Should redirect to Stripe Checkout page
4. Use test card: `4242 4242 4242 4242`
5. Any future date, any CVC
6. Should redirect to success page

### 4. Verify Database

In Supabase Dashboard → Table Editor:

```sql
-- Check products
SELECT * FROM products;

-- Check purchases
SELECT * FROM purchases ORDER BY created_at DESC;
```

---

## 🐛 Troubleshooting

### Products Not Showing

**Problem:** Blank page or "Using Demo Data" banner

**Solution:**
1. Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Restart dev server: `npm run dev`
3. Check browser console for errors
4. Verify database schema is created
5. Run `npm run upload-products` to add sample data

### Videos Not Playing

**Problem:** Only images show, no video

**Solution:**
1. Check video file exists in `public/videos/`
2. Check `video_url` in database matches filename
3. Try opening video directly: `http://localhost:5173/videos/your-video.mp4`
4. Ensure video format is MP4 (H.264)
5. Check browser console for errors

### Stripe Checkout Failing

**Problem:** Error when clicking "Proceed to Checkout"

**Solution:**
1. Check API server is running: `npm run server:dev`
2. Verify `STRIPE_SECRET_KEY` in `.env`
3. Check `stripe_price_id` is set on products
4. Open browser DevTools → Network tab → Check for API errors
5. Verify you're in Stripe Test Mode

### CORS Errors

**Problem:** API requests blocked by CORS

**Solution:**
- API server has CORS enabled by default
- Check `server/index.js` has `app.use(cors())`
- Restart API server

### Database Permissions Error

**Problem:** "permission denied" or RLS policy error

**Solution:**
1. Check RLS policies are enabled (in schema)
2. Make sure `is_active = true` on products
3. Try disabling RLS temporarily for testing:
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```
4. Re-enable after fixing:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com

---

## 🎉 You're All Set!

Your flower shop is now ready for:
- ✅ Custom videos and images
- ✅ Real-time inventory from Supabase
- ✅ Stripe payments
- ✅ Shopping cart with localStorage
- ✅ Search and filtering
- ✅ Responsive design

## Next Steps:

1. **Add your real products** to Supabase
2. **Upload your videos** to `public/videos/`
3. **Upload your images** to `public/images/products/`
4. **Configure Stripe products** and link IDs
5. **Test checkout flow** end-to-end
6. **Deploy to production** (Vercel, Netlify, etc.)

Need help? Check the troubleshooting section or open an issue!

---

Made with 🌸 by Claude Code
