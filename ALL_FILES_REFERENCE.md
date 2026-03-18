# Digital Bloom — All Files (Final)

---
## 1. src/index.css
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

:root {
  /* ============================================
     DIGITAL BLOOM — MERGED DESIGN SYSTEM
     Black brand framing + white-forward readability
     ============================================ */

  /* ── Page Foundations ── */
  --bg-page: #0A0A0A;
  --bg-hero: #000000;

  /* ── Surface System (White-Forward) ── */
  --surface-white: #FFFFFF;
  --surface-soft: #F7F7F7;
  --surface-card: #FFFFFF;
  --surface-muted: #FAFAFA;
  --bg-surface: #FFFFFF;
  --bg-surface-hover: #F0F0F0;

  /* ── Text — Dark-on-Light (primary readability) ── */
  --text-primary: #1D1D1F;
  --text-secondary: #6E6E73;
  --text-muted: #AEAEB2;
  --text-on-dark: #FFFFFF;
  --text-on-dark-secondary: rgba(255, 255, 255, 0.6);
  --text-on-dark-muted: rgba(255, 255, 255, 0.35);

  /* ── Borders ── */
  --border-subtle: #F0F0F0;
  --border-default: #E5E5EA;
  --border-strong: #D2D2D7;
  --border-on-dark: rgba(255, 255, 255, 0.08);

  /* ── Brand Accent — Gold (accent only, never dominant) ── */
  --accent-gold: #C9A14A;
  --accent-gold-hover: #B8923F;
  --accent-gold-glow: rgba(201, 161, 74, 0.08);
  --accent-gold-border: rgba(201, 161, 74, 0.2);
  --accent-gold-border-hover: rgba(201, 161, 74, 0.4);
  --spec-gold: #C9A14A;

  /* ── Deep Blue — Subtle premium accent ── */
  --deep-blue: #0B1F3A;
  --deep-blue-soft: rgba(11, 31, 58, 0.06);
  --deep-blue-text: #0B1F3A;

  /* ── Navigation (dark framing) ── */
  --nav-bg: #0A0A0A;
  --nav-bg-scrolled: rgba(10, 10, 10, 0.95);
  --nav-border-scrolled: rgba(255, 255, 255, 0.05);

  /* ── Spacing Tokens ── */
  --section-space-mobile: 56px;
  --section-space-desktop: 96px;
  --card-padding-mobile: 16px;
  --card-padding-desktop: 24px;
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);

  /* ── Scrollbar ── */
  --scrollbar-thumb: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.3);

  /* ── Dynamic Theme Engine ── */
  --bloom-primary: #FF69B4;
  --bloom-primary-rgb: 255, 105, 180;
  --bloom-radius: 20px;
  --bloom-glow: 0.15;

  /* ── Legacy aliases (backward compat) ── */
  --apple-white: #FFFFFF;
  --apple-gray: #FAFAFA;
  --apple-text: #1D1D1F;
  --apple-secondary: #6E6E73;
  --apple-border: #D2D2D7;
  --apple-accent: #C9A14A;
  --pure-gold: #C9A14A;
  --champagne-white: #F5F5F7;
}

/* ============================================
   GLOBAL RESET + TYPOGRAPHY
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  line-height: 1.6;
}

/* Serif headlines — luxury feel */
h1, h2, h3, .font-display {
  font-family: 'Playfair Display', 'Georgia', serif;
  letter-spacing: 0.02em;
}

/* ============================================
   SURFACE UTILITY CLASSES
   White-forward panels for readable content
   ============================================ */

/* White panel — primary readable surface */
.panel-white {
  background: var(--surface-white);
  border-radius: 20px;
  padding: var(--card-padding-mobile);
  border: 1px solid var(--border-subtle);
}

/* Soft panel — grouped content, forms */
.panel-soft {
  background: var(--surface-soft);
  border-radius: 16px;
  padding: var(--card-padding-mobile);
  border: 1px solid var(--border-subtle);
}

/* Dark panel — hero framing, luxury contrast */
.panel-dark {
  background: var(--bg-page);
  border-radius: 20px;
  padding: var(--card-padding-mobile);
  border: 1px solid var(--border-on-dark);
  color: var(--text-on-dark);
}

/* Deep blue accent panel */
.panel-blue {
  background: var(--deep-blue);
  border-radius: 16px;
  padding: var(--card-padding-mobile);
  color: var(--surface-white);
}

@media (min-width: 768px) {
  .panel-white,
  .panel-soft,
  .panel-dark,
  .panel-blue {
    padding: var(--card-padding-desktop);
  }
}

/* ============================================
   SECTION SPACING UTILITY
   ============================================ */
.section-spacing {
  padding-top: var(--section-space-mobile);
  padding-bottom: var(--section-space-mobile);
}

@media (min-width: 768px) {
  .section-spacing {
    padding-top: var(--section-space-desktop);
    padding-bottom: var(--section-space-desktop);
  }
}

/* ============================================
   HERO TEXT OVERLAY
   Readable text on busy images
   ============================================ */
.hero-text-overlay {
  position: relative;
  z-index: 2;
}

.hero-text-overlay::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
  z-index: -1;
  border-radius: 12px;
}

/* ============================================
   FORM SECTION GROUPING
   ============================================ */
.form-group-section {
  background: var(--surface-soft);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-subtle);
}

.form-group-section__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

/* ============================================
   STICKY MOBILE CTA BAR
   Reusable fixed-bottom action area
   ============================================ */
.sticky-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--surface-white);
  border-top: 1px solid var(--border-default);
  padding: 12px 20px;
  padding-bottom: calc(12px + var(--safe-area-bottom));
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.sticky-cta-bar__price {
  flex: 1;
}

.sticky-cta-bar__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  margin-bottom: 2px;
}

.sticky-cta-bar__amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
}

.sticky-cta-bar__btn {
  padding: 14px 28px;
  background: var(--accent-gold);
  color: #FFFFFF;
  border: none;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;
  flex-shrink: 0;
}

.sticky-cta-bar__btn:hover {
  background: var(--accent-gold-hover);
}

/* ============================================
   BUTTONS — Premium Feel
   ============================================ */
.btn-primary {
  background: var(--accent-gold);
  color: #FFFFFF;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 980px;
  border: none;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 161, 74, 0.25);
  background: var(--accent-gold-hover);
}

.btn-secondary {
  border: 1.5px solid var(--border-strong);
  background: transparent;
  color: var(--text-primary);
  transition: all 0.3s ease;
  border-radius: 980px;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  cursor: pointer;
  min-height: 48px;
}

.btn-secondary:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: var(--accent-gold-glow);
}

/* Deep blue button variant */
.btn-deep-blue {
  background: var(--deep-blue);
  color: #FFFFFF;
  border: none;
  border-radius: 980px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
  transition: all 0.3s ease;
}

.btn-deep-blue:hover {
  background: #132d4f;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(11, 31, 58, 0.3);
}

/* ============================================
   GRADIENT TEXT — Subtle gold
   ============================================ */
.gradient-text {
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Deep blue heading accent */
.text-deep-blue {
  color: var(--deep-blue);
}

/* Gold accent text */
.text-gold {
  color: var(--accent-gold);
}

/* ============================================
   PRODUCT VIDEO PROTECTION
   ============================================ */
video {
  user-select: none;
  pointer-events: none;
}

.demo-video-player video,
.signature-bloom__video {
  user-select: auto;
  pointer-events: auto;
}

/* Lazy loading images */
img[loading="lazy"] {
  opacity: 0;
  transition: opacity 0.3s ease;
}

img[loading="lazy"].loaded,
img {
  opacity: 1;
}

/* ============================================
   GLASS — Decorative use only (nav, hover)
   NOT for primary readable UI
   ============================================ */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Nav-specific glass */
.glass-nav {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* ============================================
   BLOOM LIST CARD — White-forward merge
   ============================================ */
.bloom-list-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border-default);
  background: var(--surface-white);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s,
              box-shadow 0.4s;
  cursor: pointer;
}

.bloom-list-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-gold-border-hover);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--accent-gold-border);
}

.bloom-list-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  background: #111;
}

.bloom-list-card__media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%);
  z-index: 1;
  pointer-events: none;
}

.bloom-list-card__info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: var(--surface-white);
}

.bloom-list-card__meta {
  flex: 1;
  min-width: 0;
}

.bloom-list-card__tier {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-gold);
  font-family: 'Outfit', sans-serif;
  display: block;
  margin-bottom: 4px;
}

.bloom-list-card__name {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s;
}

.bloom-list-card:hover .bloom-list-card__name {
  color: var(--accent-gold);
}

.bloom-list-card__desc {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 300;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bloom-list-card__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.bloom-list-card__price {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-gold);
}

.bloom-list-card__cta {
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid var(--accent-gold-border);
  border-radius: 980px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-gold);
  font-family: 'Outfit', sans-serif;
  transition: background 0.3s, border-color 0.3s, color 0.3s;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.bloom-list-card:hover .bloom-list-card__cta {
  background: var(--accent-gold);
  color: #FFFFFF;
  border-color: var(--accent-gold);
}

/* Dark background context — flip bloom card to dark mode */
.bg-obsidian .bloom-list-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-on-dark);
}

.bg-obsidian .bloom-list-card__info {
  background: rgba(255, 255, 255, 0.04);
}

.bg-obsidian .bloom-list-card__name {
  color: var(--text-on-dark);
}

.bg-obsidian .bloom-list-card__desc {
  color: var(--text-on-dark-secondary);
}

.bg-obsidian .bloom-list-card:hover {
  box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px var(--accent-gold-border);
}

/* ============================================
   DARK BACKGROUND UTILITY
   ============================================ */
.bg-obsidian {
  background: var(--bg-page);
  color: var(--text-on-dark);
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

/* ============================================
   SCROLLBAR
   ============================================ */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

/* ============================================
   MOBILE-FIRST RULES (STRICT)
   ============================================ */
@media (max-width: 640px) {
  /* Prevent iOS zoom on input focus */
  input,
  textarea,
  select {
    font-size: 16px !important;
  }

  /* Touch-friendly targets — 44px minimum */
  button,
  .btn-primary,
  .btn-secondary,
  a[role="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  body {
    font-size: 16px;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
}

@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* ============================================
   BOTTOM SHEET PANEL SUPPORT (MOBILE)
   White surface, rounded top, internal scroll
   ============================================ */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--surface-white);
  border-radius: 20px 20px 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
}

.bottom-sheet.open {
  transform: translateY(0);
}

.bottom-sheet__body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 20px 120px;
}

.bottom-sheet__footer {
  position: sticky;
  bottom: 0;
  background: var(--surface-white);
  border-top: 1px solid var(--border-default);
  padding: 16px 20px;
  padding-bottom: calc(16px + var(--safe-area-bottom));
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

/* Desktop: convert bottom sheet to side panel */
@media (min-width: 769px) {
  .bottom-sheet {
    top: 0;
    left: auto;
    right: 0;
    width: 520px;
    max-height: 100vh;
    border-radius: 0;
    transform: translateX(100%);
  }

  .bottom-sheet.open {
    transform: translateX(0);
  }
}

/* ============================================
   DEEP BLUE ACCENT USAGE
   Selected states, section headings, premium details
   ============================================ */
.accent-blue-bar {
  display: block;
  width: 40px;
  height: 3px;
  background: var(--deep-blue);
  border-radius: 3px;
  margin-bottom: 12px;
}

.selected-state-blue {
  background: var(--deep-blue-soft);
  border-color: var(--deep-blue);
}
```

---
## 2. src/styles/customizer.css
```css
/* ============================================
   CUSTOMIZER — MOBILE-FIRST BOTTOM SHEET
   Premium slide-up panel with sticky CTA
   ============================================ */

/* ─── OVERLAY ─── */
.customizer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.customizer-overlay.active {
  opacity: 1;
}

/* ─── BOTTOM SHEET (MOBILE-FIRST) ─── */
.customizer-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--surface-white, #FFFFFF);
  border-radius: 20px 20px 0 0;
  max-height: 90vh;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.25);
}

.customizer-sheet.open {
  transform: translateY(0);
}

/* ─── SHEET HEADER ─── */
.customizer-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #EBEBEB;
  flex-shrink: 0;
}

.customizer-sheet__drag-indicator {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: #D1D1D6;
  border-radius: 4px;
}

.customizer-sheet__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: #1D1D1F;
  margin: 0;
}

.customizer-sheet__close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--surface-soft, #F7F7F7);
  border-radius: 50%;
  font-size: 20px;
  color: #6E6E73;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}

.customizer-sheet__close:hover {
  background: #E8E8ED;
  color: #1D1D1F;
}

/* ─── SCROLLABLE BODY ─── */
.customizer-sheet__body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 20px calc(130px + env(safe-area-inset-bottom, 0px));
  overscroll-behavior: contain;
}

/* ─── SECTIONS ─── */
.customizer-section {
  padding: 24px 0;
  border-bottom: 1px solid #F0F0F0;
}

.customizer-section:last-of-type {
  border-bottom: none;
}

.customizer-section__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.customizer-section__number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--spec-gold, #C9A14A);
  color: #FFFFFF;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.customizer-section__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  color: #1D1D1F;
  margin: 0;
}

/* Collapsible delivery section — progressive reveal */
.customizer-section--collapsible {
  border-bottom: none;
}

.customizer-section__toggle-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.customizer-section__toggle-icon {
  width: 24px;
  height: 24px;
  color: #AEAEB2;
  transition: transform 0.25s ease;
}

.customizer-section--collapsible.expanded .customizer-section__toggle-icon {
  transform: rotate(180deg);
}

.customizer-section__collapsible-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}

.customizer-section--collapsible.expanded .customizer-section__collapsible-body {
  max-height: 800px;
}

/* ─── FORM ELEMENTS ─── */
.customizer-field {
  margin-bottom: 16px;
}

.customizer-field:last-child {
  margin-bottom: 0;
}

.customizer-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #3A3A3C;
  margin-bottom: 8px;
  font-family: 'Outfit', sans-serif;
}

.customizer-input,
.customizer-textarea,
.customizer-select {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  font-family: 'Outfit', sans-serif;
  border: 1.5px solid #E5E5EA;
  border-radius: 12px;
  background: var(--surface-soft, #F7F7F7);
  color: #1D1D1F;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
  min-height: 48px;
}

.customizer-input::placeholder,
.customizer-textarea::placeholder {
  color: #AEAEB2;
}

.customizer-input:focus,
.customizer-textarea:focus,
.customizer-select:focus {
  outline: none;
  border-color: var(--spec-gold, #C9A14A);
  box-shadow: 0 0 0 3px rgba(201, 161, 74, 0.1);
}

.customizer-textarea {
  resize: vertical;
  min-height: 88px;
}

.customizer-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236E6E73' d='M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  cursor: pointer;
}

.customizer-hint {
  display: block;
  font-size: 13px;
  color: #AEAEB2;
  margin-top: 6px;
  font-family: 'Outfit', sans-serif;
}

/* ─── COLOR THEME SWATCHES ─── */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}

.theme-swatch {
  background: var(--surface-soft, #F7F7F7);
  border: 2px solid #E5E5EA;
  border-radius: 14px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  min-height: 44px;
}

.theme-swatch:hover {
  border-color: #D1D1D6;
  background: #F0F0F0;
}

/* Restrained gold — only border changes on active, no stacked effects */
.theme-swatch.active {
  border-color: var(--spec-gold, #C9A14A);
  background: var(--surface-soft, #F7F7F7);
}

.theme-colors {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  height: 28px;
}

.theme-colors span {
  flex: 1;
  border-radius: 6px;
}

.theme-name {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #6E6E73;
  font-family: 'Outfit', sans-serif;
}

.theme-swatch.active .theme-name {
  color: var(--spec-gold, #C9A14A);
}

/* ─── EXTRAS TOGGLES ─── */
.extras-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extra-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--surface-soft, #F7F7F7);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 52px;
  border: none;
  width: 100%;
  text-align: left;
}

.extra-toggle:hover {
  background: #EFEFEF;
}

/* Active extra — subtle, not heavy */
.extra-toggle.extra-toggle--active {
  background: rgba(201, 161, 74, 0.05);
  border: 1px solid rgba(201, 161, 74, 0.2);
}

.extra-toggle__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.extra-toggle__icon {
  font-size: 22px;
  width: 36px;
  text-align: center;
}

.extra-toggle__name {
  font-size: 15px;
  font-weight: 600;
  color: #1D1D1F;
  font-family: 'Outfit', sans-serif;
}

.extra-toggle__price {
  font-size: 13px;
  color: #6E6E73;
  font-family: 'Outfit', sans-serif;
}

/* iOS-style toggle switch */
.toggle-switch {
  position: relative;
  width: 51px;
  height: 31px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch__slider {
  position: absolute;
  inset: 0;
  background: #E5E5EA;
  border-radius: 31px;
  transition: background 0.3s;
  cursor: pointer;
}

.toggle-switch__slider::before {
  content: '';
  position: absolute;
  width: 27px;
  height: 27px;
  left: 2px;
  bottom: 2px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-switch input:checked + .toggle-switch__slider {
  background: var(--spec-gold, #C9A14A);
}

.toggle-switch input:checked + .toggle-switch__slider::before {
  transform: translateX(20px);
}

/* ─── DELIVERY SECTION ─── */
.delivery-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.delivery-method {
  padding: 14px;
  border: 1.5px solid #E5E5EA;
  border-radius: 14px;
  background: var(--surface-soft, #F7F7F7);
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #3A3A3C;
  transition: border-color 0.2s, color 0.2s;
  min-height: 48px;
  font-family: 'Outfit', sans-serif;
}

.delivery-method:hover {
  border-color: #D1D1D6;
}

/* Restrained active — border only, no stacked gold */
.delivery-method.active {
  border-color: var(--spec-gold, #C9A14A);
  color: var(--spec-gold, #C9A14A);
  background: var(--surface-soft, #F7F7F7);
}

.delivery-timings {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.delivery-timing {
  padding: 12px 8px;
  border: 1.5px solid #E5E5EA;
  border-radius: 12px;
  background: var(--surface-soft, #F7F7F7);
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #3A3A3C;
  transition: border-color 0.2s, color 0.2s;
  min-height: 44px;
  font-family: 'Outfit', sans-serif;
}

.delivery-timing.active {
  border-color: var(--spec-gold, #C9A14A);
  color: var(--spec-gold, #C9A14A);
}

/* ─── STICKY SUMMARY / CTA ─── */
.customizer-sticky-cta {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 20px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  background: var(--surface-white, #FFFFFF);
  border-top: 1px solid #EBEBEB;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.cta-preview {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #E5E5EA;
}

.cta-preview img,
.cta-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: auto;
}

.cta-pricing {
  flex: 1;
  min-width: 0;
}

.cta-pricing__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6E6E73;
  font-family: 'Outfit', sans-serif;
  margin-bottom: 1px;
}

.cta-pricing__amount {
  font-size: 20px;
  font-weight: 700;
  color: #1D1D1F;
  font-family: 'Outfit', sans-serif;
}

.cta-add-btn {
  padding: 14px 24px;
  background: var(--spec-gold, #C9A14A);
  color: #FFFFFF;
  border: none;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;
  flex-shrink: 0;
  white-space: nowrap;
}

.cta-add-btn:hover {
  background: #B8923F;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(201, 161, 74, 0.25);
}

.cta-add-btn:active {
  transform: scale(0.97);
}

/* ─── EXTRA-SMALL SCREEN (≤375px) ─── */
@media (max-width: 375px) {
  .customizer-sticky-cta {
    padding: 12px 14px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    gap: 8px;
  }

  .cta-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .cta-pricing__amount {
    font-size: 18px;
  }

  .cta-add-btn {
    padding: 12px 18px;
    font-size: 13px;
  }

  .delivery-timings {
    grid-template-columns: 1fr 1fr;
  }

  .theme-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ─── BODY SCROLL LOCK (Safari-safe) ─── */
body.customizer-open {
  overflow: hidden;
  touch-action: none;
}

/* ─── GIFTING FORM ─── */
.gifting-form {
  background: var(--surface-soft, #F7F7F7);
  padding: 20px;
  border-radius: 14px;
  margin-top: 16px;
  border: 1px solid #E5E5EA;
}

.gifting-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1D1D1F;
}

.gifting-subtitle {
  font-size: 14px;
  color: #6E6E73;
  margin: 0 0 16px;
  line-height: 1.5;
}

.gifting-form .form-group {
  margin-bottom: 16px;
}

/* ─── DESKTOP — RIGHT-SIDE PANEL (POLISHED) ─── */
@media (min-width: 769px) {
  .customizer-sheet {
    top: 0;
    bottom: 0;
    left: auto;
    right: 0;
    width: 480px;
    max-height: 100vh;
    border-radius: 0;
    transform: translateX(100%);
    box-shadow: -12px 0 40px rgba(0, 0, 0, 0.1);
  }

  .customizer-sheet.open {
    transform: translateX(0);
  }

  .customizer-sheet__drag-indicator {
    display: none;
  }

  .customizer-sheet__header {
    padding: 24px 32px;
    border-bottom: 1px solid #EBEBEB;
  }

  .customizer-sheet__title {
    font-size: 22px;
  }

  .customizer-sheet__body {
    padding: 0 32px calc(100px + env(safe-area-inset-bottom, 0px));
  }

  .customizer-section {
    padding: 28px 0;
  }

  .customizer-sticky-cta {
    padding: 20px 32px;
    padding-bottom: 20px;
    gap: 16px;
  }

  .cta-preview {
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }

  .cta-pricing__amount {
    font-size: 22px;
  }
}

@media (min-width: 1200px) {
  .customizer-sheet {
    width: 540px;
  }
}
```

---
## 3. src/styles/landing.css
```css
/* ============================================
   DIGITAL BLOOM — LANDING PAGE STYLES
   Refined, mobile-first, white-forward
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

html {
  scroll-behavior: smooth;
}

/* Landing Container */
.landing-page {
  background: var(--surface-white, #FFFFFF);
  color: var(--text-primary, #1D1D1F);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================
   BUTTONS / CTAs
   ============================================ */
.cta-primary {
  display: inline-block;
  padding: 16px 32px;
  background: var(--accent-gold, #C9A14A);
  color: #FFFFFF;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 980px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  letter-spacing: 0.06em;
  min-height: 48px;
}

.cta-primary:hover {
  background: var(--accent-gold-hover, #B8923F);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 161, 74, 0.25);
}

.cta-secondary {
  display: inline-block;
  padding: 16px 32px;
  background: transparent;
  color: var(--text-primary, #1D1D1F);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 980px;
  border: 1.5px solid var(--border-strong, #D2D2D7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  letter-spacing: 0.05em;
  min-height: 48px;
}

.cta-secondary:hover {
  border-color: var(--accent-gold, #C9A14A);
  color: var(--accent-gold, #C9A14A);
  background: rgba(201, 161, 74, 0.04);
}

/* ============================================
   SECTION TITLES
   ============================================ */
.section-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 16px;
  text-align: center;
  color: var(--text-primary, #1D1D1F);
}

.section-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  text-align: center;
  margin: 0 0 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

/* Shared eyebrow */
.cat-eyebrow {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-gold, #C9A14A);
  display: block;
  text-align: center;
  margin-bottom: 14px;
}

.cat-headline {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  text-align: center;
  margin: 0 0 12px;
}

.cat-subtext {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  text-align: center;
  max-width: 500px;
  margin: 0 auto 48px;
  line-height: 1.7;
}

/* ============================================
   CATEGORY LIST — Primary occasion navigation
   White-forward, clean cards
   ============================================ */
.cat-list-section {
  padding: var(--section-space-mobile, 56px) 0;
  background: var(--surface-soft, #F7F7F7);
}

@media (min-width: 768px) {
  .cat-list-section {
    padding: var(--section-space-desktop, 96px) 0;
  }
}

.cat-list-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

.cat-list-header {
  text-align: center;
  margin-bottom: 48px;
}

.cat-list-eyebrow {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--accent-gold, #C9A14A);
  display: block;
  margin-bottom: 14px;
}

.cat-list-headline {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  margin: 0 0 12px;
  line-height: 1.2;
}

.cat-list-subtext {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Category items */
.cat-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cat-list-item {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.cat-list-item--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Title row */
.cat-list-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 10px;
  border-top: 1px solid var(--border-default, #E5E5EA);
  text-decoration: none;
  transition: border-color 0.3s;
}

.cat-list-item:first-child .cat-list-title-row {
  border-top: none;
}

.cat-list-title-row:hover .cat-list-title-row__name {
  color: var(--accent-gold, #C9A14A);
}

.cat-list-title-row__name {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-primary, #1D1D1F);
  transition: color 0.25s;
}

.cat-list-title-row__arrow {
  opacity: 0.5;
  color: var(--text-muted, #AEAEB2);
  transition: transform 0.25s, opacity 0.25s;
}

.cat-list-title-row:hover .cat-list-title-row__arrow {
  transform: translateX(4px);
  opacity: 1;
  color: var(--accent-gold, #C9A14A);
}

/* Bloom card — white surface */
.cat-list-bloom-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  text-decoration: none;
  overflow: hidden;
  background: var(--surface-white, #FFFFFF);
  border: 1px solid var(--border-default, #E5E5EA);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.35s,
              box-shadow 0.35s;
  min-height: 120px;
}

.cat-list-bloom-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-gold-border, rgba(201, 161, 74, 0.3));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.cat-list-bloom-card__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.cat-list-bloom-card__icon {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.15;
  transition: opacity 0.3s, transform 0.4s;
  overflow: hidden;
  border-radius: inherit;
}

.cat-list-bloom-card__icon video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-list-bloom-card:hover .cat-list-bloom-card__icon {
  opacity: 0.25;
  transform: scale(1.05);
}

.cat-list-bloom-card__info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-list-bloom-card__label {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  letter-spacing: 0.02em;
}

.cat-list-bloom-card__tagline {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  line-height: 1.5;
}

.cat-list-bloom-card__line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.cat-list-bloom-card:hover .cat-list-bloom-card__line {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .cat-list-bloom-card {
    padding: 20px 16px;
    gap: 16px;
    min-height: 100px;
  }

  .cat-list-bloom-card__icon {
    display: none;
  }
}

/* ============================================
   FAQ SECTION
   ============================================ */
.faq-section {
  padding: var(--section-space-mobile, 56px) 0;
  background: var(--surface-white, #FFFFFF);
  border-top: 1px solid var(--border-subtle, #F0F0F0);
}

@media (min-width: 768px) {
  .faq-section {
    padding: var(--section-space-desktop, 96px) 0;
  }
}

.faq-list {
  max-width: 800px;
  margin: 48px auto 0;
}

.faq-item {
  border-bottom: 1px solid var(--border-strong, #D2D2D7);
}

.faq-question {
  width: 100%;
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary, #1D1D1F);
  text-align: left;
  cursor: pointer;
  transition: color 0.3s;
  min-height: 44px;
}

.faq-question:hover {
  color: var(--accent-gold, #C9A14A);
}

.faq-icon {
  flex-shrink: 0;
  color: var(--accent-gold, #C9A14A);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-answer {
  max-height: 500px;
  padding-bottom: 24px;
}

.faq-answer p {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-secondary, #6E6E73);
  margin: 0;
}

/* ============================================
   FOOTER
   ============================================ */
.landing-footer {
  padding: 64px 0 32px;
  background: var(--bg-page, #0A0A0A);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-content {
  text-align: center;
}

.footer-logo {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.15em;
  margin: 0 0 8px;
  color: #F5F5F7;
}

.footer-tagline {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 300;
  color: rgba(245, 245, 247, 0.4);
  margin: 0 0 32px;
}

.footer-copyright {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: rgba(245, 245, 247, 0.3);
  margin: 0;
}

/* ============================================
   FORM ELEMENTS
   ============================================ */
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1.5px solid var(--border-default, #E5E5EA);
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  background: var(--surface-soft, #F7F7F7);
  color: var(--text-primary, #1D1D1F);
  transition: border-color 0.3s;
  box-sizing: border-box;
  min-height: 48px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-gold, #C9A14A);
  box-shadow: 0 0 0 3px rgba(201, 161, 74, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted, #AEAEB2);
}

/* ============================================
   TWO WAYS TO BLOOM — White card surfaces
   ============================================ */
.two-ways-section {
  padding: var(--section-space-mobile, 56px) 0;
  background: var(--surface-soft, #F7F7F7);
  border-top: 1px solid var(--border-subtle, #F0F0F0);
}

@media (min-width: 768px) {
  .two-ways-section {
    padding: var(--section-space-desktop, 96px) 0;
  }
}

.two-ways-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.two-ways-card {
  background: var(--surface-white, #FFFFFF);
  border: 1px solid var(--border-default, #E5E5EA);
  border-radius: 20px;
  padding: 32px 24px;
  text-decoration: none;
  color: var(--text-primary, #1D1D1F);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.two-ways-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  border-color: var(--border-strong, #D2D2D7);
}

.two-ways-card--gold {
  border-color: var(--accent-gold-border, rgba(201, 161, 74, 0.2));
}

.two-ways-card--gold:hover {
  border-color: var(--accent-gold-border-hover, rgba(201, 161, 74, 0.4));
  box-shadow: 0 12px 40px rgba(201, 161, 74, 0.08);
}

.two-ways-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--surface-soft, #F7F7F7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--text-primary, #1D1D1F);
}

.two-ways-card--gold .two-ways-icon {
  background: rgba(201, 161, 74, 0.08);
  color: var(--accent-gold, #C9A14A);
}

.two-ways-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px;
}

.two-ways-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  line-height: 1.7;
  margin: 0 0 20px;
  flex: 1;
}

.two-ways-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-gold, #C9A14A);
  letter-spacing: 0.04em;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .cta-primary,
  .cta-secondary {
    width: 100%;
    text-align: center;
  }

  .section-title {
    text-align: center;
  }

  .section-subtitle {
    text-align: center;
  }
}

@media (max-width: 640px) {
  .two-ways-grid {
    grid-template-columns: 1fr;
  }

  .two-ways-card {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .landing-container {
    padding: 0 16px;
  }
}
```

---
## 4. src/styles/success.css
```css
/* ============================================
   SUCCESS / CONFIRMATION PAGE
   Clean vertical layout, emotional tone
   ============================================ */

.success-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--surface-soft, #F7F7F7);
  color: var(--text-primary, #1D1D1F);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  padding-top: max(24px, env(safe-area-inset-top, 24px));
}

/* Center on taller screens, top-align on short screens */
@media (min-height: 700px) {
  .success-page {
    align-items: center;
  }
}

.success-container {
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Loading */
.success-loading {
  text-align: center;
  padding: 40px;
}

.success-spinner {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-default, #E5E5EA);
  border-top: 2px solid var(--accent-gold, #C9A14A);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-loading-text {
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted, #AEAEB2);
  font-family: 'Outfit', sans-serif;
}

/* Error */
.success-error-card {
  background: var(--surface-white, #FFFFFF);
  border: 1px solid #FCA5A5;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  max-width: 420px;
  margin: 0 auto;
}

.success-error-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  margin-bottom: 12px;
}

.success-error-msg {
  color: var(--text-secondary, #6E6E73);
  font-size: 15px;
  margin-bottom: 24px;
}

/* Header */
.success-header {
  text-align: center;
  padding: 20px 0;
}

.success-check {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(201, 161, 74, 0.1);
  border: 1px solid rgba(201, 161, 74, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 12px;
  color: var(--text-primary, #1D1D1F);
}

.success-subtitle {
  font-size: 15px;
  color: var(--text-secondary, #6E6E73);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
}

/* Cards */
.success-card {
  background: var(--surface-white, #FFFFFF);
  border: 1px solid var(--border-subtle, #F0F0F0);
  border-radius: 20px;
  padding: var(--card-padding-mobile, 20px);
}

@media (min-width: 768px) {
  .success-card {
    padding: var(--card-padding-desktop, 24px);
  }
}

.success-card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-gold, #C9A14A);
  margin-bottom: 16px;
  font-family: 'Outfit', sans-serif;
}

.success-card-text {
  font-size: 15px;
  color: var(--text-secondary, #6E6E73);
  line-height: 1.6;
  margin-bottom: 20px;
  font-family: 'Outfit', sans-serif;
}

/* Rows */
.success-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-subtle, #F0F0F0);
}

.success-row-last {
  border-bottom: none;
}

.success-row-label {
  font-size: 14px;
  color: var(--text-secondary, #6E6E73);
  font-family: 'Outfit', sans-serif;
}

.success-row-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  font-family: 'Outfit', sans-serif;
}

.success-row-mono {
  font-family: 'SF Mono', 'Menlo', monospace;
}

.success-row-gold {
  font-size: 20px;
  font-weight: 600;
  color: var(--accent-gold, #C9A14A);
}

.success-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-gold, #C9A14A);
  background: rgba(201, 161, 74, 0.1);
  border: 1px solid rgba(201, 161, 74, 0.2);
  border-radius: 20px;
  padding: 5px 14px;
  font-family: 'Outfit', sans-serif;
}

/* Download */
.success-btn-gold {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: var(--accent-gold, #C9A14A);
  color: #FFFFFF;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  min-height: 52px;
  transition: all 0.2s;
}

.success-btn-gold:hover {
  background: var(--accent-gold-hover, #B8923F);
}

.success-note {
  font-size: 12px;
  color: var(--text-muted, #AEAEB2);
  text-align: center;
  margin-top: 12px;
  font-style: italic;
}

.success-expired {
  font-size: 14px;
  color: #EF4444;
  text-align: center;
}

/* Status list */
.success-status-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 14px;
  color: var(--text-secondary, #6E6E73);
  line-height: 1.5;
  font-family: 'Outfit', sans-serif;
}

/* Share */
.success-share-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.success-share-btn {
  padding: 12px 18px;
  background: var(--surface-soft, #F7F7F7);
  border: 1px solid var(--border-default, #E5E5EA);
  border-radius: 12px;
  color: var(--text-secondary, #6E6E73);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
  min-height: 44px;
  flex: 1;
  min-width: 90px;
  text-align: center;
}

.success-share-btn:hover {
  border-color: var(--accent-gold, #C9A14A);
  color: var(--accent-gold, #C9A14A);
  background: rgba(201, 161, 74, 0.04);
}

/* Actions */
.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.success-btn-primary {
  display: block;
  width: 100%;
  padding: 16px;
  background: var(--deep-blue, #0B1F3A);
  border: none;
  border-radius: 14px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  min-height: 52px;
  transition: all 0.2s;
}

.success-btn-primary:hover {
  background: #132d4f;
}

.success-btn-outline {
  display: inline-block;
  padding: 14px 32px;
  background: transparent;
  border: 1.5px solid var(--border-strong, #D2D2D7);
  border-radius: 14px;
  color: var(--text-primary, #1D1D1F);
  font-size: 14px;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  min-height: 48px;
  transition: all 0.2s;
}

.success-btn-outline:hover {
  border-color: var(--accent-gold, #C9A14A);
  color: var(--accent-gold, #C9A14A);
}

/* Brand */
.success-brand {
  text-align: center;
  padding: 24px 0;
}

.success-brand-name {
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted, #AEAEB2);
  margin-bottom: 4px;
  font-family: 'Outfit', sans-serif;
}

.success-brand-sub {
  font-size: 10px;
  color: var(--border-strong, #D2D2D7);
  font-family: 'Outfit', sans-serif;
}

/* Narrow phone share buttons */
@media (max-width: 375px) {
  .success-share-btn {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 70px;
  }
}
```

---
## 5. src/styles/gallery.css
```css
/* ============================================
   GALLERY / SHOP PAGE
   White-forward, polished grid layout
   ============================================ */

.gallery-page {
  min-height: 100vh;
  background: var(--surface-soft, #F7F7F7);
  padding-bottom: 80px;
}

.gallery-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 768px) {
  .gallery-container {
    padding: 0 32px;
  }
}

@media (min-width: 1200px) {
  .gallery-container {
    padding: 0 48px;
  }
}

/* ── PAGE HEADER ── */
.gallery-header {
  padding: 32px 0 24px;
  border-bottom: 1px solid var(--border-default, #E5E5EA);
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .gallery-header {
    padding: 48px 0 32px;
    margin-bottom: 48px;
  }
}

.gallery-header__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(24px, 5vw, 40px);
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  letter-spacing: 0.02em;
  margin: 0 0 8px;
  line-height: 1.2;
}

.gallery-header__count {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary, #6E6E73);
  margin: 0;
  letter-spacing: 0.02em;
}

/* ── EMPTY STATE ── */
.gallery-empty {
  text-align: center;
  padding: 64px 24px;
  background: var(--surface-white, #FFFFFF);
  border-radius: 20px;
  border: 1px solid var(--border-subtle, #F0F0F0);
}

.gallery-empty__icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.gallery-empty__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  margin: 0 0 10px;
}

.gallery-empty__text {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: var(--text-secondary, #6E6E73);
  margin: 0 0 24px;
}

.gallery-empty__cta {
  display: inline-block;
  padding: 14px 32px;
  background: var(--accent-gold, #C9A14A);
  color: #FFFFFF;
  border-radius: 980px;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  transition: all 0.2s;
}

.gallery-empty__cta:hover {
  background: var(--accent-gold-hover, #B8923F);
}

/* ── SECTIONS ── */
.gallery-sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

@media (min-width: 768px) {
  .gallery-sections {
    gap: 64px;
  }
}



/* Section header: title + see all on one line */
.gallery-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle, #F0F0F0);
  margin-bottom: 24px;
}

.gallery-section__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 600;
  color: var(--text-primary, #1D1D1F);
  margin: 0;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.gallery-section__tagline {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: var(--text-secondary, #6E6E73);
  margin: 4px 0 0;
  line-height: 1.5;
}

.gallery-section__see-all {
  flex-shrink: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-gold, #C9A14A);
  text-decoration: none;
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: color 0.2s;
  padding-bottom: 2px;
}

.gallery-section__see-all:hover {
  color: var(--accent-gold-hover, #B8923F);
}

/* ── PRODUCT GRID ── */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
}

@media (min-width: 1280px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }
}
```

---
## 6. src/components/Customizer.jsx
```jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'balloon', icon: '🎈', name: 'Balloons', price: 2.99 },
  { id: 'ribbon', icon: '🎀', name: 'Ribbon Wrap', price: 1.99 },
  { id: 'sparkle', icon: '✨', name: 'Sparkle Effect', price: 3.99 },
];

const COLOR_THEMES = [
  { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
  { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
  { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
  { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] },
];

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {} }) => {
  const { messagePlaceholder, toPlaceholder, ...stateDefaults } = defaults;
  const scrollPosRef = useRef(0);

  // Clean, minimal state
  const [message, setMessage] = useState({
    short: stateDefaults.short || '',
    toName: stateDefaults.toName || '',
    fromName: stateDefaults.fromName || '',
  });
  const [colorTheme, setColorTheme] = useState(stateDefaults.colorTheme || 'original');
  const [extras, setExtras] = useState({ balloon: false, ribbon: false, sparkle: false });

  // Safari-safe scroll lock
  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.classList.add('customizer-open');
    } else {
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosRef.current);
    }
    return () => {
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Scoped theme
  const themeStyle = useMemo(() => {
    const specs = {
      original: { color: '#FF69B4' },
      warm:     { color: '#FF6B6B' },
      cool:     { color: '#4ECDC4' },
      elegant:  { color: '#D4AF37' },
      romantic: { color: '#C41E3A' },
    };
    return specs[colorTheme] || specs.original;
  }, [colorTheme]);

  const handleMessageChange = useCallback((field, value) => {
    setMessage(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleExtra = useCallback((extraId) => {
    setExtras(prev => ({ ...prev, [extraId]: !prev[extraId] }));
  }, []);

  // Pricing
  const basePrice = parseFloat(product?.price || 0);
  const extrasTotal = EXTRAS.reduce((sum, e) => sum + (extras[e.id] ? e.price : 0), 0);
  const totalPrice = basePrice + extrasTotal;
  const isProductValid = Boolean(product?.id && basePrice > 0);

  // Non-blocking Add to Cart
  const handleComplete = useCallback(() => {
    if (!isProductValid) return;
    // Fire-and-forget theme save
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('digital_bloom_themes').insert([{
            user_id: user.id, theme_name: colorTheme, primary_color: themeStyle.color,
          }]);
        }
      } catch (err) { console.error('Theme save (non-blocking):', err); }
    })();
    onComplete({ productId: product.id, message, colorTheme, extras, totalPrice });
    onClose();
  }, [isProductValid, product, message, colorTheme, extras, totalPrice, themeStyle, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={`customizer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} role="presentation" />

      <div className={`customizer-sheet ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Customize your experience">
        <div className="customizer-sheet__drag-indicator" />

        {/* Header */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">Customize</h2>
          <button type="button" className="customizer-sheet__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body — streamlined: Message → Style → Extras */}
        <div className="customizer-sheet__body">

          {/* ── MESSAGE (simplified — just short msg + to/from) ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">1</span>
              <h3 className="customizer-section__title">Your Message</h3>
            </div>

            <div className="customizer-field">
              <input
                id="cust-msg"
                type="text"
                className="customizer-input"
                placeholder={messagePlaceholder || 'e.g., Happy Birthday!'}
                maxLength="80"
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
              />
              <span className="customizer-hint">{message.short.length}/80</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-to">To</label>
                <input id="cust-to" type="text" className="customizer-input"
                  placeholder={toPlaceholder || 'Recipient'}
                  value={message.toName}
                  onChange={(e) => handleMessageChange('toName', e.target.value)} />
              </div>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-from">From</label>
                <input id="cust-from" type="text" className="customizer-input"
                  placeholder="Your name"
                  value={message.fromName}
                  onChange={(e) => handleMessageChange('fromName', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── STYLE ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">2</span>
              <h3 className="customizer-section__title">Style</h3>
            </div>
            <div className="theme-grid" role="radiogroup" aria-label="Color theme">
              {COLOR_THEMES.map(theme => (
                <button key={theme.id} type="button" role="radio" aria-checked={colorTheme === theme.id}
                  className={`theme-swatch ${colorTheme === theme.id ? 'active' : ''}`}
                  onClick={() => setColorTheme(theme.id)}>
                  <div className="theme-colors">
                    <span style={{ background: theme.colors[0] }} />
                    <span style={{ background: theme.colors[1] }} />
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── EXTRAS ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">3</span>
              <h3 className="customizer-section__title">Extras</h3>
            </div>
            <div className="extras-grid">
              {EXTRAS.map(extra => (
                <button key={extra.id} type="button"
                  className={`extra-toggle ${extras[extra.id] ? 'extra-toggle--active' : ''}`}
                  onClick={() => toggleExtra(extra.id)}
                  aria-pressed={extras[extra.id]}
                  aria-label={`${extra.name} — $${extra.price.toFixed(2)}`}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon" aria-hidden="true">{extra.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{extra.name}</span>
                      <span className="extra-toggle__price">+${extra.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="toggle-switch" aria-hidden="true">
                    <input type="checkbox" tabIndex={-1} checked={extras[extra.id]} readOnly />
                    <span className="toggle-switch__slider" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STICKY CTA ── */}
        <div className="customizer-sticky-cta">
          <div className="cta-preview">
            {product?.image_url && <img src={product.image_url} alt={product?.name || 'Preview'} />}
          </div>
          <div className="cta-pricing">
            <div className="cta-pricing__label">Total</div>
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          <button type="button" className="cta-add-btn" onClick={handleComplete}
            disabled={!isProductValid} aria-label={`Add to cart for $${totalPrice.toFixed(2)}`}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Customizer;
```

---
## 7. src/components/ProductDetails.jsx
```jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import Customizer from './Customizer';
import OCCASIONS from '../data/occasions';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { product, loading } = useProduct(id);
  const { products } = useProducts();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(f => f.category === product.category && f.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const customizerDefaults = useMemo(() => {
    if (!product?.category) return {};
    const occasion = OCCASIONS[product.category];
    return occasion?.customizerDefaults || {};
  }, [product?.category]);

  // Auto-dismiss success after 6 seconds
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 6000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const openCustomizer = useCallback(() => {
    setShowSuccess(false);
    setIsCustomizerOpen(true);
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--border-default)] border-t-[var(--accent-gold)] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-display text-[var(--text-primary)] mb-6">Product not found.</h2>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-[12px] uppercase tracking-widest border border-[var(--border-default)] text-white hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleCustomizationComplete = (customization) => {
    addToCart(product, 1, customization);
    setShowSuccess(true);
  };

  const heroVideoSrc = product.video_file_url || product.video_url;
  const heroImageSrc = product.image_url;
  const displayPrice = Number(product.price || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[var(--surface-soft,#F7F7F7)] text-[var(--text-primary)]">
      {/* Customizer Panel */}
      <Customizer
        key={product.id}
        product={product}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onComplete={handleCustomizationComplete}
        defaults={customizerDefaults}
      />

      {/* ── HERO MEDIA ── */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/7] overflow-hidden bg-black">
        {heroVideoSrc ? (
          <video
            src={heroVideoSrc}
            autoPlay muted loop playsInline preload="auto"
            poster={heroImageSrc}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : heroImageSrc ? (
          <img src={heroImageSrc} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back */}
        <button type="button" onClick={goBack}
          className="absolute top-6 left-5 z-10 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          aria-label="Go back">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category */}
        {product.category && (
          <div className="absolute top-6 right-5 z-10 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-medium">{product.category}</span>
          </div>
        )}
      </div>

      {/* ── PRODUCT INFO — More breathing room ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 -mt-8 relative z-10 pb-24">

        {/* Title + Price Card — generous padding */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-7 sm:p-10 shadow-lg mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#1D1D1F] mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-semibold text-[var(--accent-gold)] mb-5">
            ${displayPrice}
          </p>
          {product.description && (
            <p className="text-base text-[#6E6E73] leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* PRIMARY CTA — more padding/presence */}
          <button
            type="button"
            onClick={openCustomizer}
            className="w-full py-4.5 rounded-full text-[15px] font-bold tracking-[0.08em] uppercase transition-all bg-[var(--accent-gold)] text-white hover:brightness-110 shadow-lg active:scale-[0.98]"
            style={{ padding: '18px 0' }}
          >
            Customize Experience
          </button>

          {/* Feature labels — clearer and readable */}
          <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
            {['Digital Experience', 'Instant Delivery', 'Personalized'].map((label, i) => (
              <span key={i} className="text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── SUCCESS TOAST — Premium brand-aligned ── */}
        {showSuccess && (
          <div className="bg-[var(--surface-white)] rounded-2xl p-7 shadow-lg mb-8 animate-fade-in border border-[var(--accent-gold-border)]">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[rgba(201,161,74,0.1)] border border-[rgba(201,161,74,0.25)] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-display font-semibold text-[#1D1D1F]">Added to Your Cart</p>
                <p className="text-sm text-[#6E6E73] mt-1">Your personalized bloom is ready.</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => { setShowSuccess(false); toggleCart(); }}
                className="w-full py-4 rounded-full text-[14px] font-bold tracking-[0.08em] uppercase bg-[var(--accent-gold)] text-white hover:brightness-110 transition-all"
              >
                View Cart & Checkout
              </button>
              <Link
                to="/shop"
                className="block w-full py-3.5 rounded-full text-[13px] font-medium tracking-[0.08em] uppercase text-center border border-[#E5E5EA] text-[#6E6E73] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* ── Details Card — clear separation ── */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-7 sm:p-10 shadow-lg mb-8">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent-gold)] font-bold mb-5">Details</h3>
          {[
            { label: 'Format', value: 'Digital Video Experience' },
            { label: 'Delivery', value: 'Instant Digital Download' },
            { label: 'Access', value: 'Lifetime — download anytime' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-[#F0F0F0] last:border-b-0">
              <span className="text-[14px] text-[#6E6E73]">{item.label}</span>
              <span className="text-[14px] font-medium text-[#1D1D1F]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
          <h2 className="text-2xl font-display font-medium text-[var(--text-primary)] mb-8 tracking-tight">
            You may also like
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
            {relatedProducts.map(flower => (
              <div key={flower.id} className="min-w-[260px] snap-start sm:min-w-0">
                <ProductCard product={flower} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
```

---
## 8. src/components/ProductCard.jsx
```jsx
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const ProductCard = ({ product, compact = false }) => {
  const displayPrice = Number(product?.price || 0).toFixed(2);

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-[var(--surface-soft,#F7F7F7)] border border-[#E5E5EA] transition-all duration-500 group-hover:shadow-xl group-hover:border-[var(--accent-gold)]/30 ${compact ? 'rounded-xl aspect-square' : 'rounded-2xl aspect-[3/4]'}`}>
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
            <VideoPlayer
              videoUrl={product.video_file_url || product.video_url}
              posterUrl={product.image_url}
              alt={product.name}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-500" />

          {/* CTA — visible on mobile AND hover on desktop */}
          {!compact && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-400">
              <div className="px-7 py-3 bg-[var(--accent-gold)] rounded-full text-[12px] uppercase tracking-[0.12em] font-bold text-white shadow-lg">
                Customize
              </div>
            </div>
          )}
        </div>

        {/* Product Info — White card surface */}
        <div className={`bg-[var(--surface-white,#FFFFFF)] rounded-xl border border-[#F0F0F0] ${compact ? 'p-3 mt-2' : 'p-4 mt-3'}`}>
          <h3 className={`font-semibold text-[#1D1D1F] group-hover:text-[var(--accent-gold)] transition-colors duration-300 tracking-tight truncate ${compact ? 'text-xs' : 'text-[15px]'}`}>
            {product.name}
          </h3>
          {!compact && (
            <>
              <p className="text-[13px] text-[#6E6E73] mt-1.5 line-clamp-1 font-light">
                {product.description || product.category || 'Digital Experience'}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
                <span className="text-base font-bold text-[var(--accent-gold)]">
                  ${displayPrice}
                </span>
                <span className="text-[11px] uppercase tracking-[0.1em] text-[#AEAEB2] font-semibold">
                  Customize →
                </span>
              </div>
            </>
          )}
          {compact && (
            <span className="text-xs font-bold text-[var(--accent-gold)] mt-1 block">
              ${displayPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
```

---
## 9. src/components/ProductGrid.jsx
```jsx
import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PRICING_TIERS } from '../config/pricingTiers';
import '../styles/gallery.css';

const CATEGORY_DISPLAY = {
  'mothers-day': { label: "Mother's Day Collection", tagline: 'Celebrate the woman who gave you everything', emoji: '🌸' },
  'birthday': { label: 'Birthday Collection', tagline: 'Make their special day unforgettable', emoji: '🎂' },
  'love': { label: 'Love & Romance', tagline: 'Express your deepest feelings', emoji: '❤️' },
  'valentine': { label: "Valentine's Day", tagline: 'For the one who has your heart', emoji: '💕' },
  'celebration': { label: 'Congratulations', tagline: 'Celebrate their achievements in style', emoji: '🎉' },
  'grief': { label: 'Memorial & Sympathy', tagline: 'Honor those we hold dear', emoji: '🕊️' },
  'friendship': { label: 'Thinking of You', tagline: 'Let them know they matter', emoji: '💐' },
  'luxury': { label: 'Glass Stiletto Series', tagline: 'Where fashion meets floral artistry', emoji: '👠' },
  'zodiac': { label: 'Zodiac Collection', tagline: 'Written in the stars', emoji: '✨' },
  'general': { label: 'General Collection', tagline: 'Beautiful blooms for every moment', emoji: '🌷' },
};

const ProductGrid = ({ searchQuery = '', category = null }) => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const tierFilter = searchParams.get('tier') ? parseInt(searchParams.get('tier')) : null;
  const categoryFilter = category || searchParams.get('category') || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === null || product.tier === tierFilter;
      const matchesCategory = !categoryFilter || product.category === categoryFilter;

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [products, searchQuery, tierFilter, categoryFilter]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const categoryOrder = [
    'mothers-day', 'birthday', 'love', 'valentine',
    'celebration', 'grief', 'friendship', 'luxury', 'zodiac', 'general'
  ];

  const orderedCategories = categoryOrder.filter(cat => groupedProducts[cat]?.length > 0);

  const activeTierLabel = tierFilter
    ? PRICING_TIERS.find((t) => t.tier === tierFilter)?.name
    : null;

  const activeCategoryLabel = categoryFilter
    ? CATEGORY_DISPLAY[categoryFilter]?.label || categoryFilter
    : null;

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[#E5E5EA] border-t-[var(--accent-gold)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#6E6E73] font-light tracking-wide">Loading collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">

        {/* ── PAGE HEADER ── */}
        <header className="gallery-header">
          <div className="gallery-header__meta">
            <h1 className="gallery-header__title">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategoryLabel || (activeTierLabel ? `${activeTierLabel} Gallery` : 'Digital Gallery')}
            </h1>
            <p className="gallery-header__count">
              {filteredProducts.length} experience{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {/* ── EMPTY STATE ── */}
        {filteredProducts.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty__icon">🌸</div>
            <h3 className="gallery-empty__title">No experiences found</h3>
            <p className="gallery-empty__text">Try a different search or browse all collections.</p>
            <Link to="/shop" className="gallery-empty__cta">Browse All</Link>
          </div>
        ) : (
          /* ── CATEGORY SECTIONS ── */
          <div className="gallery-sections">
            {orderedCategories.map((catId) => {
              const catInfo = CATEGORY_DISPLAY[catId] || { label: catId, tagline: '', emoji: '🌷' };
              const catProducts = groupedProducts[catId];
              const showHeader = !categoryFilter && orderedCategories.length > 1;

              return (
                <section key={catId} className="gallery-section">
                  {showHeader && (
                    <div className="gallery-section__header">
                      <div className="gallery-section__info">
                        <h2 className="gallery-section__title">
                          {catInfo.label}
                        </h2>
                        <p className="gallery-section__tagline">{catInfo.tagline}</p>
                      </div>
                      <Link
                        to={`/shop?category=${catId}`}
                        className="gallery-section__see-all"
                      >
                        See all →
                      </Link>
                    </div>
                  )}

                  <div className="gallery-grid">
                    {catProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
```

---
## 10. src/components/landing/VideoHero.jsx
```jsx
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Auto-detect the nearest upcoming (or current) holiday for a subtle banner
function getUpcomingHoliday() {
  const now = new Date();
  const year = now.getFullYear();

  function nthWeekday(yr, mo, weekday, n) {
    const d = new Date(yr, mo - 1, 1);
    let count = 0;
    while (d.getMonth() === mo - 1) {
      if (d.getDay() === weekday) {
        count++;
        if (count === n) return new Date(d);
      }
      d.setDate(d.getDate() + 1);
    }
    return null;
  }

  const holidays = [
    { name: "Happy New Year",          label: "New Year's Day",    date: new Date(year, 0, 1) },
    { name: "Happy Valentine's Day",   label: "Valentine's Day",   date: new Date(year, 1, 14) },
    { name: "Happy Mother's Day",      label: "Mother's Day",      date: nthWeekday(year, 5, 0, 2) },
    { name: "Happy Father's Day",      label: "Father's Day",      date: nthWeekday(year, 6, 0, 3) },
    { name: "Merry Christmas",         label: "Christmas",         date: new Date(year, 11, 25) },
  ].filter(h => h.date);

  const today = new Date(year, now.getMonth(), now.getDate());
  holidays.sort((a, b) => a.date - b.date);

  const active = holidays.find(h => {
    const diff = (h.date - today) / (1000 * 60 * 60 * 24);
    return diff >= -3 && diff <= 30;
  });

  return active || null;
}

export default function VideoHero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const holiday = useMemo(() => getUpcomingHoliday(), []);

  // Simplified intro — content visible quickly, no long cinematic wait
  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Play video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const scrollToContent = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      const next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section ref={heroRef} className="video-hero">
        {/* Video Background — with graceful fallback */}
        <div className="video-hero__bg">
          <div className="video-hero__video-wrap">
            {!videoFailed && (
              <video
                ref={videoRef}
                className="video-hero__video"
                autoPlay
                muted
                loop
                playsInline
                poster="/videos/hero_bloom_poster.jpg"
                preload="auto"
                onCanPlay={() => setVideoLoaded(true)}
                onError={() => setVideoFailed(true)}
              >
                <source src="/videos/digital_bloom_hero_morph.mp4" type="video/mp4" />
              </video>
            )}
            {/* Fallback: poster image if video fails */}
            {(videoFailed || !videoLoaded) && (
              <img
                src="/videos/hero_bloom_poster.jpg"
                alt="Digital Bloom"
                className="video-hero__fallback-img"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: videoLoaded ? -1 : 0,
                }}
              />
            )}
          </div>
          <div className="video-hero__overlay" />
        </div>

        {/* Text Content — visible immediately on mobile */}
        <div
          className="video-hero__content"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Holiday banner — subtle, secondary */}
          {holiday && (
            <div className="video-hero__banner" style={{ marginBottom: '16px' }}>
              <span className="video-hero__banner-title">{holiday.name}</span>
            </div>
          )}

          <h1 className="video-hero__title">
            Digital Bloom
          </h1>
          <p className="video-hero__tagline">
            Give Them Their Flowers While They&rsquo;re Here
          </p>
          <div className="video-hero__cta-wrap">
            <Link to="/shop" className="video-hero__btn">
              <span className="video-hero__btn-text">Start Your Bloom</span>
              <span className="video-hero__btn-shimmer" />
              <span className="video-hero__btn-glow" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          type="button"
          className="video-hero__scroll-indicator"
          onClick={scrollToContent}
          aria-label="Scroll down"
          style={{
            opacity: contentVisible ? 0.7 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}
        >
          <span className="video-hero__scroll-text">Scroll</span>
          <svg
            className="video-hero__chevron"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      {/* Scroll fade */}
      <div className="video-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
```

---
## 11. src/pages/Success.jsx
```jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus } from '../lib/supabase';
import '../styles/success.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPurchase = async () => {
      if (!sessionId) {
        setError('Session token unavailable.');
        setIsProcessing(false);
        return;
      }

      try {
        const updatedPurchase = await updatePurchaseStatus(sessionId, 'completed', {
          stripe_session_id: sessionId
        });
        if (updatedPurchase) setPurchase(updatedPurchase);
      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to process your purchase. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [sessionId]);

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}/shop`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = `${window.location.origin}/shop`;
  const shareText = encodeURIComponent('I just sent a luxury digital bloom ✨ Check it out! #DigitalBloom');

  if (isProcessing) {
    return (
      <div className="success-page">
        <div className="success-loading">
          <div className="success-spinner" />
          <p className="success-loading-text">Preparing Your Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-error-card">
          <h2 className="success-error-title">Something Went Wrong</h2>
          <p className="success-error-msg">{error}</p>
          <Link to="/" className="success-btn-outline">Return Home</Link>
        </div>
      </div>
    );
  }

  const displayPrice = Number(purchase?.total_price || 0).toFixed(2);
  const displayId = (purchase?.id || 'N/A').substring(0, 8).toUpperCase();

  return (
    <div className="success-page">
      <div className="success-container">

        {/* ── SUCCESS HEADER ── */}
        <div className="success-header">
          <div className="success-check">
            <svg width="32" height="32" fill="none" stroke="#C9A14A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="success-title">Your Bloom Is On Its Way!</h1>
          <p className="success-subtitle">
            Your experience has been created and is being prepared for delivery.
          </p>
        </div>

        {/* ── ORDER SUMMARY ── */}
        {purchase && (
          <div className="success-card">
            <h3 className="success-card-label">Order Summary</h3>
            <div className="success-row">
              <span className="success-row-label">Order ID</span>
              <span className="success-row-value success-row-mono">{displayId}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">Total</span>
              <span className="success-row-value success-row-gold">${displayPrice}</span>
            </div>
            <div className="success-row success-row-last">
              <span className="success-row-label">Status</span>
              <span className="success-badge">Confirmed ✓</span>
            </div>
          </div>
        )}

        {/* ── YOUR EXPERIENCE ── */}
        <div className="success-card">
          <h3 className="success-card-label">Your Experience</h3>
          {purchase?.download_url ? (
            new Date(purchase.download_expires_at) > new Date() ? (
              <div>
                <p className="success-card-text">Your customized bloom is ready! Download it now or share directly.</p>
                <a href={purchase.download_url} download className="success-btn-gold">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Experience
                </a>
                <p className="success-note">Your download link is valid for 48 hours.</p>
              </div>
            ) : (
              <p className="success-expired">Your download link has expired (48h). Please contact support.</p>
            )
          ) : (
            <div>
              <p className="success-card-text">We're preparing your experience now.</p>
              <ul className="success-status-list">
                <li>✓ Confirmation sent to your email</li>
                <li>⏳ Experience processing (est. 2–4 hours)</li>
                <li>📧 You'll be notified when it's ready</li>
              </ul>
            </div>
          )}
        </div>

        {/* ── SHARE ── */}
        <div className="success-card">
          <h3 className="success-card-label">Share Digital Bloom</h3>
          <div className="success-share-row">
            <button type="button" onClick={copyLink} className="success-share-btn">
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              X
            </button>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="success-actions">
          <Link to="/" className="success-btn-primary">Return to Homepage</Link>
        </div>

        {/* ── BRAND FOOTER ── */}
        <div className="success-brand">
          <p className="success-brand-name">Digital Bloom™</p>
          <p className="success-brand-sub">Digital Gifting Experience</p>
        </div>
      </div>
    </div>
  );
};

export default Success;
```
