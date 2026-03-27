# 🚀 Quick Deployment Guide

## **Fastest Way to Go Live (5 minutes)**

### **Step 1: Install Vercel**
```bash
npm install -g vercel
```

### **Step 2: Deploy**
```bash
cd ~/Desktop/flower-shop
vercel
```

### **Step 3: Add Your Secrets**
When prompted, add these environment variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

> ⚠️ **NEVER commit real API keys to Git.** Get these values from your Supabase and Stripe dashboards and add them directly in Vercel's environment variable settings.

### **Step 4: Deploy to Production**
```bash
vercel --prod
```

### **Done!** 🎉

Your site will be live at: `https://digital-bloom-xxxxx.vercel.app`

---

## **OR Use GitHub (For Version Control)**

### **Step 1: Create GitHub Repo**
```bash
cd ~/Desktop/flower-shop

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Digital Bloom - Ready for production"
```

### **Step 2: Push to GitHub**
1. Go to https://github.com/new
2. Create repo named "digital-bloom"
3. Run these commands:

```bash
git remote add origin https://github.com/YOUR-USERNAME/digital-bloom.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy with Vercel**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Add environment variables
5. Deploy!

---

## **Update Your Live Site**

Whenever you make changes:

```bash
cd ~/Desktop/flower-shop
git add .
git commit -m "Updated products"
git push
```

Vercel will auto-deploy! 🚀

---

## **Cost Summary**

**FREE TIER (Perfect for Starting):**
- Vercel: Free (unlimited deployments)
- Supabase: Free (500MB database, 50K users)
- Stripe: Free (2.9% + 30¢ per transaction)

**Total Monthly Cost: $0** (you only pay Stripe fees when you make sales!)

---

## **When You Get Your First Sales**

1. **Switch Stripe to Live Mode**
   - Go to Stripe Dashboard → Toggle to Live Mode
   - Get new API keys
   - Update in Vercel environment variables

2. **Get Custom Domain** (optional)
   - Buy at Namecheap.com (~$10/year)
   - Add to Vercel (Settings → Domains)

3. **Celebrate!** 🎉

---

**Questions? Everything is in COMPLETE_CODE_GUIDE.md**
