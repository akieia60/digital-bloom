# CODEX BRIEF — Gamble Feedback Fixes (April 7, 2026)

**Branch to work on:** `fix/gamble-feedback-apr7`
**Base:** `main`
**Priority:** High — these are blocking the product feeling polished for real users.

Michael already handled:
- ✅ FROM line cramping fix — committed to this branch (compositionEngine.js, bottom-left-safe 22%→26%, bottom-left-tight 19%→23%)

---

## TASK 1 — Fix Stripe success_url (Wrong Domain)

**File:** `api/create-checkout-session.js`

After a successful Stripe payment, Safari is showing "can't open the page" because the success URL uses `digitalbloom.com` (two L's) — that domain doesn't exist.

**Fix:** Find every instance of `digitalbloom.com` in the success_url and cancel_url and replace with `digitabloom.com` (one L).

```js
// WRONG (two L's — domain doesn't exist):
success_url: 'https://digitalbloom.com/success...'
cancel_url: 'https://digitalbloom.com/shop'

// CORRECT:
success_url: 'https://digitabloom.com/success...'
cancel_url: 'https://digitabloom.com/shop'
```

Also check if `digitalbloom.store` is used as an alternate — both `digitabloom.com` and `digitalbloom.store` are valid live domains. Either is fine as long as it's NOT `digitalbloom.com` with two L's.

---

## TASK 2 — Fix "Bloom Not Found" 404 Bug

**Symptom:** When a user clicks the "View Bloom" link from the order confirmation / delivery page, they get a 404 or a blank "Bloom Not Found" screen.

**What to investigate:**
1. Where is the "View Bloom" link generated? (likely in the order success page or email confirmation)
2. What URL format does it produce? (e.g. `/bloom/[id]` or `/view/[slug]`)
3. Does a route exist in the React router for that path?
4. Does Vercel have a rewrite rule for that path? (check `vercel.json`)

**Expected behavior:** Clicking "View Bloom" should load a page that plays the purchased bloom video — no 404, no white screen.

**Fix:** Trace the URL generation, confirm the route exists in `App.jsx` (or wherever routing is defined), and add a Vercel rewrite if needed so deep links don't 404.

---

## TASK 3 — Fix Delivery Share Link Experience

**Symptom:** When AK shares a bloom with someone (the recipient), clicking the link drops them directly into the full shop instead of a dedicated gift experience.

**Expected behavior:** The share link should open a beautiful "A bloom is waiting for you" gift reveal page — not the shop. It should show:
- The occasion/category name (e.g. "Mother's Day", "Birthday")
- The bloom video
- A message like "Someone sent you a Digital Bloom gift"
- A CTA to redeem or view

**What to build:**
1. A `/gift/[token]` or `/bloom/[id]` route that renders a `GiftReveal` page
2. The page looks up the bloom by the ID/token from Supabase
3. Displays: occasion name, video player, sender message (if any), brand footer
4. The share URL should be generated on order success and stored in Supabase alongside the order

This is a full UX flow — coordinate with AK on the design if needed, but the core requirement is: recipient gets a gift experience, not a shop landing.

---

## TASK 4 — Cart Overhaul

**Symptom (from Gamble's feedback):** The cart is cluttered. Bloom Credits purchase option, navigation links, and FAQ content are showing up inside the cart. The checkout button is too prominent/large. Overall it feels like a page, not a cart.

**What to fix:**
1. **Products only in cart** — Remove Bloom Credits upsell, navigation links, FAQ, and any non-product content from the cart view
2. **Checkout button** — Make it a small, elegant pill/line button. Not a giant block button. Think luxury minimal.
3. **Checkout flow** — Clicking checkout should go to a dedicated checkout page (separate route), not expand inline in the cart

**Design direction:** Think luxury e-commerce — clean, focused, nothing extra. The cart should just be: item(s), price, checkout pill.

---

## TASK 5 — Push Branch and Open PR

After completing Tasks 1–4:

```bash
git push origin fix/gamble-feedback-apr7
```

Then open a PR: `fix/gamble-feedback-apr7` → `main`

PR title: `fix: Gamble feedback — Stripe URL, Bloom routing, delivery UX, cart cleanup`

Tag AK for review before merging.

---

## Context / Notes

- **Two Supabase projects** — website DB is `yhdbeblowolfinxxhsnt`, PWA DB is `ljzlkphwkgyavqmoremg`. All product/order data is in the website DB. Don't mix them.
- **Live domains:** `digitabloom.com` (primary) and `digitalbloom.store` (secondary). Neither is `digitalbloom.com` with two L's.
- **Auto-deploy:** pushing to `main` deploys to Vercel automatically. Test on the branch preview first.
- **Video specs:** MP4, H.264, muted, no audio
- **Brand aesthetic:** Dark background, gold (#D4AF37) accents, luxury/minimal — nothing generic
