# HANDOFF → DEUCE — March 29, 2026 (Session 2)

**From:** Michael (Claude/Cowork)
**Branch:** `design-upgrade`
**Repo:** `~/Desktop/digitalbloom/🌐 web-store/`

---

## What Michael Did This Session (4 features)

✅ **1. Global hamburger menu** — FAQ is now accessible from every page. The FAQ modal + floating pill button moved to App level so they appear on the Shop, Credits, Product, and all other pages — not just the landing page. FAQ link added to Header's mobile hamburger menu too.

✅ **2. Back button on every page** — Shop page now has a back button. (ExperienceCredits, CreditBalance, ProductDetails, and CategoryPage already had them.) Cart items already have "Edit Customization" and "View Product" links built in.

✅ **3. Hero section motion** — Added floating gold/rose particles drifting upward + a sweeping aurora light effect behind the gradient hero. Pure CSS, no performance impact.

✅ **4. Customizer overhaul** — Sound selection went from 4 tracks to 8 (added Golden Harp, Ocean Breeze, Jazz Lounge, R&B Soul). New visual step progress bar at the top showing which step you're on with clickable dots. Sound tracks now display as a 2-column card grid instead of a plain list. Review step has a cleaner row layout.

---

## Exact Commands to Run

```bash
# Step 1: Clean any lock files
find ~/Desktop/digitalbloom/🌐\ web-store/.git -name "*.lock" -delete 2>/dev/null

# Step 2: Stage all changed files
git -C ~/Desktop/digitalbloom/🌐\ web-store/ add src/App.jsx src/components/Header.jsx src/components/Customizer.jsx src/components/landing/FAQ.jsx src/components/landing/GradientHero.jsx src/components/landing/LandingNav.jsx src/pages/LandingPage.jsx src/pages/Shop.jsx src/styles/customizer.css src/styles/gradient-hero.css src/styles/landing.css src/locales/en.js src/locales/es.js src/locales/fr.js src/locales/ht.js src/locales/zh.js

# Step 3: Commit
git -C ~/Desktop/digitalbloom/🌐\ web-store/ commit -m "Global FAQ + back buttons + hero particles + customizer overhaul (8 sounds, step bar, card grid)"

# Step 4: Push
git -C ~/Desktop/digitalbloom/🌐\ web-store/ push origin design-upgrade
```

---

## Files Changed (16 total)

### Core architecture
- `src/App.jsx` — FAQ modal + pill button moved here (global), ShoppingCart now on all pages, onOpenFaq passed to Header and LandingPage
- `src/pages/LandingPage.jsx` — Simplified, receives onOpenFaq from App, no longer manages own FAQ state
- `src/components/Header.jsx` — Added onOpenFaq prop, FAQ link in hamburger menu
- `src/components/landing/LandingNav.jsx` — Already had onOpenFaq (no change this session)

### FAQ modal
- `src/components/landing/FAQ.jsx` — Already a modal from previous commit (no change)

### Back buttons
- `src/pages/Shop.jsx` — Added BackButton component at top of page

### Hero animation
- `src/components/landing/GradientHero.jsx` — Added aurora div + 18 floating particles
- `src/styles/gradient-hero.css` — Added aurora sweep + particle float keyframes

### Customizer overhaul
- `src/components/Customizer.jsx` — 8 sound tracks (was 4), step progress bar, sound card grid layout, cleaner review card
- `src/styles/customizer.css` — New step bar styles, sound card grid, review row layout

### Locale files (all 5)
- `src/locales/en.js` — Added 4 new sound keys
- `src/locales/es.js` — Added 4 new sound keys (Spanish)
- `src/locales/fr.js` — Added 4 new sound keys (French)
- `src/locales/ht.js` — Added 4 new sound keys (Haitian Creole)
- `src/locales/zh.js` — Added 4 new sound keys (Chinese)

---

## Watch Out For

- ⚠️ **Do NOT commit `DEUCE_COMMIT_HANDOFF.md`** — it's a handoff doc, not code
- ⚠️ **Branch is `design-upgrade`** — NOT main
- ⚠️ **Lock files** — run the find+delete command first

---

## What's Left on the Roadmap

1. ~~Full i18n~~ ✅
2. ~~FAQ redesign~~ ✅
3. ~~Global hamburger menu~~ ✅
4. ~~Back button + cart editing~~ ✅
5. ~~Hero motion~~ ✅
6. ~~Customizer overhaul~~ ✅
7. **Final review + merge to main** — AK wants to see everything first, then merge with rollback plan. DO NOT merge to main yet.
