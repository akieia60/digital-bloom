import { createClient } from '@supabase/supabase-js';
import { applyCors } from '../_lib/cors.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // FIX #6 — CORS hardening (replaces wildcard origin)
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, order_total_cents } = req.body;

    if (!code || !order_total_cents) {
      return res.status(400).json({ error: 'Code and order total are required' });
    }

    // Look up credit
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (creditError || !credit) {
      return res.status(404).json({ error: 'Invalid credit code' });
    }

    // Check if credit is usable
    if (credit.status !== 'active' && credit.status !== 'partially_used') {
      return res.status(400).json({ error: 'Credit is not active' });
    }

    if (credit.remaining_amount_cents <= 0) {
      return res.status(400).json({ error: 'Credit has no remaining balance' });
    }

    // Calculate how much to reserve (min of credit balance and order total)
    const reserved_cents = Math.min(credit.remaining_amount_cents, order_total_cents);

    // Create reservation (expires in 15 minutes)
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { data: reservation, error: resError } = await supabase
      .from('experience_credit_reservations')
      .insert({
        credit_id: credit.id,
        code: credit.code,
        reserved_cents,
        status: 'reserved',
        expires_at
      })
      .select()
      .single();

    if (resError) {
      console.error('Reservation error:', resError);
      return res.status(500).json({ error: 'Failed to reserve credit' });
    }

    res.status(200).json({
      reservation_id: reservation.id,
      applied_cents: reserved_cents,
      remaining_after_cents: credit.remaining_amount_cents - reserved_cents,
      expires_at
    });

  } catch (error) {
    console.error('Error reserving credit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
