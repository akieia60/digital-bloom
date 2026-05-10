import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEAM_CAL_KEY = process.env.TEAM_CAL_KEY;

const ALLOWED_FIELDS = new Set([
  'event_date',
  'event_name',
  'prep_start_date',
  'content_idea',
  'platform_focus',
  'notes',
  'status',
  'owner',
]);

const ALLOWED_STATUSES = new Set(['planned', 'in-production', 'scheduled', 'live', 'done']);

function authorized(req) {
  if (!TEAM_CAL_KEY) return false;
  const headerKey = req.headers['x-team-cal-key'];
  const bodyKey = req.body?.key;
  return headerKey === TEAM_CAL_KEY || bodyKey === TEAM_CAL_KEY;
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('content_calendar')
      .select('id, event_date, event_name, prep_start_date, content_idea, platform_focus, notes, status, owner, sort_key, updated_at, updated_by')
      .order('sort_key', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, must-revalidate');
    return res.status(200).json({ events: data || [] });
  }

  if (req.method === 'PATCH') {
    if (!authorized(req)) return res.status(403).json({ error: 'Invalid team key' });

    const { id, updates, by } = req.body || {};
    if (!id || !updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'id and updates required' });
    }

    const filtered = {};
    for (const [k, v] of Object.entries(updates)) {
      if (!ALLOWED_FIELDS.has(k)) continue;
      filtered[k] = v;
    }
    if (filtered.status && !ALLOWED_STATUSES.has(filtered.status)) {
      return res.status(400).json({ error: `status must be one of ${[...ALLOWED_STATUSES].join(', ')}` });
    }
    if (Object.keys(filtered).length === 0) {
      return res.status(400).json({ error: 'no valid fields to update' });
    }
    filtered.updated_at = new Date().toISOString();
    if (by) filtered.updated_by = String(by).slice(0, 64);

    const { data, error } = await supabase
      .from('content_calendar')
      .update(filtered)
      .eq('id', id)
      .select('id, event_date, event_name, prep_start_date, content_idea, platform_focus, notes, status, owner, sort_key, updated_at, updated_by')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ event: data });
  }

  if (req.method === 'POST') {
    if (!authorized(req)) return res.status(403).json({ error: 'Invalid team key' });

    const { event, by } = req.body || {};
    if (!event || !event.event_date || !event.event_name) {
      return res.status(400).json({ error: 'event_date and event_name required' });
    }

    const row = {};
    for (const [k, v] of Object.entries(event)) {
      if (!ALLOWED_FIELDS.has(k)) continue;
      row[k] = v;
    }
    row.sort_key = event.sort_key || event.event_date;
    if (by) row.updated_by = String(by).slice(0, 64);

    const { data, error } = await supabase
      .from('content_calendar')
      .insert(row)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ event: data });
  }

  if (req.method === 'DELETE') {
    if (!authorized(req)) return res.status(403).json({ error: 'Invalid team key' });
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });
    const { error } = await supabase.from('content_calendar').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
