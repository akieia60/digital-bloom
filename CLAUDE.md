# Digital Bloom — Master Instructions for AI Assistants (OpenClaw / Claude / Any AI)

> **Read this entire file before doing anything.** This is your source of truth for working on Digital Bloom.

---

## WHO YOU ARE WORKING FOR

**Owner:** Ak (Akieia Davis)
**Contact via:** Telegram (@akieia)
**GitHub:** akieia60

---

## THE TWO REPOS — NEVER CONFUSE THESE

This is the most important thing to understand. There are two separate projects:

| Repo | Purpose | Who uses it |
|------|---------|-------------|
| **digital-bloom** ← YOU ARE HERE | The main customer-facing website at digitabloom.com | Everyone — customers, Gamble, the public |
| **digital-bloom-prompt-engine** | Ak's personal internal tool for creating prompts and generating videos | Only Ak, when on the road or creating content |

**RULE: Unless Ak specifically says "prompt engine," all work goes in this repo (`digital-bloom`).**
**RULE: Never make changes to the prompt engine when you mean to change the main site.**
**RULE: When in doubt, ask Ak which repo before touching anything.**

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
- ❌ Never make changes to the **prompt engine** repo when working on the main site
- ❌ Never access Ak's Messages, iMessage, or personal apps for information — ask Ak directly instead
- ❌ Never make changes without explaining what you're doing and why
- ❌ Never use pure black (`#0A0A0A`, `#000000`) for backgrounds — use navy `#0D1B36`
- ❌ Never declare something "done" or "deployed" unless you've actually verified the build passes
- ❌ Never be overly dramatic or use excessive emoji/ALL CAPS in responses — keep it calm and professional
- ❌ Never push to GitHub — Ak handles all git commits and pushes via GitHub Desktop
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

## INTERNATIONALIZATION (i18n)

The entire site supports multiple languages via a custom LanguageContext system.

### How it works
- Translation files live in `src/locales/` — one file per language (`en.js`, `es.js`)
- Both files export an object with **identical keys**, just different translated values
- The active language state lives in `src/contexts/LanguageContext.jsx`
- Every component imports `useLanguage` and calls `t('key')` to get the translated string
- Default language is **Spanish (`es`)** — this is intentional per business preference
- The language switcher UI is in `src/components/landing/LandingNav.jsx`

### Key files
| File | Purpose |
|------|---------|
| `src/locales/en.js` | English strings (~200 keys — source of truth for all keys) |
| `src/locales/es.js` | Spanish strings (must have all the same keys as `en.js`) |
| `src/contexts/LanguageContext.jsx` | Language state + `t()` function |
| `src/components/landing/LandingNav.jsx` | Language switcher UI |

### Components already translated
Every user-facing component uses `t()`: VideoHero, LandingNav, ValueProps, AboutSection, HowItWorks, FAQ, LandingFooter, CategoryGrid, Shop, CategoryPage, ProductDetails, CartItem, ShoppingCart, GiftingForm, Customizer, ExperienceCredits, CreditBalance, ComingSoon, Success.

### To add a new language (e.g. French)
1. Copy `src/locales/en.js` → `src/locales/fr.js`
2. Translate every **value** in the new file (never change the keys)
3. In `src/contexts/LanguageContext.jsx`, import `{ fr }` and add it to the languages map
4. Add the new language option in the switcher in `LandingNav.jsx`

### Rules
- **Every key in `en.js` must also exist in `es.js` (and any other locale file) with the same key name**
- Never hardcode user-visible text in a component — always use `t('key')`
- For arrays with translatable content (FAQ questions, step titles, etc.), define the array **inside the component function** where `t()` is available
- For computed keys (e.g. theme names, extra names), use pattern: `t('cust_theme_' + theme.id)`

---

## IF YOU'RE EVER UNSURE

Just ask Ak. A quick question saves a lot of cleanup. Ak prefers short, clear communication over long explanations. If you get confused between the two repos or aren't sure what page/file to edit — **stop and ask first**.
