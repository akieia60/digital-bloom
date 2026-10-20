# Digital Bloom — Brand Asset Audit

**Date:** September 7, 2026
**Scope:** every PNG/JPG in `Documents/GitHub/digital-bloom` (48 files; `node_modules` and `dist` skipped)
**Standard used:** the repo itself, because `brand-meridian-2025-q2.pdf` and `legal-required-copy.txt` do not exist on this Mac (searched the granted folders plus a whole-computer Spotlight search).

## The rulebook I measured against

| Rule | Guideline value | Where it comes from |
|---|---|---|
| Brand gold | `#D4AF37` | `tailwind.config.js` (`pure-gold`, `brand-gold`, `gold`, `apple-accent`), 301 uses in `src/` |
| Off-brand golds to catch | `#C9A961` (from your request) and `#C9A14A` (a second gold living in the CSS variables, 61 uses) | your message + `src/*.css` |
| Blues to catch | `#0052B3` and `#004B9F` | your message. Note: neither blue exists anywhere in the code. The repo's own dark blue is `#0D1B36` / `#0B1F3A`. |
| Old logos | Both the pink flower-in-navy-circle (`digital bloom/db_logo_*.png`) and the gold wire-lotus (`public/logo.png`) | your answer |
| Legal copy | Brand name must carry the ™ (`BRAND = 'Digital Bloom™'` in `src/data/legal.js`); watermark text is `Digital Bloom™`; footer is `© <year> Creative Vision LLC. All rights reserved.` | `src/data/legal.js`, `public/watermark.png`, footer components |
| "Undersized" | [Inference] my rule, not the repo's: a ™ or © shorter than 12 px at delivered size, or under 1 % of image height, or detached from the name it belongs to | — |

**Confidence key:** High = measured directly (exact pixels, or plainly visible). Medium = measured as an average over shaded/glowing artwork, or OCR confirmed by eye. Low = photographic scene where lighting, not a design choice, produced the color.

---

## 1. Old logo present — 6 files

| File | Issue | Guideline | Asset | Confidence |
|---|---|---|---|---|
| `digital bloom/db_logo_full.png` | Old pink-flower logo (wide lockup) | no old logo | pink 8-petal flower in navy circle + "DIGITAL BLOOM / GIFTING EXPERIENCES" | High |
| `digital bloom/db_logo_icon.png` | Old pink-flower logo (mark only) | no old logo | same mark, 1215×1215 | High |
| `digital bloom/db_logo_stacked.png` | Old pink-flower logo (stacked) | no old logo | same mark + wordmark stacked | High |
| `digital bloom/db_logo_svg_rendered.png` | Old pink-flower logo (stacked, alt render) | no old logo | same mark + wordmark stacked | High |
| `public/logo.png` | Old gold-lotus logo — **this is the file the live site loads** | no old logo | gold wire lotus + "Digital Bloom / Digital Gifting Experience" | High |
| `public/logo-large.png` | Old gold-lotus logo (byte-identical copy of `logo.png`) | no old logo | same | High |

[Inference] Four posters (`birthday_…_bloom_v1`, `birthday_…_transition_v1`, `iloveyou_…_roses_bloom_v1`, `thinkingofyou_…_bloom_v1`) show a "Digital Bloom™" wordmark rendered *inside* the AI image in a script/serif face that matches neither old logo. Not flagged as an old logo, but it is a third, unofficial wordmark.

## 2. Off-brand hex codes — 7 files

| File | Issue | Guideline | Asset | Confidence |
|---|---|---|---|---|
| `digital bloom/db_logo_full.png` | Gold accents are the CSS gold, not the brand gold | `#D4AF37` | `#C9A74E` (ΔE 15 from guideline; ΔE 5 from `#C9A14A`) | High |
| `digital bloom/db_logo_icon.png` | Same | `#D4AF37` | `#C9A84D` (ΔE 14) | High |
| `digital bloom/db_logo_stacked.png` | Same | `#D4AF37` | `#C9A74D` (ΔE 15) | High |
| `digital bloom/db_logo_svg_rendered.png` | Gold accents match the off-brand gold you named | `#D4AF37` | `#CAA85E` (ΔE 21; ΔE 2 from `#C9A961`) | High |
| `public/logo.png` | Lotus gold averages to the off-brand gold | `#D4AF37` | `#CFA662` (ΔE 24; ΔE 4 from `#C9A961`) | Medium — glowing render, value is the mean of gold pixels |
| `public/logo-large.png` | Same (identical file) | `#D4AF37` | `#CFA662` | Medium |
| `public/images/posters/mothersday_digitalbloom_mothersday_bloom_v4.jpg` | 8.7 % of pixels sit within ΔE 15 of the flagged blues | no `#0052B3` / `#004B9F` | `#264894` average | Low — blue-lit cognac scene, photographic |

Not flagged: the 26 photographic posters/product shots whose warm highlights average `#D1A65E`–`#DDA269`. Those are scene lighting, not a chosen brand color, so a hex rule does not meaningfully apply. `docs/gamble-sketches/01-…jpg` contains iOS system blue `#0A4F9B` (a phone screenshot, see section 4).

Passing the gold check with exact pixels: `public/watermark.png` (81 % of opaque pixels are exactly `#D4AF37`), `public/cal-icon-180/192/512.png` (exact `#D4AF37`), `public/guide-icon-180.png` (exact `#D4AF37` on repo navy `#0D1B36`). `public/admin/archive-icon-*.png` are shaded gold averaging `#D0AD42`–`#D3AE40` (ΔE 4–6) — pass with tolerance.

## 3. Missing or undersized legal copy

### 3a. Undersized / detached ™ — 5 files

| File | Issue | Guideline | Asset | Confidence |
|---|---|---|---|---|
| `digital bloom/db_logo_full.png` | ™ is tiny and floats ~1,900 px to the right of the wordmark | ™ attached to "Digital Bloom", ≥12 px | ™ ≈ 11 px tall on a 1215 px canvas (0.9 %) | High |
| `digital bloom/db_logo_stacked.png` | ™ tiny and detached above-right of the name | same | ™ ≈ 10 px (0.6 %) | High |
| `digital bloom/db_logo_svg_rendered.png` | ™ tiny and overlaps the letters between "L" and "OOM" | same | ™ ≈ 8–10 px, low-contrast gold on navy | High |
| `digital bloom/db_logo_icon.png` | ™ tiny at the rim of the circle | same | ™ ≈ 11 px (0.9 %) | Medium |
| `public/images/posters/birthday_birthday_roses_bloom_v1.jpg` | Card shows "Digital Bloom" but the ™ is blurred to illegibility | ™ legible | ™ not readable by eye or OCR | Medium |

### 3b. Brand name without ™ — 2 files

| File | Issue | Guideline | Asset | Confidence |
|---|---|---|---|---|
| `public/logo.png` | "Digital Bloom" set without ™ | `Digital Bloom™` | no ™ anywhere in the file | High |
| `public/logo-large.png` | Same (identical file) | `Digital Bloom™` | no ™ | High |

### 3c. No legal copy at all — 23 files

Guideline: `Digital Bloom™` watermark / © line. Asset value: nothing — no ™, ©, brand name, or entity name in the pixels. Confidence that it is absent: High.

[Inference] Whether this is a *violation* depends on use. The site adds a `Digital Bloom™` watermark overlay in code (`VideoPlayer.jsx`, `db-watermark`), so on-site these are covered. Off-site (social posts, ads, DMs) they go out with no mark at all.

Posters (20): `birthday_birthday_roses_bloom_v2`, `congratulations_congratulations_roses_bloom_v1`, `congratulations_congratulations_roses_bloom_v2`, `general_general_goldenroses_bloom_v1`, `general_general_lotus_bloom_v1`, `general_general_rainbowrose_bloom_v1`, `general_general_roses_bloom_v1`, `glassstiletto_glassstilettoseries_roses_artistic_v1`, `glassstiletto_glassstilettoseries_roses_artistic_v2`, `iloveyou_iloveyou_goldenroses_bloom_v1`, `iloveyou_iloveyou_roses_bloom_v2`, `memorial_memorial_roses_artistic_v1`, `mothers-day-balloon-celebration`, `mothersday_digitalbloom_mothersday_bloom_45s`, `mothersday_digitalbloom_mothersday_bloom_v2`, `mothersday_digitalbloom_mothersday_bloom_v3`, `mothersday_digitalbloom_mothersday_bloom_v4`, `mothersday_digitalbloom_mothersday_bloom_v6`, `valentine_valentine_roses_bloom_v1`, `valentine_valentine_roses_bloom_v2` (all `.jpg` under `public/images/posters/`).

Products (3): `public/images/products/6681d0bf-0041-48b9-b53e-bcca4e923b85.png`, `public/images/products/9B2109BA-9A69-48BF-8D14-D3499B2B0FA4.png`, `public/images/products/mothers-day-balloon-celebration.jpg`.

Legal copy present and adequately sized (pass): `public/watermark.png` ("Digital Bloom™", ™ ≈ 21 px on a 60 px file), `birthday_birthday_roses_transition_v1.jpg` (™ ≈ 21 px, 1.8 %), `iloveyou_iloveyou_roses_bloom_v1.jpg`, `thinkingofyou_thinkingofyou_roses_bloom_v1.jpg`. App icons (`cal-icon-*`, `archive-icon-*`, `guide-icon-180`) were treated as not-applicable — icons never carry legal text.

## 4. Outside the three checks, but you should know — 7 files

| File | What I found | Confidence |
|---|---|---|
| `public/images/AI Video Generator.png` | 3024×1898, **every pixel is pure black**. Broken asset. | High |
| `public/images/diamond-heart-thumb.jpg` | Byte-identical to the file above — also all black. | High |
| `public/images/products/6681d0bf-….png` and `9B2109BA-….png` | Photos of a person (outdoor portrait; screen-capture of a video call), sitting in the *products* folder. [Unverified] whether these are meant to be product images. | High that they are portraits |
| `docs/gamble-sketches/01…`, `02…`, `03…jpg` | Not sketches — iPhone screenshots: `01` is the iOS VPN settings screen, `02` is a Tailscale "ready to use" page showing your email address, `03` is an OpenClaw gateway login form. They are not brand assets and probably should not live in the repo. | High |

## 5. Scorecard

- **48** assets checked.
- **13 passed every check with no caveats:** `cal-icon-180/192/512.png`, `archive-icon-120/152/167/180/512.png`, `guide-icon-180.png`, `watermark.png`, `birthday_birthday_roses_transition_v1.jpg`, `iloveyou_iloveyou_roses_bloom_v1.jpg`, `thinkingofyou_thinkingofyou_roses_bloom_v1.jpg`.
- **35 pass** if you accept the site's runtime watermark as satisfying the legal-copy rule for posters/products (adds the 22 "missing legal copy only" files; `mothersday_bloom_v4` stays flagged for blue).
- **6 logo files fail every category** (old logo + off-brand gold + ™ problem) — and `public/logo.png` is the one on the live site.
- **5 files are not really brand assets** (2 black images, 3 phone screenshots).

## How this was measured (plain English)

Colors: every pixel was converted to Lab, a color space where the distance between two colors ("ΔE") roughly matches what your eye sees — under about 5 is hard to tell apart, over 10 is clearly different. For each file I averaged the pixels that were anywhere near gold and compared that average to the guideline. Flat-design files (icons, watermark) were also checked for exact hex matches.
Logos: every file was viewed on contact sheets and confirmed by eye; automated template matching was tried but was not reliable enough to lean on, so the logo calls are visual.
Legal copy: Tesseract OCR (normal and inverted) looked for ™, ©, "Digital Bloom", "Creative Vision", "LLC"; every hit was checked visually at 2–4× zoom, and false hits (a rose the OCR read as ©) were thrown out. Text height comes from the OCR bounding box.
