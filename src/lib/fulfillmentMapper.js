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
