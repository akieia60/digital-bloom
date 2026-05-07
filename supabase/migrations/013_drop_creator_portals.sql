-- 013_drop_creator_portals.sql (2026-05-07)
--
-- Reverses 012_creator_portals.sql. The creator-portal flow was
-- abandoned after Bre's first session — iOS Safari can't reliably
-- save cross-origin Vercel Blob URLs, so the portal couldn't deliver
-- the videos it was supposed to. Replaced by a "Bre Pull" button
-- on /admin/archive.html that burns + serves the file via the same
-- pipeline but with application/octet-stream so iOS shows the Save
-- dialog directly.
--
-- Rows + Vercel Blob files were already wiped via
-- scripts/one-off/cleanup-creator-portal.mjs --apply before this
-- migration ran. Tables are now safe to drop.

DROP TABLE IF EXISTS creator_video_assignments CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
