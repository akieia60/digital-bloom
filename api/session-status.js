import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';
import { finalizePurchaseRecord } from './_lib/purchaseFlow.js';
import {
  buildDeliverySummary,
  isScheduledBloomLocked,
  normalizeBloomDeliverySettings,
  processBloomDeliveryEmails,
} from './_lib/bloomDeliveryEmail.js';
import { getSignedDeliveryUrl } from './_lib/deliveryAccess.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const STALE_PURCHASE_RENDER_MS = 8 * 1000; // 8 seconds — give webhook a head start, then self-heal

function hasCustomizedBloomWithoutRender(purchase) {
  return Boolean(purchase?.composition_manifest?.customization) && !String(purchase?.download_url || '').trim();
}

function shouldSurfaceAsProcessing(purchase) {
  const status = String(purchase?.status || '').toLowerCase();
  return status === 'pending' || status === 'processing';
}

function isStaleProcessingPurchase(purchase) {
  const status = String(purchase?.status || '').toLowerCase();
  if (status !== 'pending' && status !== 'processing') return false;

  const activityAt = new Date(purchase?.updated_at || purchase?.created_at || 0).getTime();
  if (!Number.isFinite(activityAt)) return false;

  return Date.now() - activityAt > STALE_PURCHASE_RENDER_MS;
}

async function recoverStalePurchase(purchase) {
  if (!purchase || !isStaleProcessingPurchase(purchase)) {
    return purchase;
  }

  if (!purchase.composition_manifest?.customization) {
    return purchase;
  }

  try {
    return await finalizePurchaseRecord(purchase, null);
  } catch (error) {
    console.warn('Failed to recover stale bloom purchase:', error);
    return purchase;
  }
}

async function serializePurchaseWithProtectedDownload(purchase) {
  const delivery = normalizeBloomDeliverySettings(purchase);
  const downloadUrl = await getSignedDeliveryUrl(supabase, purchase).catch((error) => {
    console.error('Failed to resolve signed delivery URL:', error);
    return /^https?:\/\//i.test(String(purchase.download_url || ''))
      ? purchase.download_url
      : null;
  });

  return {
    id: purchase.id,
    product_id: purchase.product_id,
    quantity: purchase.quantity,
    total_price: purchase.total_price,
    status: shouldSurfaceAsProcessing(purchase) ? 'processing' : purchase.status,
    download_url: downloadUrl,
    download_storage_path: purchase.download_storage_path || null,
    download_expires_at: purchase.download_expires_at,
    bloom_slug: purchase.bloom_slug,
    has_customization: Boolean(purchase.composition_manifest?.customization),
    delivery: buildDeliverySummary(delivery),
    products: {
      id: purchase.products?.id || null,
      name: purchase.products?.name || null,
    },
  };
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bloomSlug = String(req.query.bloom_slug || '').trim();
    if (bloomSlug) {
      const { data: initialPurchase, error: bloomError } = await supabase
        .from('purchases')
        .select('*, products(*)')
        .eq('bloom_slug', bloomSlug)
        .maybeSingle();

      if (bloomError) throw bloomError;

      if (!initialPurchase) {
        return res.status(404).json({ error: 'This bloom could not be found' });
      }

      const purchase = await recoverStalePurchase(initialPurchase);
      const [deliveryProcessedPurchase] = await processBloomDeliveryEmails({
        supabase,
        purchases: [purchase],
        req,
        explicitTestMode: String(process.env.STRIPE_SECRET_KEY || '').includes('_test_'),
      });
      const resolvedPurchase = deliveryProcessedPurchase || purchase;
      const delivery = normalizeBloomDeliverySettings(resolvedPurchase);

      if (delivery && isScheduledBloomLocked(delivery)) {
        return res.status(200).json({
          ok: true,
          kind: 'bloom',
          purchase: {
            id: resolvedPurchase.id,
            bloom_slug: resolvedPurchase.bloom_slug,
            product_id: resolvedPurchase.product_id,
            total_price: resolvedPurchase.total_price,
            status: 'scheduled',
            created_at: resolvedPurchase.created_at,
            download_url: null,
            download_expires_at: resolvedPurchase.download_expires_at,
            composition_manifest: resolvedPurchase.composition_manifest || {},
            delivery: buildDeliverySummary(delivery),
          },
          product: resolvedPurchase.products
            ? {
                id: resolvedPurchase.products.id,
                name: resolvedPurchase.products.name,
                category: resolvedPurchase.products.category,
                video_file_url: resolvedPurchase.products.video_file_url || resolvedPurchase.products.video_url,
                image_url: resolvedPurchase.products.image_url,
              }
            : null,
        });
      }

      return res.status(200).json({
        ok: true,
        kind: 'bloom',
        purchase: {
            id: resolvedPurchase.id,
            bloom_slug: resolvedPurchase.bloom_slug,
            product_id: resolvedPurchase.product_id,
            total_price: resolvedPurchase.total_price,
            status: shouldSurfaceAsProcessing(resolvedPurchase) ? 'processing' : resolvedPurchase.status,
          created_at: resolvedPurchase.created_at,
          download_url: await getSignedDeliveryUrl(supabase, resolvedPurchase).catch((error) => {
            console.error('Failed to resolve bloom delivery URL:', error);
            return /^https?:\/\//i.test(String(resolvedPurchase.download_url || ''))
              ? resolvedPurchase.download_url
              : null;
          }),
          download_storage_path: resolvedPurchase.download_storage_path || null,
          download_expires_at: resolvedPurchase.download_expires_at,
          composition_manifest: resolvedPurchase.composition_manifest || {},
          delivery: buildDeliverySummary(delivery),
        },
        product: resolvedPurchase.products
          ? {
              id: resolvedPurchase.products.id,
              name: resolvedPurchase.products.name,
              category: resolvedPurchase.products.category,
              video_file_url: resolvedPurchase.products.video_file_url || resolvedPurchase.products.video_url,
              image_url: resolvedPurchase.products.image_url,
            }
          : null,
      });
    }

    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('stripe_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!purchases || purchases.length === 0) {
      const { data: credit, error: creditError } = await supabase
        .from('experience_credits')
        .select('id, code, initial_amount_cents, remaining_amount_cents, status, purchaser_email, recipient_email, created_at')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();

      if (creditError) throw creditError;

      if (!credit) {
        return res.status(404).json({ error: 'No purchases found for this session' });
      }

      return res.status(200).json({
        ok: true,
        kind: 'credit',
        session_id: sessionId,
        checkout_status: 'completed',
        totals: {
          items: 1,
          amount: Number(credit.initial_amount_cents || 0) / 100,
        },
        purchases: [],
        credit: {
          id: credit.id,
          code: credit.code,
          initial_amount_cents: credit.initial_amount_cents,
          remaining_amount_cents: credit.remaining_amount_cents,
          status: credit.status,
          purchaser_email: credit.purchaser_email,
          recipient_email: credit.recipient_email,
          created_at: credit.created_at,
        },
      });
    }

    const recoveredPurchases = [];
    for (const purchase of purchases) {
      recoveredPurchases.push(await recoverStalePurchase(purchase));
    }

    const deliveredOrQueuedPurchases = await processBloomDeliveryEmails({
      supabase,
      purchases: recoveredPurchases,
      req,
      explicitTestMode: String(process.env.STRIPE_SECRET_KEY || '').includes('_test_'),
    });

    const totalAmount = deliveredOrQueuedPurchases.reduce((sum, purchase) => sum + Number(purchase.total_price || 0), 0);
    const allCompleted = deliveredOrQueuedPurchases.every((purchase) => !shouldSurfaceAsProcessing(purchase) && purchase.status === 'completed');
    const publicPurchases = await Promise.all(
      deliveredOrQueuedPurchases.map((purchase) => serializePurchaseWithProtectedDownload(purchase))
    );

    return res.status(200).json({
      ok: true,
      kind: 'purchase',
      session_id: sessionId,
      checkout_status: allCompleted ? 'completed' : 'processing',
      totals: {
        items: purchases.length,
        amount: totalAmount,
      },
      purchases: publicPurchases,
    });
  } catch (error) {
    console.error('session-status error:', error);
    return res.status(500).json({ error: 'Failed to fetch checkout status' });
  }
}
