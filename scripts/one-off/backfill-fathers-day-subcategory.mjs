import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Father's Day taxonomy:
//   for-dad         — classic father / "Dad" / "Pops"
//   for-grandpa     — granddad / patriarch
//   for-stepdad     — bonus dad
//   father-in-law   — inherited dad
//   from-son        — masculine sender voice
//   from-daughter   — daughter's perspective
//   memorial        — in-memory
const RULES = [
  { sub: 'for-stepdad',   rx: /bonus dad|stepdad|step-dad|step dad/i },
  { sub: 'for-grandpa',   rx: /grandpa|granddad|grandfather|patriarch/i },
  { sub: 'father-in-law', rx: /father in law|father-in-law/i },
  { sub: 'memorial',      rx: /heaven|in memory|still with|forever|legacy/i },
  // for-dad is the default catch-all
];

function classify(name, description) {
  const blob = `${name || ''}\n${description || ''}`;
  for (const r of RULES) if (r.rx.test(blob)) return r.sub;
  return 'for-dad';
}

const { data, error } = await sb
  .from('products')
  .select('id, name, description, subcategory')
  .eq('category', 'fathers-day')
  .eq('is_active', true);
if (error) { console.error(error); process.exit(1); }

const apply = process.argv.includes('--apply');
console.log(apply ? '\n[APPLY MODE]\n' : '\n[DRY RUN — pass --apply]\n');

const counts = {};
const updates = [];
for (const p of data) {
  const sub = classify(p.name, p.description);
  counts[sub] = (counts[sub] || 0) + 1;
  updates.push({ id: p.id, name: p.name, sub });
  console.log(`  ${sub.padEnd(14)} | ${p.name}`);
}

console.log('\nDistribution:');
for (const [k, v] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}

if (!apply) { console.log('\n(Re-run with --apply to commit.)'); process.exit(0); }

let ok = 0, fail = 0;
for (const u of updates) {
  const { error } = await sb.from('products').update({ subcategory: u.sub }).eq('id', u.id);
  if (error) { console.error('  fail', u.id, error.message); fail++; }
  else ok++;
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
