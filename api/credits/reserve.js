import { applyCors } from '../_lib/cors.js';
import { reserveCreditBalance } from '../_lib/creditReservations.js';

export default async function handler(req, res) {
  // FIX #6 — CORS hardening (replaces wildcard origin)
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, order_total_cents } = req.body;
    const normalizedCode = code?.toUpperCase();
    const requestedCents = Number.parseInt(order_total_cents, 10);

    if (!normalizedCode || !requestedCents || requestedCents <= 0) {
      return res.status(400).json({ error: 'Code and order total are required' });
    }

    const { reservation, applied_cents, remaining_after_cents, expires_at } =
      await reserveCreditBalance(normalizedCode, requestedCents);

    res.status(200).json({
      reservation_id: reservation.id,
      applied_cents,
      remaining_after_cents,
      expires_at,
    });

  } catch (error) {
    console.error('Error reserving credit:', error);
    if (error.message === 'Invalid credit code') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Credit is not active' || error.message === 'Credit has no remaining balance') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
