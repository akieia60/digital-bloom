/**
 * Composition Engine
 *
 * Maps customization state -> renderable composition layers.
 * This is the core logic that translates user selections into
 * a visual layer stack for both live preview and fulfillment.
 */

const OVERLAY_ASSETS = {
  balloon: {
    warm: { src: null, css: true, label: 'Warm Balloons' },
    cool: { src: null, css: true, label: 'Cool Balloons' },
    elegant: { src: null, css: true, label: 'Gold Balloons' },
    romantic: { src: null, css: true, label: 'Rose Balloons' },
    original: { src: null, css: true, label: 'Classic Balloons' },
  },
  ribbon: {
    warm: { src: null, css: true, label: 'Warm Ribbon' },
    cool: { src: null, css: true, label: 'Cool Ribbon' },
    elegant: { src: null, css: true, label: 'Gold Ribbon' },
    romantic: { src: null, css: true, label: 'Rose Ribbon' },
    original: { src: null, css: true, label: 'Classic Ribbon' },
  },
  sparkle: {
    default: { src: null, css: true, label: 'Sparkle Effect' },
  },
  goldDust: {
    default: { src: null, css: true, label: 'Gold Dust' },
  },
  softGlow: {
    default: { src: null, css: true, label: 'Soft Glow' },
  },
  rosePetals: {
    default: { src: null, css: true, label: 'Rose Petals' },
  },
};

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

const TEXT_POSITIONS = {
  'top-left-safe': {
    top: '8%',
    left: '6%',
    textAlign: 'left',
  },
  'top-left-soft': {
    top: '11%',
    left: '8%',
    textAlign: 'left',
  },
  'bottom-left-safe': {
    bottom: '20%',
    left: '6%',
    textAlign: 'left',
  },
  'bottom-left-tight': {
    bottom: '15%',
    left: '6%',
    textAlign: 'left',
  },
  'bottom-right-safe': {
    bottom: '15%',
    right: '6%',
    textAlign: 'right',
  },
  'bottom-brand-left': {
    bottom: '6.6%',
    left: '7%',
    textAlign: 'left',
  },
  'bottom-brand-right': {
    bottom: '7.2%',
    right: '7%',
    textAlign: 'right',
  },
  'lower-third-center': {
    bottom: '18%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
};

export const ENGRAVING_STYLES = {
  heirloom: {
    label: 'Heirloom engraving',
    recipientPosition: 'top-left-safe',
    messagePosition: 'bottom-left-safe',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-right',
    textVariant: 'heirloom',
  },
  signature: {
    label: 'Signature bloom',
    recipientPosition: 'top-left-soft',
    messagePosition: 'lower-third-center',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-right',
    textVariant: 'signature',
  },
  modern: {
    label: 'Modern keepsake',
    recipientPosition: 'top-left-safe',
    messagePosition: 'bottom-left-tight',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-right',
    textVariant: 'modern',
  },
};

function getOverlayDescriptor(overlayId, colorTheme) {
  if (overlayId === 'balloon') {
    return OVERLAY_ASSETS.balloon[colorTheme] || OVERLAY_ASSETS.balloon.original;
  }

  if (overlayId === 'ribbon') {
    return OVERLAY_ASSETS.ribbon[colorTheme] || OVERLAY_ASSETS.ribbon.original;
  }

  return OVERLAY_ASSETS[overlayId]?.default || null;
}

function addOverlay(overlays, overlayId, colorTheme, zIndex) {
  const asset = getOverlayDescriptor(overlayId, colorTheme);
  if (!asset) return;

  overlays.push({
    id: overlayId,
    type: asset.src ? 'video' : 'css',
    src: asset.src,
    themeVariant: overlayId === 'balloon' || overlayId === 'ribbon' ? colorTheme : 'default',
    label: asset.label,
    zIndex,
  });
}

export function getCompositionLayers({
  product,
  colorTheme = 'original',
  extras = {},
  message = {},
  engravingStyle = 'heirloom',
}) {
  const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.original;
  const engraving = ENGRAVING_STYLES[engravingStyle] || ENGRAVING_STYLES.heirloom;

  const baseMedia = {
    type: product?.video_file_url || product?.video_url ? 'video' : 'image',
    src: product?.video_file_url || product?.video_url || product?.image_url || null,
    poster: product?.image_url || null,
  };

  const overlays = [];
  if (extras.balloon) addOverlay(overlays, 'balloon', colorTheme, 10);
  if (extras.ribbon) addOverlay(overlays, 'ribbon', colorTheme, 20);
  if (extras.sparkle) addOverlay(overlays, 'sparkle', colorTheme, 30);
  if (extras.goldDust) addOverlay(overlays, 'goldDust', colorTheme, 25);
  if (extras.softGlow) addOverlay(overlays, 'softGlow', colorTheme, 15);
  if (extras.rosePetals) addOverlay(overlays, 'rosePetals', colorTheme, 22);

  const colorFilter = {
    themeId: colorTheme,
    label: theme.label,
    cssFilter: theme.filter,
    overlayColor: theme.overlayColor,
    blendMode: theme.blendMode,
    hueRotate: theme.hueRotate,
    saturate: theme.saturate,
    brightness: theme.brightness,
  };

  const recipientName = message.toName || null;
  const senderName = message.fromName || null;

  const textLayer = message?.short
    ? {
        text: message.short,
        position: engraving.messagePosition,
        positionStyle: TEXT_POSITIONS[engraving.messagePosition],
        font: 'Playfair Display',
        color: '#FFFFFF',
        shadow: true,
        variant: engraving.textVariant,
      }
    : null;

  const protectionLayer = {
    engravingStyle,
    engravingLabel: engraving.label,
    recipientName,
    senderName,
    tmText: 'TM',
    brandText: 'Digital Bloom™',
    recipientPosition: engraving.recipientPosition,
    recipientPositionStyle: TEXT_POSITIONS[engraving.recipientPosition],
    senderPosition: engraving.senderPosition,
    senderPositionStyle: TEXT_POSITIONS[engraving.senderPosition],
    tmPosition: engraving.tmPosition,
    tmPositionStyle: TEXT_POSITIONS[engraving.tmPosition],
    brandPosition: engraving.brandPosition,
    brandPositionStyle: TEXT_POSITIONS[engraving.brandPosition],
    showBrandRail: true,
  };

  return {
    baseMedia,
    colorFilter,
    overlays,
    textLayer,
    protectionLayer,
    activeExtras: overlays.map((overlay) => overlay.id),
    themeLabel: theme.label,
  };
}

export function getThemeFilter(themeId) {
  return (COLOR_THEMES[themeId] || COLOR_THEMES.original).filter;
}

export function getThemeSpec(themeId) {
  return COLOR_THEMES[themeId] || COLOR_THEMES.original;
}

export function hasRealAsset(overlayType, themeVariant = 'default') {
  const registry = OVERLAY_ASSETS[overlayType];
  if (!registry) return false;
  const asset = registry[themeVariant] || registry.default || Object.values(registry)[0];
  return asset?.src != null;
}

export function registerOverlayAsset(overlayType, variant, src) {
  if (OVERLAY_ASSETS[overlayType]?.[variant]) {
    OVERLAY_ASSETS[overlayType][variant].src = src;
    OVERLAY_ASSETS[overlayType][variant].css = false;
  }
}

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
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
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
