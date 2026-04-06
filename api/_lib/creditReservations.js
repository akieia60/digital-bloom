import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const HOLD_PREFIX = 'hold_v2:';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function makeHoldMarker() {
  return `${HOLD_PREFIX}${crypto.randomUUID()}`;
}

function isManagedHold(marker) {
  return typeof marker === 'string' && marker.startsWith(HOLD_PREFIX);
}

async function tryReserveCreditRpc(normalizedCode, requestedCents) {
  const { data, error } = await supabase.rpc('reserve_experience_credit', {
    p_code: normalizedCode,
    p_requested_cents: requestedCents,
  });

  if (error) {
    const message = error.message || '';
    const missingRpc =
      error.code === 'PGRST202' ||
      message.includes('Could not find the function public.reserve_experience_credit') ||
      message.includes('reserve_experience_credit');
    const brokenRpc =
      error.code === '42702' &&
      message.includes('expires_at') &&
      message.includes('ambiguous');

    if (missingRpc || brokenRpc) {
      return null;
    }

    throw new Error(message || 'Failed to reserve credit');
  }

  const reservationResult = Array.isArray(data) ? data[0] : data;
  if (!reservationResult?.reservation_id) {
    throw new Error('Failed to reserve credit');
  }

  const { data: reservation, error: reservationError } = await supabase
    .from('experience_credit_reservations')
    .select('*')
    .eq('id', reservationResult.reservation_id)
    .single();

  if (reservationError || !reservation) {
    throw reservationError || new Error('Reservation not found after reserve RPC');
  }

  return {
    reservation,
    applied_cents: Number(reservationResult.applied_cents || 0),
    remaining_after_cents: Number(reservationResult.remaining_after_cents || 0),
    expires_at: reservationResult.expires_at,
  };
}

async function restoreCreditBalance(creditId, cents) {
  if (!cents) return;

  const { data: credit, error: fetchError } = await supabase
    .from('experience_credits')
    .select('id, remaining_amount_cents')
    .eq('id', creditId)
    .single();

  if (fetchError || !credit) {
    throw fetchError || new Error('Credit not found while restoring balance');
  }

  const { error: updateError } = await supabase
    .from('experience_credits')
    .update({
      remaining_amount_cents: Number(credit.remaining_amount_cents || 0) + cents,
    })
    .eq('id', creditId);

  if (updateError) throw updateError;
}

export async function releaseExpiredReservations(creditId) {
  const nowIso = new Date().toISOString();

  const { data: managedExpired, error: managedError } = await supabase
    .from('experience_credit_reservations')
    .update({ status: 'released' })
    .eq('credit_id', creditId)
    .eq('status', 'reserved')
    .lte('expires_at', nowIso)
    .like('stripe_session_id', `${HOLD_PREFIX}%`)
    .select('reserved_cents');

  if (managedError) throw managedError;

  const restoredCents = (managedExpired || []).reduce(
    (sum, reservation) => sum + Number(reservation.reserved_cents || 0),
    0
  );

  if (restoredCents > 0) {
    await restoreCreditBalance(creditId, restoredCents);
  }

  const { error: legacyReleaseError } = await supabase
    .from('experience_credit_reservations')
    .update({ status: 'released' })
    .eq('credit_id', creditId)
    .eq('status', 'reserved')
    .lte('expires_at', nowIso)
    .is('stripe_session_id', null);

  if (legacyReleaseError) throw legacyReleaseError;
}

export async function reserveCreditBalance(code, requestedCents) {
  const normalizedCode = code.toUpperCase();
  const rpcReservation = await tryReserveCreditRpc(normalizedCode, requestedCents);
  if (rpcReservation) {
    return rpcReservation;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (creditError || !credit) {
      throw new Error('Invalid credit code');
    }

    if (credit.status !== 'active' && credit.status !== 'partially_used') {
      throw new Error('Credit is not active');
    }

    await releaseExpiredReservations(credit.id);

    const { data: legacyReservations, error: legacyError } = await supabase
      .from('experience_credit_reservations')
      .select('reserved_cents')
      .eq('credit_id', credit.id)
      .eq('status', 'reserved')
      .gt('expires_at', new Date().toISOString())
      .is('stripe_session_id', null);

    if (legacyError) throw legacyError;

    const legacyReservedCents = (legacyReservations || []).reduce(
      (sum, reservation) => sum + Number(reservation.reserved_cents || 0),
      0
    );

    const visibleRemaining = Number(credit.remaining_amount_cents || 0);
    const availableCents = Math.max(0, visibleRemaining - legacyReservedCents);

    if (availableCents <= 0) {
      throw new Error('Credit has no remaining balance');
    }

    const reservedCents = Math.min(availableCents, requestedCents);
    const newRemaining = visibleRemaining - reservedCents;

    const { data: updatedRows, error: updateError } = await supabase
      .from('experience_credits')
      .update({
        remaining_amount_cents: newRemaining,
      })
      .eq('id', credit.id)
      .eq('remaining_amount_cents', visibleRemaining)
      .select('id');

    if (updateError) throw updateError;
    if (!updatedRows || updatedRows.length === 0) {
      continue;
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const holdMarker = makeHoldMarker();

    const { data: reservation, error: reservationError } = await supabase
      .from('experience_credit_reservations')
      .insert({
        credit_id: credit.id,
        code: credit.code,
        reserved_cents: reservedCents,
        status: 'reserved',
        expires_at: expiresAt,
        stripe_session_id: holdMarker,
      })
      .select()
      .single();

    if (reservationError) {
      await restoreCreditBalance(credit.id, reservedCents);
      throw reservationError;
    }

    return {
      reservation,
      applied_cents: reservedCents,
      remaining_after_cents: Math.max(0, availableCents - reservedCents),
      expires_at: expiresAt,
    };
  }

  throw new Error('Could not safely reserve credit. Please try again.');
}

export async function captureReservedCredit(reservationId, stripeSessionId) {
  const { data: reservation, error: resError } = await supabase
    .from('experience_credit_reservations')
    .select('*, experience_credits(*)')
    .eq('id', reservationId)
    .single();

  if (resError || !reservation) throw new Error('Reservation not found');
  if (reservation.status === 'captured') return reservation;

  const holdAlreadyApplied = isManagedHold(reservation.stripe_session_id);

  if (!holdAlreadyApplied) {
    const currentRemaining = Number(reservation.experience_credits.remaining_amount_cents || 0);
    const newBalance = Math.max(0, currentRemaining - reservation.reserved_cents);
    const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

    const { error: creditUpdateError } = await supabase
      .from('experience_credits')
      .update({
        remaining_amount_cents: newBalance,
        status: newStatus,
        redeemed_at: newBalance === 0 ? new Date().toISOString() : null,
      })
      .eq('id', reservation.credit_id);

    if (creditUpdateError) throw creditUpdateError;
  } else {
    const currentRemaining = Number(reservation.experience_credits.remaining_amount_cents || 0);
    const newStatus = currentRemaining === 0 ? 'redeemed' : 'partially_used';

    const { error: creditUpdateError } = await supabase
      .from('experience_credits')
      .update({
        status: newStatus,
        redeemed_at: currentRemaining === 0 ? new Date().toISOString() : null,
      })
      .eq('id', reservation.credit_id);

    if (creditUpdateError) throw creditUpdateError;
  }

  const { error: ledgerError } = await supabase.from('experience_credit_ledger').insert({
    credit_id: reservation.credit_id,
    delta_cents: -reservation.reserved_cents,
    reason: 'redemption',
    related_order_id: stripeSessionId,
  });

  if (ledgerError) throw ledgerError;

  const { error: reservationUpdateError } = await supabase
    .from('experience_credit_reservations')
    .update({
      status: 'captured',
      stripe_session_id: stripeSessionId,
    })
    .eq('id', reservationId);

  if (reservationUpdateError) throw reservationUpdateError;

  return reservation;
}
