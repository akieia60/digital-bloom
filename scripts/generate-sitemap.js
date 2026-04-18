#!/usr/bin/env node
/**
 * generate-sitemap.js
 * ────────────────────────────────────────────────────────────
 * Writes public/sitemap.xml covering:
 *   • Static landing / shop / legal pages
 *   • One URL per canonical category from src/data/categories.js
 *   • One URL per active product in Supabase (if env vars are set)
 *
 * Called from `prebuild` so Vercel always deploys a fresh sitemap.
 *
 * If Supabase env vars are missing (e.g. a contributor running `npm run build`
 * locally without credentials), we skip the per-product URLs and log a
 * warning — the site still ships, just without deep product links in the
 * sitemap. Category + static URLs always render.
 *
 * Usage:   node scripts/generate-sitemap.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES } from '../src/data/categories.js';

// Load .env.local for local runs; Vercel injects env vars natively so the
// import is a no-op there.
try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
  dotenv.config();
} catch { /* dotenv optional */ }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const BASE_URL = (
  process.env.APP_BASE_URL ||
  process.env.VITE_APP_BASE_URL ||
  'https://digitabloom.store'
).replace(/\/$/, '');

const STATIC_PATHS = [
  { loc: '/',        priority: '1.0', changefreq: 'weekly' },
  { loc: '/shop',    priority: '0.9', changefreq: 'daily'  },
  { loc: '/about',   priority: '0.5', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.4', changefreq: 'monthly' },
];

// ── Fetch live products from Supabase (optional) ─────────────────────
async function fetchProducts() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn(
      '⚠️  Sitemap: Supabase env vars missing — skipping per-product URLs.'
    );
    return [];
  }
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('products')
      .select('slug, category, updated_at')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn(`⚠️  Sitemap: Supabase fetch failed — ${err.message}`);
    return [];
  }
}

// ── Render ────────────────────────────────────────────────────────────
function url({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const products = await fetchProducts();

  const entries = [];

  for (const s of STATIC_PATHS) {
    entries.push(url({ ...s, lastmod: today }));
  }

  for (const c of CATEGORIES) {
    entries.push(
      url({
        loc: `/shop/${c.slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
      })
    );
  }

  for (const p of products) {
    if (!p.slug) continue;
    entries.push(
      url({
        loc: `/product/${p.slug}`,
        lastmod: (p.updated_at || today).slice(0, 10),
        changefreq: 'monthly',
        priority: '0.6',
      })
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  fs.writeFileSync(OUT_PATH, xml, 'utf8');
  console.log(
    `✅ Sitemap written — ${STATIC_PATHS.length} static, ${CATEGORIES.length} categories, ${products.length} products.`
  );
}

main().catch((err) => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
