# Digital Bloom — Security & Bug Audit

**Date:** June 16, 2026
**Scope:** Whole repo, focused on the serverless API (`api/`), config, secrets, and dependencies.
**Type:** Report only — no code was changed.

---

## Plain-English summary

The site is in good shape on the things that are easiest to get badly wrong: your real secrets are **not** committed to the repo, the Stripe payment webhook is **properly verified**, and the scheduled (cron) jobs are **password-protected**. Good.

The biggest theme of the problems below is this: **most of your API endpoints rely only on "CORS" for protection, and CORS is not a lock on the door.** CORS only asks a *browser* to behave politely. Anyone using a simple tool like `curl` (a one-line command) ignores CORS completely. So several endpoints that touch **money, paid services, and storage** can currently be called by anyone on the internet.

Think of it like a shop where the front door has a sign saying "staff only" but no actual lock. Customers respect the sign; a determined person just walks in.

The three things I'd fix first:

1. **Checkout trusts the price the customer's browser sends** — someone could pay a price they choose. (Your $1 promo was hiding this, but the promo ended May 11, so it's live now.)
2. **Gift-credit codes can be looked up and drained by guessing** — no login, no rate limit.
3. **Several "worker" endpoints have no lock at all** — anyone can upload files to your storage or trigger expensive video-processing jobs.

None of these require deep hacking skill to exploit, which is why they're worth prioritizing. Details and suggested fixes below, ordered by severity.

---

## Critical / High severity

### 1. Checkout price comes from the customer, not your database
**Where:** `api/_lib/checkoutSession.js` (`buildLineItems`, line ~29 and `totalCents`, line ~83)

**What's happening:** The amount charged is calculated from `item.product.price` — a value that arrives **in the request from the shopper's browser**. The server never re-checks the real price from your products table.

**Why it matters:** A person can edit the request and set any price they want (e.g. pay $0.50 for a premium bloom). The same client-supplied total also feeds the gift-credit discount math, so it can throw off credits too. Right now a flat "$1 Mother's Day promo" masks this — but that promo ended **2026‑05‑11**, so prices are currently fully controlled by the buyer.

**Suggested fix:** On the server, look up each product's real price from Supabase using the product ID, and build the Stripe line items from *that*, ignoring any price the browser sends. The browser should only send product IDs and quantities.

---

### 2. Gift-credit codes can be enumerated and drained
**Where:** `api/credits/validate.js`, `api/credits/reserve.js`, `api/credits/balance.js` (all open, no auth, no rate limit)

**What's happening:** Anyone can POST a code and get back whether it's valid and **how much money is left on it**. There's nothing stopping someone from trying millions of codes automatically.

**Why it matters:** Gift credits are real money. With no rate limit, an attacker can guess codes, find live ones, see their balance, and spend them via the reserve flow.

**Suggested fix:** (a) Add rate limiting / lockout on these endpoints (e.g. per-IP attempts per minute). (b) Make credit codes long and random so they can't be guessed. (c) Don't return the exact remaining balance until a code is confirmed valid by the legitimate owner. (d) Consider requiring the code be tied to the purchaser's email.

---

### 3. Anyone can get an upload link to your storage
**Where:** `api/get-upload-url.js` (no authentication)

**What's happening:** A POST with a `slug` returns a signed URL that lets the caller upload a file straight into your `product-media` storage bucket.

**Why it matters:** A stranger can fill your storage with arbitrary files (cost + abuse), or stage files that later get picked up by your video pipeline.

**Suggested fix:** Require admin/founder auth on this endpoint (same `requireFounder` check you already use on `env-check.js`), and validate that uploads are video files within a size limit.

---

### 4. The heavy video-processing endpoint has no lock
**Where:** `api/process-bloom.js` (no authentication)

**What's happening:** This endpoint is public. It runs `ffmpeg` watermarking in a big 60-second / 3 GB function and writes products into your database using the all-powerful service-role key. It's meant to be called *internally* by the admin archive flow, but nothing stops the public from calling it directly.

**Why it matters:** Anyone can trigger your most expensive function repeatedly (a way to run up your Vercel bill) and potentially create/modify product rows.

**Suggested fix:** Require a shared internal secret (like your `CRON_SECRET` pattern) or founder auth. When `archive.js` calls it internally, have it pass that secret in a header.

---

### 5. Verify (and then delete) the one-time setup endpoint
**Where:** `api/setup/create-products.js`

**What's happening:** Its own comments say it should be protected by a `SETUP_SECRET` and **deleted after first use**. It creates Stripe products. I could not confirm from the first part of the file that the secret check is actually enforced.

**Why it matters:** If the secret check is missing or weak, a stranger could create Stripe products in your account. Either way, a one-time setup tool shouldn't stay live in production.

**Suggested fix:** Confirm the `SETUP_SECRET` check exists and works — then delete this file entirely. You've already run it; you don't need it deployed.

---

## Medium severity

### 6. Paid third-party endpoints have no auth or rate limit (bill-running risk)
**Where:** `api/refine-prompt.js` (Anthropic), `api/tts.js` (ElevenLabs), `api/grok/generate.js` (Grok)

**What's happening:** These are open to the public and each one calls a **paid** outside service on every request.

**Why it matters:** Someone can hammer them in a loop and run up real charges on your Anthropic / ElevenLabs / Grok accounts. (`refine-prompt` powers your prompt engine, so it does need to be callable — it just needs guardrails.)

**Suggested fix:** Add rate limiting (per IP and/or a lightweight token tied to your site), cap request size, and set spending limits in each provider's dashboard as a backstop.

---

### 7. Admin token is passed in the URL
**Where:** `api/admin/archive.js` (GET reads `req.query.token`), and the `archive.html?token=...` link pattern noted in `CLAUDE.md`

**What's happening:** The admin password (token) travels as part of the web address.

**Why it matters:** Anything in a URL tends to get saved in places you don't control: server logs, browser history, and the "Referer" header sent to other sites. That can leak your admin token.

**Suggested fix:** Send the token in an `Authorization: Bearer …` header instead of the URL (the POST path already reads it from the body, which is better). Even better long-term: use real founder login (`requireFounder`) for admin actions.

---

### 8. `send-bloom.js` is unauthenticated
**Where:** `api/send-bloom.js`

**What's happening:** A POST with a `bloom_slug` sends the delivery email and marks the bloom delivered — with no auth.

**Why it matters:** If slugs are guessable, someone could trigger premature deliveries or spam recipients, and prematurely flip blooms to "delivered."

**Suggested fix:** Tie the action to the buyer (e.g. a per-purchase secret token in the manage-page link) or require auth.

---

### 9. Out-of-date dependencies with known vulnerabilities
**Where:** `package.json` / `package-lock.json` — `npm audit` reports **7 issues (6 high, 1 moderate)**: `ws`, `minimatch`, `qs`, and `react-router`.

**Why it matters:** These are mostly "denial of service" type bugs (ways to crash or hang the app). Lower risk than the items above, but they're free to fix.

**Suggested fix:** Run `npm audit fix`, then test the site still builds and works. Review anything that needs `--force` before applying it.

---

### 10. No security headers on responses
**Where:** `vercel.json` (`headers` section sets caching only)

**What's happening:** The site doesn't send common protective headers like `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, or `Strict-Transport-Security`.

**Why it matters:** These headers are extra layers that reduce the damage from other bugs (e.g. they make it harder to embed your site in a scam frame, or to leak the admin token via Referer — see #7).

**Suggested fix:** Add a global headers block in `vercel.json`. Start with `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `Strict-Transport-Security`. Add a Content-Security-Policy carefully (test it — CSP can break pages if too strict).

---

## Important to verify (depends on your Supabase setup)

### 11. The public Supabase key is only safe if "RLS" is on for every table
**Where:** `public/prompt-engine.html` line ~1568 (the `SUPABASE_ANON_KEY` is hardcoded)

**What's happening:** That "anon" key is *designed* to be public — that part is fine and normal. **But** it only stays safe if every table has Row Level Security (RLS) turned on with proper policies. I noticed a setup note in `api/submit-idea.js` that creates a policy `FOR ALL USING (true)` — that is wide open if it applies to the public role.

**Why it matters:** If any table is readable/writable by the anon key, anyone with that key (it's in your public HTML) could read or change that data directly.

**Suggested fix:** In Supabase, confirm RLS is **enabled on every table**, and that anon policies only allow exactly what the public should do (usually: read active products, nothing else). I can help you go table-by-table if you connect me to Supabase.

---

## Lower severity / housekeeping

- **`scripts/db_wipe.js` and `db_wipe_v2.js`** are destructive scripts living in the repo. Consider moving them to `archive/` or adding a loud confirmation prompt so they can't be run by accident.
- **`.git.broken-2026-05-03/`** (old corrupted git backup) sits in your working folder. It's correctly git-ignored so it won't be pushed, but old git history can contain old secrets. Once you're sure you don't need it, delete it locally.
- **CORS allows requests with no `Origin` header** (`api/_lib/cors.js`, line 35) — this is intentional for server-to-server calls, but it's another reminder that CORS won't stop non-browser clients. The fix for that is real auth on each endpoint (items above), not CORS.

---

## What's already done well (keep it)

- **Secrets are not committed.** Only `.env.example` is tracked; `.gitignore` properly excludes all real `.env` files, keys, and certs.
- **Stripe webhook verifies the signature** (`api/stripe/webhook.js`) using `STRIPE_WEBHOOK_SECRET` before trusting any event — exactly right, and it has duplicate-processing protection.
- **Cron endpoints are protected** by `CRON_SECRET`.
- **`env-check.js` requires founder login and never returns secret values** — only whether each variable is present.
- **`go.js` redirect endpoint sanitizes its input** and hashes IP addresses before storing them — privacy-conscious and injection-safe.
- **Service-role key is only used server-side** (never shipped to the browser).

---

## Suggested order of work

1. **#1 Checkout price** — money leaving the door incorrectly. Fix first.
2. **#2 Credit code abuse** — money, easy to exploit.
3. **#3 / #4 Open upload + processing endpoints** — add auth.
4. **#5 Delete the setup endpoint.**
5. **#6 Rate-limit the paid AI/voice endpoints** + set provider spend caps.
6. **#11 Confirm Supabase RLS** on every table.
7. **#7 / #8 Admin token in URL + send-bloom auth.**
8. **#9 `npm audit fix` and #10 security headers** — quick wins, do alongside the above.

---

*If you'd like, I can do a follow-up pass with code-level fixes on a separate branch (not pushed to live) for your review, and/or connect to Supabase to verify the RLS policies in #11.*
