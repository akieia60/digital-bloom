# 🌸 Digital Bloom - Complete Code Guide

## 📂 Project Structure

Your entire app is in: `/Users/akieiamoniquedavis/Desktop/flower-shop`

```
flower-shop/
│
├── 🎨 FRONTEND CODE (React/Vite)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Header.jsx       # Navigation & search
│   │   │   ├── Hero.jsx         # Homepage banner
│   │   │   ├── ProductGrid.jsx  # Product listing
│   │   │   ├── ProductCard.jsx  # Individual product cards
│   │   │   ├── ShoppingCart.jsx # Shopping cart sidebar
│   │   │   ├── CartItem.jsx     # Cart item component
│   │   │   ├── FilterPanel.jsx  # Search filters
│   │   │   ├── VideoPlayer.jsx  # Video player for products
│   │   │   └── ProductDetails.jsx
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Admin.jsx        # Admin panel (add/edit products)
│   │   │   └── Success.jsx      # Payment success page
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.jsx  # Shopping cart state management
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.js      # Supabase database connection
│   │   │   └── stripe.js        # Stripe payment integration
│   │   │
│   │   ├── hooks/
│   │   │   └── useProducts.js   # Load products from database
│   │   │
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   │
│   ├── public/                  # Static files
│   │   ├── images/              # Product images
│   │   └── videos/              # Product videos
│   │
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS config
│
├── 🔧 BACKEND CODE (Node.js/Express)
│   ├── server.js                # Express API server
│   │   └── /api/create-checkout-session  # Stripe checkout endpoint
│   │
│   └── scripts/                 # Utility scripts
│       └── uploadProducts.js    # Upload products to database
│
├── 🗄️ DATABASE
│   └── supabase/
│       └── schemas/
│           └── 01_initial_schema.sql  # Database schema
│
├── ⚙️ CONFIGURATION
│   ├── .env                     # Environment variables (SECRETS!)
│   ├── package.json             # Dependencies & scripts
│   └── .gitignore               # Files to ignore in git
│
└── 📚 DOCUMENTATION
    ├── README.md
    ├── SETUP_GUIDE.md
    └── COMPLETE_CODE_GUIDE.md (this file)
```

---

## 🔑 Key Files Explained

### Frontend (React)
- **src/App.jsx** - Main application, routing, layout
- **src/components/ShoppingCart.jsx** - Shopping cart with checkout
- **src/pages/Admin.jsx** - Product management interface
- **src/lib/stripe.js** - Stripe payment integration
- **src/lib/supabase.js** - Database connection

### Backend (Express)
- **server.js** - API server for Stripe checkout

### Configuration
- **.env** - Your API keys (Supabase, Stripe)
- **package.json** - App dependencies and scripts

---

## 📦 All Your Code in One Place

Your complete codebase is in the `flower-shop` folder on your Desktop.

To see all code files:
```bash
cd ~/Desktop/flower-shop
open .
```

To view any file:
```bash
# Frontend component
code src/components/ShoppingCart.jsx

# Backend server
code server.js

# Admin panel
code src/pages/Admin.jsx
```

---

## 💾 How to Backup Your Code

### Option 1: Zip the entire project
```bash
cd ~/Desktop
zip -r digital-bloom-backup.zip flower-shop -x "*/node_modules/*"
```

### Option 2: Use Git (Recommended)
```bash
cd ~/Desktop/flower-shop
git init
git add .
git commit -m "Initial commit - Digital Bloom"
```

Then push to GitHub (see deployment section below)

---

## 🚀 DEPLOY TO PRODUCTION

Here are your best options:

---

## **Option 1: Vercel (EASIEST - Recommended)**

### ✅ Free tier available
### ✅ Automatic deployments
### ✅ Built-in SSL

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Prepare your project**
```bash
cd ~/Desktop/flower-shop
```

3. **Deploy**
```bash
vercel
```

Follow the prompts:
- Link to Vercel account (create free account at vercel.com)
- Choose project name: `digital-bloom`
- Deploy!

4. **Add Environment Variables**
- Go to vercel.com → Your Project → Settings → Environment Variables
- Add:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`

5. **Redeploy**
```bash
vercel --prod
```

**Your site will be live at:** `https://digital-bloom.vercel.app`

---

## **Option 2: Netlify**

### ✅ Free tier available
### ✅ Drag-and-drop deployment
### ✅ Great for frontend

**Steps:**

1. **Build your app**
```bash
cd ~/Desktop/flower-shop
npm run build
```

2. **Go to Netlify**
- Visit: https://app.netlify.com
- Sign up (free)
- Drag the `dist` folder to deploy

3. **Add Environment Variables**
- Site Settings → Build & Deploy → Environment
- Add all your env variables

4. **Deploy Backend Separately**
- Backend needs to be on a service like:
  - Railway.app (free tier)
  - Render.com (free tier)
  - Heroku (paid)

---

## **Option 3: Full GitHub + Vercel (BEST FOR LONG TERM)**

### Step 1: Push to GitHub

```bash
cd ~/Desktop/flower-shop

# Initialize git
git init

# Create .gitignore (already exists)
# Make sure .env is in .gitignore

# Add files
git add .

# Commit
git commit -m "Initial commit - Digital Bloom flower shop"

# Create repo on GitHub
# Go to github.com → New Repository → "digital-bloom"

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/digital-bloom.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to vercel.com
2. Click "Import Project"
3. Import from GitHub → Select `digital-bloom`
4. Add environment variables
5. Deploy!

**Benefits:**
- Every git push auto-deploys
- Version control
- Easy rollbacks
- Professional workflow

---

## **Option 4: Railway (Backend + Frontend Together)**

### ✅ $5/month free credit
### ✅ Deploy everything together

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd ~/Desktop/flower-shop
railway init
railway up
```

Add environment variables in Railway dashboard.

---

## 🌐 Custom Domain

After deploying, you can add your own domain:

**Vercel:**
- Settings → Domains → Add `yourdomain.com`

**Netlify:**
- Domain Settings → Add custom domain

**Purchase domain at:**
- Namecheap.com
- GoDaddy.com
- Google Domains

---

## 📝 Important Before Production

### 1. Update Stripe URLs in .env
```env
VITE_STRIPE_SUCCESS_URL=https://yourdomain.com/success
VITE_STRIPE_CANCEL_URL=https://yourdomain.com
```

### 2. Switch Stripe to Live Mode
- Go to Stripe Dashboard
- Switch from Test Mode to Live Mode
- Get new API keys
- Update in production environment variables

### 3. Configure CORS for Production
Update `server.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

### 4. Update API URL for Production
Update `src/lib/stripe.js`:
```javascript
const response = await fetch('https://your-api.vercel.app/api/create-checkout-session', {
```

---

## 🔐 Security Checklist

✅ Never commit `.env` file to git
✅ Use environment variables for all secrets
✅ Enable Supabase Row Level Security (RLS) - Already done!
✅ Use Stripe webhook signing for production
✅ Enable HTTPS (automatic with Vercel/Netlify)
✅ Set proper CORS origins

---

## 📊 Your Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Hosting:** Vercel/Netlify (recommended)

---

## 🆘 Need Help?

- **Frontend issues:** Check `src/components/`
- **Backend issues:** Check `server.js`
- **Database issues:** Check `src/lib/supabase.js`
- **Checkout issues:** Check `src/lib/stripe.js`

All your code is readable, editable, and yours to keep forever!

---

## 🎉 You're Ready!

Your Digital Bloom flower shop is:
- ✅ Fully functional locally
- ✅ Ready to deploy
- ✅ Production-ready code
- ✅ Easy to maintain and update

**Choose your deployment method and go live!** 🚀
