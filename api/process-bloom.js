import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';
import { PROMPT_ENGINE_CATEGORY_MAP } from '../src/data/categories.js';
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

// CATEGORY_MAP is imported from src/data/categories.js — the single source of
// truth shared with the frontend + prompt-engine. See that file to add or
// rename categories; this endpoint will pick up the change automatically.
const CATEGORY_MAP = PROMPT_ENGINE_CATEGORY_MAP;

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

  const categorySlug = CATEGORY_MAP[category];
  if (!categorySlug) {
    // Loud failure beats silent misrouting — previously unknown categories
    // fell through to 'mothers-day', which hid the drift that caused uploads
    // to vanish from their intended collection.
    return res.status(400).json({
      error: `Unknown category "${category}". Update src/data/categories.js or correct the cat: string in prompt-engine.html. Accepted labels: ${Object.keys(CATEGORY_MAP).join(', ')}`,
    });
  }
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
    //
    // Bouncing watermark (Sora 2 / Reels-style piracy lift): the gold
    // "Digital Bloom™" lockup cycles through all four corners every 5
    // seconds, snapping (not sliding) on each transition. Pirates can't
    // crop a single corner — they'd lose the watermark on the next jump.
    //
    // Cycle timeline (mod 20s):
    //   0-5s  → bottom-left   (x=24,         y=H-h-14)
    //   5-10s → bottom-right  (x=W-w-24,     y=H-h-14)
    //   10-15s → top-right    (x=W-w-24,     y=14)
    //   15-20s → top-left     (x=24,         y=14)
    //
    // eval=frame is required so x/y re-evaluate every frame instead of
    // freezing at filter init.
    const wmX = "if(lt(mod(t,20),5),24,if(lt(mod(t,20),15),W-w-24,24))";
    const wmY = "if(lt(mod(t,20),10),H-h-14,14)";
    await runFfmpeg([
      '-i', tmpRaw, '-i', tmpWm,
      '-filter_complex', `overlay=x='${wmX}':y='${wmY}':eval=frame`,
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
    // Cache-buster: republishes overwrite the same storage path, so browsers and
    // the storefront's <video> tag would replay the old bytes against an unchanged
    // URL. Appending ?v=<minute-precision-utc> flips the URL on every republish so
    // a refreshed page always pulls fresh bytes. (Ak 2026-05-10 — David spotted
    // the prior render still playing after a republish that the archive said shipped.)
    const cacheBust = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
    const videoUrl = `${supabaseUrl}/storage/v1/object/public/product-media/${watermarkedStoragePath}?v=${cacheBust}`;
    const productSlug = pid || `${categorySlug}-${slug}`;

    // Pull the prompt's badge so subcategory tags ("🌸 Mothers-Day · Friend
    // Honoring · An Incredible Mother") flow into the product description.
    // Without this every product gets the same generic blurb and customer
    // searches like "friend" or "stepmom" miss the relevant blooms — Monique
    // 2026-05-06 noted the gap; we surface it via description until a proper
    // subcategory schema lands. Falls back to the generic copy if no pid or
    // the prompt has no badge.
    let promptBadge = '';
    if (pid) {
      try {
        const { data: promptRow } = await supabase
          .from('prompt_engine_custom_prompts')
          .select('badge')
          .eq('id', pid)
          .maybeSingle();
        promptBadge = (promptRow?.badge || '').trim();
      } catch (badgeErr) {
        console.warn(`process-bloom: badge lookup failed for prompt ${pid}:`, badgeErr);
      }
    }
    const description = promptBadge
      ? `${promptBadge} — A Digital Bloom by Digital Bloom™.`
      : 'A beautiful Digital Bloom for every occasion.';

    // Extract subcategory from the badge — Monique tags every prompt as
    // "🌸 Mothers-Day · Friend Honoring · An Incredible Mother". The middle
    // segment is the human-readable subcategory; we slugify it so the
    // CategoryPage chips can filter on a stable key. Skips emojis, falls
    // back to null if the badge doesn't have a middle segment. The
    // CategoryPage hides chips that have zero matches in this category,
    // so leaving subcategory null is safe — those rows just live under the
    // default "For Mom" / un-filtered view.
    let subcategory = null;
    if (promptBadge) {
      const segments = promptBadge.split(/\s+·\s+/).map((s) => s.trim());
      if (segments.length >= 2) {
        const middle = segments[1].replace(/[^a-zA-Z0-9 -]/g, '').trim();
        if (middle) {
          subcategory = middle.toLowerCase().replace(/\s+/g, '-');
        }
      }
    }

    const baseProductPayload = {
      name: title,
      slug: productSlug,
      description,
      subcategory,
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
    };

    let { data: product, error: dbErr } = await supabase
      .from('products')
      .upsert({
        ...baseProductPayload,
        prompt_id: pid || null,
      }, { onConflict: 'slug' })
      .select('id, name, slug, prompt_id')
      .single();

    if (dbErr?.code === '42703' || dbErr?.code === 'PGRST204') {
      ({ data: product, error: dbErr } = await supabase
        .from('products')
        .upsert(baseProductPayload, { onConflict: 'slug' })
        .select('id, name, slug')
        .single());
    }

    if (dbErr) throw new Error(`DB upsert failed: ${dbErr.message}`);

    console.log(`[process-bloom] ✅ ${product.name} — ${videoUrl}`);

    // Warm the storefront catalog edge cache with the freshly-published row so
    // shoppers see the new video immediately instead of waiting on s-maxage.
    const baseUrl = process.env.APP_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || 'https://digitalbloom.store';
    fetch(`${baseUrl}/api/list-products?_=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    }).catch(() => {});

    return res.status(200).json({ success: true, product });

  } catch (err) {
    console.error('[process-bloom] ❌', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    [tmpRaw, tmpWm, tmpOut].forEach(f => { try { unlinkSync(f); } catch {} });
  }
}
