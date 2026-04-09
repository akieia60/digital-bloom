import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';
import { getSignedDeliveryUrl } from './_lib/deliveryAccess.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function serializePurchaseWithProtectedDownload(purchase) {
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
    status: purchase.status,
    download_url: downloadUrl,
    download_storage_path: purchase.download_storage_path || null,
    download_expires_at: purchase.download_expires_at,
    bloom_slug: purchase.bloom_slug,
    has_customization: Boolean(purchase.composition_manifest?.customization),
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
      const { data: purchase, error: bloomError } = await supabase
        .from('purchases')
        .select('*, products(*)')
        .eq('bloom_slug', bloomSlug)
        .maybeSingle();

      if (bloomError) throw bloomError;

      if (!purchase) {
        return res.status(404).json({ error: 'This bloom could not be found' });
      }

      return res.status(200).json({
        ok: true,
        kind: 'bloom',
        purchase: {
          id: purchase.id,
          bloom_slug: purchase.bloom_slug,
          product_id: purchase.product_id,
          total_price: purchase.total_price,
          status: purchase.status,
          created_at: purchase.created_at,
          download_url: await getSignedDeliveryUrl(supabase, purchase).catch((error) => {
            console.error('Failed to resolve bloom delivery URL:', error);
            return /^https?:\/\//i.test(String(purchase.download_url || ''))
              ? purchase.download_url
              : null;
          }),
          download_storage_path: purchase.download_storage_path || null,
          download_expires_at: purchase.download_expires_at,
          composition_manifest: purchase.composition_manifest || {},
        },
        product: purchase.products
          ? {
              id: purchase.products.id,
              name: purchase.products.name,
              category: purchase.products.category,
              video_file_url: purchase.products.video_file_url || purchase.products.video_url,
              image_url: purchase.products.image_url,
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

    const totalAmount = purchases.reduce((sum, purchase) => sum + Number(purchase.total_price || 0), 0);
    const allCompleted = purchases.every((purchase) => purchase.status === 'completed');
    const publicPurchases = await Promise.all(
      purchases.map((purchase) => serializePurchaseWithProtectedDownload(purchase))
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
