# Digital Bloom — Complete Project Handoff

> **Last updated:** March 13, 2026
> **Repo:** [github.com/akieia60/digital-bloom](https://github.com/akieia60/digital-bloom)
> **Live site:** Deployed on Vercel (auto-deploys from `main` branch)

---

## 1. What Is Digital Bloom?

Digital Bloom is a **luxury digital gifting platform** where users can browse, customize, and send digital flower experiences (video-based "blooms") for occasions like birthdays, Mother's Day, Valentine's Day, etc. Think of it as a digital flower shop — instead of physical flowers, customers send beautifully animated video bouquets.

### Business Model
- **Direct purchase:** Browse categories → customize a bloom → pay via Stripe → recipient receives the digital experience
- **Experience Credits:** A gift-card-style system — buy credits first, redeem them later for any bloom
- **Pricing tiers:** 4 tiers — $1.99 (Single Bloom), $4.99 (Bloom Experience), $9.99 (Premium Bloom), $19.99 (Signature Collection)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | React 19, Vite 7 | SPA with client-side routing |
| **Styling** | Vanilla CSS + Tailwind CSS 4 | Landing page uses vanilla CSS; some inner pages still use Tailwind |
| **Routing** | React Router DOM 7 | See routes in `src/App.jsx` |
| **Backend/API** | Vercel Serverless Functions | In the `api/` directory |
| **Database** | Supabase (PostgreSQL) | Products, purchases, credits |
| **Payments** | Stripe Checkout | Cards, Apple Pay, Google Pay, Cash App, Link/Venmo, Affirm, Klarna |
| **Hosting** | Vercel | Auto-deploys on push to `main` |
| **Version Control** | Git / GitHub Desktop | Repo: `akieia60/digital-bloom` |

### Key Dependencies (`package.json`)
```
react: ^19.2.0
react-router-dom: ^7.13.0
@stripe/stripe-js: ^8.6.4
@supabase/supabase-js: ^2.91.1
stripe: ^20.2.0 (server-side)
vite: ^7.2.4
```

---

## 3. Environment Variables

All secrets are stored in Vercel's environment settings. A local `.env.local` exists for development. Reference `.env.example` for the full list:

| Variable | Where Used | Purpose |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | Frontend | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase public/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | API only | Supabase admin key (server-side) |
| `STRIPE_SECRET_KEY` | API only | Stripe secret (server-side) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | API only | Stripe webhook verification |
| `VITE_STRIPE_PRODUCT_TIER1..4` | Both | Stripe product IDs per tier |
| `VITE_STRIPE_PRICE_TIER1..4` | Both | Stripe price IDs per tier |
| `APP_BASE_URL` | API | For success/cancel redirect URLs |

> **IMPORTANT:** The site is currently running in **Stripe sandbox/test mode**. Live keys are NOT active yet. When ready to go live, swap all `sk_test_` / `pk_test_` keys for `sk_live_` / `pk_live_` keys in Vercel's environment settings.

---

## 4. Project Structure

```
digital-bloom/
├── api/                          # Vercel Serverless Functions
│   ├── create-checkout-session.js  # Main Stripe checkout (automatic_payment_methods)
│   ├── create-credit-checkout.js   # Experience Credits purchase
│   ├── credits/                    # Credit validation/redemption endpoints
│   ├── stripe/                     # Stripe webhook handler
│   ├── grok/                       # Grok AI integration
│   └── setup/                      # One-time setup scripts
│
├── public/
│   └── videos/                     # Hero and product videos
│       ├── digital_bloom_hero_morph.mp4  # ← Active hero video (3.1MB)
│       ├── hero_bloom_poster.jpg         # Hero poster/fallback image
│       └── shop/                         # Product video assets
│
├── src/
│   ├── App.jsx                     # Root component + all routes
│   ├── main.jsx                    # Entry point
│   ├── index.css                   # Global styles
│   │
│   ├── components/
│   │   ├── landing/                # Landing page sections
│   │   │   ├── VideoHero.jsx         # Hero with video bg + holiday banner
│   │   │   ├── LandingNav.jsx        # Fixed nav (hamburger on mobile)
│   │   │   ├── CategoryGrid.jsx      # "Browse by Occasion" cards
│   │   │   ├── TwoWaysToBloom.jsx    # "Send a Bloom" vs "Experience Credits" [NEW]
│   │   │   ├── FAQ.jsx               # Accordion FAQ
│   │   │   ├── LandingFooter.jsx     # Footer
│   │   │   ├── SignatureBloom.jsx    # (currently unused in LandingPage)
│   │   │   └── ...                   # Other unused sections
│   │   │
│   │   ├── Header.jsx              # Sticky header (all pages except landing)
│   │   ├── ShoppingCart.jsx         # Cart drawer (slide-in from right)
│   │   ├── CartItem.jsx            # Individual cart item
│   │   ├── Customizer.jsx          # Bloom customization form
│   │   ├── CustomizationPreview.jsx # Live preview of customization
│   │   ├── ProductCard.jsx         # Product thumbnail card
│   │   ├── ProductGrid.jsx         # Grid of product cards
│   │   ├── ProductDetails.jsx      # Full product detail page
│   │   ├── FilterPanel.jsx         # Shop page filters
│   │   ├── PricingTiers.jsx        # Pricing tier display
│   │   └── tracker/                # Toast notification system
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx         # Homepage (VideoHero + CategoryGrid + TwoWaysToBloom + FAQ)
│   │   ├── Shop.jsx                # Main shop page with category tabs
│   │   ├── CategoryPage.jsx        # Individual category (e.g. /shop/birthday)
│   │   ├── Success.jsx             # Post-checkout confirmation [REDESIGNED]
│   │   ├── ExperienceCredits.jsx   # Buy credits page
│   │   ├── CreditBalance.jsx       # Check credit balance
│   │   ├── Admin.jsx               # Admin panel
│   │   ├── FounderDashboard.jsx    # Founder analytics
│   │   ├── PromptVault.jsx         # AI prompt library
│   │   └── ComingSoon.jsx          # Placeholder for unbuilt routes
│   │
│   ├── lib/
│   │   ├── supabase.js             # Supabase client + product/purchase queries
│   │   ├── stripe.js               # Stripe client + checkout session creation
│   │   ├── credits.js              # Credit validation/balance logic
│   │   └── creditStripe.js         # Credit-specific Stripe integration
│   │
│   ├── context/
│   │   └── CartContext.jsx          # React Context for shopping cart state
│   │
│   ├── data/
│   │   ├── occasions.js            # Category metadata (title, tagline, accent color, emoji)
│   │   ├── flowers.js              # Static product data
│   │   └── ...                     # Prompt vault data files
│   │
│   └── styles/
│       ├── video-hero.css          # Hero section styles + cinematic intro
│       ├── landing-nav.css         # Fixed navigation
│       ├── landing.css             # Landing page sections + Two Ways to Bloom
│       ├── customizer.css          # Customizer layout (mobile-first)
│       ├── credits.css             # Experience Credits page
│       └── signature-bloom.css     # Signature bloom section
│
├── vercel.json                     # SPA rewrite rule
├── vite.config.js                  # Vite config
├── tailwind.config.js              # Tailwind config
├── package.json                    # Dependencies
└── .env.example                    # Template for environment variables
```

---

## 5. Routes

Defined in `src/App.jsx`:

| Route | Component | Description |
|-------|----------|-------------|
| `/` | `LandingPage` | Homepage with hero video, categories, Two Ways, FAQ |
| `/shop` | `Shop` | Main shop with all blooms, category tabs, and filters |
| `/shop/:categorySlug` | `CategoryPage` | Blooms filtered by occasion (e.g. `/shop/birthday`) |
| `/product/:id` | `ProductDetails` | Individual bloom detail with customizer |
| `/credits` | `ExperienceCredits` | Purchase experience credits |
| `/credits/balance` | `CreditBalance` | Check credit balance |
| `/success` | `Success` | Post-checkout confirmation page |
| `/admin` | `Admin` | Admin panel (product management) |
| `/admin/prompts` | `PromptBrowser` | Browse AI prompts |
| `/experience/1` | `Experience1` | Experience viewer |
| `/founder` | `FounderDashboard` | Founder analytics dashboard |
| `/vault` | `PromptVault` | AI prompt library |
| `/about`, `/contact` | `ComingSoon` | Placeholder pages |

**Note:** The `Header` and `ShoppingCart` components render on ALL pages **except** the landing page (`/`), which has its own `LandingNav`.

---

## 6. Key Features & How They Work

### 6.1 Landing Page Flow
```
LandingNav (fixed, hamburger on mobile)
  → VideoHero (full-screen video + holiday banner + "Choose Your Occasion" CTA)
    → CategoryGrid ("Browse by Occasion" — cards for each holiday)
      → TwoWaysToBloom ("Send a Bloom" vs "Experience Credits")
        → FAQ (accordion)
          → LandingFooter
```

### 6.2 Holiday Banner (auto-detects holidays)
`VideoHero.jsx` contains `getUpcomingHoliday()` which automatically shows the nearest holiday within 45 days. If no holiday is near, it defaults to "Give Them Their Flowers."

**Currently configured holidays:** New Year's, Valentine's Day, St. Patrick's Day, Mother's Day, Father's Day, 4th of July, Halloween, Thanksgiving, Christmas, New Year's Eve.

### 6.3 Hero Video
- File: `public/videos/digital_bloom_hero_morph.mp4` (3.1MB)
- Content: Box opens → roses emerge → color morphing sequence (red→orange→purple→green→pink)
- Plays on loop, muted, with cinematic intro animation (curtain lift → title fade-in → tagline → CTA)
- Poster fallback image: `public/videos/hero_bloom_poster.jpg`

### 6.4 Shopping & Checkout Flow
```
Browse occasions → Pick a bloom → Customize (message, color, recipient, delivery method)
  → Add to cart → Cart drawer opens → Apply credit code (optional)
    → "Check Out & Publish" button → Stripe Checkout
      → Payment (Cards, Apple Pay, Cash App, Venmo, Klarna, etc.)
        → Success page with order details + download link
```

### 6.5 Customizer (`Customizer.jsx`)
The customizer lets users personalize their bloom. Current fields:
- **Custom Message** — personal text to the recipient
- **Color Theme** — select the bloom's color palette
- **To / From** — recipient and sender names
- **Delivery Method** — email or text message
  - Text: asks for phone number (with `type="tel"`) + reassurance note
- **Delivery Timing** — now or scheduled
- **Gift Toggle** — mark as gift

**Removed fields** (were non-functional):
- ~~Occasion selector~~ (redundant — category page handles this)
- ~~Balloon Message~~ (never displayed)
- ~~Slogan Type / Custom Slogan~~ (never displayed)
- ~~Symbol selector~~ (not functional)

### 6.6 Payment Methods
`api/create-checkout-session.js` uses `automatic_payment_methods: { enabled: true }` which lets Stripe dynamically show **all enabled payment methods** from the dashboard.

**Currently enabled in Stripe sandbox (10 methods):**
- Cards, Apple Pay, Cash App Pay, Link (includes Venmo for US), Amazon Pay
- Affirm, Klarna, Bancontact, EPS, Cartes Bancaires

**Not yet enabled:** Google Pay (needs to be toggled on in Stripe dashboard)

### 6.7 Experience Credits
- Users can purchase credits on `/credits`
- Credits are redeemed in the cart drawer using a code format: `DBLOOM-XXXX-XXXX`
- If credits cover the full amount, Stripe is skipped entirely (free checkout)
- Credit balance can be checked at `/credits/balance`

### 6.8 Success Page (`Success.jsx`)
Clean single-column mobile-first layout with:
- Gold checkmark + confirmation header
- Order summary card (ID, total, status)
- Download section (48-hour expiry on download links) or status updates for pending orders
- Social sharing buttons (Facebook, X, Instagram, TikTok, Copy Link)
- Return home + Save Receipt actions

### 6.9 Mobile UX
- **Hero:** `padding-top: calc(80px + env(safe-area-inset-top))` prevents nav/hero overlap on mobile
- **Customizer:** Preview shows **first** on mobile (via `order: -1`), not buried below form fields
- **Cart drawer:** Full-screen on mobile, sidebar on desktop
- **Landing nav:** Hamburger menu on mobile with slide-in drawer

---

## 7. Supabase Database

The database stores products, purchases, and credits. Key tables:

| Table | Purpose |
|-------|---------|
| `products` | All bloom products with name, description, price, video URL, category, tier |
| `purchases` | Order records with Stripe session ID, status, total, download URL/expiry |
| `credits` | Experience credit codes with balance, redemption status |
| `credit_reservations` | Temporary holds when credits are applied at checkout |

Connection is configured in `src/lib/supabase.js` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 8. Stripe Configuration

| Setting | Value |
|---------|-------|
| **Account name** | Quiet Dynasty Empire |
| **Mode** | Sandbox (test) |
| **Dashboard** | [dashboard.stripe.com](https://dashboard.stripe.com) |
| **Payment methods** | `automatic_payment_methods` (shows all enabled methods) |
| **Webhook** | Configured for checkout.session.completed events |

### Pricing Tiers
| Tier | Name | Price | Env Var |
|------|------|-------|---------|
| 1 | Single Bloom | $1.99 | `VITE_STRIPE_PRICE_TIER1` |
| 2 | Bloom Experience | $4.99 | `VITE_STRIPE_PRICE_TIER2` |
| 3 | Premium Bloom | $9.99 | `VITE_STRIPE_PRICE_TIER3` |
| 4 | Signature Collection | $19.99 | `VITE_STRIPE_PRICE_TIER4` |

### Going Live Checklist
1. Enable all payment methods on the **live** Stripe account (same ones as sandbox)
2. Enable Google Pay in both sandbox and live
3. Replace all `sk_test_` / `pk_test_` keys with `sk_live_` / `pk_live_` keys in Vercel env settings
4. Update the webhook endpoint to point to the live account
5. Verify the webhook secret is updated

---

## 9. Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| *Pure Gold* | `#D4AF37` | Accents, CTAs, logo |
| *Obsidian* | `#0A0A0A` | Dark backgrounds |
| *Apple Dark* | `#1D1D1F` | Text (landing page) |
| *Apple Gray* | `#6E6E73` | Secondary text |
| *Apple Light* | `#F5F5F7` | Card backgrounds |
| *Border* | `#D2D2D7` | Subtle borders |

### Typography
- **Display:** Playfair Display (serif) — headings, section titles
- **Body:** Outfit (sans-serif) — paragraphs, labels, buttons
- **Accent:** Cormorant Garamond (serif) — occasionally used

### Theme
The landing page uses a **clean white Apple-style** theme. Inner pages (shop, customizer, cart, success) use a **dark luxury** theme with obsidian backgrounds, gold accents, and glassmorphism effects.

---

## 10. Current Status — What's Done & What's Left

### ✅ Completed
| Item | Details | Files Changed |
|------|---------|---------------|
| Hero/nav overlap fix | Added mobile padding to clear fixed nav | `video-hero.css` |
| Customizer streamlining | Removed 4 non-functional fields (Occasion, Balloon, Slogan, Symbol) | `Customizer.jsx`, `customizer.css` |
| Mobile preview reorder | Preview shows FIRST on mobile via `order: -1` | `customizer.css` |
| Text delivery UX | Phone input with `type="tel"` + reassurance note, no login gate | `Customizer.jsx` |
| Checkout button text | "Publish Experience" → "Check Out & Publish" | `ShoppingCart.jsx` |
| All payment methods | `payment_method_types: ['card']` → `automatic_payment_methods` | `create-checkout-session.js` |
| Success page redesign | Single-column mobile-first layout, friendly labels | `Success.jsx` |
| Experience Credits visibility | New "Two Ways to Bloom" section on landing page | `TwoWaysToBloom.jsx`, `LandingPage.jsx`, `landing.css` |
| Hero video | Crossfade-edited hero with box opening + color morph | `public/videos/digital_bloom_hero_morph.mp4` |

### 🚧 In Progress / On Hold
| Item | Status | Blocker |
|------|--------|---------|
| Category video previews | ON HOLD | Need 3–5 second preview video clips for each occasion category |
| Google Pay | Not enabled | Need to toggle on in Stripe dashboard (both sandbox + live) |
| Live Stripe mode | Not started | Site needs to be fully ready first; then swap keys in Vercel |

### 📋 Category Preview Video Requirements
For the "Browse by Occasion" section to have Netflix-style video previews:
- **Duration:** 3–5 seconds each, seamlessly looping
- **Format:** MP4 (H.264), muted, no audio
- **File size:** Under 2MB each
- **Resolution:** 720p max
- **Content:** A quick bloom highlight for each category (e.g., color morph, bouquet reveal)
- **Behavior:** Auto-play on hover (desktop) or on scroll-into-view (mobile)
- **Categories needing videos:** Match whatever categories exist in `src/data/occasions.js`

---

## 11. How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/akieia60/digital-bloom.git
cd digital-bloom

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in Supabase and Stripe keys

# 4. Start dev server
npm run dev
# Opens at http://localhost:5173

# 5. Build for production (optional)
npm run build
```

**Note:** Stripe checkout will NOT work locally (no `STRIPE_SECRET_KEY` in the serverless function context). Push to Vercel for full testing.

---

## 12. How to Deploy

1. **Commit changes** via GitHub Desktop or `git commit`
2. **Push to `main`** — Vercel auto-deploys within ~60 seconds
3. **No manual build step needed** — Vercel runs `npm run build` automatically

### Vercel Configuration
- **Framework:** Vite
- **Build command:** `vite build`
- **Output directory:** `dist`
- **Serverless functions:** Auto-detected from `api/` directory
- **SPA rewrite:** All routes → `/index.html` (configured in `vercel.json`)

---

## 13. Known Issues & Quirks

1. **npm permissions:** The local machine has had recurring `EPERM` issues with `node_modules`. Fix with `sudo chown -R $(whoami):staff /path/to/digital-bloom`
2. **Mixed styling:** Landing page uses vanilla CSS; some inner pages use Tailwind. A theme architecture audit was done (see conversation `5405a976`) to prepare for future theme-switching.
3. **Video storage:** Hero video is stored in `public/videos/` (served statically by Vite/Vercel). Product videos are stored in Supabase Storage.
4. **Safari HTTPS-Only:** Safari blocks `localhost` HTTP URLs by default. Use Chrome for local development, or disable HTTPS-Only in Safari settings.
5. **Unused components:** Several landing page components exist but aren't currently used: `SignatureBloom.jsx`, `AboutSection.jsx`, `ContactSection.jsx`, `DemoVideo.jsx`, `FeaturedGallery.jsx`, `HowItWorks.jsx`, `ValueProps.jsx`, `LandingHero.jsx`.

---

## 14. Key Contacts & Resources

| Resource | Link |
|----------|------|
| GitHub Repo | `github.com/akieia60/digital-bloom` |
| Vercel Dashboard | `vercel.com/akieias-projects` |
| Supabase Dashboard | `supabase.com/dashboard/project/yhdbeblowolfinxxhsnt` |
| Stripe Dashboard | `dashboard.stripe.com` (account: Quiet Dynasty Empire) |
| Google Flow | Used for creating hero/bloom video animations |
| Grok Imagine | Used for generating flower images |

---

## 15. For AI Assistants

If you're picking this up as an AI assistant:

1. **The repo is at** `/Users/akieiamoniquedavis/Documents/GitHub/digital-bloom`
2. **Always pull latest** before making changes: `git pull origin main`
3. **Don't modify** anything without the owner's approval
4. **Stripe is in sandbox mode** — test payments won't charge real money
5. **The landing page uses its own nav** (`LandingNav`) — the `Header` component only renders on inner pages
6. **CSS architecture is mixed** — landing/hero/customizer use vanilla CSS files in `src/styles/`; some components use Tailwind classes
7. **The owner uses GitHub Desktop** for commits/pushes, not the command line
8. **Video assets** — hero video is local (`public/videos/`), product videos are in Supabase Storage
9. **The `occasions.js` data file** defines all category metadata (name, tagline, emoji, accent color) — used by `CategoryGrid` and `CategoryPage`
