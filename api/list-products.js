import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  let query = supabase
    .from('products')
    .select('id, name, slug, prompt_id, category, price, is_active, video_url, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  let { data, error } = await query;

  if (error?.code === '42703' || error?.code === 'PGRST204') {
    ({ data, error } = await supabase
      .from('products')
      .select('id, name, slug, category, price, is_active, video_url, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false }));
  }

  if (error) return res.status(500).json({ error: error.message });

  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
  );
  return res.status(200).json({ products: data || [] });
}
