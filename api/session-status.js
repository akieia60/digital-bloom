import Stripe from 'stripe';
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const STALE_PURCHASE_RENDER_MS = 8 * 1000; // 8 seconds — give webhook a head start, then self-heal
const MAX_BLOOM_OPENS = Number(process.env.MAX_BLOOM_OPENS || 30); // how many times a bloom link can be opened

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

/**
 * Self-heal credit purchases when the webhook fails to create the record.
 * Retrieves the Stripe session, checks if it was a credit purchase, and creates the credit.
 */
async function selfHealCreditPurchase(stripeSessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (!session || session.payment_status !== 'paid') return null;

    const metadata = session.metadata || {};
    if (metadata.type !== 'experience_credit') return null;

    const { code, amount_cents, purchaser_email, recipient_email } = metadata;
    if (!code || !amount_cents) return null;

    // Check again (race condition guard)
    const { data: existing } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('stripe_session_id', stripeSessionId)
      .maybeSingle();

    if (existing) return existing;

    const amountCents = parseInt(amount_cents, 10);

    const { data: credit, error: insertError } = await supabase
      .from('experience_credits')
      .insert({
        code,
        initial_amount_cents: amountCents,
        remaining_amount_cents: amountCents,
        purchaser_email,
        recipient_email: recipient_email || purchaser_email,
        status: 'active',
        stripe_session_id: stripeSessionId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Self-heal credit insert failed:', insertError);
      // Might be a duplicate code — try fetching again
      const { data: retry } = await supabase
        .from('experience_credits')
        .select('*')
        .eq('stripe_session_id', stripeSessionId)
        .maybeSingle();
      return retry || null;
    }

    // Also create the ledger entry
    await supabase.from('experience_credit_ledger').insert({
      credit_id: credit.id,
      reason: 'purchase',
      delta_cents: amountCents,
      related_order_id: stripeSessionId,
    }).catch((err) => console.error('Self-heal ledger insert failed:', err));

    console.warn('Self-healed credit purchase:', credit.code, 'for session:', stripeSessionId);
    return credit;
  } catch (err) {
    console.error('Self-heal credit check failed:', err);
    return null;
  }
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  // Prevent Vercel edge / browser from caching polling responses (fixes 304 loop)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

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

      // ── View-count enforcement ──
      // Only count opens for completed blooms (not processing/scheduled).
      // Only increment when context=gift (recipient gift page), NOT manage page.
      const isGiftContext = String(req.query.context || '').toLowerCase() === 'gift';

      if (resolvedPurchase.status === 'completed') {
        const currentCount = Number(resolvedPurchase.download_count || 0);
        if (currentCount >= MAX_BLOOM_OPENS) {
          // Bloom has been opened too many times — treat as expired
          return res.status(410).json({
            ok: false,
            kind: 'bloom',
            error: 'view_limit_reached',
            message: 'This bloom has reached its viewing limit. Want your own? Visit digitalbloom.store',
            purchase: {
              id: resolvedPurchase.id,
              bloom_slug: resolvedPurchase.bloom_slug,
              status: 'expired',
              download_url: null,
              download_expires_at: resolvedPurchase.download_expires_at,
              composition_manifest: {},
              delivery: buildDeliverySummary(delivery),
            },
            product: resolvedPurchase.products ? {
              id: resolvedPurchase.products.id,
              name: resolvedPurchase.products.name,
            } : null,
          });
        }

        // Only increment view count for gift-page views (not manage-page previews)
        if (isGiftContext) {
          const manifest = JSON.parse(JSON.stringify(resolvedPurchase.composition_manifest || {}));
          const deliveryMeta = manifest.delivery || {};
          const newViewCount = (Number(deliveryMeta.viewCount) || 0) + 1;
          deliveryMeta.viewCount = newViewCount;
          deliveryMeta.maxViews = deliveryMeta.maxViews || MAX_BLOOM_OPENS;
          // Stamp claimedAt on first gift-context view
          if (!deliveryMeta.claimedAt) {
            deliveryMeta.claimedAt = new Date().toISOString();
          }
          manifest.delivery = deliveryMeta;

          // Fire-and-forget: update both download_count and manifest delivery metadata
          supabase
            .from('purchases')
            .update({
              download_count: currentCount + 1,
              composition_manifest: manifest,
              updated_at: new Date().toISOString(),
            })
            .eq('id', resolvedPurchase.id)
            .then(() => {})
            .catch((err) => console.warn('[bloom-views] count update failed:', err));
        }
      }

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
        // Self-heal: if the webhook didn't create the credit, check Stripe and create it now
        const healed = await selfHealCreditPurchase(sessionId);
        if (!healed) {
          return res.status(404).json({ error: 'No purchases found for this session' });
        }
        return res.status(200).json({
          ok: true,
          kind: 'credit',
          session_id: sessionId,
          checkout_status: 'completed',
          totals: {
            items: 1,
            amount: Number(healed.initial_amount_cents || 0) / 100,
          },
          purchases: [],
          credit: {
            id: healed.id,
            code: healed.code,
            initial_amount_cents: healed.initial_amount_cents,
            remaining_amount_cents: healed.remaining_amount_cents,
            status: healed.status,
            purchaser_email: healed.purchaser_email,
            recipient_email: healed.recipient_email,
            created_at: healed.created_at,
          },
        });
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
