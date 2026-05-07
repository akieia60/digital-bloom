import { createClient } from '@supabase/supabase-js';
import { put } from '@vercel/blob';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

export const maxDuration = 60;

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function unauthorized(res) { return res.status(401).json({ error: 'unauthorized' }); }

function actorFromToken(token) {
  if (!token) return null;
  const map = {
    [process.env.ADMIN_TOKEN || '_disabled1_']: 'Ak',
    [process.env.ADMIN_TOKEN_GAMBLE || '_disabled2_']: 'Gamble',
    [process.env.ADMIN_TOKEN_DAVID || '_disabled3_']: 'David',
  };
  return map[token] || null;
}

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

async function burnQrAndUpload({ inputUrl, slug, title, category, bucket }) {
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
    // with a font usable by drawtext, and "parsing global options filter
    // not found" was killing every push. The QR encodes the same URL
    // viewers would have read from the caption, so we lose nothing.
    // Final scale forces even dimensions so libx264 never rejects.
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
    const safeName = title.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 50);
    const blobPath = `creators/${slug}/admin-pushed/${category || 'misc'}/${safeName}-${stamp}.mp4`;

    const result = await put(blobPath, buf, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'video/mp4',
      addRandomSuffix: false,
    });

    return { videoUrl: result.url, blobPath, sizeBytes: buf.length };
  } finally {
    for (const p of [inPath, qrPath, outPath]) {
      try { unlinkSync(p); } catch { /* ignore */ }
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const token = String(req.headers['x-admin-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '') || '');
  const actor = actorFromToken(token);
  if (!actor) return unauthorized(res);

  const { creatorSlug, productIds, bucket } = req.body || {};
  if (!creatorSlug || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'creatorSlug and productIds[] required' });
  }
  // Limit per call to keep us inside the 60s function budget. Larger pushes
  // can be done in successive batches from the admin page.
  if (productIds.length > 5) {
    return res.status(400).json({ error: 'max 5 videos per push — call again with the next batch' });
  }

  // Verify the creator exists.
  const { data: creator } = await supabase
    .from('creators')
    .select('slug, display_name, is_active')
    .eq('slug', creatorSlug)
    .maybeSingle();
  if (!creator || !creator.is_active) {
    return res.status(404).json({ error: 'creator not found or inactive' });
  }

  // Pull the requested products.
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, name, category, video_file_url, video_url')
    .in('id', productIds);
  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!products || products.length === 0) {
    return res.status(404).json({ error: 'no products found' });
  }

  const results = [];
  for (const p of products) {
    const inputUrl = p.video_file_url || p.video_url;
    if (!inputUrl) {
      results.push({ id: p.id, name: p.name, ok: false, reason: 'no video url' });
      continue;
    }
    try {
      const { videoUrl, blobPath, sizeBytes } = await burnQrAndUpload({
        inputUrl,
        slug: creatorSlug,
        title: p.name,
        category: p.category,
        bucket: bucket || p.category || 'misc',
      });
      const { error: insertErr } = await supabase
        .from('creator_video_assignments')
        .insert({
          creator_slug: creatorSlug,
          video_url: videoUrl,
          blob_path: blobPath,
          title: p.name,
          category: p.category,
          bucket: bucket || p.category || 'misc',
          size_bytes: sizeBytes,
          is_active: true,
        });
      if (insertErr) throw insertErr;
      results.push({ id: p.id, name: p.name, ok: true, videoUrl });
    } catch (err) {
      results.push({ id: p.id, name: p.name, ok: false, reason: String(err.message || err) });
    }
  }

  return res.status(200).json({ creator: creatorSlug, actor, results });
}
