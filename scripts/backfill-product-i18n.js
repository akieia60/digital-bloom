#!/usr/bin/env node
/**
 * Backfill the products.i18n column for every active product.
 *
 * For each product, asks Claude Haiku to translate (name, description) into
 * the 9 non-English locales the storefront supports, then stores the result
 * as JSONB on products.i18n. Idempotent — only translates rows missing
 * a locale, so re-running fills holes without re-charging API calls.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/backfill-product-i18n.js [--limit=N] [--only-missing]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ── env loading ────────────────────────────────────────────────────
function loadEnv(path) {
  try {
    const txt = readFileSync(path, 'utf8');
    for (const line of txt.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const k = m[1];
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {}
}
loadEnv(resolve(process.env.HOME, '.openclaw/.env'));
loadEnv(resolve(process.cwd(), '.env.local'));
loadEnv(resolve(process.cwd(), '.env'));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_API_KEY) { console.error('missing ANTHROPIC_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) { console.error('missing SUPABASE_URL / SERVICE_ROLE_KEY'); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const LIMIT = args.limit ? parseInt(args.limit, 10) : null;
const ONLY_MISSING = !!args['only-missing'];

const LOCALES = ['es', 'fr', 'de', 'pt-BR', 'ht', 'vi', 'tl', 'zh', 'ja'];
const LOCALE_NAMES = {
  es: 'Spanish (es)',
  fr: 'French (fr)',
  de: 'German (de)',
  'pt-BR': 'Brazilian Portuguese (pt-BR)',
  ht: 'Haitian Creole (ht)',
  vi: 'Vietnamese (vi)',
  tl: 'Tagalog (tl)',
  zh: 'Simplified Chinese (zh)',
  ja: 'Japanese (ja)',
};

// ── supabase REST helpers ───────────────────────────────────────────
async function sb(path, opts = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const r = await fetch(url, {
    ...opts,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

async function fetchProducts() {
  const select = 'id,name,description,category,i18n';
  let products = await sb(`/products?is_active=eq.true&select=${select}&order=created_at.asc`);
  if (LIMIT) products = products.slice(0, LIMIT);
  return products;
}

async function updateI18n(id, i18n) {
  await sb(`/products?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ i18n }),
  });
}

// ── claude translation ─────────────────────────────────────────────
async function translateProduct(product, missingLocales) {
  const payload = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `You translate product copy for "Digital Bloom" — a luxury digital flower-bouquet gifting site.

Product to translate:
- Name (English): "${product.name}"
- Description (English): "${product.description || 'A beautiful Digital Bloom for every occasion.'}"
- Category (do NOT translate, just for context): ${product.category}

Translate BOTH the name and description into each of these languages, preserving the brand name "Digital Bloom" untranslated and keeping the same emotional tone (intimate, celebratory, gift-giving):

${missingLocales.map(l => `- ${LOCALE_NAMES[l]}`).join('\n')}

Return ONLY a JSON object in this exact shape, with NO markdown fences, NO commentary:

{
${missingLocales.map(l => `  "${l}": { "name": "...", "description": "..." }`).join(',\n')}
}`,
    }],
  };

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error('empty response');
  // strip accidental fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch (e) { throw new Error(`bad JSON from claude: ${cleaned.slice(0, 200)}`); }
  return parsed;
}

// ── main ───────────────────────────────────────────────────────────
async function main() {
  const products = await fetchProducts();
  console.log(`fetched ${products.length} active products`);

  let translated = 0, skipped = 0, failed = 0, totalCost = 0;
  const start = Date.now();

  for (const p of products) {
    const existing = p.i18n || {};
    const missing = LOCALES.filter(l => !existing[l] || !existing[l].name);
    if (ONLY_MISSING && missing.length === 0) {
      skipped++;
      continue;
    }
    const need = ONLY_MISSING ? missing : LOCALES;
    if (need.length === 0) { skipped++; continue; }

    try {
      const result = await translateProduct(p, need);
      const merged = { ...existing, ...result };
      await updateI18n(p.id, merged);
      translated++;
      // rough cost estimate: ~600 tokens out @ haiku $0.80/Mtok = $0.0005/product
      totalCost += 0.0005;
      const cats = Object.keys(merged).join(',');
      console.log(`  ✓ ${p.name.padEnd(40).slice(0, 40)} [${cats}]`);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${p.id} (${p.name}): ${e.message}`);
    }
  }

  const dur = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\ndone in ${dur}s — translated=${translated} skipped=${skipped} failed=${failed} ~$${totalCost.toFixed(2)}`);
}

main().catch(e => { console.error(e); process.exit(1); });
