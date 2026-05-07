import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Subcategory rules (priority order — first match wins).
// Pattern matches against `${name}\n${description}` lowercased.
const RULES = [
  {
    sub: 'memorial',
    label: 'In Memory',
    rx: /heaven|eternal|spirit|became the light|lives on|still with|in memory|still blooms|transcendent|her garden lives|she became the light/i,
  },
  {
    sub: 'from-son',
    label: 'From Son',
    rx: /\bson(?!g)|\bking\b|masculine|throne|imperial|general's|iron & velvet|blood & gold|coronation|crowning his|raised a king|built a king|son who shows/i,
  },
  {
    sub: 'for-grandma',
    label: 'For Grandma',
    rx: /matriarch|generational|three generations|heirloom|vintage grandeur|three blooms|three waves|garden she planted|antique botanical|generational bloom/i,
  },
  {
    sub: 'new-mom',
    label: 'For New Mom',
    rx: /new motherhood|joyful arrival|became mama|born in bloom|new mother|first bloom|peony-forward/i,
  },
  {
    sub: 'long-distance',
    label: 'Long Distance',
    rx: /long distance|across the miles|letter home|far away|long-distance|across a great|golden hour letter/i,
  },
];

function classify(name, description) {
  const blob = `${name || ''}\n${description || ''}`;
  for (const r of RULES) {
    if (r.rx.test(blob)) return { sub: r.sub, label: r.label };
  }
  return { sub: 'for-mom', label: 'For Mom' };
}

const { data, error } = await sb
  .from('products')
  .select('id, name, description, subcategory')
  .eq('category', 'mothers-day')
  .eq('is_active', true);

if (error) { console.error(error); process.exit(1); }

const apply = process.argv.includes('--apply');
console.log(apply ? '\n[APPLY MODE — writing to Supabase]\n' : '\n[DRY RUN — pass --apply to write]\n');

const counts = {};
const updates = [];
for (const p of data) {
  const { sub, label } = classify(p.name, p.description);
  counts[sub] = (counts[sub] || 0) + 1;
  updates.push({ id: p.id, name: p.name, sub });
  console.log(`  ${sub.padEnd(14)} | ${p.name}`);
}

console.log('\nDistribution:');
for (const [k, v] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}

if (!apply) {
  console.log('\n(Re-run with --apply to commit.)');
  process.exit(0);
}

let ok = 0, fail = 0;
for (const u of updates) {
  const { error } = await sb
    .from('products')
    .update({ subcategory: u.sub })
    .eq('id', u.id);
  if (error) { console.error('  fail', u.id, error.message); fail++; }
  else ok++;
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
