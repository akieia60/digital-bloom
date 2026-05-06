#!/usr/bin/env node
/**
 * upload-creator-pack-to-blob.mjs
 * ──────────────────────────────────────────────────────────────────────
 * Walks ~/digitalbloom/handoffs/<slug>/ on the Mac, uploads every MP4
 * (and the master .zip if present) to Vercel Blob, and inserts one row
 * per video into creator_video_assignments. The /c/<slug> portal page
 * reads from those rows, so once this finishes the creator's portal is
 * fully populated.
 *
 * Usage:
 *   node scripts/upload-creator-pack-to-blob.mjs <slug>
 *
 * Env required:
 *   BLOB_READ_WRITE_TOKEN  (from .env.local — already pulled from Vercel)
 *   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent: re-running upserts the assignment rows by (creator_slug, title)
 * so we don't double-list anything.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';

const ICLOUD_ROOT = path.join(
  os.homedir(),
  'Library',
  'Mobile Documents',
  'com~apple~CloudDocs',
  'digitalbloom',
  'handoffs',
);

function stripQuotes(v) {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  const txt = fs.readFileSync(p, 'utf8');
  for (const line of txt.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    const val = stripQuotes(t.slice(eq + 1).trim());
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(path.join(os.homedir(), '.openclaw', '.env'));
loadEnvFile(path.join(process.cwd(), '.env.local'));

const slug = (process.argv[2] || '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
if (!slug) {
  console.error('Usage: node scripts/upload-creator-pack-to-blob.mjs <slug>');
  process.exit(1);
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!BLOB_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN not set. Run: vercel env pull .env.local');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase env not set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const slugFolder = path.join(ICLOUD_ROOT, slug);
if (!fs.existsSync(slugFolder)) {
  console.error(`Folder not found: ${slugFolder}`);
  console.error(`Run scripts/build-creator-pack.mjs ${slug} first.`);
  process.exit(1);
}

function bucketFromRelPath(relPath) {
  const parts = relPath.split(path.sep);
  if (parts[0] === '01-commercials') return 'commercials';
  if (parts[0] === '02-flyers')      return 'flyers';
  if (parts[0] === '03-blooms' && parts[1]) return parts[1]; // category slug
  if (relPath.endsWith('.zip')) return 'master-zip';
  return 'misc';
}

function titleFromBaseName(name) {
  return name
    .replace(/\.mp4$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')   // strip leading date
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

async function walkMp4s(rootDir) {
  const out = [];
  async function walk(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(abs);
      } else if (e.isFile()) {
        const rel = path.relative(rootDir, abs);
        if (e.name.toLowerCase().endsWith('.mp4') || e.name.toLowerCase().endsWith('.zip')) {
          out.push({ abs, rel });
        }
      }
    }
  }
  await walk(rootDir);
  return out;
}

async function upsertAssignment({ creatorSlug, videoUrl, blobPath, title, bucket, sizeBytes }) {
  // Soft "upsert" by deleting any prior row with same (creator_slug, blob_path)
  // then inserting. PG unique constraint isn't on blob_path so do it manually.
  await supabase
    .from('creator_video_assignments')
    .delete()
    .eq('creator_slug', creatorSlug)
    .eq('blob_path', blobPath);
  const { error } = await supabase
    .from('creator_video_assignments')
    .insert({
      creator_slug: creatorSlug,
      video_url: videoUrl,
      blob_path: blobPath,
      title,
      bucket,
      size_bytes: sizeBytes,
      is_active: true,
    });
  if (error) throw error;
}

async function main() {
  console.log(`▸ Uploading creator pack for: ${slug}`);
  console.log(`▸ Source:                     ${slugFolder}`);
  console.log('');

  const files = await walkMp4s(slugFolder);
  if (!files.length) {
    console.error('No MP4 or ZIP files found.');
    process.exit(1);
  }
  console.log(`▸ Found ${files.length} file(s)`);

  // Sort: zip first so it shows up at the top of the portal as the
  // "download everything" option, then commercials, then flyers, then
  // blooms by category alphabetically.
  files.sort((a, b) => {
    const aZip = a.rel.endsWith('.zip') ? 0 : 1;
    const bZip = b.rel.endsWith('.zip') ? 0 : 1;
    if (aZip !== bZip) return aZip - bZip;
    return a.rel.localeCompare(b.rel);
  });

  let uploaded = 0;
  let failed = 0;

  for (const f of files) {
    const stat = await fs.promises.stat(f.abs);
    const blobPath = `creators/${slug}/${f.rel.split(path.sep).join('/')}`;
    const bucket = bucketFromRelPath(f.rel);
    const baseName = path.basename(f.abs);
    const title = bucket === 'master-zip'
      ? `${slug}.zip (download everything — ${(stat.size / 1024 / 1024).toFixed(0)} MB)`
      : titleFromBaseName(baseName);

    process.stdout.write(`  ▸ ${blobPath}  (${(stat.size/1024/1024).toFixed(1)} MB) `);
    try {
      const stream = fs.createReadStream(f.abs);
      const result = await put(blobPath, stream, {
        access: 'public',
        token: BLOB_TOKEN,
        contentType: f.rel.endsWith('.zip') ? 'application/zip' : 'video/mp4',
        addRandomSuffix: false,
      });

      await upsertAssignment({
        creatorSlug: slug,
        videoUrl: result.url,
        blobPath,
        title,
        bucket,
        sizeBytes: stat.size,
      });

      console.log(`✓`);
      uploaded++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log(`✓ Uploaded ${uploaded} file(s), ${failed} failed.`);
  console.log(`✓ Portal: https://digitalbloom.store/c/${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
