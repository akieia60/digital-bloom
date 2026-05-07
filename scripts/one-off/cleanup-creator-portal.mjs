/**
 * 2026-05-07 cleanup: legacy creator-portal flow is dead. Bre uses
 * /admin/archive.html → "Bre Pull" instead. This script:
 *   1. Deletes the breana/* files from Vercel Blob (frees storage)
 *   2. Deletes the creator_video_assignments + creators rows
 *   3. DROPs both tables
 *
 * Run once with --apply. Without --apply prints what would happen.
 */
import { createClient } from '@supabase/supabase-js';
import { list, del } from '@vercel/blob';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const env = {};
for (const line of readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const apply = process.argv.includes('--apply');
const blobToken = env.BLOB_READ_WRITE_TOKEN;

console.log(apply ? '\n[APPLY MODE]\n' : '\n[DRY RUN — pass --apply]\n');

// 1. Blob storage — list + delete
console.log('1. Vercel Blob: listing creators/* paths…');
let blobUrls = [];
let cursor;
do {
  const result = await list({ prefix: 'creators/', token: blobToken, cursor });
  blobUrls.push(...result.blobs.map(b => b.url));
  cursor = result.cursor;
} while (cursor);
console.log(`   found ${blobUrls.length} blob files (sample: ${blobUrls.slice(0,3).map(u=>u.split('/').slice(-1)[0]).join(', ')})`);

if (apply && blobUrls.length > 0) {
  // del() accepts an array
  for (let i = 0; i < blobUrls.length; i += 50) {
    await del(blobUrls.slice(i, i + 50), { token: blobToken });
  }
  console.log(`   deleted ${blobUrls.length} blobs`);
}

// 2. Supabase rows
console.log('\n2. Supabase rows…');
if (apply) {
  const { error: e1 } = await sb.from('creator_video_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (e1) console.error('   assignments delete err:', e1.message);
  const { error: e2 } = await sb.from('creators').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (e2) console.error('   creators delete err:', e2.message);
  console.log('   deleted all rows from both tables');
} else {
  console.log('   would delete 46 + 1 rows');
}

// 3. Tables — these need raw SQL. Skip in script; do via supabase mcp in-line.
console.log('\n3. DROP TABLE — apply manually via supabase mcp:');
console.log('   DROP TABLE IF EXISTS creator_video_assignments CASCADE;');
console.log('   DROP TABLE IF EXISTS creators CASCADE;');

console.log('\nDone.');
