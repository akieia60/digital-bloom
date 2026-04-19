import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, category, price, is_active')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ products: data || [] });
}
