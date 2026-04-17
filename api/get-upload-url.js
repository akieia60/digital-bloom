import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.body || {};
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const rawPath = `raw-uploads/${slug}_${Date.now()}.mp4`;

  const { data, error } = await supabase.storage
    .from('product-media')
    .createSignedUploadUrl(rawPath);

  if (error) {
    console.error('[get-upload-url]', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    signedUrl: data.signedUrl,
    rawPath,
  });
}
