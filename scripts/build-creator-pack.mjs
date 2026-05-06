#!/usr/bin/env node
/**
 * build-creator-pack.mjs
 * ──────────────────────────────────────────────────────────────────────
 * Build a content-creator handoff pack: collect top marketing flyers +
 * commercials + top-5 product blooms per category, burn the creator's
 * tracked-link QR onto every clip, and drop them into one iCloud folder
 * Ak can share with one tap.
 *
 * Built 2026-05-06 for Ak's first creator partnership (Breana).
 *
 * Usage:
 *   node scripts/build-creator-pack.mjs <slug>
 *
 * Output goes to:
 *   ~/Library/Mobile Documents/com~apple~CloudDocs/digitalbloom/handoffs/<slug>/
 *
 * Subfolders inside:
 *   01-commercials/      → polished long-form ads
 *   02-flyers/           → daily-post flyers with FLOWERS CLIP music
 *   03-blooms/<category>/ → top product videos by category
 *   _MANIFEST.txt        → human-readable list of what's inside
 *
 * Requirements:
 *   - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env (or in ~/.openclaw/.env)
 *   - ffmpeg-static + qrcode (already in package.json)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

// ── Config ─────────────────────────────────────────────────────────────
const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://digitalbloom.store';
const ICLOUD_ROOT = path.join(
  os.homedir(),
  'Library',
  'Mobile Documents',
  'com~apple~CloudDocs',
  'digitalbloom',
);

// Marketing videos to include (final composites only — skip work-in-progress
// scene clips like clip-N.mp4). Paths are relative to ICLOUD_ROOT.
const MARKETING_FLYERS = [
  'marketing-plan/flyers/flyer-01-dont-wait/2026-05-05-flyer-01-dont-wait.mp4',
  'marketing-plan/flyers/flyer-03-show-your-love/2026-05-05-flyer-03-show-your-love.mp4',
  'marketing-plan/flyers/flyer-04-mothers-day/2026-05-05-flyer-04-mothers-day.mp4',
  'marketing-plan/flyers/king-energy-2026-05-06/2026-05-06-flyer-king-energy.mp4',
  'marketing-plan/flyers/memorial/flyer-memorial-falling-petals-WITH-TEXT.mp4',
  'marketing-plan/flyers/bloom-graduation-silhouette/2026-05-05-bloom-graduation-silhouette.mp4',
];

const HERO_COMMERCIALS = [
  'commercials/2026-04-30-hero-vision-black-V4/hero-vision-black-V4A-FULL-son-walks.mp4',
  'commercials/2026-04-30-hero-vision-black-V4/hero-vision-black-V4B-FULL-son-girlfriend.mp4',
  'commercials/2026-04-30-hero-vision-black-V3/hero-vision-black-V3-FULL-37s-mastered-prompts.mp4',
  'commercials/2026-04-30-hero-vision-black-V2/hero-vision-black-V2-FULL-40s-gamble-revisions.mp4',
];

// Top categories with how many product blooms to pull from each.
const PRODUCT_CATEGORIES = [
  { slug: 'mothers-day', count: 5 },
  { slug: 'fathers-day', count: 5 },
  { slug: 'birthday',    count: 5 },
  { slug: 'graduation',  count: 5 },
  { slug: 'love',        count: 5 },
  { slug: 'anniversary', count: 5 },
];

// ── CLI ────────────────────────────────────────────────────────────────
const slugArg = process.argv[2];
if (!slugArg) {
  console.error('Usage: node scripts/build-creator-pack.mjs <slug>');
  process.exit(1);
}
const slug = slugArg.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64).toLowerCase();
if (!slug) {
  console.error('Slug must contain a-z, 0-9, _ or -.');
  process.exit(1);
}

// ── Env loading ────────────────────────────────────────────────────────
const ENV_PATH = path.join(os.homedir(), '.openclaw', '.env');
if (fs.existsSync(ENV_PATH)) {
  const envFile = fs.readFileSync(ENV_PATH, 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

// Try to source from project .env.local for SUPABASE_* if not already set.
const PROJECT_ENV = path.join(process.cwd(), '.env.local');
if (fs.existsSync(PROJECT_ENV)) {
  const envFile = fs.readFileSync(PROJECT_ENV, 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var.');
  console.error('Add them to ~/.openclaw/.env or .env.local in this repo.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ────────────────────────────────────────────────────────────
function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(new Error(`ffmpeg spawn error: ${err.message}`)));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-400)}`));
    });
  });
}

async function generateQrPng(url, outputPath) {
  await QRCode.toFile(outputPath, url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 360,
    color: { dark: '#0D1B36', light: '#FFFFFF' },
  });
}

async function burnQr({ inputPath, outputPath, qrPath, slug }) {
  const fontFile = '/System/Library/Fonts/Helvetica.ttc';
  const filterGraph = [
    `[1:v]scale=iw*1:ih*1,pad=w=iw+24:h=ih+24:x=12:y=12:color=white[qrPadded]`,
    `[0:v][qrPadded]scale2ref=w=iw*0.18:h=ow/mdar[base][qrFinal]`,
    `[base][qrFinal]overlay=x=W-w-28:y=H-h-92[withQr]`,
    `[withQr]drawtext=fontfile='${fontFile}':text='digitalbloom.store/go/${slug}':fontcolor=white:fontsize=22:borderw=2:bordercolor=black@0.85:x=W-text_w-32:y=H-60[outv]`,
  ].join(';');

  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-i', qrPath,
    '-filter_complex', filterGraph,
    '-map', '[outv]',
    '-map', '0:a?',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-c:a', 'copy',
    '-movflags', '+faststart',
    outputPath,
  ]);
}

async function downloadToFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(destPath, buf);
}

function safeName(name) {
  return String(name)
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .toLowerCase();
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const startTs = Date.now();
  const trackedUrl = `${BASE_URL}/go/${slug}`;
  const outRoot = path.join(ICLOUD_ROOT, 'handoffs', slug);

  console.log(`▸ Creator pack for slug: ${slug}`);
  console.log(`▸ Tracked URL:           ${trackedUrl}`);
  console.log(`▸ Output:                ${outRoot}`);
  console.log('');

  await fs.promises.mkdir(path.join(outRoot, '01-commercials'), { recursive: true });
  await fs.promises.mkdir(path.join(outRoot, '02-flyers'),      { recursive: true });

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'creator-pack-'));
  const qrPath = path.join(tmpDir, 'qr.png');
  await generateQrPng(trackedUrl, qrPath);

  const manifest = [];
  manifest.push(`Digital Bloom — Creator Pack for ${slug}`);
  manifest.push(`Generated: ${new Date().toISOString()}`);
  manifest.push(`Tracked URL on every video: ${trackedUrl}`);
  manifest.push('');

  let burned = 0;
  let skipped = 0;

  // 1. HERO COMMERCIALS
  manifest.push('## 01-commercials/');
  for (const rel of HERO_COMMERCIALS) {
    const absIn = path.join(ICLOUD_ROOT, rel);
    if (!fs.existsSync(absIn)) {
      console.log(`  - skip (not found): ${rel}`);
      manifest.push(`  - SKIPPED (not found): ${rel}`);
      skipped++;
      continue;
    }
    const baseName = path.basename(rel, '.mp4');
    const outPath = path.join(outRoot, '01-commercials', `${baseName}.mp4`);
    console.log(`  ▸ commercial: ${baseName}`);
    try {
      await burnQr({ inputPath: absIn, outputPath: outPath, qrPath, slug });
      manifest.push(`  ✓ ${baseName}.mp4`);
      burned++;
    } catch (err) {
      console.error(`    failed: ${err.message}`);
      manifest.push(`  ✗ ${baseName}.mp4 — ${err.message}`);
      skipped++;
    }
  }
  manifest.push('');

  // 2. MARKETING FLYERS
  manifest.push('## 02-flyers/');
  for (const rel of MARKETING_FLYERS) {
    const absIn = path.join(ICLOUD_ROOT, rel);
    if (!fs.existsSync(absIn)) {
      console.log(`  - skip (not found): ${rel}`);
      manifest.push(`  - SKIPPED (not found): ${rel}`);
      skipped++;
      continue;
    }
    const baseName = path.basename(rel, '.mp4');
    const outPath = path.join(outRoot, '02-flyers', `${baseName}.mp4`);
    console.log(`  ▸ flyer: ${baseName}`);
    try {
      await burnQr({ inputPath: absIn, outputPath: outPath, qrPath, slug });
      manifest.push(`  ✓ ${baseName}.mp4`);
      burned++;
    } catch (err) {
      console.error(`    failed: ${err.message}`);
      manifest.push(`  ✗ ${baseName}.mp4 — ${err.message}`);
      skipped++;
    }
  }
  manifest.push('');

  // 3. PRODUCT BLOOMS by category
  for (const cat of PRODUCT_CATEGORIES) {
    const catFolder = path.join(outRoot, '03-blooms', cat.slug);
    await fs.promises.mkdir(catFolder, { recursive: true });

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, slug, video_file_url, video_url, created_at')
      .eq('is_active', true)
      .eq('category', cat.slug)
      .not('name', 'ilike', '%TEST%')
      .order('created_at', { ascending: false })
      .limit(cat.count * 2);  // pull extra in case some are dupes/broken
    if (error) {
      console.error(`  category ${cat.slug} query failed:`, error);
      continue;
    }

    manifest.push(`## 03-blooms/${cat.slug}/`);
    let picked = 0;
    const seenNames = new Set();
    for (const p of products) {
      if (picked >= cat.count) break;
      const url = p.video_file_url || p.video_url;
      if (!url) continue;
      const nameKey = String(p.name || '').toLowerCase().trim();
      if (seenNames.has(nameKey)) continue;  // skip duplicate names
      seenNames.add(nameKey);

      const cleanName = safeName(p.name) || `bloom-${p.id.slice(0,8)}`;
      const inAbs = path.join(tmpDir, `${cat.slug}-${cleanName}.mp4`);
      const outAbs = path.join(catFolder, `${cleanName}.mp4`);

      console.log(`  ▸ ${cat.slug} / ${p.name}`);
      try {
        await downloadToFile(url, inAbs);
        await burnQr({ inputPath: inAbs, outputPath: outAbs, qrPath, slug });
        await fs.promises.unlink(inAbs).catch(() => {});
        manifest.push(`  ✓ ${cleanName}.mp4 — ${p.name}`);
        picked++;
        burned++;
      } catch (err) {
        console.error(`    failed: ${err.message}`);
        manifest.push(`  ✗ ${cleanName}.mp4 — ${err.message}`);
        skipped++;
      }
    }
    manifest.push('');
  }

  // 4. README / manifest
  manifest.push('---');
  manifest.push(`Total burned: ${burned}`);
  manifest.push(`Total skipped: ${skipped}`);
  manifest.push('');
  manifest.push('Every video has a brand QR code in the bottom-right corner');
  manifest.push(`encoding ${trackedUrl}. Anyone who scans it lands on the`);
  manifest.push(`Digital Bloom storefront with ?ref=${slug} attached so we can`);
  manifest.push(`measure exactly how many sales the creator drives.`);

  await fs.promises.writeFile(
    path.join(outRoot, '_MANIFEST.txt'),
    manifest.join('\n'),
    'utf8',
  );

  // 5. Cleanup
  await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});

  const elapsedMin = ((Date.now() - startTs) / 1000 / 60).toFixed(1);
  console.log('');
  console.log(`✓ Pack ready: ${outRoot}`);
  console.log(`  ${burned} videos burned, ${skipped} skipped, ${elapsedMin} min`);
  console.log(`  Tracked URL: ${trackedUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
