# CHECKOUT_FAILURE_REPORT.md

## Root Cause

**CORS rejection.** The API's CORS regex blocked the site's own Vercel deployment URL.

In `api/_lib/cors.js` line 29, the regex that validates Vercel preview URLs was:
```
/^https:\/\/[a-zA-Z0-9-]+(\.vercel\.app)$/
```

This **only matches single-segment subdomains** like `myapp.vercel.app`. But Vercel deployments (especially preview/branch deploys) use **multi-segment subdomains with dots**, like:
```
digital-bloom-git-cleanup-akieia60s-projects.vercel.app
```

The character class `[a-zA-Z0-9-]` does **NOT** include dots (`.`), so the regex fails, `applyCors()` returns 403 "Forbidden: origin not allowed", the client receives a non-200 response, `createCartCheckoutSession()` returns `null`, and the cart shows **"Failed to create checkout session"**.

## Full Flow Trace

```
1. User clicks "Check Out & Publish"
2. ShoppingCart.handleCheckout() → formats cart items
3. createCartCheckoutSession() in src/lib/stripe.js
4. POST /api/create-checkout-session
5. ❌ applyCors() in api/_lib/cors.js → regex fails → 403 Forbidden
6. Client catches non-ok response → throws error
7. Catch block returns null
8. ShoppingCart line 75: !result → throws "Failed to create checkout session"
9. Error displayed in red banner
```

## Fix Applied

### `api/_lib/cors.js` (line 29)

```diff
- if (/^https:\/\/[a-zA-Z0-9-]+(\.vercel\.app)$/.test(origin)) return true;
+ if (/^https:\/\/[a-zA-Z0-9._-]+(\.vercel\.app)$/.test(origin)) return true;
```

Added `.` (dot) and `_` (underscore) to the character class so all Vercel deployment URL formats are accepted.

## Files Touched

| File | Change |
|------|--------|
| `api/_lib/cors.js` | Fixed regex character class |

## Vercel Environment Variables

No new env vars are needed for this fix. However, if `APP_BASE_URL` is set in Vercel to the project's canonical URL (e.g. `https://digital-bloom.vercel.app`), checkout would also work through the ALLOWED_ORIGINS whitelist — but fixing the regex is the proper solution since it covers all preview deployments too.

Existing required env vars (unchanged):
- `STRIPE_SECRET_KEY` — must be set in Vercel
- `SUPABASE_URL` or `VITE_SUPABASE_URL` — must be set in Vercel  
- `SUPABASE_SERVICE_ROLE_KEY` — must be set in Vercel
