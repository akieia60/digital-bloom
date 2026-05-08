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
  .select('id, name, description')
  .eq('category', 'mothers-day')
  .eq('is_active', true)
  .is('subcategory', null);
console.log('UNTAGGED active Mother\'s Day:', data.length);
for (const p of data) {
  console.log(`  ${p.name}`);
  console.log(`    desc: ${(p.description || '').slice(0, 110)}`);
}
