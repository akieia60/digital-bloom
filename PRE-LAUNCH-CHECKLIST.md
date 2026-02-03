# 🚀 Digital Bloom - Pre-Launch Checklist

## ✅ Complete This Before Going Live

---

## 📸 **Step 1: Create Your Flower Arrangements**

### What You Need:
- [ ] High-quality photos of each arrangement (1000x1000px recommended)
- [ ] Optional: Videos of arrangements (MP4 format)
- [ ] Product names
- [ ] Descriptions (what flowers, what occasions)
- [ ] Prices

### Tips:
- Take photos in good lighting
- White or simple background works best
- Show arrangements from different angles
- Videos can be 5-15 seconds (loops well)

---

## 🌸 **Step 2: Add Products via Admin Panel**

### How to Add Each Arrangement:

1. **Start your local servers:**
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

4. **Fill in the form:**
   - **Name:** "Purple Orchid Elegance" (example)
   - **Price:** 79.99
   - **Description:** "Exotic purple orchids in modern vase..."
   - **Category:** Choose from: roses, tulips, lilies, mixed
   - **Occasions:** anniversary, birthday, wedding, etc.
   - **Stock:** How many you have available
   - **Image URL:**
     - Upload to Unsplash.com (free) and paste link
     - OR use: `/images/your-photo.jpg` (put in public/images/)
   - **Video URL:** `/videos/your-video.mp4` (optional)

5. **Click "Add Product"**

6. **Repeat for each arrangement!**

### Recommended Number of Products:
- **Minimum:** 8-10 arrangements (looks professional)
- **Ideal:** 15-20 arrangements (great variety)
- **Maximum:** As many as you want!

---

## 🎨 **Step 3: Customize Your Branding**

### Update Store Name (if not "Digital Bloom"):
- [ ] Edit `src/components/Header.jsx` (line 20)
- [ ] Edit `index.html` (line 7) - Update page title

### Update Colors (optional):
- [ ] Edit `tailwind.config.js` - Change color scheme

### Add Your Logo (optional):
- [ ] Replace logo in `src/components/Header.jsx`

---

## 💳 **Step 4: Set Up Stripe for Real Payments**

### Current Status: TEST MODE ✅
- Test card works: 4242 4242 4242 4242
- No real money is charged

### Before Launch, Switch to LIVE MODE:

1. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com
   - Toggle from "Test mode" to "Live mode" (top right)

2. **Get Live API Keys:**
   - Go to Developers → API Keys
   - Copy **Live** Publishable Key
   - Copy **Live** Secret Key

3. **Update Keys (when deploying):**
   - In Vercel: Settings → Environment Variables
   - Update both Stripe keys with LIVE versions

4. **Set Up Bank Account:**
   - Stripe → Settings → Payouts
   - Add your bank account to receive payments

⚠️ **Don't switch to live mode until you're ready to accept real payments!**

---

## 📝 **Step 5: Write Your Policies**

### Create These Pages (when ready):

- [ ] **Shipping Policy**
  - Delivery areas
  - Delivery times
  - Shipping costs

- [ ] **Return Policy**
  - Can customers return?
  - Refund policy
  - Damaged arrangements

- [ ] **Privacy Policy**
  - How you handle customer data
  - (Can use free generator: termsfeed.com)

- [ ] **Terms of Service**
  - Purchase terms
  - (Can use free generator: termsfeed.com)

💡 You can add these later - not required for launch!

---

## 🧪 **Step 6: Test Everything Locally**

### Before deploying, test:

- [ ] **Browse products** - All arrangements show correctly
- [ ] **Search works** - Can find products by name
- [ ] **Filters work** - Category and occasion filters
- [ ] **Add to cart** - Items go in cart
- [ ] **Update quantities** - Can change amounts
- [ ] **Remove from cart** - Can delete items
- [ ] **Checkout** - Redirects to Stripe (test mode)
- [ ] **Complete test purchase** - Use test card: 4242 4242 4242 4242
- [ ] **See success page** - Confirmation shows
- [ ] **Admin panel** - Can add/edit/delete products
- [ ] **Mobile view** - Test on phone (responsive design)

### Test Checklist:
```bash
# Start servers
cd ~/Desktop/flower-shop
npm run dev          # Terminal 1
npm run backend      # Terminal 2

# Visit in browser
http://localhost:5173       # Main store
http://localhost:5173/admin # Admin panel

# Test on phone
- Open browser on phone
- Go to: http://YOUR-COMPUTER-IP:5173
```

---

## 📸 **Step 7: Prepare Marketing Materials**

### Get Ready to Share:

- [ ] Take screenshots of your site
- [ ] Write announcement post for social media
- [ ] Make list of people to share with
- [ ] Create Instagram/Facebook business page (optional)

---

## 🚀 **Step 8: Deploy When Ready**

### Deployment Day Checklist:

1. **Make sure all products are added** ✅
2. **Test everything one more time** ✅
3. **Have your .env variables ready** ✅
4. **Follow DEPLOY.md instructions** ✅
5. **Buy domain (optional)**
6. **Share your link!** 🎉

---

## 📋 **Quick Product Entry Template**

**Use this for each arrangement:**

```
Name: ______________________________
Price: $ ___________________________
Description: _______________________
___________________________________
___________________________________
Category: [ ] roses [ ] tulips [ ] lilies [ ] mixed
Occasions: _________________________
Stock: _____________________________
Photo taken: [ ] Yes [ ] No
Photo uploaded: [ ] Yes [ ] No
Video taken: [ ] Yes [ ] No
Added to site: [ ] Yes [ ] No
```

---

## 💡 **Pro Tips:**

### Photography Tips:
- Use natural light (near window)
- Take photos during daytime
- Simple background (white, gray, wood)
- Multiple angles
- Show size/scale

### Pricing Tips:
- Research competitor prices
- Factor in: flowers + time + delivery
- Round to .99 (e.g., $49.99 not $50.00)
- Start with test prices, adjust based on sales

### Description Tips:
- What flowers are included
- What occasions it's perfect for
- Vase/container details
- Size/dimensions
- Any special care instructions

---

## 🎯 **Your Timeline:**

### Phase 1: Preparation (Now)
- ✅ Website built
- ✅ Servers running
- ✅ Admin panel ready
- 🔲 Create arrangements
- 🔲 Take photos/videos
- 🔲 Add all products

### Phase 2: Testing (Before Launch)
- 🔲 Test all features
- 🔲 Test on mobile
- 🔲 Complete test purchase
- 🔲 Review all product info

### Phase 3: Launch! (When Ready)
- 🔲 Deploy to Vercel
- 🔲 Switch Stripe to live mode
- 🔲 Buy domain (optional)
- 🔲 Share with the world!

### Phase 4: Post-Launch
- 🔲 Monitor first orders
- 🔲 Get customer feedback
- 🔲 Add more products
- 🔲 Promote on social media

---

## ⏰ **Estimated Timeline:**

**Creating Arrangements:** 1-2 weeks
- Time to make each arrangement
- Photo/video shoots
- Edit images

**Adding to Website:** 1-2 hours
- Use admin panel
- Quick and easy!

**Testing:** 1 hour
- Test all features
- Make sure everything works

**Deployment:** 5-10 minutes
- Follow DEPLOY.md
- Super quick!

**Total:** Take your time! Launch when YOU'RE ready! 🌸

---

## 📞 **Need Help?**

When you're ready to launch:
1. Review DEPLOY.md
2. Test everything one more time
3. Deploy!
4. Share your success! 🎉

---

## ✨ **Remember:**

- **Don't rush!** Quality over speed
- **Test thoroughly** before going live
- **Start with test mode** on Stripe
- **You can always add more** products later
- **It's okay to launch small** and grow
- **Your website is ready** whenever you are!

---

**Current Status: ✅ Website Ready**
**Next Step: 🌸 Create Your Beautiful Arrangements!**

Take your time and make it perfect! 💐
