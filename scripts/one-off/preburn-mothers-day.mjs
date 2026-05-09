/**
 * preburn-mothers-day.mjs (2026-05-08 night, generalized 2026-05-09)
 *
 * Pre-burns QR + uploads active blooms to Vercel Blob, writes the
 * burned URL back to products.qr_burned_url. With this in place, Bre
 * Pull links point DIRECTLY to a ready-to-download Blob URL — zero
 * burn time on tap, iOS Save dialog appears in <2 seconds.
 *
 * Defaults to mothers-day for backwards compatibility (Ak's muscle
 * memory). Pass --category=<slug> for any single category, or
 * --category=all to burn every active product across the catalog.
 *
 * Usage:
 *   node scripts/one-off/preburn-mothers-day.mjs                              # dry run, mothers-day
 *   node scripts/one-off/preburn-mothers-day.mjs --apply                      # do mothers-day
 *   node scripts/one-off/preburn-mothers-day.mjs --apply --category=graduation
 *   node scripts/one-off/preburn-mothers-day.mjs --apply --category=birthday
 *   node scripts/one-off/preburn-mothers-day.mjs --apply --category=all       # every category
 *   node scripts/one-off/preburn-mothers-day.mjs --apply --concurrency=4
 */
import { createClient } from '@supabase/supabase-js';
import { put } from '@vercel/blob';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import QRCode from 'qrcode';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');
const concurrencyArg = process.argv.find((a) => a.startsWith('--concurrency='));
const concurrency = concurrencyArg ? Number(concurrencyArg.split('=')[1]) : 3;
const categoryArg = process.argv.find((a) => a.startsWith('--category='));
const categoryFilter = categoryArg ? categoryArg.split('=')[1].trim() : 'mothers-day';
const blobToken = env.BLOB_READ_WRITE_TOKEN;

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args);
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
async function burnAndUpload(product) {
  const inputUrl = product.video_file_url || product.video_url;
  if (!inputUrl) throw new Error('no video url');
  const tmp = os.tmpdir();
  const stamp = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const inPath  = path.join(tmp, `pb-in-${stamp}.mp4`);
  const qrPath  = path.join(tmp, `pb-qr-${stamp}.png`);
  const outPath = path.join(tmp, `pb-out-${stamp}.mp4`);
  try {
    await downloadToFile(inputUrl, inPath);
    const trackedUrl = `https://digitalbloom.store/go/bre`;
    await QRCode.toFile(qrPath, trackedUrl, {
      errorCorrectionLevel: 'H', margin: 2, width: 360,
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
    const safeName = (product.name || 'bloom').toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 50);
    const blobPath = `bre-pulls/preburn/${product.category}/${safeName}-${product.id.slice(0,8)}.mp4`;
    const result = await put(blobPath, buf, {
      access: 'public', token: blobToken,
      contentType: 'application/octet-stream', addRandomSuffix: false, allowOverwrite: true,
    });
    const downloadUrl = `${result.url}?download=${encodeURIComponent(safeName)}.mp4`;
    return { downloadUrl, sizeBytes: buf.length };
  } finally {
    for (const p of [inPath, qrPath, outPath]) {
      try { unlinkSync(p); } catch {}
    }
  }
}

let query = sb
  .from('products')
  .select('id, name, category, video_file_url, video_url, qr_burned_url')
  .eq('is_active', true)
  .order('created_at', { ascending: false });
if (categoryFilter !== 'all') {
  query = query.eq('category', categoryFilter);
}
const { data, error } = await query;
if (error) { console.error(error); process.exit(1); }

const need = data.filter((p) => force || !p.qr_burned_url);
const skip = data.length - need.length;
const label = categoryFilter === 'all' ? 'all categories' : categoryFilter;
console.log(`\n${apply ? '[APPLY]' : '[DRY RUN]'} Active blooms (${label}): ${data.length}, skipping (already burned): ${skip}, to-process: ${need.length}, concurrency: ${concurrency}\n`);
if (categoryFilter === 'all' && need.length) {
  const byCat = need.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
  console.log('  Breakdown:');
  for (const [c, n] of Object.entries(byCat).sort()) console.log(`    ${c}: ${n}`);
  console.log('');
}
if (!apply) { console.log('(--apply to commit)'); process.exit(0); }

let done = 0, fail = 0;
const queue = [...need];
const workers = Array.from({ length: concurrency }, async () => {
  while (queue.length) {
    const p = queue.shift();
    if (!p) return;
    const t0 = Date.now();
    try {
      const { downloadUrl, sizeBytes } = await burnAndUpload(p);
      await sb.from('products').update({ qr_burned_url: downloadUrl }).eq('id', p.id);
      done++;
      console.log(`  ✓ [${done}/${need.length}] ${(Date.now()-t0)/1000 | 0}s · ${(sizeBytes/1024/1024).toFixed(1)}MB · ${p.name}`);
    } catch (e) {
      fail++;
      console.error(`  ✗ FAIL ${p.name}: ${e.message}`);
    }
  }
});
await Promise.all(workers);
console.log(`\nDone. ${done} burned, ${fail} failed.`);
