import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function unauthorized(res) {
  res.status(401).json({ error: 'unauthorized' });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return res.status(500).json({ error: 'ADMIN_TOKEN not configured' });

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  if (req.method === 'GET') {
    const token = req.query.token;
    if (token !== adminToken) return unauthorized(res);
    const category = (req.query.category || 'mothers-day').toString();
    const status = (req.query.status || 'inactive').toString();
    const isActive = status === 'active';
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, category, video_file_url, video_url, thumbnail_url, image_url, is_active, created_at, price_cents')
      .eq('category', category)
      .eq('is_active', isActive)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ products: data || [] });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    if (body.token !== adminToken) return unauthorized(res);
    const { productId, action } = body;
    if (!productId || !['restore', 'archive'].includes(action)) {
      return res.status(400).json({ error: 'productId and action (restore|archive) required' });
    }
    const isActive = action === 'restore';
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select('id, name, is_active')
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ product: data });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method not allowed' });
}
