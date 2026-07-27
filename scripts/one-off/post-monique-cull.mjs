import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Active counts
const { data: all } = await sb.from('products').select('category, subcategory, is_active').limit(2000);
const active = all.filter(p => p.is_active);
const inactive = all.filter(p => !p.is_active);

const cat = {};
const sub = {};
for (const p of active) {
  cat[p.category || 'NULL'] = (cat[p.category || 'NULL'] || 0) + 1;
  if (p.category === 'mothers-day') {
    sub[p.subcategory || '__untagged'] = (sub[p.subcategory || '__untagged'] || 0) + 1;
  }
}

console.log('TOTAL: ', active.length, 'active /', inactive.length, 'inactive\n');
console.log('ACTIVE BY CATEGORY:');
for (const [k, v] of Object.entries(cat).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}
console.log('\nMOTHER\'S DAY — by subcategory:');
for (const [k, v] of Object.entries(sub).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}

// What's left in Mother's Day specifically
const { data: md } = await sb
  .from('products')
  .select('id, name, subcategory, created_at')
  .eq('category', 'mothers-day')
  .eq('is_active', true)
  .order('subcategory', { ascending: true });
console.log('\nMOTHER\'S DAY SURVIVORS:');
for (const p of (md || [])) {
  console.log(`  ${(p.subcategory || 'untagged').padEnd(14)} | ${p.name}`);
}
