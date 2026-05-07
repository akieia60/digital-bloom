import { createClient } from '@supabase/supabase-js';
import { burnQrAndUpload } from '../_lib/burnQr.js';

export const maxDuration = 60;

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function unauthorized(res) { return res.status(401).json({ error: 'unauthorized' }); }

function actorFromToken(token) {
  if (!token) return null;
  const map = {
    [process.env.ADMIN_TOKEN || '_disabled1_']: 'Ak',
    [process.env.ADMIN_TOKEN_GAMBLE || '_disabled2_']: 'Gamble',
    [process.env.ADMIN_TOKEN_DAVID || '_disabled3_']: 'David',
    [process.env.ADMIN_TOKEN_BRE || '_disabled4_']: 'Bre',
  };
  return map[token] || null;
}

/**
 * Bre's pull workflow: pick any product → server burns a tracked QR
 * onto the video → returns a download URL Bre can tap on her phone
 * to save the file to Photos / Files. From there she posts to social
 * by hand. No Buffer integration, no creator portal.
 *
 * Replaces the abandoned 2026-05-06 creator-portal flow (/c/<slug>
 * + admin/creators.html + creator-push API + creators tables —
 * all dropped 2026-05-07).
 *
 * QR target slug defaults to "bre" so referral clicks attribute to her.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const token = String(req.headers['x-admin-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '') || '');
  const actor = actorFromToken(token);
  if (!actor) return unauthorized(res);

  const { productId, slug = 'bre' } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'productId required' });

  const { data: product, error: pErr } = await supabase
    .from('products')
    .select('id, name, category, video_file_url, video_url')
    .eq('id', productId)
    .maybeSingle();
  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!product) return res.status(404).json({ error: 'product not found' });

  const inputUrl = product.video_file_url || product.video_url;
  if (!inputUrl) return res.status(400).json({ error: 'product has no video url' });

  try {
    const { videoUrl, fileName } = await burnQrAndUpload({
      inputUrl,
      slug,
      title: product.name,
      category: product.category,
      bucket: 'bre-pulls',
    });
    // Vercel Blob honors `?download=<filename>` to force a Save dialog
    // even on iOS Safari (which would otherwise open the MP4 inline).
    const downloadUrl = `${videoUrl}?download=${encodeURIComponent(fileName)}`;
    return res.status(200).json({ ok: true, actor, downloadUrl, fileName, productName: product.name });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
