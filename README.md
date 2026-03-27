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

## Claude Project Handoff

Use this section as the fast-entry project brief for Claude or any other coding agent.

### What this project is
Digital Bloom is the **main customer-facing website/storefront** for a luxury digital gifting platform. Customers browse blooms, customize a bloom, pay, and receive a personalized digital experience. This repo is **not** the Prompt Engine / Command Center app.

### Critical separation
There are two separate Digital Bloom systems and they must not be mixed:
- **Website/storefront repo:** `digital-bloom` → customer product, checkout, delivery, payment, personalized bloom rendering
- **Prompt Engine / Command Center repo:** separate system for AK’s internal mobile workflow, voice/chat assistant, prompt library, subscriptions, and operator tools

If a request involves shopper UX, bloom customization, checkout, rendering, delivery files, Stripe, or the public site, it belongs in **this repo**.
If a request involves Monique chat, the command center, prompt library, subscriptions, or AK’s internal operator workflow, it likely belongs in the **other repo**.

### Current project state
Recent work completed or partially completed in this website repo:
- Added product-protection overlays to the bloom delivery/viewing experience
- Added a first-pass personalized render endpoint for delivered MP4 output
- Began refactoring the customizer into a multi-step, preview-first flow
- Build passes locally after the current customizer refactor

### Stakeholder feedback that currently matters most
Gamble’s current feedback is for the **main web app** and should be treated as priority product direction.

### Gamble handwritten sketches / visual references
The actual handwritten sketches are included in this repo here:
- `docs/gamble-sketches/01-selection-message-flow.jpg`
- `docs/gamble-sketches/02-selection-border-and-effects.jpg`
- `docs/gamble-sketches/03-watermark-and-name-protection.jpg`
- `docs/gamble-sketches/README.md`

These should be treated as source visual direction, not just loose inspiration.
They show the intended step-by-step customer flow, persistent preview behavior, frame/effect choices, final preview concept, and anti-copy watermark/name-overlay direction.

#### Product protection requirements
Personalized bloom experiences and delivered video output should visibly include:
- TM mark at bottom-left
- Digital Bloom watermark at bottom-right or top-right
- Recipient name embedded visibly in the personalized output to discourage duplication or screen-record reuse

Additional sketch-based notes from Gamble’s visuals:
- recipient names should fade in periodically, approximately every 10 seconds from the beginning of the video
- Digital Bloom watermarking should appear repeatedly through the video, not just once
- watermark direction includes both horizontal and diagonal treatment concepts
- intent is to make copied or screen-recorded output clearly branded and recipient-specific

#### Desired customer customization / checkout flow
The desired UX is a **persistent-preview, step-by-step flow**:
1. **Message step**
   - Customer enters To / From / short message
   - Bloom stays visible
   - Text updates live on the bloom preview
   - Sketch suggests the bloom preview should already show To / From placement and Digital Bloom TM branding area
2. **Frame step**
   - Bloom stays visible with existing message choices
   - Customer chooses border/frame color
   - Preview updates live
   - Gamble’s sketch explicitly shows border-style selection examples including:
     - Original
     - Warm Sunset
     - Cool Breeze
     - Elegant Gold
     - Romantic Rose
3. **Effect step**
   - Bloom stays visible with previous selections preserved
   - Customer chooses decorative effect
   - Preview updates live
   - Gamble’s sketch explicitly lists effect ideas including:
     - Balloons
     - Ribbon Wrap
     - Sparkle Effect
     - Gold Dust
   - There is also a handwritten note near Balloons indicating: "Take this out... We have balloons"
   - Another sketch note indicates the typed message may fade away when playback starts, suggesting message treatment may differ between preview and playback
4. **Final preview / music step**
   - Customer clearly sees all chosen options together before purchase
   - Sketches also indicate a final preview state and a music selection step/area
5. **Payment options**
   - New credit/debit card
   - Instant wallet options such as Apple Pay and other supported methods
   - Buy credits for current or future use

### What appears to be true in code right now
- A first structural pass of a multi-step customizer has already been started
- Current step structure includes Message, Frame, Effect, Sound, and Review
- Persistent top preview shell and step progress UI were added
- The implementation is **not finished** relative to the requested Gamble flow and likely still needs tightening in UX, state handling, and payment alignment

### Likely next best tasks
If picking up work in this repo, prioritize in roughly this order:
1. Audit the current customizer implementation in `src/components/Customizer.jsx`
2. Make the preview-first flow match Gamble’s requested step-by-step behavior exactly
3. Ensure To / From / message, frame, and decorative effects all update live and persist cleanly between steps
4. Make the review screen clearly summarize what the customer is buying
5. Verify checkout/payment paths support:
   - card payments
   - wallet payments via Stripe-supported methods
   - credits purchase / credits usage logic where appropriate
6. Verify the personalized render path actually burns in the required protection overlays on delivered output
7. Test the end-to-end purchase → render → delivery flow

### Constraints and guidance
- Preserve clean separation between storefront concerns and internal tooling concerns
- Do not move command-center or Monique assistant logic into this repo
- Keep implementation practical and shippable over abstract rewrites
- Prefer small, testable commits
- If changing checkout or render logic, be careful with env-dependent code paths and Vercel serverless assumptions

### Environment / deployment notes
- This repo auto-deploys from `main` on Vercel
- Stripe is configured through Vercel server-side env vars
- Some functionality is difficult to fully validate locally without deployment env vars
- End-to-end validation may require deployed testing, not just local build success

### Useful working summary for Claude
If you are Claude picking this up, assume:
- The repo already has active in-progress work
- The priority is customer-facing website UX and personalized delivery behavior
- The main objective is to finish and harden the preview-first customizer/checkout flow based on Gamble’s spec
- A secondary objective is verifying the product-protection overlays and delivered rendered output are truly working in production-like conditions

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
