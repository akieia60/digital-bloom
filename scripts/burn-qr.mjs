#!/usr/bin/env node
/**
 * burn-qr.mjs — burn a tracked-link QR code + URL onto a marketing video.
 *
 * Built 2026-05-06 so Ak can hand each influencer a unique short URL
 * (digitalbloom.store/go/<slug>) that's visible IN the video itself —
 * scannable by anyone watching, even if the post strips clickable links.
 *
 * Usage:
 *   node scripts/burn-qr.mjs <input.mp4> <slug> [output.mp4]
 *
 * Examples:
 *   node scripts/burn-qr.mjs ~/Desktop/karen-cut.mp4 karen
 *     → writes ~/Desktop/karen-cut.qr.mp4
 *
 *   node scripts/burn-qr.mjs ~/Desktop/v.mp4 instagram-mothers-day ~/Desktop/v.final.mp4
 *
 * Behaviour:
 *  • Generates a high-contrast QR encoding https://digitalbloom.store/go/<slug>
 *  • Burns the QR in the bottom-right corner for the entire duration
 *    (Ak's brand pills already live bottom-left/right on regular blooms;
 *    on marketing videos that's free space).
 *  • Prints the URL as a small caption beneath the QR so people who can't
 *    scan can still type it.
 *  • Writes a new MP4 with `-movflags +faststart` so it streams cleanly
 *    on the storefront and on Buffer / TikTok / IG.
 *  • Doesn't touch the input file.
 *
 * Requirements: ffmpeg (uses the bundled ffmpeg-static), qrcode npm package
 * (installed alongside this script).
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://digitalbloom.store';

const [, , inputArg, slugArg, outputArg] = process.argv;

if (!inputArg || !slugArg) {
  console.error('Usage: node scripts/burn-qr.mjs <input.mp4> <slug> [output.mp4]');
  console.error('Example: node scripts/burn-qr.mjs ~/Desktop/karen.mp4 karen');
  process.exit(1);
}

const inputPath = path.resolve(inputArg.replace(/^~/, os.homedir()));
const slug = String(slugArg).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64).toLowerCase();
const outputPath = outputArg
  ? path.resolve(outputArg.replace(/^~/, os.homedir()))
  : inputPath.replace(/\.mp4$/i, `.qr.mp4`);

if (!fs.existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}
if (!slug) {
  console.error('Slug is required and must contain a-z, 0-9, _ or -.');
  process.exit(1);
}

const trackedUrl = `${BASE_URL}/go/${slug}`;

async function main() {
  // 1. Generate the QR PNG into a temp dir.
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'db-qr-'));
  const qrPath = path.join(tmpDir, 'qr.png');

  await QRCode.toFile(qrPath, trackedUrl, {
    errorCorrectionLevel: 'H',  // 30% recovery — survives compression / lighting
    margin: 2,
    width: 360,
    color: { dark: '#0D1B36', light: '#FFFFFF' },  // brand navy on white
  });

  console.log(`✓ QR generated for ${trackedUrl}`);

  // 2. ffmpeg overlay: bottom-right, 18% of frame width, with a small caption
  //    showing the URL. Border around the QR for legibility against any
  //    background.
  //
  //    Filter graph:
  //      [0:v] = base video
  //      [1:v] = QR PNG
  //      pad QR with white border + drop shadow → [qrPadded]
  //      overlay [qrPadded] on [0:v] at bottom-right with 24px margin → [withQr]
  //      drawtext caption underneath with the URL → [outv]
  //
  //    fontfile uses macOS Helvetica which is always present.
  // Fixed-size QR (~140×140 + white padding to 164×164) keeps it scannable
  // from across a room on any video resolution. Earlier draft used
  // scale2ref which inverted base/QR sizing on some inputs. The final
  // scale=trunc(iw/2)*2 forces even dimensions so libx264 never rejects.
  const fontFile = '/System/Library/Fonts/Helvetica.ttc';
  const filterGraph = [
    '[1:v]scale=140:140:flags=lanczos,pad=164:164:x=12:y=12:color=white[qrPadded]',
    '[0:v][qrPadded]overlay=x=W-w-28:y=H-h-92[withQr]',
    `[withQr]drawtext=fontfile='${fontFile}':text='digitalbloom.store/go/${slug}':fontcolor=white:fontsize=22:borderw=2:bordercolor=black@0.85:x=W-text_w-32:y=H-60,scale=trunc(iw/2)*2:trunc(ih/2)*2[outv]`,
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

  console.log(`✓ Wrote ${outputPath}`);
  console.log(`  Tracked URL: ${trackedUrl}`);
  console.log(`  Click counts: SELECT slug, count(*) FROM referral_clicks WHERE slug = '${slug}' GROUP BY slug;`);

  // Clean up tmp.
  await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(new Error(`ffmpeg spawn error: ${err.message}`)));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-600)}`));
    });
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
