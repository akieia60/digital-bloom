# Phase 2 — Full File Contents for Review

Branch: phase-2-customization-engine (NOT on main)
Commit: 414e40e

---

## FILE 1: src/lib/compositionEngine.js
STATUS: NEW
PURPOSE: Core engine that maps customization state → renderable layers. Overlay asset registry with null src (CSS placeholders). Color themes with CSS filters + raw values. registerOverlayAsset() for future real asset swap.

```js
/**
 * Composition Engine
 * 
 * Maps customization state → renderable composition layers.
 * This is the core logic that translates user selections into
 * a visual layer stack for both live preview and fulfillment.
 * 
 * Design notes:
 * - Overlay assets are referenced by ID, resolved to paths at render time
 * - Color treatments are CSS-based for V1, designed for easy swap to real filters
 * - System is decoupled from any storage layer (localStorage, Supabase, etc.)
 */

// ── OVERLAY ASSET REGISTRY ──
// Maps overlay IDs to asset paths. Swap these to real transparent WebM/APNG later.
// V1 uses CSS-animated placeholders when asset path is null.

const OVERLAY_ASSETS = {
  balloon: {
    warm:     { src: null, css: true, label: 'Warm Balloons' },
    cool:     { src: null, css: true, label: 'Cool Balloons' },
    elegant:  { src: null, css: true, label: 'Gold Balloons' },
    romantic: { src: null, css: true, label: 'Rose Balloons' },
    original: { src: null, css: true, label: 'Classic Balloons' },
  },
  ribbon: {
    warm:     { src: null, css: true, label: 'Warm Ribbon' },
    cool:     { src: null, css: true, label: 'Cool Ribbon' },
    elegant:  { src: null, css: true, label: 'Gold Ribbon' },
    romantic: { src: null, css: true, label: 'Rose Ribbon' },
    original: { src: null, css: true, label: 'Classic Ribbon' },
  },
  sparkle: {
    default:  { src: null, css: true, label: 'Sparkle Effect' },
  },
};

// ── COLOR THEME SPECS ──
// Each theme defines CSS filter values for live preview
// and color metadata for fulfillment rendering.

const COLOR_THEMES = {
  original: {
    label: 'Original',
    filter: 'none',
    hueRotate: 0,
    saturate: 1,
    brightness: 1,
    overlayColor: null,
    blendMode: 'normal',
  },
  warm: {
    label: 'Warm Sunset',
    filter: 'sepia(0.15) saturate(1.3) hue-rotate(-10deg)',
    hueRotate: -10,
    saturate: 1.3,
    brightness: 1.05,
    overlayColor: 'rgba(255, 160, 122, 0.12)',
    blendMode: 'overlay',
  },
  cool: {
    label: 'Cool Breeze',
    filter: 'saturate(1.1) hue-rotate(160deg) brightness(1.05)',
    hueRotate: 160,
    saturate: 1.1,
    brightness: 1.05,
    overlayColor: 'rgba(78, 205, 196, 0.1)',
    blendMode: 'overlay',
  },
  elegant: {
    label: 'Elegant Gold',
    filter: 'sepia(0.25) saturate(1.2) brightness(1.08)',
    hueRotate: 0,
    saturate: 1.2,
    brightness: 1.08,
    overlayColor: 'rgba(212, 175, 55, 0.08)',
    blendMode: 'overlay',
  },
  romantic: {
    label: 'Romantic Rose',
    filter: 'saturate(1.4) hue-rotate(-20deg) brightness(1.02)',
    hueRotate: -20,
    saturate: 1.4,
    brightness: 1.02,
    overlayColor: 'rgba(196, 30, 58, 0.08)',
    blendMode: 'overlay',
  },
};

// ── TEXT OVERLAY CONFIG ──

const TEXT_POSITIONS = {
  'bottom-center': { bottom: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  'bottom-left':   { bottom: '12%', left: '8%', textAlign: 'left' },
  'center':        { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
};

// ── MAIN COMPOSITION FUNCTION ──

/**
 * Build a composition layer stack from customization state.
 * 
 * @param {Object} params
 * @param {Object} params.product - Product object (id, video_file_url, image_url, etc.)
 * @param {string} params.colorTheme - Theme ID ('original', 'warm', 'cool', 'elegant', 'romantic')
 * @param {Object} params.extras - { balloon: bool, ribbon: bool, sparkle: bool }
 * @param {Object} params.message - { short: string, toName: string, fromName: string }
 * @returns {Object} Composition descriptor
 */
export function getCompositionLayers({ product, colorTheme = 'original', extras = {}, message = {} }) {
  const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.original;

  // Base media layer
  const baseMedia = {
    type: product?.video_file_url || product?.video_url ? 'video' : 'image',
    src: product?.video_file_url || product?.video_url || product?.image_url || null,
    poster: product?.image_url || null,
  };

  // Overlay layers (only active ones)
  const overlays = [];

  if (extras.balloon) {
    const asset = OVERLAY_ASSETS.balloon[colorTheme] || OVERLAY_ASSETS.balloon.original;
    overlays.push({
      id: 'balloon',
      type: asset.src ? 'video' : 'css',
      src: asset.src,
      themeVariant: colorTheme,
      label: asset.label,
      zIndex: 10,
    });
  }

  if (extras.ribbon) {
    const asset = OVERLAY_ASSETS.ribbon[colorTheme] || OVERLAY_ASSETS.ribbon.original;
    overlays.push({
      id: 'ribbon',
      type: asset.src ? 'video' : 'css',
      src: asset.src,
      themeVariant: colorTheme,
      label: asset.label,
      zIndex: 20,
    });
  }

  if (extras.sparkle) {
    const asset = OVERLAY_ASSETS.sparkle.default;
    overlays.push({
      id: 'sparkle',
      type: asset.src ? 'video' : 'css',
      src: asset.src,
      themeVariant: 'default',
      label: asset.label,
      zIndex: 30,
    });
  }

  // Color treatment layer
  const colorFilter = {
    themeId: colorTheme,
    label: theme.label,
    cssFilter: theme.filter,
    overlayColor: theme.overlayColor,
    blendMode: theme.blendMode,
    // Raw values for fulfillment rendering
    hueRotate: theme.hueRotate,
    saturate: theme.saturate,
    brightness: theme.brightness,
  };

  // Text layer
  const textLayer = message?.short ? {
    text: message.short,
    toName: message.toName || null,
    fromName: message.fromName || null,
    position: 'bottom-center',
    positionStyle: TEXT_POSITIONS['bottom-center'],
    font: 'Playfair Display',
    color: '#FFFFFF',
    shadow: true,
  } : null;

  return {
    baseMedia,
    colorFilter,
    overlays,
    textLayer,
    // Summary for quick display
    activeExtras: overlays.map(o => o.id),
    themeLabel: theme.label,
  };
}

/**
 * Get the CSS filter string for a given theme.
 * Used by LivePreview for the color treatment layer.
 */
export function getThemeFilter(themeId) {
  return (COLOR_THEMES[themeId] || COLOR_THEMES.original).filter;
}

/**
 * Get theme metadata for a given theme ID.
 */
export function getThemeSpec(themeId) {
  return COLOR_THEMES[themeId] || COLOR_THEMES.original;
}

/**
 * Check if an overlay has a real asset (vs CSS placeholder).
 */
export function hasRealAsset(overlayType, themeVariant = 'default') {
  const registry = OVERLAY_ASSETS[overlayType];
  if (!registry) return false;
  const asset = registry[themeVariant] || registry.default || Object.values(registry)[0];
  return asset?.src != null;
}

/**
 * Register a real overlay asset (for future asset swapping).
 * Call this when real transparent WebM/APNG assets are ready.
 * 
 * @param {'balloon'|'ribbon'|'sparkle'} overlayType
 * @param {string} variant - Theme variant or 'default'
 * @param {string} src - Path to the asset file
 */
export function registerOverlayAsset(overlayType, variant, src) {
  if (OVERLAY_ASSETS[overlayType]?.[variant]) {
    OVERLAY_ASSETS[overlayType][variant].src = src;
    OVERLAY_ASSETS[overlayType][variant].css = false;
  }
}

export { COLOR_THEMES, OVERLAY_ASSETS, TEXT_POSITIONS };
```

---

## FILE 2: src/lib/fulfillmentMapper.js
STATUS: NEW
PURPOSE: Generates serializable render-ready manifests for fulfillment. buildFulfillmentManifest() for full server-side spec. buildCartComposition() for lightweight cart storage. Not coupled to any storage layer.

```js
/**
 * Fulfillment Mapper
 * 
 * Translates customization selections into a render-ready specification
 * (manifest) that can drive server-side composition later.
 * 
 * Design notes:
 * - Output is a plain serializable object (JSON-safe)
 * - Not coupled to any storage layer — caller decides where to persist
 * - Designed for future use with FFmpeg, Remotion, or cloud render pipelines
 */

import { getCompositionLayers, getThemeSpec } from './compositionEngine';

/**
 * Build a fulfillment manifest from product + customization data.
 * This manifest describes everything needed to render the final
 * composited output on the server side.
 * 
 * @param {Object} product - Product object from Supabase
 * @param {Object} customization - { message, colorTheme, extras, totalPrice }
 * @returns {Object} Fulfillment manifest
 */
export function buildFulfillmentManifest(product, customization) {
  const { message = {}, colorTheme = 'original', extras = {}, totalPrice = 0 } = customization;
  const theme = getThemeSpec(colorTheme);
  const layers = getCompositionLayers({ product, colorTheme, extras, message });

  // Determine base asset
  const baseVideoUrl = product.video_file_url || product.video_url;
  const baseAsset = {
    type: baseVideoUrl ? 'video' : 'image',
    url: baseVideoUrl || product.image_url || null,
    fallbackImage: product.image_url || null,
    // If video, estimate duration from filename or default
    duration: baseVideoUrl ? estimateVideoDuration(baseVideoUrl) : null,
  };

  // Build overlay instructions
  const overlayInstructions = [];

  if (extras.balloon) {
    overlayInstructions.push({
      type: 'balloon',
      variant: colorTheme,
      asset: getOverlayAssetPath('balloon', colorTheme),
      timing: { start: 0, end: baseAsset.duration || 30 },
      position: 'center',
      opacity: 0.85,
    });
  }

  if (extras.ribbon) {
    overlayInstructions.push({
      type: 'ribbon',
      variant: colorTheme,
      asset: getOverlayAssetPath('ribbon', colorTheme),
      timing: { start: 0, end: baseAsset.duration || 30 },
      position: 'border',
      opacity: 0.7,
    });
  }

  if (extras.sparkle) {
    overlayInstructions.push({
      type: 'sparkle',
      variant: 'default',
      asset: getOverlayAssetPath('sparkle', 'default'),
      timing: { start: 0, end: baseAsset.duration || 30 },
      position: 'full',
      opacity: 0.6,
    });
  }

  // Build color treatment
  const colorTreatment = {
    themeId: colorTheme,
    label: theme.label,
    hueRotate: theme.hueRotate,
    saturate: theme.saturate,
    brightness: theme.brightness,
    overlayColor: theme.overlayColor,
    blendMode: theme.blendMode,
  };

  // Build text overlay
  const textOverlay = message.short ? {
    text: message.short,
    toName: message.toName || null,
    fromName: message.fromName || null,
    font: 'Playfair Display',
    fontSize: 48,
    position: 'bottom-center',
    color: '#FFFFFF',
    shadow: '0 2px 8px rgba(0,0,0,0.6)',
    fadeIn: { start: 0.5, duration: 1.0 },
  } : null;

  // Assemble manifest
  return {
    version: '1.0',
    createdAt: new Date().toISOString(),
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
    },
    baseAsset,
    colorTreatment,
    overlays: overlayInstructions,
    textOverlay,
    output: {
      format: 'mp4',
      resolution: '1080p',
      fps: 30,
      codec: 'h264',
    },
    pricing: {
      basePrice: Number(product.price || 0),
      extrasTotal: totalPrice - Number(product.price || 0),
      totalPrice,
    },
    // Flat summary for quick reference
    summary: {
      theme: theme.label,
      extras: Object.entries(extras).filter(([, v]) => v).map(([k]) => k),
      hasMessage: Boolean(message.short),
      hasTo: Boolean(message.toName),
      hasFrom: Boolean(message.fromName),
    },
  };
}

/**
 * Extract just the composition metadata for cart storage.
 * This is a lighter version of the full manifest — enough to
 * reconstruct the full manifest later from product + this data.
 * 
 * @param {Object} customization - Full customization state
 * @returns {Object} Lightweight composition descriptor
 */
export function buildCartComposition(customization) {
  const { message = {}, colorTheme = 'original', extras = {} } = customization;

  return {
    colorTheme,
    extras: {
      balloon: Boolean(extras.balloon),
      ribbon: Boolean(extras.ribbon),
      sparkle: Boolean(extras.sparkle),
    },
    message: {
      short: message.short || '',
      toName: message.toName || '',
      fromName: message.fromName || '',
    },
    // Active overlay list for quick rendering
    activeOverlays: Object.entries(extras).filter(([, v]) => v).map(([k]) => k),
  };
}

// ── HELPERS ──

/**
 * Estimate video duration from filename conventions.
 * e.g., "mothersday_bloom_45s.mp4" → 45
 * Falls back to 29 seconds (standard bloom length).
 */
function estimateVideoDuration(url) {
  if (!url) return 29;
  const match = url.match(/(\d+)s\./);
  return match ? parseInt(match[1], 10) : 29;
}

/**
 * Get overlay asset path for a given type and variant.
 * Returns null if no real asset exists (CSS placeholder in use).
 */
function getOverlayAssetPath(overlayType, variant) {
  // V1: no real assets yet, return planned paths
  const paths = {
    balloon: `/overlays/balloon/balloon-${variant}.webm`,
    ribbon: `/overlays/ribbon/ribbon-${variant}.webm`,
    sparkle: `/overlays/sparkle/sparkle-default.webm`,
  };
  return paths[overlayType] || null;
}
```

---

## FILE 3: src/components/LivePreview.jsx
STATUS: NEW
PURPOSE: Visual composition component — stacks base media + color filter + conditional overlays (balloon/ribbon/sparkle) + text overlay. Uses CSS placeholders for V1, auto-switches to real video overlays when registered.

```jsx
import { useMemo } from 'react';
import { getCompositionLayers } from '../lib/compositionEngine';
import '../styles/overlays.css';

/**
 * LivePreview — Dynamic composition preview
 * 
 * Renders a stacked layer composition based on customization state.
 * Each layer is conditionally rendered and positioned absolutely.
 * 
 * When real overlay assets (WebM/APNG) are available, the CSS placeholder
 * layers will automatically be replaced — the compositionEngine returns
 * { type: 'video' } for real assets and { type: 'css' } for placeholders.
 */

const BALLOON_EMOJIS = ['🎈', '🎈', '🎈', '🎈', '🎈'];

export default function LivePreview({ product, colorTheme, extras, message, className = '' }) {
  const composition = useMemo(
    () => getCompositionLayers({ product, colorTheme, extras, message }),
    [product, colorTheme, extras, message]
  );

  if (!composition?.baseMedia?.src && !composition?.baseMedia?.poster) {
    return (
      <div className={`composition-preview ${className}`}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0a0a0a)' }} />
      </div>
    );
  }

  const { baseMedia, colorFilter, overlays, textLayer } = composition;

  return (
    <div className={`composition-preview ${className}`}>
      {/* Layer 0: Base Media */}
      <div className="composition-layer--base">
        {baseMedia.type === 'video' ? (
          <video
            src={baseMedia.src}
            poster={baseMedia.poster}
            autoPlay muted loop playsInline
            preload="auto"
            onError={(e) => {
              // Fallback to poster image if video fails
              e.target.style.display = 'none';
              const img = e.target.nextElementSibling;
              if (img) img.style.display = 'block';
            }}
          />
        ) : null}
        {/* Fallback image (hidden if video plays) */}
        {baseMedia.poster && (
          <img
            src={baseMedia.poster}
            alt="Preview"
            style={{ display: baseMedia.type === 'video' ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* Layer 1: Color Filter */}
      {colorFilter.overlayColor && (
        <div
          className="composition-layer--color"
          style={{
            background: colorFilter.overlayColor,
            mixBlendMode: colorFilter.blendMode,
          }}
        />
      )}

      {/* Layer 2+: Dynamic Overlays */}
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="composition-layer--overlay entering"
          style={{ zIndex: overlay.zIndex }}
        >
          {overlay.type === 'video' && overlay.src ? (
            // Real asset overlay (future)
            <video
              src={overlay.src}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // CSS placeholder overlay
            <CSSOverlay overlayId={overlay.id} themeVariant={overlay.themeVariant} />
          )}
        </div>
      ))}

      {/* Layer N: Text Overlay */}
      {textLayer && (
        <div
          className="composition-layer--text"
          style={textLayer.positionStyle}
        >
          <div className="composition-text__message">{textLayer.text}</div>
          {(textLayer.toName || textLayer.fromName) && (
            <div className="composition-text__names">
              {textLayer.toName && `To ${textLayer.toName}`}
              {textLayer.toName && textLayer.fromName && ' · '}
              {textLayer.fromName && `From ${textLayer.fromName}`}
            </div>
          )}
        </div>
      )}

      {/* Subtle vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)',
      }} />
    </div>
  );
}

/**
 * CSS-only overlay placeholders.
 * These render animated CSS effects. When real assets are loaded,
 * the parent renders a <video> instead of this component.
 */
function CSSOverlay({ overlayId, themeVariant }) {
  switch (overlayId) {
    case 'balloon':
      return (
        <div className={`overlay-balloon overlay-balloon--${themeVariant}`}>
          {BALLOON_EMOJIS.map((emoji, i) => (
            <span key={i} className="overlay-balloon__item">{emoji}</span>
          ))}
        </div>
      );

    case 'ribbon':
      return (
        <div className={`overlay-ribbon overlay-ribbon--${themeVariant}`}>
          <div className="overlay-ribbon__border" />
        </div>
      );

    case 'sparkle':
      return (
        <div className="overlay-sparkle">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="overlay-sparkle__particle" />
          ))}
        </div>
      );

    default:
      return null;
  }
}
```

---

## FILE 4: src/styles/overlays.css
STATUS: NEW
PURPOSE: CSS-only placeholder animations for overlays — floating balloons, shimmering ribbon border, scatter sparkle particles, text overlay styling. Temporary scaffolding only.

```css
/* ============================================
   OVERLAY ANIMATIONS — V1 CSS Placeholders
   
   These are temporary CSS-only overlays used until
   real transparent WebM/APNG assets are added.
   When real assets are ready, the LivePreview component
   will render <video> layers instead of these CSS effects.
   ============================================ */

/* ── COMPOSITION CONTAINER ── */
.composition-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.composition-preview--square {
  aspect-ratio: 1 / 1;
}

.composition-preview--landscape {
  aspect-ratio: 16 / 9;
}

/* ── BASE MEDIA LAYER ── */
.composition-layer--base {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.composition-layer--base video,
.composition-layer--base img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── COLOR FILTER LAYER ── */
.composition-layer--color {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  transition: background 0.4s ease, opacity 0.4s ease;
}

/* ── OVERLAY LAYERS (shared) ── */
.composition-layer--overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.composition-layer--overlay.entering {
  animation: overlayFadeIn 0.4s ease forwards;
}

.composition-layer--overlay.exiting {
  animation: overlayFadeOut 0.3s ease forwards;
}

@keyframes overlayFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes overlayFadeOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}

/* ── BALLOON OVERLAY (CSS Placeholder) ── */
.overlay-balloon {
  z-index: 10;
}

.overlay-balloon__item {
  position: absolute;
  font-size: 32px;
  animation: balloonFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}

.overlay-balloon__item:nth-child(1) { left: 15%; bottom: -10%; animation-delay: 0s; animation-duration: 4.2s; }
.overlay-balloon__item:nth-child(2) { left: 40%; bottom: -15%; animation-delay: 0.6s; animation-duration: 3.8s; font-size: 28px; }
.overlay-balloon__item:nth-child(3) { left: 65%; bottom: -8%; animation-delay: 1.2s; animation-duration: 4.5s; }
.overlay-balloon__item:nth-child(4) { left: 85%; bottom: -12%; animation-delay: 0.3s; animation-duration: 3.6s; font-size: 24px; }
.overlay-balloon__item:nth-child(5) { left: 30%; bottom: -18%; animation-delay: 1.8s; animation-duration: 4.0s; font-size: 36px; }

@keyframes balloonFloat {
  0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.9; }
  50%  { transform: translateY(-280px) rotate(8deg); opacity: 0.85; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(-500px) rotate(-5deg); opacity: 0; }
}

/* Balloon colors per theme */
.overlay-balloon--warm .overlay-balloon__item:nth-child(1) { color: #FF6B6B; }
.overlay-balloon--warm .overlay-balloon__item:nth-child(2) { color: #FFA07A; }
.overlay-balloon--warm .overlay-balloon__item:nth-child(3) { color: #FFD700; }
.overlay-balloon--warm .overlay-balloon__item:nth-child(4) { color: #FF8C42; }
.overlay-balloon--warm .overlay-balloon__item:nth-child(5) { color: #FF6B6B; }

.overlay-balloon--cool .overlay-balloon__item:nth-child(1) { color: #4ECDC4; }
.overlay-balloon--cool .overlay-balloon__item:nth-child(2) { color: #95E1D3; }
.overlay-balloon--cool .overlay-balloon__item:nth-child(3) { color: #67C5E5; }
.overlay-balloon--cool .overlay-balloon__item:nth-child(4) { color: #A8E6CF; }
.overlay-balloon--cool .overlay-balloon__item:nth-child(5) { color: #4ECDC4; }

.overlay-balloon--elegant .overlay-balloon__item { color: #D4AF37; }
.overlay-balloon--romantic .overlay-balloon__item { color: #FF69B4; }
.overlay-balloon--original .overlay-balloon__item { color: #FF69B4; }

/* ── RIBBON OVERLAY (CSS Placeholder) ── */
.overlay-ribbon {
  z-index: 20;
}

.overlay-ribbon__border {
  position: absolute;
  inset: 8px;
  border: 2px solid;
  border-radius: 12px;
  opacity: 0.5;
  animation: ribbonShimmer 3s ease-in-out infinite;
}

.overlay-ribbon__corner {
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 0.7;
}

.overlay-ribbon__corner--tl { top: 4px; left: 4px; }
.overlay-ribbon__corner--tr { top: 4px; right: 4px; transform: scaleX(-1); }
.overlay-ribbon__corner--bl { bottom: 4px; left: 4px; transform: scaleY(-1); }
.overlay-ribbon__corner--br { bottom: 4px; right: 4px; transform: scale(-1); }

@keyframes ribbonShimmer {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.6; }
}

.overlay-ribbon--warm .overlay-ribbon__border { border-color: #FFA07A; }
.overlay-ribbon--cool .overlay-ribbon__border { border-color: #4ECDC4; }
.overlay-ribbon--elegant .overlay-ribbon__border { border-color: #D4AF37; }
.overlay-ribbon--romantic .overlay-ribbon__border { border-color: #FF69B4; }
.overlay-ribbon--original .overlay-ribbon__border { border-color: #FFB6C1; }

/* ── SPARKLE OVERLAY (CSS Placeholder) ── */
.overlay-sparkle {
  z-index: 30;
}

.overlay-sparkle__particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255,255,255,0.6);
  animation: sparkleGlow 2s ease-in-out infinite;
}

.overlay-sparkle__particle:nth-child(1)  { top: 12%; left: 20%; animation-delay: 0s; }
.overlay-sparkle__particle:nth-child(2)  { top: 25%; left: 75%; animation-delay: 0.3s; }
.overlay-sparkle__particle:nth-child(3)  { top: 40%; left: 45%; animation-delay: 0.7s; }
.overlay-sparkle__particle:nth-child(4)  { top: 55%; left: 15%; animation-delay: 1.0s; }
.overlay-sparkle__particle:nth-child(5)  { top: 60%; left: 80%; animation-delay: 0.5s; }
.overlay-sparkle__particle:nth-child(6)  { top: 75%; left: 35%; animation-delay: 1.3s; }
.overlay-sparkle__particle:nth-child(7)  { top: 30%; left: 60%; animation-delay: 0.2s; width: 3px; height: 3px; }
.overlay-sparkle__particle:nth-child(8)  { top: 85%; left: 55%; animation-delay: 0.8s; }
.overlay-sparkle__particle:nth-child(9)  { top: 18%; left: 40%; animation-delay: 1.5s; width: 5px; height: 5px; }
.overlay-sparkle__particle:nth-child(10) { top: 70%; left: 70%; animation-delay: 0.4s; }

@keyframes sparkleGlow {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50%      { opacity: 1; transform: scale(1.2); }
}

/* ── TEXT OVERLAY LAYER ── */
.composition-layer--text {
  position: absolute;
  z-index: 40;
  pointer-events: none;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
}

.composition-text__message {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(16px, 4vw, 28px);
  font-weight: 500;
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3);
  line-height: 1.3;
  animation: textFadeIn 0.6s ease forwards;
}

.composition-text__names {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(10px, 2.5vw, 14px);
  color: rgba(255,255,255,0.7);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  margin-top: 6px;
  letter-spacing: 0.05em;
}

@keyframes textFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## FILE 5: src/components/Customizer.jsx
STATUS: MODIFIED
PURPOSE: Added LivePreview import + integration. Live preview section appears after Extras when any extra is toggled or message is typed. Sticky CTA thumbnail replaced with mini LivePreview. onComplete enriched with composition manifest from buildCartComposition().

```jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import LivePreview from './LivePreview';
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
    // Build composition manifest for fulfillment
    const composition = buildCartComposition({ message, colorTheme, extras });
    onComplete({ productId: product.id, message, colorTheme, extras, totalPrice, composition });
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

          {/* ── LIVE PREVIEW ── */}
          {(extras.balloon || extras.ribbon || extras.sparkle || message.short) && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <h3 className="customizer-section__title">Preview</h3>
              </div>
              <div style={{ maxWidth: 280, margin: '0 auto' }}>
                <LivePreview
                  product={product}
                  colorTheme={colorTheme}
                  extras={extras}
                  message={message}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── STICKY CTA ── */}
        <div className="customizer-sticky-cta">
          <div className="cta-preview">
            <LivePreview
              product={product}
              colorTheme={colorTheme}
              extras={extras}
              message={message}
              className="composition-preview--square"
            />
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

## FILE 6: src/components/CartItem.jsx
STATUS: MODIFIED
PURPOSE: Added active overlay tags display (balloon/ribbon/sparkle icons) from composition.activeOverlays. Uses optional chaining — safe for items without composition data.

```jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  };

  return (
    <div className="flex items-start space-x-6 py-8 border-b border-white/5 last:border-0 group animate-fade-in">
      {/* Visual Asset Preview */}
      <Link to={`/product/${item.id}`} className="w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden glass border border-white/5 relative block">
        {item.video_file_url || item.video_url ? (
          <video
            src={item.video_file_url || item.video_url}
            className="w-full h-full object-cover"
            poster={item.image_url || item.image}
            preload="auto"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </Link>

      {/* Item Narrative */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${item.id}`} className="text-sm font-medium text-white font-display tracking-tight truncate pr-4 hover:text-[var(--accent-gold)] transition-colors">
            {item.name}
          </Link>
          <p className="text-sm font-light text-white/50">${parseFloat(item.price).toFixed(2)}</p>
        </div>

        {/* Bespoke Details (if any) */}
        {item.customization ? (
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-2">
               <span className="text-[9px] uppercase tracking-widest text-pure-gold font-bold">Bespoke</span>
            </div>
            {/* Handle both string (legacy) and object (new) message formats */}
            {item.customization.message && (
              <p className="text-[11px] text-white/40 font-light italic line-clamp-2">
                "{typeof item.customization.message === 'string'
                  ? item.customization.message
                  : item.customization.message.short || ''}"
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Show To/From if present (new format) */}
              {(item.customization.message?.toName || item.customization.message?.fromName) && (
                <span className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {item.customization.message.toName && `To: ${item.customization.message.toName}`}
                  {item.customization.message.toName && item.customization.message.fromName && ' · '}
                  {item.customization.message.fromName && `From: ${item.customization.message.fromName}`}
                </span>
              )}
              {/* Show colorTheme (new) or legacy music/theme */}
              {(item.customization.colorTheme || item.customization.theme || item.customization.music) && (
                <span className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {item.customization.colorTheme || item.customization.theme || item.customization.music}
                </span>
              )}
              {/* Show active overlays from composition manifest */}
              {item.customization.composition?.activeOverlays?.map(overlay => (
                <span key={overlay} className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {overlay === 'balloon' ? '🎈' : overlay === 'ribbon' ? '🎀' : overlay === 'sparkle' ? '✨' : ''} {overlay}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6 font-light">Gallery Piece</p>
        )}

        {/* Minimal Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <span className="text-xs font-medium text-white/60 w-4 text-center">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
```
