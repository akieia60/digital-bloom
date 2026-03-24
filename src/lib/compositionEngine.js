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
  'upper-third-center': { top: '14%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
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

  const recipientName = message.toName || null;
  const senderName = message.fromName || null;

  // Text layer
  const textLayer = message?.short ? {
    text: message.short,
    toName: recipientName,
    fromName: senderName,
    position: 'bottom-center',
    positionStyle: TEXT_POSITIONS['bottom-center'],
    font: 'Playfair Display',
    color: '#FFFFFF',
    shadow: true,
  } : null;

  const protectionLayer = {
    recipientName,
    senderName,
    tmText: 'TM',
    brandText: 'Digital Bloom™',
    recipientPosition: 'upper-third-center',
    recipientPositionStyle: TEXT_POSITIONS['upper-third-center'],
    tmPosition: 'bottom-left',
    tmPositionStyle: TEXT_POSITIONS['bottom-left'],
    brandPosition: 'bottom-right',
  };

  return {
    baseMedia,
    colorFilter,
    overlays,
    textLayer,
    protectionLayer,
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

// ── BRAND PROTECTION CONFIG ──
// Configures watermark behavior per product type

export const BRANDING_CONFIG = {
  styles: {
    'subtle-gold': {
      color: 'rgba(212, 175, 55, 0.35)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontStyle: 'italic',
      fontSize: '0.7rem',
      letterSpacing: '0.2em',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    },
    'soft-white': {
      color: 'rgba(255, 255, 255, 0.2)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontStyle: 'italic',
      fontSize: '0.7rem',
      letterSpacing: '0.2em',
      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    },
  },
  positions: {
    'bottom-center': { bottom: '16px', left: '0', right: '0', textAlign: 'center' },
    'bottom-right': { bottom: '12px', right: '16px', textAlign: 'right' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  },
  defaults: {
    watermark: true,
    watermarkStyle: 'subtle-gold',
    watermarkPosition: 'bottom-center',
    trademarkText: 'Digital Bloom™',
    introBrandCard: false,
    outroBrandCard: true,
  },
};

/**
 * Get branding layer configuration for a given product type.
 * 
 * @param {Object} [overrides] - Optional overrides for branding behavior
 * @returns {Object} Branding layer specification
 */
export function getBrandingLayer(overrides = {}) {
  const config = { ...BRANDING_CONFIG.defaults, ...overrides };
  const style = BRANDING_CONFIG.styles[config.watermarkStyle] || BRANDING_CONFIG.styles['subtle-gold'];
  const position = BRANDING_CONFIG.positions[config.watermarkPosition] || BRANDING_CONFIG.positions['bottom-center'];

  return {
    type: 'branding',
    watermark: config.watermark,
    text: config.trademarkText,
    style,
    position,
    introBrandCard: config.introBrandCard,
    outroBrandCard: config.outroBrandCard,
  };
}

export { COLOR_THEMES, OVERLAY_ASSETS, TEXT_POSITIONS };

