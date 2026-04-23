# HANDOFF — Digital Bloom
**Last updated:** April 22, 2026
**Branch:** `main`
**Repo (Mac mini):** `~/Desktop/digitalbloom/🌐 web-store/`
**Repo (MacBook):** `~/Documents/GitHub/digital-bloom/`
**Live site:** digitabloom.com | Prompt engine: digitalbloom.store/prompt-engine.html

---

## ✅ EVERYTHING COMPLETED (April 2026 Session)

### 1. Watermark — Clean Version (no black outline)
**File:** `api/process-bloom.js`
- Replaced the old watermark PNG (had a black outline) with a new clean one
- New watermark: gold `#D4AF37` text, soft shadow only, no stroke, transparent background
- Generated via Python/Pillow, base64-encoded directly into the file

### 2. Bloom View Limit — 30 Max Opens
**File:** `api/session-status.js`
- Bloom links were opening unlimited times — Gamble caught this in testing
- Fixed: each bloom now tracks opens in the `download_count` column in Supabase
- After 30 opens, the link returns `status: 'expired'` and no download URL
- Configurable via `MAX_BLOOM_OPENS` env variable (defaults to 30)

### 3. Unreadable Card Text Fixed
**File:** `api/_lib/renderBloom.js`
- Cards on videos were too transparent — text was hard to read over busy footage
- Fixed: switched from semi-transparent color backgrounds to solid dark navy `rgba(6,14,26,0.72)`
- Text opacity boosted to 97%, text shadow strengthened
- Applies to recipient name box, message box, and sender box

### 4. Watermark Placement Redesign
**File:** `api/_lib/renderBloom.js`
- Removed the old bottom-left pill stamp (had a black outline)
- Added TOP LEFT clean badge: "Digital Bloom™" in italic gold, dark navy background
- Bottom-right text changed from `© Digital Bloom` to `Digital Bloom™` to match
- Both corners now match the same clean style

### 5. Acknowledgement Category Added
**File:** `src/data/categories.js`
- Added `acknowledgement` as a full category with slug, display name, tagline, emoji, accent color
- 20 prompts added to prompt engine covering: fist bump, sports blooms, gold dust explosion, basketball, football, etc.

### 6. Raw Idea Refiner + Gamble Submit Mode
**Files:** `public/prompt-engine.html`, `api/refine-prompt.js`, `api/submit-idea.js`, `api/get-ideas.js`
- Ak can paste a raw idea → AI turns it into a full 3-scene Digital Bloom prompt
- Gamble has a separate submit URL: `digitalbloom.store/prompt-engine.html?submit=1`
- Gamble submits ideas → they appear in Ak's engine as "Pending Ideas from Gamble"
- ⚠️ **ANTHROPIC_API_KEY still needs to be added to Vercel env vars** for the AI Refiner to work

### 7. Prompt Engine — Merge Conflict Resolved + Builder Made Collapsible
**File:** `public/prompt-engine.html`
- Git merge conflict resolved (two branches had different additions)
- Prompt Builder panel now starts collapsed — tap the chevron to expand it
- Prompts show immediately on load without the Builder blocking the view

### 8. Prompt Engine — Critical JS Syntax Error Fixed
**File:** `public/prompt-engine.html`
- Prompt `ack-18` ("Fist Bump — Gold Dust Explosion") had `You're` inside a single-quoted string
- The apostrophe in `You're` ended the string early → crashed the entire 80-prompt PROMPTS array
- Nothing loaded at all (blank page, stats showing dashes) because of this one character
- Fixed: escaped the apostrophe to `You\'re`
- **Committed and live** — engine is working again

---

## ⚠️ STILL NEEDS TO BE DONE

### Priority 1 — Add API Key to Vercel
The AI Refiner (✨ Refine with AI button) will fail until this is done:
1. Go to vercel.com → digital-bloom project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = Ak's Anthropic API key
3. Redeploy (or it auto-picks up on next push)

### Priority 2 — Supabase Prompt Sync Table
Ak deleted the `prompt_engine_custom_prompts` table from Supabase. The 80 hardcoded core prompts are unaffected (they live in the HTML file). But the Builder's cloud sync won't work until the table is recreated. Run this SQL in Supabase → SQL Editor:
```sql
create table if not exists prompt_engine_custom_prompts (
  id uuid primary key default gen_random_uuid(),
  workspace text not null default 'digital-bloom-shared',
  title text not null,
  cat text not null,
  badge text,
  workflow text,
  scenes jsonb not null default '[]',
  is_deleted boolean not null default false,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Priority 3 — Stripe Going Live
Still in sandbox/test mode. When ready:
1. Swap `STRIPE_SECRET_KEY` in Vercel env vars to live key (starts with `sk_live_`)
2. Swap `VITE_STRIPE_PUBLISHABLE_KEY` to the live publishable key
3. Enable Google Pay in Stripe dashboard

---

## TECH STACK
- **Frontend:** React 19 + Vite 7 (`src/` folder)
- **Backend:** Vercel Serverless Functions (`api/` folder)
- **Database:** Supabase (PostgreSQL) — website and PWA use SEPARATE databases
- **Payments:** Stripe (currently test/sandbox, not live yet)
- **Deploy:** Push to `main` → Vercel auto-deploys in ~60 seconds
- **Ak deploys via:** GitHub Desktop (NOT terminal)

## KEY FILES
| What | File |
|------|------|
| All category data (single source of truth) | `src/data/categories.js` |
| Prompt engine (Ak's daily tool) | `public/prompt-engine.html` |
| Video rendering + card overlays | `api/_lib/renderBloom.js` |
| Bloom view limit enforcement | `api/session-status.js` |
| Watermark PNG data | `api/process-bloom.js` |
| AI prompt refiner endpoint | `api/refine-prompt.js` |
| Gamble idea submit endpoint | `api/submit-idea.js` |
| Gamble idea fetch endpoint | `api/get-ideas.js` |

## DESIGN RULES (never break these)
- Navy `#0D1B36` for dark backgrounds — NEVER pure black
- Gold `#D4AF37` for accents, CTAs, watermarks
- Fonts: Playfair Display (headings), Outfit (body)
- Brand name always: **Digital Bloom™** (with ™)
- Never hardcode category lists outside `src/data/categories.js`
- Never break `/prompt-engine.html` — Ak uses it daily from her phone

## PEOPLE
- **Ak** (Akieia Davis) — owner, uploads videos from phone while on the road
- **Gamble** (704-605-2509) — business partner, UI/UX feedback on live site
- **David** — advisor, ideas around subscription model and Dearly Departed section

---

## 📱 FOR iPHONE — PASTE THIS INTO CLAUDE APP

> Copy everything from the line below and paste it as your first message to Claude on your iPhone.

---

Hi Claude — I'm Ak, owner of Digital Bloom (digitabloom.com), a luxury digital gifting platform where customers send animated video bouquets called "blooms" for occasions like birthdays, Mother's Day, Valentine's Day, etc. Customers customize a bloom, pay via Stripe, and the recipient gets a digital experience.

**Tech:** React 19 + Vite frontend, Vercel serverless functions in `api/`, Supabase (PostgreSQL) database, Stripe payments (currently test mode, not live yet). Hosted on Vercel, auto-deploys from `main` branch on GitHub.

**What we recently built and fixed:**
- Bloom links now expire after 30 views (tracked via `download_count` in Supabase `purchases` table, enforced in `api/session-status.js`)
- Video card text is now readable — dark navy overlays `rgba(6,14,26,0.72)` instead of the old transparent ones
- Watermark redesigned: clean "Digital Bloom™" italic gold badge at top-left AND bottom-right of every video, no black outline
- Added "Acknowledgement" as a new product category with 20 video prompts (fist bumps, sports blooms, gold dust, basketball, football themes)
- Added a Raw Idea Refiner panel to my prompt engine — I paste a rough idea and AI turns it into a full 3-scene video prompt
- Added a separate Gamble submit link (`?submit=1`) so my business partner can submit ideas that show up in my engine
- Fixed a JS syntax error in the prompt engine (`You're` apostrophe inside a single-quoted string in prompt `ack-18`) that was causing a total blank page

**My prompt engine** is at `digitalbloom.store/prompt-engine.html` — I use it daily from my phone to generate AI video prompts. It has 80 hardcoded prompts across 22 categories.

**Still to do:** Add `ANTHROPIC_API_KEY` to Vercel for the AI Refiner. Recreate `prompt_engine_custom_prompts` Supabase table (was accidentally deleted). Stripe goes live once keys are swapped.

**Key rules:** Never break `/prompt-engine.html`. All category data lives in `src/data/categories.js` — edit there only, never hardcode category lists elsewhere. Dark backgrounds always use navy `#0D1B36`, never pure black.

What do you need help with?
