import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { renderBloomDelivery } from './renderBloom.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function toPriceNumber(value) {
  const parsed = Number.parseFloat(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function generateBloomSlug() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

function buildCompositionManifest(cartItem) {
  const product = cartItem.product || {};
  const customization = product.customization || cartItem.customization || null;
  if (!customization) return null;

  return {
    customization,
    composition: customization.composition || product.composition || cartItem.composition || null,
  };
}

export function buildPurchaseRows(cartItems, { customerEmail = null, stripeSessionId, status = 'pending' }) {
  return cartItems.map((item) => {
    const product = item.product || {};
    const quantity = Number(item.quantity || 1);
    const unitPrice = toPriceNumber(product.price);
    const compositionManifest = buildCompositionManifest(item);
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
