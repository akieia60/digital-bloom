import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { count: cCount } = await sb.from('creators').select('*', { count: 'exact', head: true });
const { count: aCount } = await sb.from('creator_video_assignments').select('*', { count: 'exact', head: true });
console.log('creators rows:', cCount);
console.log('creator_video_assignments rows:', aCount);

const { data: list } = await sb.from('creator_video_assignments').select('id, creator_slug, title, blob_path').limit(20);
console.log('sample assignments:', JSON.stringify(list, null, 2));
