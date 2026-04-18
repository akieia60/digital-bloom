import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Digital Bloom™ watermark — gold serif text, 400×60px transparent PNG
// Burned in bottom-left (overlay=24:H-74) — matches local watermark process
const WATERMARK_B64 = `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`;

const TIER1_PRICE_ID = 'price_1T3JsrAbAZNcYUize3HYyAvh';
const TIER1_PRODUCT_ID = 'prod_U1McdDJX6Z5VSP';

const CATEGORY_MAP = {
  "Mother's Day": 'mothers-day',
  "Birthday": 'birthday',
  "Love": 'love',
  "Friendship": 'friendship',
  "Thank You": 'thank-you',
  "Anniversary": 'anniversary',
  "Encouragement": 'encouragement',
  "Sympathy": 'sympathy',
  "Father's Day": 'fathers-day',
  "Holidays": 'holiday',
  "Zodiac / Celestial Saga": 'zodiac',
  "Inclusive & Special": 'womens-day',
  "Signature Series": 'mothers-day',
  "Signature Stories": 'signature-stories',
};

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('error', err => reject(new Error(`Spawn error: ${err.message}`)));
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-400)}`));
    });
  });
}

export const maxDuration = 60;

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { rawPath, title, slug, category, pid } = req.body || {};
  if (!rawPath || !title || !slug || !category) {
    return res.status(400).json({ error: 'Missing required fields: rawPath, title, slug, category' });
  }

  const categorySlug = CATEGORY_MAP[category] || 'mothers-day';
  // Use the prompt's stable ID (pid) as the storage filename and DB slug so that
  // re-uploads always overwrite the same record — no duplicate-key collisions.
  const fileKey = pid || slug;
  const watermarkedStoragePath = `${categorySlug}/${fileKey}_watermarked.mp4`;

  const ts = Date.now();
  const tmpRaw = `/tmp/raw_${ts}.mp4`;
  const tmpWm  = `/tmp/wm_${ts}.png`;
  const tmpOut = `/tmp/out_${ts}.mp4`;

  try {
    // 1. Download raw video from Supabase Storage
    const { data: fileData, error: dlErr } = await supabase.storage
      .from('product-media')
      .download(rawPath);
    if (dlErr) throw new Error(`Download failed: ${dlErr.message}`);
    writeFileSync(tmpRaw, Buffer.from(await fileData.arrayBuffer()));

    // 2. Write watermark PNG from embedded base64
    writeFileSync(tmpWm, Buffer.from(WATERMARK_B64, 'base64'));

    // 3. Burn watermark in with ffmpeg overlay filter
    // -an: drop audio — AI-generated bloom videos have no audio stream,
    // and -c:a copy would fail on a missing stream.
    await runFfmpeg([
      '-i', tmpRaw, '-i', tmpWm,
      '-filter_complex', 'overlay=24:H-74',
      '-c:v', 'libx264', '-preset', 'ultrafast',
      '-an', '-y', tmpOut,
    ]);

    // 4. Upload watermarked video
    const outBuffer = readFileSync(tmpOut);
    const { error: uploadErr } = await supabase.storage
      .from('product-media')
      .upload(watermarkedStoragePath, outBuffer, { contentType: 'video/mp4', upsert: true });
    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

    // 5. Delete raw file to keep storage clean
    await supabase.storage.from('product-media').remove([rawPath]);

    // 6. Upsert product record (insert or update on slug conflict so re-uploads work)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const videoUrl = `${supabaseUrl}/storage/v1/object/public/product-media/${watermarkedStoragePath}`;
    const productSlug = pid || `${categorySlug}-${slug}`;

    const { data: product, error: dbErr } = await supabase
      .from('products')
      .upsert({
        name: title,
        slug: productSlug,
        description: `A beautiful Digital Bloom for every occasion.`,
        price: 1.99,
        image_url: videoUrl,
        video_url: videoUrl,
        category: categorySlug,
        occasions: [categorySlug],
        tier: 1,
        stripe_price_id: TIER1_PRICE_ID,
        stripe_product_id: TIER1_PRODUCT_ID,
        is_active: true,
        stock: 999,
        product_type: 'digital',
      }, { onConflict: 'slug' })
      .select('id, name, slug')
      .single();
    if (dbErr) throw new Error(`DB upsert failed: ${dbErr.message}`);

    console.log(`[process-bloom] ✅ ${product.name} — ${videoUrl}`);
    return res.status(200).json({ success: true, product });

  } catch (err) {
    console.error('[process-bloom] ❌', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    [tmpRaw, tmpWm, tmpOut].forEach(f => { try { unlinkSync(f); } catch {} });
  }
}
