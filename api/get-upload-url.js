import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Closes the anonymous-upload-signing hole Codex flagged 2026-05-24:
// CORS alone was the only check, so any caller from an allowed origin
// could mint a Supabase upload URL. Now requires ADMIN_TOKEN — matches
// the same pattern used by api/admin/* endpoints.
function isAuthorized(req) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false;
  const header = req.headers['x-admin-token'] || req.headers['X-Admin-Token'] || '';
  const queryToken = (req.query && req.query.token) || '';
  const bodyToken = (req.body && req.body.token) || '';
  return header === expected || queryToken === expected || bodyToken === expected;
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized: ADMIN_TOKEN required' });
  }

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
