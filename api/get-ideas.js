/**
 * api/get-ideas.js
 * Digital Bloom — Retrieve pending idea submissions for Ak to review
 *
 * GET  → returns { ideas: [...] }
 * DELETE ?id=123 → marks idea as dismissed
 */

import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('prompt_ideas')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('[get-ideas]', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ideas: data || [] });
  }

  if (req.method === 'DELETE') {
    const id = req.query?.id;
    if (!id) return res.status(400).json({ error: 'id is required' });

    const { error } = await supabase
      .from('prompt_ideas')
      .update({ status: 'dismissed' })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
