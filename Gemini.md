# Digital Bloom — Gemini / Antigravity Agent Instructions

> **IMPORTANT:** This file is intentionally minimal as of May 9, 2026.
> The full project context, rules, and team state live in Notion.
> Always read Notion first — never rely on this file alone.

---

## Your First Two Steps (mandatory, every session)

1. **Read the Master Briefing** — full project context, rules, architecture, team:
   https://www.notion.so/34e4b19f45c98127ab30c9c3603547d8

2. **Read the Agent Coordination Hub** — what other agents have done, active handoffs for you:
   https://www.notion.so/35b4b19f45c981b983e6fcef2df9e62b

## Your Last Step (mandatory, every session)

Before ending your session, add a log entry to the Agent Coordination Hub with:
- Your agent name and platform
- The date
- What you completed
- Any handoffs for other agents

---

## Quick Reference

| What | Where |
|------|-------|
| Live site | https://digitalbloom.store |
| GitHub repo | https://github.com/akieia60/digital-bloom |
| Vercel project | `flower-shop` (auto-deploys from `main` branch) |
| Supabase project ID | `yhdbeblowolfinxxhsnt` |
| Admin archive | https://digitalbloom.store/admin/archive.html?token=... |
| Prompt engine | https://digitalbloom.store/prompt-engine.html |

---

## Critical Rules (never break these)

- Navy `#0D1B36` for dark backgrounds — NEVER pure black
- Gold `#D4AF37` for accents, CTAs, watermarks
- Fonts: Playfair Display (headings), Outfit (body), Cormorant Garamond (accents)
- Brand name always: **Digital Bloom™** (with ™)
- Never hardcode category lists outside `src/data/categories.js`
- Never break `/prompt-engine.html` — Ak uses it daily from her phone
- All blooms must be silent. `ffmpeg -movflags +faststart` is mandatory on every MP4.
- Watermark is baked in-video via ffmpeg — never DOM overlay

---

## Historical Note

This file previously contained early-stage architecture notes from the initial Gemini/Antigravity development session (Easter 2026 launch target, dynamic theme engine concepts). Those notes are superseded by the current production architecture documented in the Master Briefing.

*Migrated to Notion Hub-and-Spoke architecture: May 9, 2026 by Magic (Manus)*
