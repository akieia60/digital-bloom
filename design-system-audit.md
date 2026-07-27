# Digital Bloom™ — Design System Audit
**Date:** May 13, 2026 | **Auditor:** Michael (Claude / Cowork)

---

## Summary

| Metric | Result |
|--------|--------|
| Files reviewed | 25+ CSS/JSX files across `src/` |
| Issues found | 18 |
| Critical (break brand rules) | 4 |
| High priority | 7 |
| Low / cleanup | 7 |
| Overall health score | **54 / 100** |

The design system has a solid foundation — the `:root` token block in `index.css` is well-structured and most components reference it correctly. But there are four critical breaks from the brand spec and significant fragmentation across CSS files that is creating maintenance debt.

---

## Critical Issues (fix immediately)

### 1. Gold color is split between TWO different values
**Rule broken:** CLAUDE.md spec says gold is `#D4AF37`.

**What's happening:**
- `index.css` defines `--accent-gold: #C9A14A` — this is a *different*, darker gold
- `#D4AF37` appears hardcoded in 265 instances across 47 files (gradient-hero, landing, watermarks, FAQ modal, data files, etc.)
- A third gold variant `#C9A84C` appears in gradient-hero particles
- A fourth `rgba(201, 168, 76, ...)` appears inline

**Impact:** The store has two noticeably different shades of gold depending on which component you're looking at. CTAs, watermarks, and the FAQ modal all look slightly different from each other.

**Fix:** Either update `--accent-gold` in `index.css` to `#D4AF37` (the official spec) and replace all hardcoded `#C9A14A` occurrences with `var(--accent-gold)`, OR make a conscious decision to use `#C9A14A` everywhere and update the spec. Pick one and go all-in.

---

### 2. Navy background not consistent
**Rule broken:** CLAUDE.md spec says navy is `#0D1B36` and pure black is never allowed.

**What's happening:**
- `--bg-page: #0D1B36` — correct in `:root`
- `gradient-hero.css` uses `#0c1f3f` (slightly different blue) throughout — 4+ hardcoded instances
- `#07111f` appears as video background in landing.css and gradient-hero (dark blue-black)
- `#0a0a0a` is used for media tile backgrounds (near-black, violates the rule)
- `--nav-bg-scrolled: rgba(10, 10, 10, 0.95)` — this is effectively pure black on scroll, a direct rule violation

**Fix:**
- Replace all `#0c1f3f` with `#0D1B36` or `var(--bg-page)` in gradient-hero.css
- Replace `rgba(10, 10, 10, 0.95)` with something like `rgba(13, 27, 54, 0.95)` for the scrolled nav
- Replace `#0a0a0a` with `#0D1B36` or `var(--bg-page)`

---

### 3. Third serif font (Cormorant Garamond) in use without brand approval
**Rule broken:** Brand fonts are Playfair Display (headings) and Outfit (body). Period.

**What's happening:**
- `gradient-hero.css` uses Cormorant Garamond for the tagline, watermark, and brand bar text
- It's also referenced in the `index.css` imports and the `db-watermark` CSS rule
- This creates a three-serif situation that dilutes the premium, consistent look

**Fix:** Replace all `'Cormorant Garamond'` references with `'Playfair Display'`. They're both elegant serifs and the switch is safe.

---

### 4. `#FFFFFF` hardcoded on button text instead of a token
Not a brand-rules violation exactly, but the `cta-primary` button text color is `#FFFFFF` hardcoded in multiple places rather than `var(--text-on-dark)`. If the button background ever changes, the text won't adapt.

---

## High Priority Issues

### 5. Button styles are defined three times (duplication)
Three separate sets of button styles exist for essentially the same buttons:
- `btn-primary` / `btn-secondary` in `index.css` (global)
- `cta-primary` / `cta-secondary` in `landing.css` (scoped to landing page)
- `gradient-hero__btn` / `gradient-hero__ghost-btn` in `gradient-hero.css` (hero-specific)

All three do the same job — rounded pill, gold fill, Outfit font. Any time a button style needs updating, it has to be changed in three places. This is how bugs sneak in.

**Fix:** Keep only `btn-primary` and `btn-secondary` in `index.css`. Extend them with modifier classes if the hero needs size variations (e.g. `.btn-primary--hero`, `.btn-primary--sm`). Delete the duplicates.

---

### 6. Eyebrow text class explosion (7 nearly identical classes)
Every section has its own eyebrow class with nearly identical rules:
`.cat-eyebrow`, `.cat-list-eyebrow`, `.sq-cat-eyebrow`, `.cat-stack-eyebrow`, `.demo-video-eyebrow`, `.faq-item-eyebrow`, `.gradient-hero__pill-text`

They all use Outfit, ~0.7rem, letter-spacing ~0.28-0.35em, uppercase, gold color. The tiny differences (0.28em vs 0.3em vs 0.35em) are invisible to users and accidental rather than intentional.

**Fix:** Create one `.eyebrow` utility class in `index.css` and use it everywhere. Variations (dark vs light context) handled by a single modifier class.

---

### 7. `ProductCard.jsx` bypasses the token system with Tailwind hardcodes
The card uses Tailwind classes with hardcoded hex values: `text-[#1D1D1F]`, `text-[#6E6E73]`, `border-[#E5E5EA]`, `text-[#AEAEB2]`, `border-[#F0F0F0]`.

These happen to match the CSS variable values but bypass the variable system. If you ever run a rebrand or tweak a gray shade, these won't update.

**Fix:** Use `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, etc. — Tailwind's arbitrary value syntax fully supports CSS variables.

---

### 8. 13 font families loaded in index.css — only 2 are used
`index.css` loads: Playfair Display, Outfit, Inter, Great Vibes, Dancing Script, Cinzel, Lora, Josefin Sans, Sacramento, Allura, Italianno, Caveat, Marcellus.

Most are leftover from earlier design experiments. Every one of these adds a network request and delays your page load. Ak uses the prompt engine from her phone daily — this matters.

**Fix:** Remove all fonts except Playfair Display and Outfit (plus Cormorant Garamond if you decide to keep it for now). That's cutting 10+ font requests.

---

### 9. `--bloom-primary: #FF69B4` in `:root` doesn't match any brand color
Hot pink. Left over from a dynamic theme system. It's defined globally but not part of the brand spec. Causes confusion about what colors are "official."

**Fix:** If the dynamic bloom theming system is still in use, isolate `--bloom-primary` to the customizer component scope. Otherwise, remove it from `:root`.

---

### 10. CSS file fragmentation — 11 separate stylesheets
`landing.css`, `gallery.css`, `gradient-hero.css`, `video-hero.css`, `bloomDelivery.css`, `credits.css`, `success.css`, `overlays.css`, `signature-bloom.css`, `mothers-day-countdown.css`, `wrapped-gift.css`

This makes it hard to answer questions like "where is the card hover style?" or "what's our section spacing?" because the answer could be in any of 11 files.

**Fix (medium term):** Consolidate into 3 files: `tokens.css` (all `:root` variables), `global.css` (reset, typography, utility classes, common components), and `pages/[name].css` for page-specific overrides. This is a larger refactor — prioritize after the critical issues.

---

### 11. `btn-deep-blue` hover uses hardcoded `#132d4f` instead of a token
```css
.btn-deep-blue:hover {
  background: #132d4f; /* ← not a token */
}
```
`--deep-blue` is `#0B1F3A` — the hover is a lighter variant but it's not defined as a token, so it's floating.

**Fix:** Add `--deep-blue-hover: #132d4f` to `:root` and use it.

---

## Low Priority / Polish

### 12. Legacy aliases in `:root` add noise
`--apple-white`, `--apple-gray`, `--apple-text`, `--apple-secondary`, `--apple-border`, `--apple-accent`, `--pure-gold`, `--champagne-white` — these are backward-compat aliases that duplicate the current tokens. If no code is actively using them (worth a quick grep), they can be removed.

### 13. `--spec-gold` duplicates `--accent-gold`
Both are `#C9A14A`. One token is enough.

### 14. Inconsistent border-radius values
Cards use: `border-radius: 12px`, `14px`, `16px`, `20px`, `22px`, `28px` — no pattern. A simple 3-tier system (small: 12px, medium: 16px, large: 24px) would bring order without restricting design.

### 15. Touch target inconsistency
Mobile buttons require `min-height: 44px` per the code, but some badge-style elements (`bloom-list-card__cta` at `min-height: 36px`) fall below the target on mobile.

### 16. `line-clamp` used without `-webkit-` fallback in some places
Modern browsers support `line-clamp` directly now, but older iOS still needs `-webkit-line-clamp`. Most places have both, but it's worth a sweep.

### 17. Gradient overlays re-defined everywhere
`linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.55) 100%)` appears in at least 4 different files for video card overlays. One `.video-overlay` utility class would cover all of them.

### 18. No dark mode handling for white-surface components
The site uses `var(--bg-page)` as the dark base but white-surface components (product cards, panels) have no `prefers-color-scheme: dark` handling. Not urgent since the UI is intentionally dark-framed, but worth noting for the future.

---

## Priority Action Plan

**This week (critical brand fixes):**
1. Decide on one gold value — `#D4AF37` (spec) or `#C9A14A` (current var) — and update everything to match
2. Fix the scrolled nav background: `rgba(10, 10, 10, 0.95)` → `rgba(13, 27, 54, 0.95)`
3. Replace `#0a0a0a` and `#0c1f3f` with `#0D1B36` / `var(--bg-page)` in gradient-hero.css
4. Replace `Cormorant Garamond` with `Playfair Display` everywhere

**Next sprint (quality of life):**
5. Merge the three button definitions into one in `index.css`
6. Create a single `.eyebrow` utility class
7. Fix `ProductCard.jsx` Tailwind hardcodes to use CSS vars
8. Trim the font imports to 2 families

**Backlog (when bandwidth allows):**
9. CSS file consolidation into 3 logical files
10. Add `--deep-blue-hover` token
11. Clean up legacy aliases and `--spec-gold` duplicate
12. Standardize border-radius to a 3-tier system

---

## Token Inventory (current state)

| Token | Value | Status |
|-------|-------|--------|
| `--bg-page` | `#0D1B36` | ✅ Correct |
| `--accent-gold` | `#C9A14A` | ⚠️ Conflicts with `#D4AF37` spec |
| `--text-primary` | `#1D1D1F` | ✅ |
| `--text-secondary` | `#6E6E73` | ✅ |
| `--text-muted` | `#AEAEB2` | ✅ |
| `--surface-white` | `#FFFFFF` | ✅ |
| `--surface-soft` | `#F7F7F7` | ✅ |
| `--border-subtle` | `#F0F0F0` | ✅ |
| `--border-default` | `#E5E5EA` | ✅ |
| `--section-space-mobile` | `56px` | ✅ |
| `--section-space-desktop` | `96px` | ✅ |
| `--bloom-primary` | `#FF69B4` | ❌ Not a brand color — scope or remove |
| `--spec-gold` | `#C9A14A` | ❌ Duplicate of `--accent-gold` |
| `--apple-*` aliases | various | ⚠️ Legacy — audit and remove |

---

*Audit produced by Michael (Claude / Cowork) — May 13, 2026*
*Next step: Run a `/design:design-system extend` session to spec the unified button and eyebrow components.*
