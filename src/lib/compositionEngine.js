/**
 * Composition Engine
 *
 * Maps customization state -> renderable composition layers.
 * This is the core logic that translates user selections into
 * a visual layer stack for both live preview and fulfillment.
 */

import { getPosterUrl } from './media';

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

export const COLOR_SWATCHES = [
  { id: 'ruby', nameKey: 'customize_color_ruby', hex: '#C53A5C' },
  { id: 'blush', nameKey: 'customize_color_blush', hex: '#F2A7BC' },
  { id: 'gold', nameKey: 'customize_color_gold', hex: '#D4AF37' },
  { id: 'champagne', nameKey: 'customize_color_champagne', hex: '#EED7B8' },
  { id: 'ivory', nameKey: 'customize_color_ivory', hex: '#F7F2EA' },
  { id: 'emerald', nameKey: 'customize_color_emerald', hex: '#137A63' },
  { id: 'sapphire', nameKey: 'customize_color_sapphire', hex: '#2D5B9F' },
  { id: 'violet', nameKey: 'customize_color_violet', hex: '#7B63D9' },
];

export const COLOR_PALETTES = {
  original: {
    label: 'Bloom Blush',
    nameKey: 'customize_palette_original',
    primaryColor: '#C53A5C',
    accentColor: '#F2A7BC',
    filter: 'saturate(1.08) brightness(1.02)',
    hueRotate: -6,
    saturate: 1.08,
    brightness: 1.02,
    blendMode: 'screen',
  },
  warm: {
    label: 'Sunset Gold',
    nameKey: 'customize_palette_warm',
    primaryColor: '#C86A38',
    accentColor: '#E7C47D',
    filter: 'sepia(0.12) saturate(1.28) hue-rotate(-6deg) brightness(1.06)',
    hueRotate: -6,
    saturate: 1.28,
    brightness: 1.06,
    blendMode: 'overlay',
  },
  cool: {
    label: 'Ocean Silk',
    nameKey: 'customize_palette_cool',
    primaryColor: '#2D5B9F',
    accentColor: '#8FD5E6',
    filter: 'saturate(1.12) hue-rotate(148deg) brightness(1.05)',
    hueRotate: 148,
    saturate: 1.12,
    brightness: 1.05,
    blendMode: 'screen',
  },
  elegant: {
    label: 'Champagne Luxe',
    nameKey: 'customize_palette_elegant',
    primaryColor: '#8C6B2F',
    accentColor: '#EED7B8',
    filter: 'sepia(0.22) saturate(1.18) brightness(1.08)',
    hueRotate: 0,
    saturate: 1.18,
    brightness: 1.08,
    blendMode: 'soft-light',
  },
  romantic: {
    label: 'Velvet Rose',
    nameKey: 'customize_palette_romantic',
    primaryColor: '#8E2949',
    accentColor: '#F4C9D7',
    filter: 'saturate(1.34) hue-rotate(-18deg) brightness(1.03)',
    hueRotate: -18,
    saturate: 1.34,
    brightness: 1.03,
    blendMode: 'screen',
  },
  custom: {
    label: 'Custom Palette',
    nameKey: 'customize_theme_custom',
    primaryColor: '#C53A5C',
    accentColor: '#EED7B8',
    filter: 'saturate(1.12) brightness(1.04)',
    hueRotate: 0,
    saturate: 1.12,
    brightness: 1.04,
    blendMode: 'screen',
  },
};

export const MESSAGE_FONT_OPTIONS = {
  playfair: {
    label: 'Classic Serif',
    previewFamily: "'Playfair Display', Georgia, serif",
    previewWeight: 600,
    previewFontStyle: 'normal',
    previewTransform: 'none',
    previewLetterSpacing: '0.02em',
    renderFont: 'Serif',
  },
  outfit: {
    label: 'Modern Sans',
    previewFamily: "'Outfit', 'Helvetica Neue', Arial, sans-serif",
    previewWeight: 700,
    previewFontStyle: 'normal',
    previewTransform: 'none',
    previewLetterSpacing: '0.03em',
    renderFont: 'Sans',
  },
  arialBold: {
    label: 'Bold Sans',
    previewFamily: "Arial, 'Helvetica Neue', sans-serif",
    previewWeight: 700,
    previewFontStyle: 'normal',
    previewTransform: 'uppercase',
    previewLetterSpacing: '0.06em',
    renderFont: 'Sans',
  },
};

const TEXT_POSITIONS = {
  'top-left-safe': {
    top: '8%',
    left: '6%',
    textAlign: 'left',
    maxWidth: '40%',
  },
  'top-left-soft': {
    top: '10%',
    left: '8%',
    textAlign: 'left',
    maxWidth: '42%',
  },
  'bottom-left-safe': {
    bottom: '26%',
    left: '6%',
    textAlign: 'left',
    maxWidth: '62%',
  },
  'bottom-left-tight': {
    bottom: '23%',
    left: '6%',
    textAlign: 'left',
    maxWidth: '58%',
  },
  'bottom-right-safe': {
    bottom: '18.5%',
    right: '8%',
    textAlign: 'right',
    maxWidth: '42%',
  },
  'bottom-brand-left': {
    bottom: '5.4%',
    left: '7%',
    textAlign: 'left',
  },
  'bottom-brand-inline': {
    bottom: '5.45%',
    left: '30%',
    textAlign: 'left',
  },
  'lower-third-center': {
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    maxWidth: '70%',
  },
};

function hexToRgb(hex) {
  const normalized = String(hex || '').replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function withAlpha(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function clampBrightness(hex, multiplier = 1) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (channel) => Math.max(0, Math.min(255, Math.round(channel * multiplier)));
  return `#${[adjust(rgb.r), adjust(rgb.g), adjust(rgb.b)].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function getMessageSize(messageText = '') {
  const length = String(messageText || '').trim().length;
  if (length > 90) {
    return 'clamp(14px, 3.2vw, 20px)';
  }
  if (length > 56) {
    return 'clamp(15px, 3.6vw, 22px)';
  }
  return 'clamp(17px, 4.2vw, 26px)';
}

export function getThemeSpec(themeId, overrides = {}) {
  const base = COLOR_PALETTES[themeId] || COLOR_PALETTES.original;
  const primaryColor = overrides.primaryColor || base.primaryColor;
  const accentColor = overrides.accentColor || base.accentColor;

  return {
    ...base,
    themeId: themeId in COLOR_PALETTES ? themeId : 'original',
    primaryColor,
    accentColor,
    overlayColor: withAlpha(primaryColor, 0.12),
    secondaryOverlayColor: withAlpha(accentColor, 0.2),
    messagePanelColor: withAlpha(clampBrightness(primaryColor, 0.42), 0.40),
    railColor: withAlpha(clampBrightness(primaryColor, 0.35), 0.82),
    edgeGlowColor: withAlpha(accentColor, 0.28),
    brandColor: clampBrightness(accentColor, 1.04),
    accentTextColor: withAlpha(accentColor, 0.90),
    dedicationTextColor: withAlpha('#FFFFFF', 0.76),
    signatureTextColor: withAlpha('#FFFFFF', 0.70),
  };
}

export const ENGRAVING_STYLES = {
  heirloom: {
    label: 'Heirloom engraving',
    recipientPosition: 'top-left-safe',
    messagePosition: 'bottom-left-safe',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-inline',
    textVariant: 'heirloom',
  },
  signature: {
    label: 'Signature bloom',
    recipientPosition: 'top-left-soft',
    messagePosition: 'lower-third-center',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-inline',
    textVariant: 'signature',
  },
  modern: {
    label: 'Modern keepsake',
    recipientPosition: 'top-left-safe',
    messagePosition: 'bottom-left-tight',
    senderPosition: 'bottom-right-safe',
    brandPosition: 'bottom-brand-left',
    tmPosition: 'bottom-brand-inline',
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
  primaryColor,
  accentColor,
  extras = {},
  message = {},
  engravingStyle = 'heirloom',
  fontChoice = 'playfair',
}) {
  const theme = getThemeSpec(colorTheme, { primaryColor, accentColor });
  const engraving = ENGRAVING_STYLES[engravingStyle] || ENGRAVING_STYLES.heirloom;
  const font = MESSAGE_FONT_OPTIONS[fontChoice] || MESSAGE_FONT_OPTIONS.playfair;
  const baseVideoUrl = product?.video_file_url || product?.video_url || null;
  const basePosterUrl = getPosterUrl(baseVideoUrl, product?.image_url);

  const baseMedia = {
    type: baseVideoUrl ? 'video' : 'image',
    src: baseVideoUrl || basePosterUrl || product?.image_url || null,
    poster: basePosterUrl,
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
    secondaryOverlayColor: theme.secondaryOverlayColor,
    primaryColor: theme.primaryColor,
    accentColor: theme.accentColor,
    railColor: theme.railColor,
    messagePanelColor: theme.messagePanelColor,
    edgeGlowColor: theme.edgeGlowColor,
    brandColor: theme.brandColor,
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
        fontChoice,
        textStyle: {
          fontFamily: font.previewFamily,
          fontWeight: font.previewWeight,
          fontStyle: font.previewFontStyle,
          textTransform: font.previewTransform,
          letterSpacing: font.previewLetterSpacing,
          fontSize: getMessageSize(message.short),
        },
      }
    : null;

  const protectionLayer = {
    engravingStyle,
    engravingLabel: engraving.label,
    recipientName,
    senderName,
    tmText: 'TM',
    brandText: 'Digital Bloom',
    recipientPosition: engraving.recipientPosition,
    recipientPositionStyle: TEXT_POSITIONS[engraving.recipientPosition],
    recipientTextStyle: {
      fontFamily: font.previewFamily,
      fontWeight: font.previewWeight,
      fontStyle: font.previewFontStyle,
      textTransform: font.previewTransform === 'uppercase' ? 'uppercase' : 'uppercase',
      letterSpacing: font.previewLetterSpacing,
      color: theme.dedicationTextColor,
    },
    senderPosition: engraving.senderPosition,
    senderPositionStyle: TEXT_POSITIONS[engraving.senderPosition],
    senderTextStyle: {
      fontFamily: font.previewFamily,
      fontWeight: font.previewWeight,
      fontStyle: font.previewFontStyle,
      textTransform: font.previewTransform === 'uppercase' ? 'uppercase' : 'uppercase',
      letterSpacing: font.previewLetterSpacing,
      color: theme.signatureTextColor,
    },
    tmPosition: engraving.tmPosition,
    tmPositionStyle: TEXT_POSITIONS[engraving.tmPosition],
    brandPosition: engraving.brandPosition,
    brandPositionStyle: TEXT_POSITIONS[engraving.brandPosition],
    showBrandRail: true,
    railColor: theme.railColor,
    brandColor: theme.brandColor,
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
  return getThemeSpec(themeId).filter;
}

export function getMessageFontSpec(fontChoice) {
  return MESSAGE_FONT_OPTIONS[fontChoice] || MESSAGE_FONT_OPTIONS.playfair;
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

export { OVERLAY_ASSETS, TEXT_POSITIONS };
