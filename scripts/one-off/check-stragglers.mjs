import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const env = {};
for (const line of readFileSync(path.resolve('/Users/ak/Documents/GitHub/digital-bloom/.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Pull ALL active mothers-day with their verbose tags
const { data } = await sb
  .from('products')
  .select('id, name, subcategory, is_active, last_action_by, last_action_at')
  .eq('category', 'mothers-day')
  .order('last_action_at', { ascending: false, nullsFirst: false })
  .limit(120);

const active = data.filter(p => p.is_active);
const inactive = data.filter(p => !p.is_active);
console.log('Active total:', active.length);
console.log('Inactive total:', inactive.length);

const verboseSlugs = active.filter(p => p.subcategory && (
  p.subcategory.startsWith('for-a-') ||
  p.subcategory.includes('-mom-doing-it-all') ||
  p.subcategory.includes('-a-friend-whos') ||
  p.subcategory === 'to-my-wife'
));
console.log('\nProducts with verbose / non-canonical subcats:', verboseSlugs.length);
for (const p of verboseSlugs) console.log(`  ${p.subcategory.padEnd(40)} | ${p.name}`);

// Anything published in the last 4 hours
const fourHoursAgo = new Date(Date.now() - 4*60*60*1000).toISOString();
const recent = active.filter(p => p.last_action_at && p.last_action_at > fourHoursAgo);
console.log('\nPublished/touched in last 4 hours:', recent.length);
const byActor = {};
for (const p of recent) byActor[p.last_action_by || 'NULL'] = (byActor[p.last_action_by || 'NULL'] || 0) + 1;
console.log('  by actor:', byActor);
