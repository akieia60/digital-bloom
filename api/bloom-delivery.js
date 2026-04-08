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
    const bloomSlug = String(req.query.slug || '').trim();

    if (!bloomSlug) {
      return res.status(400).json({ error: 'slug is required' });
    }

    const { data: purchase, error } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('bloom_slug', bloomSlug)
      .maybeSingle();

    if (error) throw error;

    if (!purchase) {
      return res.status(404).json({ error: 'This bloom could not be found' });
    }

    return res.status(200).json({
      ok: true,
      purchase: {
        id: purchase.id,
        bloom_slug: purchase.bloom_slug,
        product_id: purchase.product_id,
        total_price: purchase.total_price,
        status: purchase.status,
        created_at: purchase.created_at,
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
  } catch (error) {
    console.error('bloom-delivery error:', error);
    return res.status(500).json({ error: 'Failed to fetch bloom delivery' });
  }
}
