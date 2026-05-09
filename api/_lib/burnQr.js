import { put } from '@vercel/blob';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(new Error(`ffmpeg spawn: ${err.message}`)));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg ${code}: ${stderr.slice(-300)}`));
    });
  });
}

async function downloadToFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

/**
 * Pull the source video, overlay a QR for a tracked /go/<slug> link,
 * upload the result to Vercel Blob (public), and return the blob URL.
 *
 * Used by /api/admin/bre-download (Bre's direct-download flow).
 */
export async function burnQrAndUpload({ inputUrl, slug, title, category, bucket = 'pulls' }) {
  const tmp = os.tmpdir();
  const stamp = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const inPath  = path.join(tmp, `in-${stamp}.mp4`);
  const qrPath  = path.join(tmp, `qr-${stamp}.png`);
  const outPath = path.join(tmp, `out-${stamp}.mp4`);

  try {
    await downloadToFile(inputUrl, inPath);

    const trackedUrl = `https://digitalbloom.store/go/${slug}`;
    await QRCode.toFile(qrPath, trackedUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 360,
      color: { dark: '#0D1B36', light: '#FFFFFF' },
    });

    // QR-only filter (no drawtext) — Vercel's bundled ffmpeg doesn't ship
    // a font usable by drawtext. The QR encodes the same URL viewers
    // would have read from a caption, so we lose nothing.
    const filterGraph = [
      `[1:v]scale=140:140:flags=lanczos,pad=164:164:x=12:y=12:color=white[qrPadded]`,
      `[0:v][qrPadded]overlay=x=W-w-28:y=H-h-28,scale=trunc(iw/2)*2:trunc(ih/2)*2[outv]`,
    ].join(';');

    await runFfmpeg([
      '-y', '-i', inPath, '-i', qrPath,
      '-filter_complex', filterGraph,
      '-map', '[outv]', '-map', '0:a?',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
      '-c:a', 'copy', '-movflags', '+faststart',
      outPath,
    ]);

    const buf = readFileSync(outPath);
    const safeName = (title || 'bloom').toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 50);
    // Caller passes a bucket like "creators/<slug>/admin-pushed" or
    // "bre-pulls" — slug is encoded in the QR's tracked URL, not the
    // storage path, so we don't need to repeat it here.
    const blobPath = `${bucket}/${category || 'misc'}/${safeName}-${stamp}.mp4`;

    // Content-Type matters here: video/mp4 makes iOS Safari OPEN the
    // file inline and ignore `?download=`. application/octet-stream
    // forces Safari to show the Save dialog instead. The QR-burned
    // videos aren't previewed anywhere else (the storefront uses the
    // unmarked source video), so the binary content-type is fine.
    const result = await put(blobPath, buf, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'application/octet-stream',
      addRandomSuffix: false,
    });

    return { videoUrl: result.url, blobPath, sizeBytes: buf.length, fileName: `${safeName}.mp4` };
  } finally {
    for (const p of [inPath, qrPath, outPath]) {
      try { unlinkSync(p); } catch { /* ignore */ }
    }
  }
}

/**
 * Same burn pipeline as burnQrAndUpload, but returns the buffer DIRECTLY
 * instead of uploading to Vercel Blob. Used by the GET-stream variant of
 * /api/admin/bre-download where we want to serve the file as the response
 * body (cleanest iOS Safari path — direct anchor → file response, no
 * two-step async dance).
 */
export async function burnQrToBuffer({ inputUrl, slug, title }) {
  const tmp = os.tmpdir();
  const stamp = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const inPath  = path.join(tmp, `in-${stamp}.mp4`);
  const qrPath  = path.join(tmp, `qr-${stamp}.png`);
  const outPath = path.join(tmp, `out-${stamp}.mp4`);

  try {
    await downloadToFile(inputUrl, inPath);

    const trackedUrl = `https://digitalbloom.store/go/${slug}`;
    await QRCode.toFile(qrPath, trackedUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 360,
      color: { dark: '#0D1B36', light: '#FFFFFF' },
    });

    const filterGraph = [
      `[1:v]scale=140:140:flags=lanczos,pad=164:164:x=12:y=12:color=white[qrPadded]`,
      `[0:v][qrPadded]overlay=x=W-w-28:y=H-h-28,scale=trunc(iw/2)*2:trunc(ih/2)*2[outv]`,
    ].join(';');

    await runFfmpeg([
      '-y', '-i', inPath, '-i', qrPath,
      '-filter_complex', filterGraph,
      '-map', '[outv]', '-map', '0:a?',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
      '-c:a', 'copy', '-movflags', '+faststart',
      outPath,
    ]);

    const buf = readFileSync(outPath);
    const safeName = (title || 'bloom').toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 50);
    return { buffer: buf, fileName: `${safeName}.mp4`, sizeBytes: buf.length };
  } finally {
    for (const p of [inPath, qrPath, outPath]) {
      try { unlinkSync(p); } catch { /* ignore */ }
    }
  }
}
