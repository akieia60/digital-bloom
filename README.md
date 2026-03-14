# Digital Bloom

A luxury digital gifting platform where customers browse, customize, and send animated flower experiences for any occasion.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 |
| Styling | Vanilla CSS + Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Backend | Vercel Serverless Functions (`api/`) |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout (automatic payment methods) |
| Hosting | Vercel (auto-deploys from `main`) |

## Project Structure

```
├── api/                        # Vercel serverless endpoints
│   ├── create-checkout-session.js    # Stripe checkout (products)
│   ├── create-credit-checkout.js    # Stripe checkout (credits)
│   ├── credits/                     # validate, reserve, balance
│   ├── stripe/webhook.js           # Stripe webhook handler
│   └── _lib/cors.js                # CORS utility
│
├── src/
│   ├── App.jsx                 # Root + routes
│   ├── components/             # UI components
│   │   ├── landing/            # Landing page sections
│   │   └── tracker/            # Toast notifications
│   ├── pages/                  # Route pages
│   ├── lib/                    # Supabase, Stripe, Credits clients
│   ├── context/                # CartContext
│   ├── data/                   # occasions.js, prompt vault data
│   └── styles/                 # CSS files
│
├── public/videos/              # Hero video + product posters
├── supabase/migrations/        # Database schema
├── archive/                    # Archived docs, CSVs, legacy HTML
└── scripts/                    # One-time setup/seed scripts
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | LandingPage | Hero video, categories, Two Ways to Bloom, FAQ |
| `/shop` | Shop | All products with category tabs |
| `/shop/:slug` | CategoryPage | Occasion-filtered products |
| `/product/:id` | ProductDetails | Product detail + customizer |
| `/credits` | ExperienceCredits | Buy credits |
| `/credits/balance` | CreditBalance | Check balance |
| `/success` | Success | Post-checkout confirmation |
| `/admin` | Admin | Product management |
| `/founder` | FounderDashboard | Env checks, API tests, risk dashboard |
| `/vault` | PromptVault | AI prompt library |

## Required Environment Variables

### Server-side (Vercel env settings)
```
SUPABASE_URL                    # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY       # Supabase admin key
STRIPE_SECRET_KEY               # Stripe secret key
STRIPE_WEBHOOK_SECRET           # Stripe webhook verification
APP_BASE_URL                    # e.g. https://your-app.vercel.app
```

### Client-side (VITE_ prefix, accessible in browser)
```
VITE_SUPABASE_URL               # Supabase project URL
VITE_SUPABASE_ANON_KEY          # Supabase public key
VITE_STRIPE_PUBLISHABLE_KEY     # Stripe publishable key
VITE_STRIPE_PRICE_TIER1..4      # Stripe price IDs per tier
```

> **Note:** Stripe is currently in sandbox/test mode. See HANDOFF.md for the live transition checklist.

## Local Development

```bash
npm install
npm run dev          # http://localhost:5173
```

Stripe checkout won't work locally (no `STRIPE_SECRET_KEY`). Push to Vercel for full testing.

## Deployment

Push to `main` → Vercel auto-deploys. No manual steps needed.

## Key Files

- **HANDOFF.md** — Comprehensive project documentation for AI assistants or developers
- **CLEANUP_AUDIT.md** — Detailed audit of issues found during repo cleanup
- **CLEANUP_SUMMARY.md** — Summary of what was changed during cleanup

## Archived During Cleanup

The following were moved to `archive/` during the repo slimming pass:
- **archive/docs/** — 20 stale setup/configuration guides
- **archive/legacy-html/** — 5 old prototype HTML files
- **archive/demo-data/** — CSVs, SQL fixes, static flower data (`flowers.js`)

## Credit Ledger Schema

All writes to `experience_credit_ledger` use:
```sql
(credit_id, delta_cents, reason, related_order_id)
-- reason: 'purchase' | 'redemption' | 'void' | 'adjustment'
-- delta_cents: positive for purchase, negative for redemption
```
