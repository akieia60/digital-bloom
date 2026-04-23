/**
 * api/submit-idea.js
 * Digital Bloom — Save a raw idea submission (from Gamble or others)
 *
 * POST body: { submitter, category, idea, submitted_at }
 * Returns:   { success: true, id }
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel env vars
 *
 * One-time setup: Run this SQL in your Supabase SQL Editor to create the table:
 *
 *   CREATE TABLE IF NOT EXISTS prompt_ideas (
 *     id         BIGSERIAL PRIMARY KEY,
 *     submitter  TEXT NOT NULL DEFAULT 'Gamble',
 *     category   TEXT NOT NULL,
 *     idea       TEXT NOT NULL,
 *     status     TEXT NOT NULL DEFAULT 'pending',
 *     submitted_at TIMESTAMPTZ DEFAULT NOW(),
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *   ALTER TABLE prompt_ideas ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "service_role_all" ON prompt_ideas FOR ALL USING (true);
 */

import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { submitter = 'Gamble', category, idea, submitted_at } = req.body || {};

  if (!idea || !idea.trim()) return res.status(400).json({ error: 'idea is required' });
  if (!category)             return res.status(400).json({ error: 'category is required' });

  const { data, error } = await supabase
    .from('prompt_ideas')
    .insert([{ submitter, category, idea: idea.trim(), status: 'pending', submitted_at: submitted_at || new Date().toISOString() }])
    .select('id')
    .single();

  if (error) {
    console.error('[submit-idea]', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, id: data.id });
}
