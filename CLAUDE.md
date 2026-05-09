# Digital Bloom — Agent Instructions

> **IMPORTANT:** Do not use this file as your primary source of context.
> It is intentionally minimal. All project context, rules, and team state live in Notion.

## Your First Two Steps (mandatory, every session)

1. **Read the Master Briefing:**
   https://www.notion.so/34e4b19f45c98127ab30c9c3603547d8

2. **Read the Agent Coordination Hub** (check for handoffs addressed to you, see what other agents have done):
   https://www.notion.so/35b4b19f45c981b983e6fcef2df9e62b

## Your Last Step (mandatory, every session)

Before ending your session, add a log entry to the Agent Coordination Hub with:
- Your agent name
- The date
- What you completed
- Any handoffs for other agents

## Quick Reference

| What | Where |
|------|-------|
| Live site | https://digitalbloom.store |
| GitHub repo | https://github.com/akieia60/digital-bloom |
| Vercel project | flower-shop (auto-deploys from `main`) |
| Supabase project | yhdbeblowolfinxxhsnt |
| Admin archive | https://digitalbloom.store/admin/archive.html?token=... |
| Prompt engine | https://digitalbloom.store/prompt-engine.html |

## Critical Rules (never break these)

- Navy `#0D1B36` for dark backgrounds — NEVER pure black
- Gold `#D4AF37` for accents, CTAs, watermarks
- Fonts: Playfair Display (headings), Outfit (body)
- Brand name always: **Digital Bloom™** (with ™)
- Never hardcode category lists outside `src/data/categories.js`
- Never break `/prompt-engine.html` — Ak uses it daily from her phone
- All blooms must be silent (audio stripped). `ffmpeg -movflags +faststart` is mandatory on every MP4.
- Watermark is baked in-video via ffmpeg — never DOM overlay

*Last updated: May 9, 2026 by Magic (Manus)*
