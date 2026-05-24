/**
 * Fulfillment Mapper
 *
 * Translates customization selections into a render-ready specification
 * that can drive server-side composition and delivery rendering.
 */

import { ENGRAVING_STYLES, getThemeSpec } from './compositionEngine';
import { getCanonicalVideoUrl, getPosterUrl } from './media';

export function buildFulfillmentManifest(product, customization) {
  const {
    message = {},
    colorTheme = 'original',
    primaryColor,
    accentColor,
    extras = {},
    totalPrice = 0,
    selectedSound = '',
    engravingStyle = 'heirloom',
    fontChoice = 'playfair',
    frameStyle = 'none',
    locale = 'en',
  } = customization;

  const theme = getThemeSpec(colorTheme, { primaryColor, accentColor });
  const engraving = ENGRAVING_STYLES[engravingStyle] || ENGRAVING_STYLES.heirloom;

  const baseVideoUrl = getCanonicalVideoUrl(product);
  const basePosterUrl = getPosterUrl(baseVideoUrl, product.image_url);
  const baseAsset = {
    type: baseVideoUrl ? 'video' : 'image',
    url: baseVideoUrl || basePosterUrl || product.image_url || null,
    fallbackImage: basePosterUrl,
    duration: baseVideoUrl ? estimateVideoDuration(baseVideoUrl) : null,
  };

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

  // Premium canvas effects — logged in manifest for future server-side rendering
  ['luminaraDrift', 'bokehBloom', 'lightVeil', 'silkPetals', 'constellationDrift', 'dewShimmer'].forEach(id => {
    if (extras[id]) {
      overlayInstructions.push({
        type: 'canvasEffect',
        effectId: id,
        timing: { start: 0, end: baseAsset.duration || 30 },
        position: 'full',
      });
    }
  });

  const colorTreatment = {
    themeId: colorTheme,
    label: theme.label,
    primaryColor: theme.primaryColor,
    accentColor: theme.accentColor,
    hueRotate: theme.hueRotate,
    saturate: theme.saturate,
    brightness: theme.brightness,
    overlayColor: theme.overlayColor,
    blendMode: theme.blendMode,
  };

  const recipientName = message.toName || null;
  const senderName = message.fromName || null;

  const textOverlay = message.short
    ? {
        text: message.short,
        font: 'Playfair Display',
        fontSize: 42,
        position: engraving.messagePosition,
        color: '#FFFFFF',
        shadow: '0 2px 8px rgba(0,0,0,0.6)',
        fadeIn: { start: 0.5, duration: 1.0 },
      }
    : null;

  const protectionPlan = {
    burnIntoDeliveredFile: true,
    engravingStyle,
    engravingLabel: engraving.label,
    recipientName,
    senderName,
    tm: {
      enabled: true,
      text: 'TM',
      position: engraving.tmPosition,
      style: 'subtle-white',
    },
    brandWatermark: {
      enabled: true,
      text: 'Digital Bloom™',
      position: engraving.brandPosition,
      style: 'subtle-gold',
    },
    dedication: {
      enabled: Boolean(recipientName),
      text: recipientName ? `To ${recipientName}` : null,
      position: engraving.recipientPosition,
      style: 'embedded-screen-safe',
      persistent: true,
    },
    signature: {
      enabled: Boolean(senderName),
      text: senderName ? `From ${senderName}` : null,
      position: engraving.senderPosition,
      style: 'embedded-screen-safe',
      persistent: true,
    },
    messageCard: {
      enabled: Boolean(message.short),
      text: message.short || null,
      position: engraving.messagePosition,
      style: engraving.textVariant,
    },
  };

  return {
    version: '1.2',
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
    audio: {
      soundtrack: selectedSound || null,
    },
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
    summary: {
      theme: theme.label,
      primaryColor: theme.primaryColor,
      accentColor: theme.accentColor,
      engravingStyle: engraving.label,
      soundtrack: selectedSound || null,
      fontChoice,
      extras: Object.entries(extras).filter(([, value]) => value).map(([key]) => key),
      frameStyle,
      hasMessage: Boolean(message.short),
      hasTo: Boolean(message.toName),
      hasFrom: Boolean(message.fromName),
    },
    branding: {
      watermark: true,
      watermarkStyle: 'signature-strip',
      watermarkPosition: engraving.brandPosition,
      introBrandCard: false,
      outroBrandCard: true,
      trademarkText: 'Digital Bloom™',
    },
    protectionPlan,
    locale,
  };
}

export function buildCartComposition(customization) {
  const {
    message = {},
    colorTheme = 'original',
    primaryColor,
    accentColor,
    extras = {},
    selectedSound = '',
    engravingStyle = 'heirloom',
    fontChoice = 'playfair',
    messageTextColor = '#FFFFFF',
    messageBold = false,
    messageTextSize = 'md',
    messageOffset = null,
    frameStyle = 'none',
    locale = 'en',
  } = customization;

  const theme = getThemeSpec(colorTheme, { primaryColor, accentColor });

  return {
    colorTheme,
    primaryColor: theme.primaryColor,
    accentColor: theme.accentColor,
    hueRotate: theme.hueRotate,
    saturate: theme.saturate,
    brightness: theme.brightness,
    overlayColor: theme.overlayColor,
    blendMode: theme.blendMode,
    selectedSound,
    engravingStyle,
    fontChoice,
    messageTextColor,
    messageBold,
    messageTextSize,
    messageOffset,
    frameStyle,
    locale,
    extras: Object.fromEntries(
      Object.entries(extras).map(([key, value]) => [key, Boolean(value)])
    ),
    message: {
      short: message.short || '',
      toName: message.toName || '',
      fromName: message.fromName || '',
    },
    activeOverlays: Object.entries(extras)
      .filter(([, value]) => value)
      .map(([key]) => key),
  };
}

function estimateVideoDuration(url) {
  if (!url) return 29;
  const match = url.match(/(\d+)s\./);
  return match ? Number.parseInt(match[1], 10) : 29;
}

function getOverlayAssetPath(overlayType, variant) {
  const paths = {
    balloon: `/overlays/balloon/balloon-${variant}.webm`,
    ribbon: `/overlays/ribbon/ribbon-${variant}.webm`,
    sparkle: '/overlays/sparkle/sparkle-default.webm',
  };
  return paths[overlayType] || null;
}
