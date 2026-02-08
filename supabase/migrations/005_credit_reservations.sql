-- ============================================
-- CREDIT RESERVATIONS TABLE
-- ============================================
-- Prevents abuse by reserving credits before checkout

CREATE TABLE IF NOT EXISTS experience_credit_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID REFERENCES experience_credits(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  reserved_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  stripe_session_id TEXT,
  
  CONSTRAINT valid_reservation_status CHECK (status IN ('reserved', 'released', 'captured'))
);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_reservations_status ON experience_credit_reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expires ON experience_credit_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe ON experience_credit_reservations(stripe_session_id);

-- Enable RLS
ALTER TABLE experience_credit_reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Service can manage reservations
CREATE POLICY "Service can manage reservations" ON experience_credit_reservations
  FOR ALL USING (true);

-- ============================================
-- SCHEDULED EMAILS TABLE
-- ============================================
-- For scheduled credit delivery emails

CREATE TABLE IF NOT EXISTS scheduled_credit_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID REFERENCES experience_credits(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  delivery_date TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_email_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Index for scheduled delivery
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_delivery ON scheduled_credit_emails(delivery_date, status);

-- Enable RLS
ALTER TABLE scheduled_credit_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Service can manage scheduled emails
CREATE POLICY "Service can manage scheduled emails" ON scheduled_credit_emails
  FOR ALL USING (true);

COMMENT ON TABLE experience_credit_reservations IS 'Temporary reservations to prevent credit abuse during checkout';
COMMENT ON TABLE scheduled_credit_emails IS 'Queue for scheduled credit delivery emails';
