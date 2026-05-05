# Agents Briefing — Digital Bloom

> Universal context for ANY AI coding agent (Claude Code, Antigravity,
> Cursor, GitHub Copilot, etc.) opening this repository.
>
> **Tool-specific files:** `CLAUDE.md` (Claude Code) is more detailed —
> read it for the full project context. `AGENTS.md` is the cross-tool
> briefing every agent should read first.

---

## What this repo is

**Digital Bloom** — a luxury digital gifting platform. Customers send animated video bouquets ("blooms") for occasions (Mother's Day, birthday, anniversary, sympathy, …) instead of physical flowers.

- **Live site:** digitabloom.com (note: `.com` has no L)
- **Storefront:** digitalbloom.store (note: `.store` has the L)
- **Owner:** Ak (Akieia Davis, GitHub: `akieia60`)
- **Business partner:** Gamble — does UI/UX walkthroughs, drives feature requests
- **Stack:** React 19 + Vite 7 frontend, Vercel serverless functions in `api/`, Supabase Postgres, Stripe Checkout
- **Hosting:** Vercel (auto-deploys on push to `main`)

---

## Workstation map (this matters for context)

Ak runs the project from two machines:

| Machine     | Antigravity instance name | Path to this repo                                  |
|-------------|---------------------------|----------------------------------------------------|
| Mac mini    | "Deuce"                   | `/Users/ak/Documents/GitHub/digital-bloom`         |
| MacBook Pro | "Aubrey"                  | `/Users/akieiamonniquedavis/Documents/GitHub/digital-bloom` |

**Both Antigravity instances and BOTH machines share this single GitHub repo as the source of truth.** Cross-machine sync = `git pull` before working, `git push` after. There is no other sync mechanism.

In addition, Ak runs **5 standing Claude Code lanes** as detached `screen` sessions on each Mac (only Mac mini is fully populated today):

- **Deuce** — code & ship lane (this repo's primary author)
- **Monique** — runs the Monique daemon that generates bloom videos via Grok / Higgsfield
- **Aubrey** — audio briefer; writes chapters to `public/guide.html` after every substantial work block
- **Gam** — business operations lane (LLC paperwork, banking, copyright filings)
- **Linda** — ground control; system health, lane liveness, daemon monitoring

The lanes communicate via a cross-lane inbox at `~/.openclaw/inbox/{lane}/*.md` (NOT in this repo — local per-machine).

---

## Single source of truth: categories

`src/data/categories.js` is the canonical taxonomy for everything category-related (slugs, names, taglines, accent colors, expected counts).

**Never hardcode a category list anywhere else.** Drift silently misroutes uploads. The build guard at `scripts/validate-categories.js` runs on every Vercel build (`vercel-build` script) and fails the deploy if `cat:` strings in `public/prompt-engine.html` don't map to canonical slugs, or if per-category counts drift.

Consumers that read `categories.js`: `api/process-bloom.js`, `src/pages/Shop.jsx`, `src/pages/CategoryPage.jsx`, `src/components/ProductGrid.jsx`, `src/components/landing/CategoryGrid.jsx`, `src/pages/Admin.jsx`, `scripts/generate-sitemap.js`.

---

## Build hygiene (read this — agents have wedged the system before)

**Do NOT run `npm run build` or `vite build` locally on Ak's Mac mini.** Vite hangs in that environment and orphans `esbuild --service` daemons. Multiple agents have piled up wedged build chains here.

- **Vercel runs the real build** via the `vercel-build` script on every push and is the source of truth.
- **Verify changes** with `npm run lint`, `npm run validate-categories`, or by reading the diff.
- The local `build` script is wrapped by `scripts/safe-build.js` (180s hard timeout, kills the whole process group on hang) so even if you forget the rule, you can't orphan processes anymore. But you still won't get a useful artifact.
- `vercel-build` is unchanged — production deploys are unaffected by the local wrapper.

---

## Design system (Brand-critical — never deviate)

| Color       | Hex       | Use                                       |
|-------------|-----------|-------------------------------------------|
| Navy Blue   | `#0D1B36` | Dark backgrounds (hero, category headers) |
| Pure Gold   | `#D4AF37` | Accents, watermarks, CTAs                 |
| White       | `#FFFFFF` | Text on dark backgrounds                  |
| Apple Dark  | `#1D1D1F` | Body text on white                        |
| Apple Gray  | `#6E6E73` | Secondary text                            |

**Fonts:** Playfair Display (headings) · Outfit (body) · Cormorant Garamond (accents)

**Hard rules:**
- Never use pure black (`#000000`, `#0A0A0A`) for backgrounds — always navy `#0D1B36`.
- Brand name is **Digital Bloom™** (with TM). Never "Digital Balloon."
- Hero video has a gold "Digital Bloom™" watermark in the bottom-left corner — don't remove it.
- Don't break the prompt engine URL `digitalbloom.store/prompt-engine.html` — Ak uses it daily from her phone.

---

## Current priorities (refresh date 2026-05-05)

1. **Mother's Day 2026 (deadline 2026-05-10)** — Mother's Day content is top focus. Ak reviews every video on Telegram before any goes to the site.
2. **Multi-language commercial rollout** — Spanish, Mandarin, Japanese, French, German, Vietnamese, Tagalog, Portuguese-BR. Multi-ethnicity casts. Dual watermark, 45s minimum.
3. **Stripe live mode** — currently sandbox. Blocked until Mercury account opens.
4. **Copyright filings** — heroes + first video of every category being filed.

---

## How Ak works (style cues for agent tone + scope)

- Ak drives a truck. Her primary device is her phone. Mobile-first responses, low taps, bookmarks stable.
- Wrap user-facing replies in a single fenced code block by default — she uses iOS Speak Screen with a programmed voice and needs one tap target. Drop the box only when she says "drop the box."
- Default to action on small reversible work (<$50). Don't ask "which way?" — pick a path.
- She uses GitHub Desktop, not terminal git. But Claude / Antigravity agents may push directly when the work is done.
- Don't run interactive commands that need her keyboard. If you need her to type something, tell her exactly what to tap and where.

---

## When you start a new session

1. `git pull origin main` — make sure you have the latest, especially Aubrey's chapter additions and Gamble's UI feedback merges.
2. Read `CLAUDE.md` if you're Claude (more detail than this file). Otherwise this file is enough to start.
3. Check `public/guide.html` — the audio chapters tell you the project's narrative arc.
4. If the work touches storefront/admin pages, glance at `public/admin/archive.html` (Gamble reviews here daily).

---

## Cross-machine sync rhythm (Mac mini ↔ MacBook Pro)

```
On the OLD machine before walking away:
  GitHub Desktop → "Push origin"   (only if there are pending commits)

On the NEW machine when you arrive:
  GitHub Desktop → "Fetch origin" → "Pull origin"
```

That's the entire ritual. Both Antigravity instances + both Claude Code lane systems will see identical state immediately after.
