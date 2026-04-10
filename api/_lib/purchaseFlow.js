import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { renderBloomDelivery } from './renderBloom.js';

export const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function toPriceNumber(value) {
  const parsed = Number.parseFloat(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeDeliveryConfig(delivery = null, customerEmail = null, cartItem = null) {
  if (!delivery || typeof delivery !== 'object') return null;

  const purchaserEmail = String(delivery.purchaserEmail || customerEmail || '').trim();
  const target = delivery.target === 'recipient' ? 'recipient' : 'self';
  const recipientEmail = String(
    target === 'recipient'
      ? (delivery.recipientEmail || '')
      : (delivery.recipientEmail || purchaserEmail || '')
  ).trim();
  const message = cartItem?.customization?.message || {};

  return {
    target,
    purchaserEmail,
    recipientEmail,
    deliveryMode: delivery.deliveryMode === 'scheduled' && delivery.deliveryDate ? 'scheduled' : 'now',
    deliveryDate: delivery.deliveryDate ? String(delivery.deliveryDate) : '',
    buyerTimezone: delivery.buyerTimezone || 'America/Chicago',
    recipientName: message.toName || '',
    senderName: message.fromName || '',
    emailStatus: delivery.deliveryMode === 'scheduled' && delivery.deliveryDate ? 'queued' : 'pending',
    emailSentAt: null,
    testLabel: false,
  };
}

export function generateBloomSlug() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

function buildCompositionManifest(cartItem, delivery = null, customerEmail = null) {
  const product = cartItem.product || {};
  const customization = product.customization || cartItem.customization || null;
  if (!customization) return null;

  const normalizedDelivery = normalizeDeliveryConfig(delivery, customerEmail, cartItem);

  return {
    customization,
    composition: customization.composition || product.composition || cartItem.composition || null,
    ...(normalizedDelivery ? { delivery: normalizedDelivery } : {}),
  };
}

export function buildPurchaseRows(cartItems, { customerEmail = null, stripeSessionId, status = 'pending', delivery = null }) {
  return cartItems.map((item) => {
    const product = item.product || {};
    const quantity = Number(item.quantity || 1);
    const unitPrice = toPriceNumber(product.price);
    const compositionManifest = buildCompositionManifest(item, delivery, customerEmail);
    const hasCustomization = Boolean(compositionManifest?.customization);

    return {
      product_id: product.id || null,
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
      stripe_session_id: stripeSessionId,
      status,
      customer_email: customerEmail || null,
      customer_name: null,
      bloom_slug: hasCustomization ? generateBloomSlug() : null,
      composition_manifest: compositionManifest,
    };
  });
}

export async function insertPurchaseRows(rows) {
  const { data, error } = await supabase
    .from('purchases')
    .insert(rows)
    .select('*, products(*)');

  if (error) throw error;
  return data || [];
}

export async function finalizePurchaseRecord(purchase, stripePaymentIntentId = null) {
  const hasCustomization = Boolean(purchase.composition_manifest?.customization);
  const product = purchase.products || {};
  const isDigital = product.product_type === 'digital' || Boolean(product.video_file_url || product.video_url);

  if (purchase.status === 'completed' && (!hasCustomization || purchase.download_url)) {
    return purchase;
  }

  const updates = {
    status: 'completed',
    updated_at: new Date().toISOString(),
  };

  if (stripePaymentIntentId) {
    updates.stripe_payment_intent_id = stripePaymentIntentId;
  }

  if (hasCustomization && !purchase.bloom_slug) {
    updates.bloom_slug = generateBloomSlug();
  }

  if (isDigital && !hasCustomization) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    updates.download_url = product.video_file_url || product.video_url || null;
    updates.download_expires_at = expiryDate.toISOString();
    updates.download_count = 0;
  }

  const { data: updated, error } = await supabase
    .from('purchases')
    .update(updates)
    .eq('id', purchase.id)
    .select('*, products(*)')
    .single();

  if (error) throw error;

  if (hasCustomization) {
    try {
      await renderBloomDelivery(updated.id);
    } catch (renderError) {
      console.error(`render failed for purchase ${updated.id}:`, renderError);
    }
  }

  return updated;
}

export async function finalizePurchasesBySession(stripeSessionId, stripePaymentIntentId = null) {
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*, products(*)')
    .eq('stripe_session_id', stripeSessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!purchases || purchases.length === 0) return [];

  const finalized = [];
  for (const purchase of purchases) {
    finalized.push(await finalizePurchaseRecord(purchase, stripePaymentIntentId));
  }

  return finalized;
}
