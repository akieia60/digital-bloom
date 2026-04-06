CREATE OR REPLACE FUNCTION reserve_experience_credit(
  p_code TEXT,
  p_requested_cents INTEGER
)
RETURNS TABLE (
  reservation_id UUID,
  applied_cents INTEGER,
  remaining_after_cents INTEGER,
  expires_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credit experience_credits%ROWTYPE;
  v_reserved_active INTEGER := 0;
  v_available_cents INTEGER := 0;
  v_applied_cents INTEGER := 0;
  v_expires_at TIMESTAMP;
  v_reservation_id UUID;
BEGIN
  IF p_requested_cents IS NULL OR p_requested_cents <= 0 THEN
    RAISE EXCEPTION 'Requested amount must be greater than zero';
  END IF;

  SELECT *
  INTO v_credit
  FROM experience_credits
  WHERE code = UPPER(p_code)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid credit code';
  END IF;

  IF v_credit.status NOT IN ('active', 'partially_used') THEN
    RAISE EXCEPTION 'Credit is not active';
  END IF;

  UPDATE experience_credit_reservations
  SET status = 'released'
  WHERE credit_id = v_credit.id
    AND status = 'reserved'
    AND experience_credit_reservations.expires_at <= NOW();

  SELECT COALESCE(SUM(reserved_cents), 0)
  INTO v_reserved_active
  FROM experience_credit_reservations
  WHERE credit_id = v_credit.id
    AND status = 'reserved'
    AND experience_credit_reservations.expires_at > NOW();

  v_available_cents := GREATEST(0, v_credit.remaining_amount_cents - v_reserved_active);

  IF v_available_cents <= 0 THEN
    RAISE EXCEPTION 'Credit has no remaining balance';
  END IF;

  v_applied_cents := LEAST(v_available_cents, p_requested_cents);
  v_expires_at := NOW() + INTERVAL '15 minutes';

  INSERT INTO experience_credit_reservations (
    credit_id,
    code,
    reserved_cents,
    status,
    expires_at
  )
  VALUES (
    v_credit.id,
    v_credit.code,
    v_applied_cents,
    'reserved',
    v_expires_at
  )
  RETURNING id INTO v_reservation_id;

  RETURN QUERY
  SELECT
    v_reservation_id,
    v_applied_cents,
    v_available_cents - v_applied_cents,
    v_expires_at;
END;
$$;
