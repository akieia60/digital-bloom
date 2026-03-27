# CLEANUP_SUMMARY.md — Repo Slimming Results

> Branch: `cleanup/repo-slimming-pass`
> Date: March 13, 2026

---

## Files Deleted (10)

| File | Reason |
|------|--------|
| `server.js` | Fully superseded by Vercel serverless functions in `api/` |
| `src/App.css` | Not imported anywhere |
| `CODE_LOCATIONS.md` | Self-referential only; replaced by HANDOFF.md |
| `COMPLETE_CODE_GUIDE.md` | Stale; referenced only by DEPLOY.md (also archived) |
| `project-structure.json` | Generated manifest, stale |
| `file-manifest.json` | Generated manifest, unused |
| `start_app.sh` | Legacy startup script for Express server |
| `db_wipe_final.js` | One-time cleanup script |
| `db_wipe_root.js` | One-time cleanup script |
| `sync-products.js` | One-time sync script |

## Files Moved to `archive/` (30)

### `archive/docs/` (20 files)
All stale setup guides, fix documentation, and historical changelogs:
CREDITS_ENV_SETUP.md, CREDITS_TESTING_GUIDE.md, DEPLOY.md, DIGITAL-ART-INTEGRATION-GUIDE.md, DIGITAL-BLOOM-PROMPT-LIBRARY.md, HOW-TO-ADD-VIDEOS.txt, LANDING_PAGE_BUILD_SUMMARY.md, MISSING_VIDEOS.md, PRE-LAUNCH-CHECKLIST.md, QUICK-ADD-GUIDE.txt, QUICK-ADD-PRODUCTS.md, README-SETUP-COMPLETE.txt, SETUP_DATABASE.md, SETUP_GUIDE.md, SIMPLE-SETUP-GUIDE.md, VERCEL_SETUP_GUIDE.md, WEBHOOK_FIX_DOCUMENTATION.md, WHAT-I-CHANGED.md, WHERE-TO-CREATE-VIDEOS.md, YOUR-VIDEO-CREATION-GUIDE.md

### `archive/legacy-html/` (5 files)
EXAMPLE-NEW-VIDEO-CARD.html, digital bloom | akieia60's Org | Supabase.html, digital-flower-shop.html, digital-flower-shop-2.html, digital-flower-shop_1.html

### `archive/demo-data/` (6 files)
FIX_DATABASE.sql, supabase_rls_migration.sql, digital_bloom_products_MINIMAL.csv, digital_bloom_products_RECOMMENDED.csv, digital_bloom_products_WITH_ID.csv, flowers.js

## Files Kept

| File | Reason |
|------|--------|
| `README.md` | **Rewritten** — now reflects current architecture |
| `HANDOFF.md` | Comprehensive project documentation |
| `Gemini.md` | Notes file |
| `.env.example` | Environment template |
| `CLEANUP_AUDIT.md` | Audit report (this cleanup) |
| `package.json` | Updated (removed `"backend"` script) |
| `vercel.json` | SPA rewrite config |
| `vite.config.js` | Build config |
| `tailwind.config.js` | Tailwind config |
| `eslint.config.js` | Linting config |
| `index.html` | Entry HTML |
| All `src/`, `api/`, `public/`, `supabase/` | Core application |

## Code Paths Fixed

### 1. Credit Ledger Schema Normalized
**Files:** `api/stripe/webhook.js`, `api/create-checkout-session.js`

All 3 ledger writes were using non-existent columns (`type`, `amount_cents`, `description`). Normalized to match the migration-defined schema:
```diff
- { type: 'purchase', amount_cents: N, description: '...' }
+ { delta_cents: N, reason: 'purchase' }

- { type: 'redemption', amount_cents: -N, description: '...', stripe_session_id }
+ { delta_cents: -N, reason: 'redemption', related_order_id: sessionId }
```

### 2. FounderDashboard Test Payloads Aligned
**File:** `src/pages/FounderDashboard.jsx`

| Test | Before (broken) | After (correct) |
|------|-----------------|------------------|
| `create-credit-checkout` | `{ amount: 1000 }` | `{ amount_cents: 1000, purchaser_email: '...' }` |
| `credits/reserve` | `{ code, amount_cents: 100 }` | `{ code, order_total_cents: 100 }` |

### 3. Supabase Server-Side Security Tightened
**File:** `api/create-checkout-session.js`
```diff
- process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
+ process.env.SUPABASE_SERVICE_ROLE_KEY
```

**File:** `api/stripe/webhook.js`
```diff
- process.env.VITE_SUPABASE_URL
+ process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
```

### 4. localhost:3001 References Removed
**Files:** `src/lib/creditStripe.js`, `src/lib/stripe.js`
```diff
- const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
+ const API_BASE = import.meta.env.VITE_API_URL || '';
```

### 5. flowers.js Dependency Removed
**File:** `src/components/FilterPanel.jsx`
- Now derives `categories` and `occasions` from `src/data/occasions.js` (the authoritative source)

**File:** `src/hooks/useProducts.js`
- Removed `flowers` import and fallback — uses graceful empty state when Supabase is unreachable

### 6. package.json Cleaned
- Removed `"backend": "node server.js"` script

---

## Remaining Risks

| Risk | Severity | Notes |
|------|----------|-------|
| **Existing ledger rows may use wrong columns** | Medium | If any credits were purchased before this fix, their ledger rows may have `type`/`amount_cents`/`description` instead of `delta_cents`/`reason`. These rows would silently fail the `reason` CHECK constraint. Run a manual check: `SELECT * FROM experience_credit_ledger WHERE reason IS NULL;` |
| **`SUPABASE_URL` vs `VITE_SUPABASE_URL` on Vercel** | Low | Vercel env may only have `VITE_SUPABASE_URL` set. The `|| process.env.VITE_SUPABASE_URL` fallback is kept for safety. Consider adding `SUPABASE_URL` as a separate env var in Vercel. |
| **40 scripts in `scripts/`** | Low | Most are one-time setup scripts. Not blocking, but could be pruned in a future pass. |
| **`vite build` not verified** | Medium | Local npm has cache permissions issues (`EPERM`). Build should work on Vercel (which has clean `node_modules`). Verified via static import analysis — all imports resolve correctly. |
| **Credit checkout still uses `payment_method_types: ['card']`** | Low | `api/create-credit-checkout.js` still explicitly sets card-only. The main checkout uses `automatic_payment_methods`. Consider aligning. |

---

## Commits on Branch

```
1. chore: archive stale documentation and remove unused files
   43 files changed, 194 insertions, 2163 deletions

2. fix: normalize credit ledger schema and align API contracts
   5 files changed, 14 insertions, 16 deletions

3. refactor: remove flowers.js dependency and rewrite README
   3 files changed, 139 insertions, 62 deletions

4. docs: add cleanup audit and summary reports
   (this commit)
```
