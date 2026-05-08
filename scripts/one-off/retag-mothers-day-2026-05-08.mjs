import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// CANONICAL slugs that match src/data/laneCatalogs.js for mothers-day:
//   for-mom, for-grandma, new-mom, mother-of-my-children,
//   stepmom, godmother-auntie, single-mom, friend-honoring,
//   from-son, long-distance, memorial
const RULES = [
  { sub: 'memorial', rx: /heaven|eternal|spirit|became the light|lives on|still with|in memory|still blooms|transcendent|her garden lives|she became the light|carried in light|grief as sacred|sacred glow/i },
  { sub: 'new-mom',  rx: /new motherhood|joyful arrival|became mama|born in bloom|first bloom|peony-forward|first mother|new crown|tiny things|bootie|first petal|baby.s breath dominant|just became grandma|she became mama/i },
  { sub: 'from-son', rx: /\bson(?!g)|\bking\b|masculine|throne|imperial|general's|iron & velvet|blood & gold|coronation|crowning his|raised a king|built a king|son who shows|proud son/i },
  { sub: 'for-grandma', rx: /matriarch|generational|three generations|heirloom|vintage grandeur|three blooms|three waves|garden she planted|antique botanical|generational bloom|just became grandma/i },
  { sub: 'mother-of-my-children', rx: /mother of my (?:babies|children)|mother of my babies|love of my life is their mama|made me a father|forever grateful (?:wife|husband)|the wife who/i },
  { sub: 'stepmom',  rx: /step.?mom|bonus mom|chose to show up|chose us|stepped in stayed|mother by choice|the other mother|family isn.t just blood|raised me as her own/i },
  { sub: 'godmother-auntie', rx: /godmother|god.mother|\bauntie\b|the other mother (?!and)|second mom|aunt(?:ie)? magic|always my auntie/i },
  { sub: 'single-mom', rx: /single mom|royalty|did it on her own|both parents|all on her own|doing it all/i },
  { sub: 'friend-honoring', rx: /friend.s a mom|friend who's a mom|mom friend|sisterhood of mothers|mom friend energy/i },
  { sub: 'long-distance', rx: /long distance|across the miles|letter home|far away|long-distance|across a great|golden hour letter|miles between/i },
];

function classify(name, description) {
  const blob = `${name || ''}\n${description || ''}`;
  for (const r of RULES) if (r.rx.test(blob)) return r.sub;
  return 'for-mom';
}

const { data, error } = await sb
  .from('products')
  .select('id, name, description, subcategory')
  .eq('category', 'mothers-day')
  .eq('is_active', true);
if (error) { console.error(error); process.exit(1); }

const apply = process.argv.includes('--apply');
console.log(apply ? '\n[APPLY MODE]\n' : '\n[DRY RUN — pass --apply]\n');

const counts = {};
const updates = [];
for (const p of data) {
  const sub = classify(p.name, p.description);
  counts[sub] = (counts[sub] || 0) + 1;
  if (sub !== p.subcategory) updates.push({ id: p.id, name: p.name, from: p.subcategory, to: sub });
}

console.log(`${updates.length} of ${data.length} need re-tagging.\n`);
for (const u of updates) {
  console.log(`  ${(u.from || 'NULL').padEnd(40)} → ${u.to.padEnd(20)} | ${u.name}`);
}

console.log('\nFinal distribution if applied:');
for (const [k, v] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}

if (!apply) { console.log('\n(Re-run with --apply to commit.)'); process.exit(0); }

let ok = 0, fail = 0;
for (const u of updates) {
  const { error } = await sb.from('products').update({ subcategory: u.to }).eq('id', u.id);
  if (error) { console.error('  fail', u.id, error.message); fail++; }
  else ok++;
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
