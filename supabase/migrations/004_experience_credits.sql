-- ============================================
-- EXPERIENCE CREDITS SYSTEM
-- ============================================
-- Run this in Supabase SQL Editor to add Experience Credits support

-- Credits Table
CREATE TABLE IF NOT EXISTS experience_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  initial_amount_cents INTEGER NOT NULL,
  remaining_amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  purchaser_email TEXT NOT NULL,
  recipient_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  redeemed_at TIMESTAMP,
  stripe_session_id TEXT,
  notes TEXT,
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'partially_used', 'redeemed', 'void')),
  CONSTRAINT valid_amounts CHECK (
    remaining_amount_cents >= 0 
    AND remaining_amount_cents <= initial_amount_cents
  )
);

-- Ledger Table for tracking all credit transactions
CREATE TABLE IF NOT EXISTS experience_credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID REFERENCES experience_credits(id) ON DELETE CASCADE,
  delta_cents INTEGER NOT NULL,
  reason TEXT NOT NULL,
  related_order_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_reason CHECK (reason IN ('purchase', 'redemption', 'void', 'adjustment'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_credits_code ON experience_credits(code);
CREATE INDEX IF NOT EXISTS idx_credits_status ON experience_credits(status);
CREATE INDEX IF NOT EXISTS idx_credits_recipient ON experience_credits(recipient_email);
CREATE INDEX IF NOT EXISTS idx_credits_purchaser ON experience_credits(purchaser_email);
CREATE INDEX IF NOT EXISTS idx_ledger_credit ON experience_credit_ledger(credit_id);
CREATE INDEX IF NOT EXISTS idx_ledger_order ON experience_credit_ledger(related_order_id);

-- Enable Row Level Security
ALTER TABLE experience_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_credit_ledger ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can validate a credit code (for redemption)
CREATE POLICY "Anyone can validate credits" ON experience_credits
  FOR SELECT USING (true);

-- Policy: System can insert credits (via service role)
CREATE POLICY "Service can insert credits" ON experience_credits
  FOR INSERT WITH CHECK (true);

-- Policy: System can update credits (via service role)
CREATE POLICY "Service can update credits" ON experience_credits
  FOR UPDATE USING (true);

-- Policy: Anyone can view ledger entries for their credits
CREATE POLICY "Anyone can view ledger" ON experience_credit_ledger
  FOR SELECT USING (true);

-- Policy: System can insert ledger entries (via service role)
CREATE POLICY "Service can insert ledger" ON experience_credit_ledger
  FOR INSERT WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE experience_credits IS 'Stores prepaid Experience Credits for DigitalBloom services';
COMMENT ON TABLE experience_credit_ledger IS 'Tracks all credit transactions (purchases, redemptions, adjustments)';
COMMENT ON COLUMN experience_credits.code IS 'Human-friendly credit code in format DBLOOM-XXXX-XXXX';
COMMENT ON COLUMN experience_credits.initial_amount_cents IS 'Original credit amount in cents';
COMMENT ON COLUMN experience_credits.remaining_amount_cents IS 'Current balance in cents';
COMMENT ON COLUMN experience_credit_ledger.delta_cents IS 'Change in credit balance (positive for purchase, negative for redemption)';
