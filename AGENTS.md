# Digital Bloom — Agent Instructions

> **IMPORTANT:** This file is intentionally minimal as of May 9, 2026.
> The full project context, team roster, current priorities, and session state
> all live in Notion. Always read Notion first — never rely on this file alone.

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
- Any handoffs for other agents (use the Breadcrumb Protocol format in the Hub)

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
| Audio guide | https://digitalbloom.store/guide |

---

## Critical Rules (never break these — these override everything)

- Navy `#0D1B36` for dark backgrounds — NEVER pure black
- Gold `#D4AF37` for accents, CTAs, watermarks
- Fonts: Playfair Display (headings), Outfit (body), Cormorant Garamond (accents)
- Brand name always: **Digital Bloom™** (with ™). Never "Digital Balloon."
- Never hardcode category lists outside `src/data/categories.js`
- Never break `/prompt-engine.html` — Ak uses it daily from her phone
- All blooms must be silent (audio stripped). `ffmpeg -movflags +faststart` is mandatory on every MP4 destined for the storefront.
- Watermark is baked in-video via ffmpeg drawtext — never DOM overlay
- Do NOT run `npm run build` locally on Ak's Mac mini — Vite hangs. Vercel runs the real build on every push.
- Ak uses GitHub Desktop, not terminal git. Agents may push directly when work is done.

---

## Build & Deploy Hygiene

- **Verify changes** with `npm run lint` and `npm run validate-categories` before pushing.
- `vercel-build` is the production build script — do not modify it.
- The local `build` script has a 180s hard timeout via `scripts/safe-build.js` to prevent orphaned processes.

---

## How Ak Works (agent tone + scope)

- Ak drives a truck. Her primary device is her phone. Keep responses mobile-first, low taps.
- Default to action on small reversible work. Don't ask "which way?" — pick a path and execute.
- Don't run interactive commands that need her keyboard. Tell her exactly what to tap and where.

---

*Last updated: May 9, 2026 by Magic (Manus) — Hub-and-Spoke architecture implemented.*
