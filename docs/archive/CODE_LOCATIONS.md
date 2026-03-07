# 📍 Where Every Piece of Code Lives

## 🎯 Quick Reference

Want to find or edit something? Here's exactly where everything is:

---

## 🛒 **Shopping Cart & Checkout**

**Cart Functionality:**
- `src/components/ShoppingCart.jsx` - The cart sidebar
- `src/context/CartContext.jsx` - Cart state management

**Checkout Process:**
- `src/lib/stripe.js` - Stripe integration
- `server.js` - Backend checkout API (line 15-48)

**Success Page:**
- `src/pages/Success.jsx` - Payment confirmation page

---

## 🌸 **Product Display**

**Product Grid:**
- `src/components/ProductGrid.jsx` - Main product listing
- `src/components/ProductCard.jsx` - Individual product cards
- `src/components/VideoPlayer.jsx` - Video player for products

**Product Details:**
- `src/components/ProductDetails.jsx` - Full product page

**Filters & Search:**
- `src/components/FilterPanel.jsx` - Category filters
- `src/components/Header.jsx` - Search bar (line 1-50)

---

## 🔧 **Admin Panel**

**Product Management:**
- `src/pages/Admin.jsx` - Complete admin interface
  - Add products (line 94-137)
  - Edit products (line 139-154)
  - Delete products (line 156-172)
  - View all products (line 398-472)

---

## 🗄️ **Database**

**Connection:**
- `src/lib/supabase.js` - Supabase client setup

**Schema:**
- `supabase/schemas/01_initial_schema.sql` - Full database structure

**Product Loading:**
- `src/hooks/useProducts.js` - Fetch products from database

**Upload Scripts:**
- `scripts/uploadProducts.js` - Add products to database

---

## 💳 **Stripe Integration**

**Frontend:**
- `src/lib/stripe.js` - Checkout session creation
  - Cart checkout (line 94-134)
  - Redirect to Stripe (line 140-158)

**Backend:**
- `server.js` - Create Stripe session API
  - Endpoint: `/api/create-checkout-session` (line 15-48)

---

## 🎨 **Styling & Design**

**Styles:**
- `src/index.css` - Global styles & animations
- `tailwind.config.js` - Tailwind configuration (colors, fonts)

**Layout:**
- `src/App.jsx` - Main layout & routing
- `src/components/Hero.jsx` - Homepage banner
- `src/components/Header.jsx` - Navigation bar

---

## ⚙️ **Configuration**

**Environment:**
- `.env` - API keys (NEVER share this file!)

**Dependencies:**
- `package.json` - All npm packages & scripts

**Build:**
- `vite.config.js` - Vite configuration
- `postcss.config.js` - PostCSS config
- `tailwind.config.js` - Tailwind config

---

## 📁 **Static Files**

**Images:**
- `public/images/` - Product images go here

**Videos:**
- `public/videos/` - Product videos go here

---

## 🚀 **Scripts You Can Run**

From `/Desktop/flower-shop` directory:

```bash
# Start development
npm run dev              # Frontend (http://localhost:5173)
npm run backend          # Backend API (http://localhost:3001)

# Build for production
npm run build            # Creates dist/ folder

# Upload products
npm run upload-products  # Add products to database

# Preview production build
npm run preview
```

---

## 📝 **To Edit Any File:**

### Using VS Code (if installed):
```bash
cd ~/Desktop/flower-shop
code .
```

### Using Finder:
1. Go to Desktop
2. Open `flower-shop` folder
3. Double-click any file

### Using Terminal:
```bash
cd ~/Desktop/flower-shop
nano src/components/ShoppingCart.jsx
```

---

## 🎯 **Common Tasks**

### **Change Store Name:**
- `src/components/Header.jsx` (line 20)
- `index.html` (line 7)

### **Change Colors:**
- `tailwind.config.js` (line 9-29)

### **Add More Products:**
- Use Admin Panel: http://localhost:5173/admin
- OR edit `scripts/uploadProducts.js`

### **Change Checkout Success Message:**
- `src/pages/Success.jsx` (line 90-93)

### **Add New Page:**
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx` (line 20-25)

---

## 📦 **Your Complete Codebase:**

**Location:** `/Users/akieiamoniquedavis/Desktop/flower-shop`

**Total Files:** ~40 code files
**Total Size:** ~2MB (excluding node_modules)

**All Your Code:**
- Frontend: 15 React components
- Backend: 1 Express server
- Database: 1 SQL schema
- Config: 5 configuration files
- Scripts: 6 utility scripts

---

## 🔍 **Need to Find Something?**

Search all files:
```bash
cd ~/Desktop/flower-shop
grep -r "search term" src/
```

Example searches:
```bash
# Find where checkout happens
grep -r "handleCheckout" src/

# Find Stripe code
grep -r "stripe" src/

# Find admin panel code
grep -r "Admin" src/
```

---

**Everything is organized, readable, and easy to modify!** 🎉
