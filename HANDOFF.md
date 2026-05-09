# Digital Bloom — Handoff Notes

> **IMPORTANT:** As of May 9, 2026, all active handoff notes are maintained in Notion.
> This file is kept for historical reference only. Do not add new handoff notes here.

---

## Where to Find Current Handoffs

**Agent Coordination Hub (live, always current):**
https://www.notion.so/35b4b19f45c981b983e6fcef2df9e62b

The Hub contains:
- Active handoffs between agents (with [OPEN] / [DONE] status markers)
- Session logs from all agents
- The full agent roster and Breadcrumb Protocol

**Master Briefing (full project context):**
https://www.notion.so/34e4b19f45c98127ab30c9c3603547d8

---

## Historical Archive (April 2026 — do not modify)

The following is a preserved record of work completed in April 2026 before the Notion Hub-and-Spoke system was implemented.

### Completed (April 2026)

- Watermark redesigned: clean "Digital Bloom™" italic gold badge, no black outline
- Bloom view limit: 30 max opens tracked via `download_count` in Supabase
- Card text readability fixed: dark navy overlays `rgba(6,14,26,0.72)`
- Acknowledgement category added with 20 prompts
- Raw Idea Refiner panel added to prompt engine
- Gamble submit mode added (`?submit=1`)
- JS syntax error in prompt `ack-18` fixed (apostrophe in single-quoted string)

### Still Open as of April 22, 2026 (check Notion Hub for current status)

- `ANTHROPIC_API_KEY` needs to be added to Vercel env vars for AI Refiner
- `prompt_engine_custom_prompts` Supabase table needs to be recreated
- Stripe live mode: swap `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` to live keys

---

*Migrated to Notion Hub-and-Spoke architecture: May 9, 2026 by Magic (Manus)*
