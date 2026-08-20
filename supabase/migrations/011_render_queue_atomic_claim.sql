-- 011 · Atomic claim for the render queue
-- Applied to production 2026-08-20.
--
-- PROBLEM
-- Two daemons read the identical queue
--   (should_generate = true AND generation_status IS NULL):
--     * ai.digitalbloom.monique.video-generator   — xAI /v1/videos API
--     * ai.digitalbloom.grok-playwright-renderer  — grok.com web UI (built as a
--       fallback during the 2026-05-13 API outage, never gated afterwards)
-- Neither claimed a row before working it, so both could take the same row and
-- render — and pay for — it twice. Caught 2026-08-20 during the Thank You batch:
-- the web renderer took "For the Mechanic" and timed out at 480s while the API
-- daemon was working the same list. Both daemons have been loaded since May.
--
-- WHY A FUNCTION AND NOT A FILTERED PATCH
-- PostgREST re-applies the request's filters to the rows it returns, so a
-- conditional UPDATE filtered on `claimed_by IS NULL` comes back as an EMPTY
-- array even when it succeeded — the row no longer matches the filter it was
-- selected by. A caller checking "did I get a row back" always reads false and
-- never renders anything. Verified against this project before shipping.
-- Doing the update and returning the answer in one statement removes the
-- ambiguity. Tested with 8 concurrent claimers on one row: exactly one wins.

ALTER TABLE prompt_engine_custom_prompts
  ADD COLUMN IF NOT EXISTS claimed_by TEXT,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_pecp_render_queue
  ON prompt_engine_custom_prompts (created_at)
  WHERE should_generate = true AND generation_status IS NULL;

CREATE OR REPLACE FUNCTION claim_render_row(
  p_id      UUID,
  p_worker  TEXT,
  p_stale_minutes INT DEFAULT 45
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_claimed INT;
BEGIN
  UPDATE prompt_engine_custom_prompts
     SET claimed_by = p_worker,
         claimed_at = now()
   WHERE id = p_id
     AND generation_status IS NULL
     AND (claimed_by IS NULL
          OR claimed_at < now() - make_interval(mins => p_stale_minutes));
  GET DIAGNOSTICS v_claimed = ROW_COUNT;
  RETURN v_claimed = 1;
END;
$$;

CREATE OR REPLACE FUNCTION release_render_row(p_id UUID)
RETURNS VOID
LANGUAGE SQL
AS $$
  UPDATE prompt_engine_custom_prompts
     SET claimed_by = NULL,
         claimed_at = NULL,
         generation_status = NULL,
         generation_tasks = NULL,
         generation_error = NULL,
         generation_model = NULL,
         generation_started_at = NULL,
         should_generate = TRUE
   WHERE id = p_id;
$$;
