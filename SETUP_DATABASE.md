# 🚀 Quick Database Setup Guide

## Step 1: Run the Database Schema

1. **Open Supabase Dashboard**
   - Go to: https://yhdbeblowolfinxxhsnt.supabase.co
   - Click **SQL Editor** (left sidebar)

2. **Copy the Schema**
   - Open the file: `supabase/schemas/01_initial_schema.sql`
   - Copy EVERYTHING (all 240 lines)

3. **Run in SQL Editor**
   - In Supabase SQL Editor, click **New Query**
   - Paste the copied schema
   - Click **RUN** (bottom right)

4. **Verify Setup**
   - You should see "Success" message
   - Go to **Table Editor** → You should see 4 tables:
     - ✅ products
     - ✅ users
     - ✅ purchases
     - ✅ cart_items

---

## Step 2: Upload Sample Products

After the schema is set up, run this command:

```bash
npm run upload-products
```

This will add 5 sample flower arrangements to your database.

---

## Step 3: Access Your Admin Panel

Once the database is set up, you can manage products at:

**http://localhost:5173/admin**

From there you can:
- ✅ View all products
- ✅ Add new arrangements (with photos/videos)
- ✅ Edit existing products
- ✅ Delete products
- ✅ Set prices and stock levels

---

## ✅ You're Done!

After completing these steps:
1. Your database is ready
2. Sample products are loaded
3. Your checkout will work with real Stripe payments
4. You can add your own arrangements via the admin panel

Need help? Just ask!
