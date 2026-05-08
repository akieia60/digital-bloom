import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await sb
  .from('products')
  .select('id, name, is_active, last_action_at, last_action_by')
  .eq('category', 'mothers-day')
  .order('last_action_at', { ascending: false, nullsFirst: false })
  .limit(40);
if (error) { console.error(error); process.exit(1); }

const active = data.filter(p => p.is_active);
const inactive = data.filter(p => !p.is_active);
console.log('Mother\'s Day right now:');
console.log('  active:', active.length);
console.log('  inactive (40 most recently touched):', inactive.length);
console.log('\nMOST RECENT 15 ACTIONS:');
for (const p of data.slice(0, 15)) {
  console.log(`  ${p.is_active ? 'ON ' : 'OFF'} | last_action ${p.last_action_at?.slice(0, 16) || '—'} by ${p.last_action_by || '—'} | ${p.name}`);
}
