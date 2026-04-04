import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
      return res.status(404).json({ error: 'No purchases found for this session' });
    }

    const totalAmount = purchases.reduce((sum, purchase) => sum + Number(purchase.total_price || 0), 0);
    const allCompleted = purchases.every((purchase) => purchase.status === 'completed');
    const publicPurchases = purchases.map((purchase) => ({
      id: purchase.id,
      product_id: purchase.product_id,
      quantity: purchase.quantity,
      total_price: purchase.total_price,
      status: purchase.status,
      download_url: purchase.download_url,
      download_expires_at: purchase.download_expires_at,
      bloom_slug: purchase.bloom_slug,
      has_customization: Boolean(purchase.composition_manifest?.customization),
      products: {
        id: purchase.products?.id || null,
        name: purchase.products?.name || null,
      },
    }));

    return res.status(200).json({
      ok: true,
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
