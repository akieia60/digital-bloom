import { createClient } from '@supabase/supabase-js';
import { burnQrAndUpload as sharedBurnQrAndUpload } from '../_lib/burnQr.js';

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
  };
  return map[token] || null;
}

// burnQrAndUpload moved to api/_lib/burnQr.js so /api/admin/bre-download
// shares the same pipeline. Local wrapper keeps the legacy bucket path
// (`creators/<slug>/admin-pushed/...`) for backward-compat with existing
// creator_video_assignments rows.
async function burnQrAndUpload(opts) {
  return sharedBurnQrAndUpload({
    ...opts,
    bucket: `creators/${opts.slug}/admin-pushed`,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const token = String(req.headers['x-admin-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '') || '');
  const actor = actorFromToken(token);
  if (!actor) return unauthorized(res);

  const { creatorSlug, productIds, bucket } = req.body || {};
  if (!creatorSlug || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'creatorSlug and productIds[] required' });
  }
  // Limit per call to keep us inside the 60s function budget. Larger pushes
  // can be done in successive batches from the admin page.
  if (productIds.length > 5) {
    return res.status(400).json({ error: 'max 5 videos per push — call again with the next batch' });
  }

  // Verify the creator exists.
  const { data: creator } = await supabase
    .from('creators')
    .select('slug, display_name, is_active')
    .eq('slug', creatorSlug)
    .maybeSingle();
  if (!creator || !creator.is_active) {
    return res.status(404).json({ error: 'creator not found or inactive' });
  }

  // Pull the requested products.
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, name, category, video_file_url, video_url')
    .in('id', productIds);
  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!products || products.length === 0) {
    return res.status(404).json({ error: 'no products found' });
  }

  const results = [];
  for (const p of products) {
    const inputUrl = p.video_file_url || p.video_url;
    if (!inputUrl) {
      results.push({ id: p.id, name: p.name, ok: false, reason: 'no video url' });
      continue;
    }
    try {
      const { videoUrl, blobPath, sizeBytes } = await burnQrAndUpload({
        inputUrl,
        slug: creatorSlug,
        title: p.name,
        category: p.category,
        bucket: bucket || p.category || 'misc',
      });
      const { error: insertErr } = await supabase
        .from('creator_video_assignments')
        .insert({
          creator_slug: creatorSlug,
          video_url: videoUrl,
          blob_path: blobPath,
          title: p.name,
          category: p.category,
          bucket: bucket || p.category || 'misc',
          size_bytes: sizeBytes,
          is_active: true,
        });
      if (insertErr) throw insertErr;
      results.push({ id: p.id, name: p.name, ok: true, videoUrl });
    } catch (err) {
      results.push({ id: p.id, name: p.name, ok: false, reason: String(err.message || err) });
    }
  }

  return res.status(200).json({ creator: creatorSlug, actor, results });
}
