/**
 * Delivery Resolver
 * 
 * Fetches and resolves bloom delivery data from Supabase.
 * Takes a bloom slug → returns composition state, product info,
 * message, and delivery status for the /bloom/:id page.
 * 
 * Design notes:
 * - Decoupled from localStorage — reads from durable purchase records
 * - Graceful fallback states for every edge case
 * - Returns everything the BloomDelivery page needs to render
 */

import { getCompositionLayers } from './compositionEngine';
import { getApiBase } from './apiBase';

/**
 * Status constants for delivery states.
 */
export const DELIVERY_STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  PROCESSING: 'processing',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
};

/**
 * Resolve a bloom delivery by its slug.
 * 
 * @param {string} bloomSlug - The unique delivery identifier
 * @returns {Object} { status, delivery, composition, error }
 */
export async function resolveBloomDelivery(bloomSlug) {
  if (!bloomSlug) {
    return { status: DELIVERY_STATUS.NOT_FOUND, delivery: null, composition: null, error: 'No bloom ID provided' };
  }

  try {
    const apiUrl = getApiBase();
    const response = await fetch(`${apiUrl}/api/session-status?bloom_slug=${encodeURIComponent(bloomSlug)}`);

    if (response.status === 404) {
      return { status: DELIVERY_STATUS.NOT_FOUND, delivery: null, composition: null, error: 'This bloom could not be found' };
    }

    if (!response.ok) {
      throw new Error('Failed to fetch bloom delivery');
    }

    const data = await response.json();
    const purchase = data?.purchase;
    const product = data?.product || {};

    if (!purchase) {
      return { status: DELIVERY_STATUS.NOT_FOUND, delivery: null, composition: null, error: 'This bloom could not be found' };
    }

    const hasCustomizedBloom = Boolean(purchase.composition_manifest?.customization);
    const hasProtectedDownload = Boolean(purchase.download_url);

    // Check purchase status
    if (
      purchase.status === 'pending' ||
      purchase.status === 'processing'
    ) {
      return {
        status: DELIVERY_STATUS.PROCESSING,
        delivery: {
          id: purchase.id,
          bloomSlug: purchase.bloom_slug,
          productName: product.name || 'Digital Bloom',
          createdAt: purchase.created_at,
        },
        composition: null,
        error: null,
      };
    }

    if (purchase.status === 'scheduled') {
      return {
        status: DELIVERY_STATUS.SCHEDULED,
        delivery: {
          id: purchase.id,
          bloomSlug: purchase.bloom_slug,
          productName: product.name || 'Digital Bloom',
          createdAt: purchase.created_at,
          delivery: purchase.delivery || null,
        },
        composition: null,
        error: null,
      };
    }

    // Extract composition manifest from purchase
    const manifest = purchase.composition_manifest || {};
    const customization = manifest.customization || {};
    const hasExpiredDownload = Boolean(
      purchase.download_expires_at && new Date(purchase.download_expires_at).getTime() <= Date.now()
    );

    if (hasExpiredDownload) {
      return {
        status: DELIVERY_STATUS.EXPIRED,
        delivery: {
          id: purchase.id,
          bloomSlug: purchase.bloom_slug,
          productName: product.name || 'Digital Bloom',
          createdAt: purchase.created_at,
        },
        composition: null,
        error: 'This protected bloom link has expired.',
      };
    }

    // Rebuild composition layers from stored data
    const composition = getCompositionLayers({
      product: {
        id: product.id,
        video_file_url: product.video_file_url || product.video_url,
        image_url: product.image_url,
        name: product.name,
      },
      colorTheme: customization.colorTheme || 'original',
      primaryColor: customization.primaryColor,
      accentColor: customization.accentColor,
      extras: customization.extras || {},
      message: customization.message || {},
      engravingStyle: customization.engravingStyle || 'heirloom',
      fontChoice: customization.fontChoice || 'playfair',
    });

    return {
      status: DELIVERY_STATUS.READY,
      delivery: {
        id: purchase.id,
        bloomSlug: purchase.bloom_slug,
        productId: purchase.product_id,
        productName: product.name || 'Digital Bloom',
        category: product.category,
        createdAt: purchase.created_at,
        totalPrice: purchase.total_price,
        downloadUrl: purchase.download_url || null,
        downloadExpiresAt: purchase.download_expires_at || null,
        // Customization details for display
        message: customization.message || {},
        colorTheme: customization.colorTheme || 'original',
        primaryColor: customization.primaryColor,
        accentColor: customization.accentColor,
        extras: customization.extras || {},
        engravingStyle: customization.engravingStyle || 'heirloom',
        fontChoice: customization.fontChoice || 'playfair',
        messageTextColor: customization.messageTextColor || '#FFFFFF',
        messageBold: customization.messageBold || false,
      },
      composition,
      error: null,
    };
  } catch (err) {
    console.error('[DeliveryResolver] Error:', err);
    return {
      status: DELIVERY_STATUS.ERROR,
      delivery: null,
      composition: null,
      error: 'Something went wrong loading your bloom. Please try again.',
    };
  }
}

/**
 * Generate a unique bloom slug.
 * Uses crypto.randomUUID if available, falls back to timestamp-based.
 */
export function generateBloomSlug() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // Use first 12 chars of UUID for a short, unique slug
    return crypto.randomUUID().replace(/-/g, '').substring(0, 12);
  }
  // Fallback: timestamp + random chars
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
