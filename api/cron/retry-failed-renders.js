// One-off recovery endpoint for purchases that completed but never rendered
// (the ffmpeg/ffprobe-on-PATH bug fixed in commit 92e930d). Auth gated by
// CRON_SECRET so it can also be triggered manually for re-runs.

import { createClient } from '@supabase/supabase-js';
import { renderBloomDelivery } from '../_lib/renderBloom.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || '';
  const userAgent = String(req.headers['user-agent'] || '');
  if (secret && authHeader === `Bearer ${secret}`) return true;
  return userAgent.includes('vercel-cron');
}

export const maxDuration = 300;

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const explicitIds = Array.isArray(req.body?.purchaseIds) ? req.body.purchaseIds : null;

  let purchases;
  if (explicitIds && explicitIds.length > 0) {
    const { data, error } = await supabase
      .from('purchases')
      .select('id, status, customer_email, download_url, composition_manifest')
      .in('id', explicitIds);
    if (error) return res.status(500).json({ error: error.message });
    purchases = data || [];
  } else {
    const { data, error } = await supabase
      .from('purchases')
      .select('id, status, customer_email, download_url, composition_manifest')
      .eq('status', 'completed')
      .is('download_url', null)
      .not('composition_manifest', 'is', null)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })
      .limit(50);
    if (error) return res.status(500).json({ error: error.message });
    purchases = data || [];
  }

  const results = [];
  for (const p of purchases) {
    if (!p.composition_manifest?.customization) {
      results.push({ id: p.id, skipped: 'no customization' });
      continue;
    }
    if (p.download_url) {
      results.push({ id: p.id, skipped: 'already rendered' });
      continue;
    }
    try {
      const out = await renderBloomDelivery(p.id);
      results.push({
        id: p.id,
        email: p.customer_email,
        ok: true,
        downloadUrl: out?.downloadUrl || out?.publicUrl || null,
      });
    } catch (err) {
      results.push({ id: p.id, email: p.customer_email, ok: false, error: err.message });
    }
  }

  return res.status(200).json({
    scanned: purchases.length,
    rendered: results.filter((r) => r.ok).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => r.ok === false).length,
    results,
  });
}
