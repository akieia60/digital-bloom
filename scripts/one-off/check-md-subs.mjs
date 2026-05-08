import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await sb
  .from('products')
  .select('subcategory, name')
  .eq('category', 'mothers-day')
  .eq('is_active', true);

const counts = {};
for (const p of data) counts[p.subcategory || 'untagged'] = (counts[p.subcategory || 'untagged'] || 0) + 1;
console.log('MOTHER\'S DAY ACTIVE — subcategory breakdown:');
for (const [k, v] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}
console.log('\nTOTAL:', data.length);
