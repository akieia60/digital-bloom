# 🎬 Simple Setup Guide - Add Digital Art Videos

## ✅ **I've Updated Your Website!**

Your website now supports **BOTH** physical flowers AND digital art videos!

You don't need to code anything - just follow these 3 simple steps:

---

## **STEP 1: Update Database** (5 minutes) ⚡

1. Go to Supabase: **https://supabase.com**
2. Click on your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**
5. Open this file: `/Desktop/flower-shop/supabase/digital-products-schema.sql`
6. **Copy ALL the SQL** (Cmd+A, Cmd+C)
7. **Paste** into Supabase SQL Editor
8. Click **"Run"** button
9. ✅ You should see "Success" message!

**Done!** Your database now supports digital products!

---

## **STEP 2: Upload Your Prompts** (Optional - 2 minutes) 📝

This step uploads your AI prompts to the database for reference:

```bash
cd ~/Desktop/flower-shop
node scripts/uploadPrompts.js
```

✅ You should see: "🎉 Prompt library upload complete!"

---

## **STEP 3: Add Digital Products** (Easy!) 🎨

### Your Existing Admin Panel Now Has Digital Product Support!

1. **Start your servers** (if not running):
```bash
cd ~/Desktop/flower-shop
npm run dev          # Terminal 1
npm run backend      # Terminal 2
```

2. **Go to Admin Panel:**
```
http://localhost:5173/admin
```

3. **Click "+ Add New Product"**

4. **Fill in the form** - Notice the NEW fields:

#### Regular Fields (same as before):
- Product Name: e.g., "Diamond Heart Pulse Roses"
- Price: e.g., 14.99
- Description: Describe your luxury video
- Category: Select "digital-art"
- Image URL: `/images/diamond-heart-thumb.jpg` (thumbnail)
- Video URL: `/videos/diamond-heart-pulse.mp4` (your video file)

#### NEW Digital Product Fields:
- **Product Type:** Select **"Digital (Video Download)"** ← Important!
- **Animation Style:** Select from dropdown (heartbeat-pulse, wave-effect, etc.)
- **Trim/Edge Style:** Select style (diamond, gold, silver, etc.)
- **Embellishments:** e.g., "pearls, sparkles"
- **AI Prompt Used:** e.g., "Diamond Crusted + Heartbeat Pulse"

5. **Set Stock:** For digital products, use **999** (unlimited)

6. **Click "Add Product"**

✅ **Done!** Your digital product is now on your website!

---

## **🎬 How to Add Your Videos**

### Before adding products, you need videos!

1. **Go to your favorite AI video generator:**
   - Grok AI (X.AI) - https://x.ai
   - Runway ML - https://runwayml.com
   - Leonardo AI - https://leonardo.ai
   - Pika Labs - https://pika.art

2. **Use a prompt from your library!**
   Example:
   ```
   Create 3D luxury red roses with diamond-encrusted edges,
   arranged in heart shape, pulsating heartbeat animation,
   white background, 4K, romantic lighting
   ```

3. **Generate the video** (takes 1-5 minutes)

4. **Download as MP4**

5. **Save to your videos folder:**
   ```
   /Desktop/flower-shop/public/videos/diamond-heart-pulse.mp4
   ```

6. **Take a screenshot** for thumbnail:
   ```
   /Desktop/flower-shop/public/images/diamond-heart-thumb.jpg
   ```

7. **Now add it via Admin Panel!** (see Step 3 above)

---

## **📦 File Organization**

```
flower-shop/
├── public/
│   ├── videos/
│   │   ├── diamond-heart-pulse.mp4        ← Your videos here
│   │   ├── gold-wave-roses.mp4
│   │   └── love-story-silhouette.mp4
│   │
│   └── images/
│       ├── diamond-heart-thumb.jpg        ← Thumbnails here
│       ├── gold-wave-thumb.jpg
│       └── love-story-thumb.jpg
```

---

## **✨ What's Changed on Your Website?**

### **Admin Panel:**
- ✅ New "Product Type" dropdown (Physical vs Digital)
- ✅ New digital product fields (animation style, trim, prompts)
- ✅ Purple section appears when you select "Digital"

### **Product Cards (Homepage):**
- ✅ Shows "🎬 Digital Art" badge on digital products
- ✅ Videos still autoplay on hover

### **Product Details Page:**
- ✅ Shows "Digital Download" badge
- ✅ NO quantity selector for digital products
- ✅ Button says "Purchase & Download" instead of "Add to Cart"
- ✅ Shows instant download benefits instead of shipping info

### **After Purchase:**
- ✅ Customer gets download link (future: you can add secure downloads)
- ✅ Video URL is accessible

---

## **🎯 Quick Example: Add Your First Digital Product**

Let's add "Diamond Heart Pulse Roses":

1. **Generate video** using Grok AI with this prompt:
   ```
   24 luxury red roses with diamond-encrusted petals arranged in
   perfect heart shape, pulsating heartbeat animation, soft romantic
   lighting, white background, 4K quality, 8 seconds loop
   ```

2. **Download video** → Save as `/public/videos/diamond-heart-pulse.mp4`

3. **Screenshot thumbnail** → Save as `/public/images/diamond-heart-thumb.jpg`

4. **Go to Admin Panel** → Click "Add New Product"

5. **Fill in:**
   - Name: Diamond Heart Pulse Roses
   - Price: 14.99
   - Description: "Luxury 3D animated roses with diamond-encrusted edges..."
   - Category: digital-art
   - Image URL: `/images/diamond-heart-thumb.jpg`
   - Video URL: `/videos/diamond-heart-pulse.mp4`
   - **Product Type: Digital**
   - Animation Style: heartbeat-pulse
   - Trim Style: diamond
   - Embellishments: diamond crust, sparkles
   - Prompt Used: Diamond Crusted + Heartbeat Pulse
   - Stock: 999

6. **Click "Add Product"**

7. **Go to homepage** → See your digital product live! 🎉

---

## **💡 Pro Tips**

### **Pricing Your Digital Products:**
- **Basic Animations:** $7.99 - $9.99
- **Premium Animations:** $12.99 - $14.99
- **Story Sequences:** $16.99 - $19.99
- **Custom/Master:** $29.99+

### **Creating Videos:**
- Start with simple animations (heartbeat, wave)
- Generate 3-5 variations, pick the best
- Keep file sizes under 10MB
- Create vertical versions (9:16) for TikTok

### **Best Combos to Create First:**
1. Diamond + Heartbeat (most viral)
2. Gold + Wave (satisfying effect)
3. Silver + Circular Pulse (hypnotic)
4. Love Story (premium, emotional)

---

## **🆘 Need Help?**

### **SQL won't run?**
- Make sure you copied ALL the SQL
- Check you're in the right Supabase project
- Look for any error messages

### **Prompts won't upload?**
- Make sure you ran Step 1 first (SQL)
- Check your `.env` file has `SUPABASE_SERVICE_ROLE_KEY`
- Run: `npm install` if needed

### **Product not showing?**
- Make sure "Product is active" is checked
- Refresh the homepage
- Check browser console for errors

### **Video not playing?**
- Check file path starts with `/videos/`
- Make sure file is in `public/videos/` folder
- Try refreshing the page

---

## **✅ You're Ready!**

Your website now supports:
- ✅ Traditional physical flower arrangements
- ✅ Luxury digital art video downloads
- ✅ Easy admin panel for both types
- ✅ Automatic product type detection
- ✅ Professional presentation

**Start creating your viral rose videos!** 🌹✨

---

**Remember:**
1. Run SQL in Supabase
2. Generate videos with AI
3. Add via admin panel

It's that simple! 🎬🚀
