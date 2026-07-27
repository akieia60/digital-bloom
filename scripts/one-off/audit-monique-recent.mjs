import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Pull the most recent active Mother's-Day-flavored blooms — sorted
// newest first — so Ak can scan for slow-mo offenders in the morning.
const { data, error } = await sb
  .from('products')
  .select('id, name, category, subcategory, description, video_file_url, video_url, created_at, updated_at, prompt_used')
  .in('category', ['mothers-day', 'fathers-day', 'birthday', 'acknowledgement', 'graduation', 'love'])
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .limit(30);

if (error) { console.error(error); process.exit(1); }

console.log(`\nLast 30 active blooms across major categories — newest first.\n`);
console.log('SLOW-MO HUNT TIPS:');
console.log('  Look at description for "slow motion", "slow-mo", "ethereal", "drifting", "floating gently"');
console.log('  Anything with "Monique" in the description was Monique-rendered.');
console.log('  Newer blooms (closer to today) are more likely the offenders.\n');

for (const p of data) {
  const vid = p.video_file_url || p.video_url || '';
  const filename = vid.split('/').pop().split('?')[0];
  const isMonique = /Monique/i.test(p.description || '');
  console.log(`────────────────────────────────────────`);
  console.log(`  ${p.name}  ${isMonique ? '· Monique' : ''}`);
  console.log(`  cat:${p.category}/${p.subcategory || '(untagged)'}  · created ${(p.created_at || '').slice(0, 16)}`);
  console.log(`  desc: ${(p.description || '').slice(0, 140)}`);
  console.log(`  file: ${filename}`);
  console.log(`  id:   ${p.id}`);
}
