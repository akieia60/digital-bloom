// Post-deploy & periodic smoke test for digitalbloom.store. Runs through
// the critical-path endpoints, validates response shape, and logs each run
// to the `smoke_test_runs` Supabase table. Designed to catch the class of
// bugs that bit Ak on launch day — code that worked in local dev but
// silently broke on Vercel's runtime (missing fonts, missing ffmpeg, an
// inverted CORS guard, a missing SELECT field, a date-math edge case).
//
// Auth: same pattern as the other cron endpoints (CRON_SECRET bearer OR
// vercel-cron user agent).

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.APP_BASE_URL || 'https://digitalbloom.store';

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.authorization || '';
  const userAgent = String(req.headers['user-agent'] || '');
  if (secret && authHeader === `Bearer ${secret}`) return true;
  return userAgent.includes('vercel-cron');
}

async function checkEndpoint(name, url, validate, allowNon2xx = false) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'digitalbloom-smoke/1.0' },
    });
    const elapsed = Date.now() - start;
    if (!res.ok && !allowNon2xx) {
      return { name, ok: false, status: res.status, ms: elapsed, error: `HTTP ${res.status}` };
    }
    if (validate) {
      const text = await res.text();
      const result = await validate(text, res);
      if (result !== true) {
        return { name, ok: false, status: res.status, ms: elapsed, error: result || 'validation failed' };
      }
    }
    return { name, ok: true, status: res.status, ms: elapsed };
  } catch (err) {
    return { name, ok: false, ms: Date.now() - start, error: err.message };
  }
}

async function runSmokeTests() {
  const checks = [
    {
      name: 'homepage',
      url: `${BASE_URL}/`,
      validate: (text) => text.includes('Digital Bloom') || 'homepage missing brand text',
    },
    {
      name: 'list-products-shape',
      url: `${BASE_URL}/api/list-products?_=${Date.now()}`,
      validate: (text) => {
        try {
          const d = JSON.parse(text);
          if (!Array.isArray(d.products)) return 'products is not an array';
          if (d.products.length < 50) return `only ${d.products.length} products (expected 50+)`;
          const sample = d.products[0];
          for (const f of ['id', 'name', 'slug', 'category', 'subcategory', 'video_url']) {
            if (!(f in sample)) return `missing required field: ${f}`;
          }
          return true;
        } catch (e) {
          return `JSON parse failed: ${e.message}`;
        }
      },
    },
    {
      name: 'customizer',
      url: `${BASE_URL}/customizer.html`,
    },
    {
      name: 'prompt-engine',
      url: `${BASE_URL}/prompt-engine.html`,
      validate: (text) => text.includes('Prompt Engine') || 'prompt-engine missing title',
    },
    {
      name: 'shop-mothers-day',
      url: `${BASE_URL}/shop/mothers-day`,
    },
    {
      name: 'share-page',
      url: `${BASE_URL}/share`,
    },
    {
      name: 'team-calendar-api',
      url: `${BASE_URL}/api/cal`,
      validate: (text) => {
        try {
          const d = JSON.parse(text);
          if (!Array.isArray(d.events)) return 'events is not an array';
          if (d.events.length < 15) return `only ${d.events.length} cal events (expected 15+)`;
          return true;
        } catch (e) {
          return `JSON parse failed: ${e.message}`;
        }
      },
    },
    {
      name: 'session-status-auth',
      url: `${BASE_URL}/api/session-status`,
      allowNon2xx: true,
      validate: (text, res) =>
        // We expect an auth-gated response (400 or 401), NOT a 500 or hang.
        // 400/401 means the CORS guard + auth path is intact; a 500/timeout
        // would indicate the kind of inverted-guard bug we hit yesterday.
        res.status === 400 || res.status === 401 || `session-status should require auth (got ${res.status})`,
    },
  ];

  const results = [];
  for (const check of checks) {
    results.push(await checkEndpoint(check.name, check.url, check.validate, check.allowNon2xx));
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);

  return {
    status: failed.length === 0 ? 'pass' : 'fail',
    passed: passed.length,
    failed: failed.length,
    results,
  };
}

export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const start = Date.now();
  const triggeredBy = req.headers['user-agent']?.includes('vercel-cron')
    ? 'vercel-cron'
    : 'manual';

  const report = await runSmokeTests();
  const durationMs = Date.now() - start;

  await supabase.from('smoke_test_runs').insert({
    status: report.status,
    duration_ms: durationMs,
    passed_count: report.passed,
    failed_count: report.failed,
    results: report.results,
    triggered_by: triggeredBy,
  });

  return res.status(200).json({
    ...report,
    durationMs,
    triggeredBy,
  });
}
