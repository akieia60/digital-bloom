#!/bin/bash
# ============================================================
# Digital Bloom — Design System Fixes PR
# Run this once from Terminal to commit & open the PR.
# ============================================================

cd "$(dirname "$0")"

echo "→ Staging changed files..."
git add \
  src/App.jsx \
  src/components/ProductCard.jsx \
  src/index.css \
  src/styles/bloomDelivery.css \
  src/styles/gallery.css \
  src/styles/gradient-hero.css \
  src/styles/landing-nav.css \
  src/styles/landing.css \
  src/styles/overlays.css \
  src/styles/video-hero.css \
  src/styles/wrapped-gift.css \
  design-system-audit.md

echo "→ Committing..."
git commit -m "chore: design system audit fixes

- Consolidate gold to brand spec #D4AF37 (was split between two values across 47 files)
- Fix navy drift: replace #0c1f3f / #0a0a0a / #07111f with brand #0D1B36
- Fix scrolled nav background from pure black to navy rgba(13,27,54,0.96)
- Replace Cormorant Garamond with Playfair Display in store UI (kept in customizer)
- Trim Google Fonts from 13 families to 3 (huge page speed win for mobile)
- Add --deep-blue-hover token; scope --bloom-primary comment
- Fix ProductCard.jsx hardcoded hex colors to use CSS variables
- Add .eyebrow and .video-overlay utility classes
- Add design-system-audit.md"

echo "→ Pushing branch..."
git push -u origin chore/design-system-fixes

echo ""
echo "✓ Done! Now opening the PR on GitHub..."
echo ""

# If you have the GitHub CLI (gh) installed:
gh pr create \
  --base main \
  --head chore/design-system-fixes \
  --title "chore: design system audit fixes — colors, fonts, tokens" \
  --body "## What this does

All changes are visual/style only — no logic, no routing, no database changes.

### 🎨 Color fixes
- **Gold unified to \`#D4AF37\`** — the official brand spec. Before this, the store used two different golds (\`#D4AF37\` and \`#C9A14A\`) in different places, making CTAs and modals look slightly different from each other
- **Navy drift fixed** — gradient-hero.css was using \`#0c1f3f\` instead of the brand \`#0D1B36\`. Media backgrounds were using near-black values (\`#0a0a0a\`, \`#07111f\`)
- **Scrolled nav background** — was \`rgba(10,10,10,0.95)\` (pure black, breaks brand rule). Now \`rgba(13,27,54,0.96)\` (navy)

### 🔤 Font fixes
- **Cormorant Garamond removed from store UI** — replaced with Playfair Display everywhere except the customizer font picker (where customers intentionally choose it for their bloom message)
- **Google Fonts trimmed from 13 families to 3** — Playfair Display, Outfit, Cormorant Garamond. Removes 10 unnecessary network requests every page load

### 🪙 Token cleanup
- \`--accent-gold\` and \`--accent-gold-hover\` updated to match spec
- \`--deep-blue-hover\` token added (was a hardcoded \`#132d4f\`)
- \`--spec-gold\` and \`--apple-accent\` now reference \`var(--accent-gold)\` instead of duplicating the value
- \`--bloom-primary\` clarified as a customizer-only token, not a brand color

### 🧩 Component fixes
- **ProductCard.jsx** — all hardcoded hex values replaced with CSS variables
- **.eyebrow utility class** added to index.css (one class to rule all the small uppercase section labels)
- **.video-overlay utility class** added to index.css (replaces repeated inline gradient overlays)
- **Landing page buttons** — removed hardcoded fallback values, now use tokens cleanly

### ✅ What was NOT changed
- No JavaScript logic
- No routing or page structure
- No database or API calls
- Cormorant Garamond kept in the customizer font engine (intentional user-facing option)

### 📋 Full audit
See \`design-system-audit.md\` at the root of the repo for the complete issue list and priority breakdown." 2>/dev/null

# If gh isn't installed, just print the GitHub URL:
if [ $? -ne 0 ]; then
  echo "→ gh CLI not found. Open this URL to create the PR manually:"
  echo "  https://github.com/akieia60/digital-bloom/compare/main...chore/design-system-fixes"
fi
