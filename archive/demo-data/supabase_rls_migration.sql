-- ============================================================================
-- DIGITAL BLOOM — Row Level Security (RLS) Hardening Migration
-- ============================================================================
--
-- PURPOSE:
--   Tighten RLS policies across ALL tables so that:
--     1. Regular users can only read/write their OWN data.
--     2. The Supabase service_role key (used by Vercel serverless functions)
--        bypasses RLS automatically — no extra policy needed.
--     3. Public (anon) users can only read active products and validate
--        credit codes — nothing else.
--
-- HOW TO RUN:
--   1. Open your Supabase project dashboard.
--   2. Go to SQL Editor (left sidebar).
--   3. Paste this entire file and click "Run".
--   4. Verify by running:
--        SELECT tablename, rowsecurity FROM pg_tables
--        WHERE schemaname = 'public';
--
-- NOTE: The service_role key automatically bypasses RLS in Supabase,
-- so our Vercel API functions (which use SUPABASE_SERVICE_ROLE_KEY)
-- will continue to work without any policy changes.
--
-- SAFE TO RE-RUN: Uses IF EXISTS / IF NOT EXISTS where possible.
-- ============================================================================


-- ─── 1. PRODUCTS ─────────────────────────────────────────────────────────────

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop old overly-permissive policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Authenticated users can see all products" ON products;

-- Anon + authenticated can read ACTIVE products only
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Only service_role (via API) can insert/update/delete products.
-- No explicit policy needed — service_role bypasses RLS.


-- ─── 2. USERS / PROFILES ────────────────────────────────────────────────────

-- The table may be called "users" or "profiles" depending on your schema.
-- We handle both. If a table doesn't exist the ALTER will simply fail silently
-- in a transaction, so we wrap each in a DO block.

DO $$ BEGIN
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own data" ON users;
  DROP POLICY IF EXISTS "Users can update own data" ON users;

  CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- If you have a separate "profiles" table:
DO $$ BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;


-- ─── 3. PURCHASES ────────────────────────────────────────────────────────────

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Inserts and updates are done by the service_role (webhook handler).


-- ─── 4. CART ITEMS ───────────────────────────────────────────────────────────

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert to own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);


-- ─── 5. EXPERIENCE CREDITS ──────────────────────────────────────────────────

ALTER TABLE experience_credits ENABLE ROW LEVEL SECURITY;

-- Remove old wide-open policies
DROP POLICY IF EXISTS "Anyone can validate credits" ON experience_credits;
DROP POLICY IF EXISTS "Service can insert credits" ON experience_credits;
DROP POLICY IF EXISTS "Service can update credits" ON experience_credits;

-- Anon/authenticated can only SELECT (validate a code) — not modify
CREATE POLICY "Anyone can validate credits (read only)"
  ON experience_credits FOR SELECT
  USING (true);

-- All inserts/updates are done via service_role from the webhook.


-- ─── 6. EXPERIENCE CREDIT LEDGER ────────────────────────────────────────────

ALTER TABLE experience_credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view ledger" ON experience_credit_ledger;
DROP POLICY IF EXISTS "Service can insert ledger" ON experience_credit_ledger;

-- Users should NOT be able to read the full ledger via the client.
-- If you need a user-facing ledger, add a policy scoped to their credits.
-- For now, only service_role can read/write.

-- (No SELECT policy = no client access. Service role bypasses RLS.)


-- ─── 7. EXPERIENCE CREDIT RESERVATIONS ──────────────────────────────────────

ALTER TABLE experience_credit_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage reservations" ON experience_credit_reservations;

-- Only service_role manages reservations (from /api/credits/reserve).
-- No client-side access needed.


-- ─── 8. SCHEDULED CREDIT EMAILS ─────────────────────────────────────────────

ALTER TABLE scheduled_credit_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage scheduled emails" ON scheduled_credit_emails;

-- Only service_role manages scheduled emails.


-- ─── 9. PROMPT LIBRARY (if exists) ──────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view prompts" ON prompt_library;

  CREATE POLICY "Anyone can view prompts"
    ON prompt_library FOR SELECT
    USING (true);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;


-- ============================================================================
-- VERIFICATION QUERIES (run these after the migration to confirm)
-- ============================================================================
--
-- Check RLS is enabled on all tables:
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;
--
-- List all policies:
--   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
--
-- ============================================================================
