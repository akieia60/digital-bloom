import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Three husband-to-wife blooms currently in `mother-of-my-children`.
// Their descriptions (My Wife / My Heart My Home My Love / Mama of Our World)
// are direct love framings, not parenthood-framed. They belong in the new
// `to-my-wife` lane Gamble dictated 5/8 01:53.
const apply = process.argv.includes('--apply');
const { data } = await sb
  .from('products')
  .select('id, name')
  .eq('category', 'mothers-day')
  .eq('is_active', true)
  .eq('subcategory', 'mother-of-my-children');
console.log(`${data.length} blooms moving from mother-of-my-children → to-my-wife`);
for (const p of data) console.log(`  ${p.name}`);
if (!apply) { console.log('\n(--apply to commit)'); process.exit(0); }
let ok = 0;
for (const p of data) {
  const { error } = await sb.from('products').update({ subcategory: 'to-my-wife' }).eq('id', p.id);
  if (!error) ok++;
}
console.log(`\nDone. Retagged: ${ok}`);
