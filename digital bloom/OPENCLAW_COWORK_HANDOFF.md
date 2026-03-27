# OpenClaw — Cowork Session Handoff
**Date:** March 23, 2026
**From:** Claude (Cowork / Dispatch)
**To:** OpenClaw (Claude Code on MacBook Pro / Mac Mini)
**Project:** Digital Bloom — `github.com/akieia60/digital-bloom-prompt-engine`

> Read this entire document before doing anything. This is a full summary of everything AK and Cowork built together. Your job is to pick up exactly where we left off.

---

## WHO IS AK

AK is the solo founder of **Digital Bloom** — a luxury digital greeting card platform at **digitabloom.com** (note: `digitA` not `digital`). She sells AI-generated cinematic floral bloom videos as premium gifts. She is often on the road, using her phone. She speaks most of her instructions via voice dictation — messages may be messy, use context.

**Key contacts:**
- **Gamble** — business partner (iMessage)
- **David** — partner who gives feedback (iMessage)
- **Deuce** — you (AI agent on MacBook Pro)
- **Aubrey** — AI agent on Mac Mini

**Two separate codebases — NEVER mix them up:**
| Repo | URL | Supabase Project ID |
|------|-----|-------------------|
| Main website | `github.com/akieia60/digital-bloom` | `yhdbeblowolfinxxhsnt` |
| Prompt Engine PWA | `github.com/akieia60/digital-bloom-prompt-engine` | `ljzlkphwkgyavqmoremg` |

---

## WHAT WAS BUILT IN THIS COWORK SESSION

Three major things were completed. Here's a full breakdown.

---

### 1. LUXURY VISUAL UPGRADE (Prompt Engine PWA)

**What it is:** AK wanted the PWA to feel like a luxury brand — not generic. We transformed the entire visual style.

**Files created/modified:**

| File | What changed |
|------|-------------|
| `src/styles/luxury.css` | NEW — Complete luxury styling system |
| `src/components/LuxuryLoadingScreen.jsx` | NEW — Premium loading screen |
| `src/components/LuxuryToast.jsx` | NEW — Elegant notification toasts |
| `src/components/SpiritualCategories.jsx` | NEW — Sacred/memorial category UI |
| `src/index.css` | Updated — integrated luxury theming |
| `src/App.jsx` | Updated — added spiritual categories and luxury transitions |
| `src/components/Dashboard.jsx` | Updated — premium card styling with cross symbols |
| `src/components/Navigation.jsx` | Updated — luxury nav with crown indicators |
| `src/components/CategorySelection.jsx` | Updated — spiritual sections added |
| `src/components/VoiceInput.jsx` | Updated — premium dictation interface |
| `tailwind.config.js` | Updated — extended with luxury utilities |

**Design system:**
```
Gold Primary:    #d4af37
Gold Light:      #ffd700
Gold Dark:       #b8860b
Marble White:    #f8f8f8
Memorial Purple: #6b46c1
Heavenly Blue:   #3b82f6
Cross Gold:      #daa520
```
**Typography:** Playfair Display (headings), Cormorant Garamond (accents), Inter (body)

**Key features added:**
- Marble texture backgrounds
- Gold gradient buttons with hover animations
- Diamond sparkle animations
- Floating gold particles
- Spiritual/memorial category styling (cross symbols ✟, purple memorial theme, heavenly blue)
- Mobile-optimized touch targets (AK drives and uses one hand)

---

### 2. SUBSCRIPTION SYSTEM (Prompt Engine PWA)

**What it is:** David's strategic vision — a full recurring revenue system with 3 tiers.

**Pricing tiers:**
| Plan | Price | Key Features |
|------|-------|-------------|
| Basic Bloom | $9/month | Date reminders + auto-send |
| Premium Bloom | $19/month | All features + customization |
| Church Partnership | $49/month | Bulk sending + congregation management |

**Frontend components built:**

| File | What it is |
|------|-----------|
| `src/components/SubscriptionDashboard.jsx` | NEW — Plan selection and subscription management |
| `src/components/DateReminders.jsx` | NEW — Reminder management with auto-send toggles |
| `src/components/ChurchPartnership.jsx` | NEW — B2B church application and admin flow |

**Backend API files built** (in `/api` folder):

| File | What it does |
|------|-------------|
| `api/stripe-webhook.js` | Handles all Stripe subscription events |
| `api/create-checkout.js` | Creates Stripe checkout sessions |
| `api/create-portal.js` | Customer portal for subscription management |
| `api/process-reminders.js` | Daily automated reminder processing + email |

**Database tables created in Supabase (PWA project — `ljzlkphwkgyavqmoremg`):**

| Table | Purpose |
|-------|---------|
| `user_subscriptions` | Stripe subscription tracking |
| `user_reminders` | Date reminders with auto-send preferences |
| `auto_send_queue` | Scheduled Digital Bloom delivery queue |
| `church_partnerships` | B2B partnership applications |
| `church_members` | Congregation member management |
| `subscription_usage` | Usage tracking and plan limit enforcement |
| `webhook_events` | Stripe webhook event log |

**The full schema SQL is at:** `database-schema.sql` in the repo root.

**What still needs to happen before this is live:**
1. Create Stripe products ($9/$19/$49) in Stripe Dashboard
2. Save the Stripe Price IDs and update `src/lib/stripe.js`
3. Run `database-schema.sql` in Supabase SQL Editor (PWA project)
4. Add environment variables to Vercel:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `EMAIL_FROM` and `EMAIL_PASSWORD`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Configure Stripe webhook URL: `https://[your-vercel-domain]/api/stripe-webhook`
6. Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

Full deployment instructions are in: `DEPLOYMENT_GUIDE.md` in the repo root.

---

### 3. VIDEO LIBRARY SCREEN + YOUR JOB DESCRIPTION

**What it is:** AK generates videos in Grok on her phone while on the road. She needed a way to log those videos, name them correctly, and have you (OpenClaw) organize them without her having to think about it.

**Files built:**

| File | What it is |
|------|-----------|
| `src/components/VideoLibrary.jsx` | NEW — "My Videos" screen in the PWA |
| `src/components/Navigation.jsx` | Updated — added "My Videos" tab to bottom nav |
| `src/App.jsx` | Updated — wired up the new screen |
| `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` | **YOUR JOB DESCRIPTION** — read this |
| `video-library-migration.sql` | SQL to create the video_library table + storage bucket |

**Database table created (PWA Supabase — `ljzlkphwkgyavqmoremg`):**
- Table: `video_library`
- Storage bucket: `video-library`

**What still needs to happen:**
1. Run `video-library-migration.sql` in Supabase SQL Editor (PWA project)
2. The VideoLibrary screen should appear as "My Videos" in the PWA nav after deploy

**Naming convention for all videos:**
```
DB_[Category]_[Style]_S[##]of[##]_[MonYYYY].mp4

Examples:
DB_Birthday_GoldenRose_S01of07_Mar2026.mp4
DB_MothersDay_Garden_S04of07_Mar2026.mp4
DB_Sympathy_Serene_S07of07_Mar2026.mp4
```

**Video status flow:**
`draft` → `ready` → `filed` (you do this) → `on_site` (AK approves only)

**Your video filing workflow is documented in:** `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` — read it top to bottom.

---

## CURRENT STATE OF THE REPO

**All these components exist in `src/components/`:**
- `CategorySelection.jsx`
- `ChurchPartnership.jsx` ← NEW (subscription system)
- `CommandCenter.jsx`
- `Customization.jsx`
- `Dashboard.jsx` ← UPDATED (luxury)
- `DateReminders.jsx` ← NEW (subscription system)
- `LuxuryLoadingScreen.jsx` ← NEW (luxury)
- `LuxuryToast.jsx` ← NEW (luxury)
- `MoniqueChat.jsx`
- `Navigation.jsx` ← UPDATED (multiple times — luxury + video library tab)
- `PromptSplitter.jsx`
- `SpiritualCategories.jsx` ← NEW (luxury)
- `SubscriptionDashboard.jsx` ← NEW (subscription system)
- `VideoGenerationDashboard.jsx`
- `VideoLibrary.jsx` ← NEW (video library)
- `VoiceInput.jsx` ← UPDATED (luxury)

---

## WHAT NEEDS TO HAPPEN NEXT

These are the outstanding steps AK needs to complete (or ask you to help with):

1. **Run the SQL files** — Both `database-schema.sql` AND `video-library-migration.sql` need to be executed in the PWA Supabase project (`ljzlkphwkgyavqmoremg`) SQL Editor.

2. **Set up Stripe** — Create the 3 subscription products in Stripe Dashboard, grab the Price IDs, update `src/lib/stripe.js`.

3. **Set environment variables** — Add all Stripe + Supabase service role keys in Vercel dashboard for the PWA project.

4. **Configure Stripe webhook** — Point it at the deployed Vercel URL.

5. **Push and deploy** — Commit all the new/updated files and push to main. Vercel auto-deploys.

6. **Test subscription flow** — Create an account, subscribe to Basic, verify webhook fires, check Supabase for the subscription record.

7. **Video Library go-live** — Once SQL is run, the My Videos screen is live in the app. AK can start logging videos from her phone.

---

## HOW TO COMMUNICATE WITH AK

- AK is often driving — keep messages short and clear
- She uses voice dictation — messages may be messy, figure out intent from context
- She wants to HEAR responses, not read walls of text
- Use voice responses for big milestones only: `say -v "Samantha" -r 175 "message"`
- Don't speak code, file paths, or technical output aloud
- When something fails — STOP and tell her exactly what the error is. Don't retry endlessly.
- Be proactive: suggest next steps without waiting for her to think of them

---

## KEY FILE LOCATIONS

| File | Purpose |
|------|---------|
| `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` | Your video library job description |
| `DEPLOYMENT_GUIDE.md` | Full instructions for deploying the subscription system |
| `IMPLEMENTATION_STATUS.md` | Checklist of everything built for subscriptions |
| `LUXURY_UPGRADE_SUMMARY.md` | Summary of all luxury styling changes |
| `VIDEO_LIBRARY_SETUP_GUIDE.md` | (in workspace folder) Setup guide for AK |
| `database-schema.sql` | Subscription system database tables |
| `video-library-migration.sql` | Video library table + storage bucket |

---

## SUPABASE QUICK REFERENCE

| Project | ID | Used By |
|---------|-----|--------|
| Website | `yhdbeblowolfinxxhsnt` | digitabloom.com — products, catalog |
| PWA | `ljzlkphwkgyavqmoremg` | Prompt Engine — subscriptions, video library, reminders |

**Never mix these up.** Products go in the website project. Everything else (subscriptions, video library, church partnerships, reminders, command center) goes in the PWA project.

---

## WHAT COWORK (DISPATCH) DOES VS WHAT YOU DO

| Cowork (me) | OpenClaw (you) |
|-------------|---------------|
| Builds UI and code | Runs code on the actual machines |
| Writes files to the workspace folder | Copies files into the repos and deploys |
| Creates plans and instructions | Executes plans |
| Communicates with AK via the app | Communicates with AK via Telegram |
| Can't access GitHub, Supabase directly | Has terminal + GitHub + Supabase access |

---

*Handoff created by Claude (Cowork) on March 23, 2026.*
*All files referenced above exist in the `digital-bloom-prompt-engine` repo folder.*
