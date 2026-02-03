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
VITE_SUPABASE_URL=https://yhdbeblowolfinxxhsnt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGJlYmxvd29sZmlueHhoc250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjA0NjMsImV4cCI6MjA4NDgzNjQ2M30.DGIJ5FSr2M4wBi3eQ5rjC0jx3CVS4pEcJe1PMOSR0yM
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51S7GViAbAZNcYUiz1RH5FJemN9wTPK47i0J7wU2y4PmrneDMpIGBajPBdtiXkJQhtzF67yA8hw7DpPJK5msTp84100WoJj234P
STRIPE_SECRET_KEY=sk_test_51S7GViAbAZNcYUiz74047wvAXyJpM1GRq8COEITXtK0Sh8XlMoNtIJwuZaqiHrjUIQOyDRU4QMYNxyIIQGnsAPkm00PmCrcx0F
```

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
