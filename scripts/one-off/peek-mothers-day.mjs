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
  .select('id, name, subcategory, prompt_used, description, occasions, slug')
  .eq('category', 'mothers-day')
  .eq('is_active', true)
  .order('created_at', { ascending: false });

if (error) { console.error(error); process.exit(1); }

console.log('total:', data.length);
console.log('subcat null:', data.filter(p => !p.subcategory).length);
console.log('subcat set:', data.filter(p => p.subcategory).length);
const subcatCounts = {};
for (const p of data) subcatCounts[p.subcategory || 'NULL'] = (subcatCounts[p.subcategory || 'NULL'] || 0) + 1;
console.log('subcategory distribution:', subcatCounts);
console.log('---');
for (const p of data) {
  console.log(JSON.stringify({
    id: p.id.slice(0,8),
    name: p.name,
    sub: p.subcategory,
    occasions: p.occasions,
    desc: (p.description || '').slice(0, 140),
    prompt: (p.prompt_used || '').slice(0, 200),
  }));
}
