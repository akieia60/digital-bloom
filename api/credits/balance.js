import { createClient } from '@supabase/supabase-js';
import { applyCors } from '../_lib/cors.js';

/**
 * GET /api/credits/balance?code=DBLOOM-XXXX-XXXX
 *
 * Returns the current balance for an experience credit code.
 * Uses the Supabase service role key (server-side only).
 */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS check
  if (!applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Credit code is required (pass as ?code=DBLOOM-XXXX-XXXX)' });
    }

    // Look up credit in database
    const { data: credit, error } = await supabase
      .from('experience_credits')
      .select('code, initial_amount_cents, remaining_amount_cents, status, created_at')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('Error fetching credit balance:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!credit) {
      return res.status(404).json({ error: 'Credit code not found' });
    }

    res.status(200).json({
      code: credit.code,
      initial_amount_cents: credit.initial_amount_cents,
      remaining_amount_cents: credit.remaining_amount_cents,
      status: credit.status,
      created_at: credit.created_at,
    });
  } catch (error) {
    console.error('Error in /api/credits/balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
