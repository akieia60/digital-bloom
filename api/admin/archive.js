import { createClient } from '@supabase/supabase-js';
import { PROMPT_ENGINE_CATEGORY_MAP } from '../../src/data/categories.js';

export const maxDuration = 60;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROMPTS_TABLE = 'prompt_engine_custom_prompts';

// Inverted map: slug → [labels]. Used to filter prompts by display label
// when the front-end gives us a slug.
const SLUG_TO_LABELS = Object.entries(PROMPT_ENGINE_CATEGORY_MAP).reduce((acc, [label, slug]) => {
  if (!acc[slug]) acc[slug] = [];
  acc[slug].push(label);
  return acc;
}, {});

function unauthorized(res) {
  return res.status(401).json({ error: 'unauthorized' });
}

function buildOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

// Pull `monique-videos/{pid}/full.mp4` and re-upload it to `product-media/raw/{pid}.mp4`
// so /api/process-bloom can pick it up and watermark.
async function stageRawFromMonique(supabase, pid) {
  const { data: file, error: dlErr } = await supabase.storage
    .from('monique-videos')
    .download(`${pid}/full.mp4`);
  if (dlErr) throw new Error(`download monique-videos/${pid}/full.mp4 failed: ${dlErr.message}`);
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from('product-media')
    .upload(`raw/${pid}.mp4`, buf, { contentType: 'video/mp4', upsert: true });
  if (upErr) throw new Error(`upload product-media/raw/${pid}.mp4 failed: ${upErr.message}`);
  return `raw/${pid}.mp4`;
}

// Run the existing process-bloom watermark + product-upsert pipeline on this
// prompt. Returns whatever process-bloom returns (success + product, or error).
async function publishPrompt(req, supabase, prompt) {
  const pid = prompt.id;
  await stageRawFromMonique(supabase, pid);
  const origin = buildOrigin(req);
  const slug = String(prompt.title || pid).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || pid;
  const r = await fetch(`${origin}/api/process-bloom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawPath: `raw/${pid}.mp4`,
      title: prompt.title,
      slug,
      category: prompt.cat,
      pid,
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `process-bloom ${r.status}`);
  return j;
}

// Look up the prompt that matches a product via the slug-equals-pid convention.
// Older legacy products have human slugs (not UUIDs) and won't match — that's
// expected; smart-restore just degrades to a plain is_active flip for them.
async function findMatchingPrompt(supabase, productSlug) {
  if (!productSlug || !/^[0-9a-f]{8}-/.test(productSlug)) return null;
  const { data } = await supabase
    .from(PROMPTS_TABLE)
    .select('id, title, cat, generation_status, generation_completed_at')
    .eq('id', productSlug)
    .eq('generation_status', 'completed')
    .maybeSingle();
  return data || null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return res.status(500).json({ error: 'ADMIN_TOKEN not configured' });

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // ── GET ───────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    if (req.query.token !== adminToken) return unauthorized(res);

    const status = (req.query.status || 'inactive').toString();
    const categorySlug = (req.query.category || 'mothers-day').toString();

    // ── Renders tab: completed prompts joined to their products by slug=pid
    if (status === 'renders') {
      const labels = SLUG_TO_LABELS[categorySlug] || [];
      let q = supabase
        .from(PROMPTS_TABLE)
        .select('id, title, cat, generation_completed_at, generation_status')
        .eq('generation_status', 'completed')
        .order('generation_completed_at', { ascending: false })
        .limit(200);
      if (labels.length) q = q.in('cat', labels);
      const { data: prompts, error: pErr } = await q;
      if (pErr) return res.status(500).json({ error: pErr.message });

      const ids = (prompts || []).map((p) => p.id);
      let products = [];
      if (ids.length) {
        const { data: prods, error: prErr } = await supabase
          .from('products')
          .select('id, slug, is_active, updated_at, video_url, video_file_url, thumbnail_url')
          .in('slug', ids);
        if (prErr) return res.status(500).json({ error: prErr.message });
        products = prods || [];
      }
      const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

      const monique = `${supabaseUrl}/storage/v1/object/public/monique-videos`;
      const renders = (prompts || []).map((p) => {
        const product = productBySlug[p.id] || null;
        const promptCompletedMs = p.generation_completed_at ? Date.parse(p.generation_completed_at) : 0;
        const productUpdatedMs = product?.updated_at ? Date.parse(product.updated_at) : 0;
        const isLive = Boolean(
          product
          && product.is_active
          && (product.video_url || '').includes(p.id)
          && productUpdatedMs >= promptCompletedMs,
        );
        return {
          id: p.id,
          title: p.title,
          cat: p.cat,
          completed_at: p.generation_completed_at,
          render_url: `${monique}/${p.id}/full.mp4`,
          is_live: isLive,
          product_id: product?.id || null,
        };
      });
      return res.status(200).json({ renders });
    }

    // ── Existing On Site / Archive lists
    const isActive = status === 'active';
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, category, video_file_url, video_url, thumbnail_url, image_url, is_active, created_at, updated_at, price_cents')
      .eq('category', categorySlug)
      .eq('is_active', isActive)
      .order('updated_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });

    // For Archive tab, attach `fresh_render` info so the UI can show
    // "NEW RENDER AVAILABLE" without an extra round trip.
    if (!isActive && (data || []).length) {
      const slugs = data.map((p) => p.slug).filter((s) => /^[0-9a-f]{8}-/.test(s));
      let prompts = [];
      if (slugs.length) {
        const { data: pData } = await supabase
          .from(PROMPTS_TABLE)
          .select('id, generation_completed_at, generation_status')
          .in('id', slugs)
          .eq('generation_status', 'completed');
        prompts = pData || [];
      }
      const promptById = Object.fromEntries(prompts.map((p) => [p.id, p]));
      const monique = `${supabaseUrl}/storage/v1/object/public/monique-videos`;
      data.forEach((p) => {
        const prompt = promptById[p.slug];
        if (!prompt) return;
        const promptMs = prompt.generation_completed_at ? Date.parse(prompt.generation_completed_at) : 0;
        const productMs = p.updated_at ? Date.parse(p.updated_at) : 0;
        if (promptMs > productMs) {
          p.fresh_render_url = `${monique}/${p.slug}/full.mp4`;
          p.fresh_render_completed_at = prompt.generation_completed_at;
        }
      });
    }

    return res.status(200).json({ products: data || [] });
  }

  // ── POST ──────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body || {};
    if (body.token !== adminToken) return unauthorized(res);

    const { action, productId, promptId } = body;

    // ── Publish a render to site (creates or refreshes the product)
    if (action === 'publish') {
      const id = promptId || productId;
      if (!id) return res.status(400).json({ error: 'promptId or productId required' });

      // If promptId came in, fetch the prompt directly. If only productId came
      // in, resolve via product.slug → prompt.id.
      let prompt = null;
      if (promptId) {
        const { data } = await supabase
          .from(PROMPTS_TABLE)
          .select('id, title, cat, generation_status, generation_completed_at')
          .eq('id', promptId)
          .maybeSingle();
        prompt = data;
      } else {
        const { data: product } = await supabase
          .from('products')
          .select('slug')
          .eq('id', productId)
          .maybeSingle();
        if (product?.slug) prompt = await findMatchingPrompt(supabase, product.slug);
      }
      if (!prompt) return res.status(404).json({ error: 'prompt not found' });
      if (prompt.generation_status !== 'completed') {
        return res.status(400).json({ error: `prompt not completed (status=${prompt.generation_status})` });
      }

      try {
        const result = await publishPrompt(req, supabase, prompt);
        return res.status(200).json({ ...result, action: 'publish' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (!productId || !['restore', 'archive'].includes(action)) {
      return res.status(400).json({ error: 'productId and action (restore|archive|publish) required' });
    }

    // ── Archive: simple is_active=false flip
    if (action === 'archive') {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select('id, name, is_active')
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ product: data });
    }

    // ── Smart restore: re-watermark only if a fresher Grok render exists
    const { data: product, error: pErr } = await supabase
      .from('products')
      .select('id, slug, updated_at, name')
      .eq('id', productId)
      .single();
    if (pErr) return res.status(500).json({ error: pErr.message });

    const prompt = await findMatchingPrompt(supabase, product.slug);
    const promptMs = prompt?.generation_completed_at ? Date.parse(prompt.generation_completed_at) : 0;
    const productMs = product.updated_at ? Date.parse(product.updated_at) : 0;
    const hasFresher = prompt && promptMs > productMs;

    if (hasFresher) {
      try {
        await publishPrompt(req, supabase, prompt);
        // process-bloom upserts is_active=true; nothing else to do.
        return res.status(200).json({
          product: { id: product.id, name: product.name, is_active: true },
          freshlyRepublished: true,
        });
      } catch (err) {
        return res.status(500).json({ error: `re-publish failed: ${err.message}` });
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select('id, name, is_active')
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ product: data, freshlyRepublished: false });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method not allowed' });
}
