import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const apply = process.argv.includes('--apply');

// Per Ak's call yesterday: sister blooms bucket into friend-honoring
// (existing "For Friend" lane covers "celebrate a peer who's now a mom").
// And the verbose `for-auntie` slug should align to the canonical
// `godmother-auntie` so it surfaces in the existing For Auntie lane.
const REMAPS = [
  { from: 'for-sister', to: 'friend-honoring' },
  { from: 'for-auntie', to: 'godmother-auntie' },
];

for (const { from, to } of REMAPS) {
  const { data } = await sb.from('products').select('id, name').eq('subcategory', from).eq('category', 'mothers-day').eq('is_active', true);
  console.log(`${from} → ${to}: ${data.length} products`);
  for (const p of data) console.log(`  ${p.name}`);
  if (apply) {
    for (const p of data) {
      await sb.from('products').update({ subcategory: to }).eq('id', p.id);
    }
    console.log(`  applied: ${data.length}`);
  }
}
console.log(apply ? '\nDone.' : '\n(--apply to commit)');
