import { createClient } from '@supabase/supabase-js';
import { applyCors } from '../_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const VALID_KINDS = new Set(['product', 'render', 'marketing']);
const VALID_AUTHORS = new Set(['ak', 'gamble', 'david', 'monique', 'aubrey', 'gam', 'linda', 'other']);

function authOk(token) {
  return Boolean(ADMIN_TOKEN) && token === ADMIN_TOKEN;
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  const token = (req.query?.token || req.body?.token || '').toString();
  if (!authOk(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { status, target_kind, target_ref, limit } = req.query || {};
    let query = supabase.from('product_feedback').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', String(status));
    if (target_kind) query = query.eq('target_kind', String(target_kind));
    if (target_ref) query = query.eq('target_ref', String(target_ref));
    const limitNum = Math.min(Number.parseInt(limit, 10) || 200, 500);
    query = query.limit(limitNum);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ feedback: data || [] });
  }

  if (req.method === 'POST') {
    const { action } = req.body || {};

    if (action === 'resolve') {
      const { id, resolved_by } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase
        .from('product_feedback')
        .update({
          status: 'resolved',
          resolved_by: String(resolved_by || 'unknown').slice(0, 40),
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ feedback: data });
    }

    if (action === 'reopen') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase
        .from('product_feedback')
        .update({ status: 'open', resolved_by: null, resolved_at: null })
        .eq('id', id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ feedback: data });
    }

    // Default action = create
    const {
      target_kind,
      target_ref,
      target_label = null,
      target_thumb_url = null,
      target_video_url = null,
      author,
      body,
    } = req.body || {};

    if (!VALID_KINDS.has(String(target_kind))) {
      return res.status(400).json({ error: `target_kind must be one of: ${[...VALID_KINDS].join(', ')}` });
    }
    if (!target_ref) return res.status(400).json({ error: 'target_ref is required' });
    if (!VALID_AUTHORS.has(String(author).toLowerCase())) {
      return res.status(400).json({ error: `author must be one of: ${[...VALID_AUTHORS].join(', ')}` });
    }
    const trimmedBody = String(body || '').trim();
    if (!trimmedBody) return res.status(400).json({ error: 'body is required' });

    const { data, error } = await supabase
      .from('product_feedback')
      .insert({
        target_kind,
        target_ref: String(target_ref),
        target_label: target_label ? String(target_label).slice(0, 200) : null,
        target_thumb_url: target_thumb_url ? String(target_thumb_url) : null,
        target_video_url: target_video_url ? String(target_video_url) : null,
        author: String(author).toLowerCase(),
        body: trimmedBody.slice(0, 4000),
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ feedback: data });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}
