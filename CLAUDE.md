# Digital Bloom — Agent Instructions

> **IMPORTANT:** Do not use this file as your primary source of context.
> It is intentionally minimal. All project context, rules, and team state live in Notion.

## Your First Two Steps (mandatory, every session)

1. **Read the Master Briefing:**
   https://www.notion.so/34e4b19f45c98127ab30c9c3603547d8

2. **Read the Agent Coordination Hub** (check for handoffs addressed to you, see what other agents have done):
   https://www.notion.so/35b4b19f45c981b983e6fcef2df9e62b

## Your Last Step (mandatory, every session)

Before ending your session, add a log entry to the Agent Coordination Hub with:
- Your agent name
- The date
- What you completed
- Any handoffs for other agents

## Quick Reference

| What | Where |
|------|-------|
| Live site | https://digitalbloom.store |
| GitHub repo | https://github.com/akieia60/digital-bloom |
| Vercel project | flower-shop (auto-deploys from `main`) |
| Supabase project | yhdbeblowolfinxxhsnt |
| Admin archive | https://digitalbloom.store/admin/archive.html?token=... |
| Prompt engine | https://digitalbloom.store/prompt-engine.html |

## Critical Rules (never break these)

- Navy `#0D1B36` for dark backgrounds — NEVER pure black
- Gold `#D4AF37` for accents, CTAs, watermarks
- Fonts: Playfair Display (headings), Outfit (body)
- Brand name always: **Digital Bloom™** (with ™)
- Never hardcode category lists outside `src/data/categories.js`
- Never break `/prompt-engine.html` — Ak uses it daily from her phone
- All blooms must be silent (audio stripped). `ffmpeg -movflags +faststart` is mandatory on every MP4.
- Watermark is baked in-video via ffmpeg — never DOM overlay

<<<<<<< Updated upstream
*Last updated: May 9, 2026 by Magic (Manus)*
=======
All category data (slugs, display names, taglines, emojis, accent colors,
expected prompt counts) lives in **one place**:

**`src/data/categories.js`** — edit here, everywhere else auto-derives.

Consumers: `api/process-bloom.js`, `src/pages/Shop.jsx`,
`src/pages/CategoryPage.jsx`, `src/components/ProductGrid.jsx`,
`src/components/landing/CategoryGrid.jsx`, `src/pages/Admin.jsx`,
`public/prompt-engine.html` (validated, not auto-derived),
`scripts/generate-sitemap.js`.

**Build guard:** `scripts/validate-categories.js` runs as a `prebuild` step
and fails the Vercel deploy if any `cat:` string in `prompt-engine.html`
doesn't map to a canonical slug, OR if per-category counts drift. Run it
locally any time with `npm run validate-categories`.

---

## WHAT IS DIGITAL BLOOM?

Digital Bloom is a **luxury digital gifting platform**. Instead of sending physical flowers, customers send beautifully animated video bouquets ("blooms") for occasions like birthdays, Mother's Day, Valentine's Day, etc.

- **Live site:** digitabloom.com
- **GitHub:** github.com/akieia60/digital-bloom
- **Hosting:** Vercel (auto-deploys when you push to `main` branch)
- **Business partner / UI feedback:** Gamble (704-605-2509)

### Business Model
- Customers browse by occasion → customize a bloom → pay via Stripe → recipient gets the digital experience
- **Pricing tiers:** $1.99 / $4.99 / $9.99 / $19.99
- **Experience Credits:** A gift-card-style system — buy credits, redeem later
- **IMPORTANT:** Stripe is currently in **sandbox/test mode**. No real money is being charged yet.

---

## TECH STACK (know this before touching anything)

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 |
| Styling | Vanilla CSS (landing page) + Tailwind CSS (some inner pages) |
| Routing | React Router DOM 7 |
| Backend | Vercel Serverless Functions (in `api/` folder) |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout |
| Hosting | Vercel |
| Version Control | GitHub Desktop (Ak does NOT use command line for git) |

---

## PROJECT STRUCTURE (key files to know)

```
digital-bloom/
├── api/                          # Backend functions (Stripe, Supabase)
├── public/videos/                # Hero video + product videos
├── src/
│   ├── App.jsx                   # All routes live here
│   ├── index.css                 # Global CSS variables + dark theme
│   ├── components/
│   │   ├── landing/
│   │   │   ├── VideoHero.jsx     # The hero section with video square
│   │   │   ├── LandingNav.jsx    # Navigation (hamburger on mobile)
│   │   │   ├── CategoryGrid.jsx  # "Browse by Occasion" — stacked categories
│   │   │   └── LandingFooter.jsx
│   │   ├── GiftingForm.jsx       # Gift delivery + message form in checkout
│   │   ├── ExperienceCustomizer.jsx  # Bloom customization panel
│   │   └── ShoppingCart.jsx      # Cart drawer
│   ├── pages/
│   │   ├── LandingPage.jsx       # Homepage (/)
│   │   ├── CategoryPage.jsx      # /shop/:category
│   │   ├── Shop.jsx              # /shop
│   │   └── Success.jsx           # /success (post-checkout)
│   ├── styles/
│   │   ├── video-hero.css        # Hero styles
│   │   ├── landing-nav.css       # Nav styles
│   │   ├── landing.css           # Landing page + category grid styles
│   │   └── customizer.css        # Checkout customizer styles
│   └── data/
│       └── occasions.js          # Category names, colors, taglines
└── HANDOFF.md                    # Full project documentation (read this too)
```

---

## DESIGN SYSTEM (colors + fonts — always follow these)

| Color | Hex | Use for |
|-------|-----|---------|
| Navy Blue | `#0D1B36` | Dark backgrounds (hero, category headers) |
| Pure Gold | `#D4AF37` | Accents, logos, CTAs, watermarks |
| White | `#FFFFFF` | Text on dark backgrounds, card surfaces |
| Apple Dark | `#1D1D1F` | Body text on white backgrounds |
| Apple Gray | `#6E6E73` | Secondary text |

**Fonts:**
- **Playfair Display** — headings, titles (luxury feel)
- **Outfit** — body text, buttons, labels
- **Cormorant Garamond** — occasional accent text

**RULE: Never use pure black (#000000 or #0A0A0A) as a background. Use navy `#0D1B36` instead.**
**RULE: Text on dark/navy backgrounds must be white or light — never dark-on-dark.**

---

## BRANDING RULES

- The brand name is always **Digital Bloom™** — include the ™ symbol in prominent locations
- There is a gold watermark "Digital Bloom™" on the hero video square (bottom left corner)
- Digital Bloom branding must always be visible — even in screenshots and screen recordings
- **"Digital Balloon"** is NOT correct — it is always **"Digital Bloom"**

---

## HOW AK DEPLOYS CHANGES

1. You make code changes to files in this repo
2. Ak opens **GitHub Desktop** on their Mac Mini
3. Ak reviews the changed files, writes a commit message, clicks **Commit to main**
4. Ak clicks **Push origin**
5. Vercel automatically deploys within ~60 seconds
6. **Ak does NOT use the terminal for git commands — only GitHub Desktop**

---

## RULES FOR HOW YOU MUST OPERATE

### ALWAYS do these:
- ✅ Read `HANDOFF.md` for full project context if you need deeper detail
- ✅ Ask Ak which repo before starting any work if there's any ambiguity
- ✅ Make one clear change at a time and explain what you did in plain English
- ✅ Tell Ak exactly which files were changed so they know what to commit
- ✅ Keep explanations simple — Ak is not a developer and learns by doing
- ✅ Build/verify changes don't break anything before declaring work done
- ✅ Confirm your understanding of a request before executing if it's complex

### NEVER do these:
- ❌ Never break the prompt engine URL (`/prompt-engine.html`) or its upload flow — Ak uses it daily from her phone on the road
- ❌ Never hardcode a category list anywhere outside `src/data/categories.js` — causes drift that silently misroutes uploads
- ❌ Never access Ak's Messages, iMessage, or personal apps for information — ask Ak directly instead
- ❌ Never make changes without explaining what you're doing and why
- ❌ Never use pure black (`#0A0A0A`, `#000000`) for backgrounds — use navy `#0D1B36`
- ❌ Never run `npm run build` or `vite build` locally on Ak's Mac mini to "verify" your changes — vite hangs in this environment and orphans esbuild service daemons that pile up and break future builds. Vercel runs the real build via `vercel-build` on every push and is the source of truth. Verify with `npm run lint`, `npm run validate-categories`, or by reading the diff. If you absolutely must build, use `npm run build` (it's wrapped in `scripts/safe-build.js` which kills any hang at 180s, but you still don't get a useful artifact).
- ❌ Never declare something "done" or "deployed" unless you've confirmed the change is committed and pushed (Vercel will then build it)
- ❌ Never be overly dramatic or use excessive emoji/ALL CAPS in responses — keep it calm and professional
- ❌ Never use the word "Digital Balloon" — it's always "Digital Bloom"

---

## CURRENT PROJECT STATUS (as of March 2026)

### ✅ Done and live
- Hero section with video square + navy blue background
- Hamburger menu moved to top-left on mobile, bright white, visible
- "Digital Bloom" faint text removed from mobile nav
- Categories redesigned: stacked full-width, big name on top, full-width bloom square, tap to open
- Checkout gifting form: To/From card preview, character count
- Digital Bloom™ watermark on hero video
- TM symbol on branding throughout
- Dark sections changed from black to deep navy blue (#0D1B36)
- Category page text made white/readable on navy background
- Stripe: sandbox mode, 10 payment methods enabled (not live yet)
- Success page redesigned

### 🚧 Not done yet
- Stripe going live (still in test/sandbox mode — needs key swap in Vercel)
- Google Pay (needs to be toggled on in Stripe dashboard)
- Category preview videos (need 3–5 second clips for each occasion)

### ⚠️ Known issues to be aware of
- Mixed CSS: Landing page uses vanilla CSS files; some inner pages use Tailwind
- npm on Ak's machine sometimes has EPERM permission errors — not a code problem
- Product videos are in Supabase Storage; only the hero video is local in `public/videos/`

---

## GAMBLE'S FEEDBACK SYSTEM

Gamble is Ak's business partner who does UI/UX walkthroughs of the live site. When Ak says "Gamble wants X" or shares Gamble's feedback, treat it as a high-priority UI change request. Gamble reviews the live site at **digitabloom.com**.

---

## IF YOU'RE EVER UNSURE

Just ask Ak. A quick question saves a lot of cleanup. Ak prefers short, clear communication over long explanations. If you get confused between the two repos or aren't sure what page/file to edit — **stop and ask first**.
>>>>>>> Stashed changes
