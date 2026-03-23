# Video Library — Setup Guide for Ak

## What was built

A new "My Videos" screen for your prompt engine. Here's what it does:

- You open the app on your phone after generating a video in Grok
- You log the video: pick the category, the style name (like "Golden Rose"), which scene number it is, and paste the Grok prompt you used
- You pick the video file straight from your camera roll to upload it
- The app auto-generates a clean filename like: `DB_Birthday_GoldenRose_S01of07_Mar2026.mp4`
- When you're ready, you tap "Mark Ready" and the app gives you the exact message to send OpenClaw
- OpenClaw checks the database, processes everything, and messages you back with a summary

---

## Files that were changed (in your prompt engine repo)

Copy these 4 files from the workspace folder into your `digital-bloom-prompt-engine` folder:

| File | What it is |
|------|-----------|
| `src/components/VideoLibrary.jsx` | The new My Videos screen — NEW FILE |
| `src/components/Navigation.jsx` | Updated to add "My Videos" to the bottom nav |
| `src/App.jsx` | Updated to connect the new screen |
| `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` | Instructions for OpenClaw — put this in the root of the repo |

---

## Step 1 — Run the SQL in Supabase

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `video-library-migration.sql` and copy all of it
5. Paste it into Supabase and click **Run**
6. You should see "Success" — that creates the table and the storage bucket

---

## Step 2 — Copy the files into your repo

Using Finder:
1. Open your `digital-bloom-prompt-engine` folder on your Desktop
2. Replace `src/components/Navigation.jsx` with the new one from workspace
3. Replace `src/App.jsx` with the new one from workspace
4. Copy `src/components/VideoLibrary.jsx` (new file — just add it, don't replace anything)
5. Copy `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` to the root of the repo

---

## Step 3 — Commit and push

In GitHub Desktop:
1. You should see 4 changed files
2. Write a commit message: "Add Video Library screen for organizing Grok videos"
3. Click Commit to main
4. Click Push origin
5. The app will auto-deploy to Vercel within about 60 seconds

---

## Step 4 — Give OpenClaw the instructions

Once the file `OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md` is in the repo and pushed, tell OpenClaw:

> "Read the file OPENCLAW_VIDEO_FILING_INSTRUCTIONS.md in the digital-bloom-prompt-engine repo. That's your job description for handling my video library going forward."

---

## How the full workflow works (the big picture)

```
You generate video in Grok
        ↓
Open prompt engine → My Videos → Log New Video
Pick from camera roll, paste prompt, tap Log
        ↓
Tap "Mark Ready" when you're done with a batch
        ↓
App gives you the exact message to copy
        ↓
Paste it in Telegram → send to OpenClaw
        ↓
OpenClaw checks the database, organizes everything,
messages you back: "Done — 3 videos filed"
        ↓
When a full 7-scene sequence is complete,
OpenClaw flags it: "Ready to add to the site"
```

---

## The naming convention

Every video gets auto-named using this format:

`DB_[Category]_[Style]_S[SceneNumber]of[TotalScenes]_[Month][Year].mp4`

Real examples:
- `DB_Birthday_GoldenRose_S01of07_Mar2026.mp4`
- `DB_MothersDay_Garden_S04of07_Mar2026.mp4`
- `DB_Sympathy_Serene_S07of07_Mar2026.mp4`

This means when you have all 7 scenes filed, you immediately know it's a complete set and it's named so that sorting by filename keeps everything in order.
