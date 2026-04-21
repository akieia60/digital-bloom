import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const WRITE_MODE = process.argv.includes('--write');
const supabaseKey = WRITE_MODE ? serviceRoleKey : (serviceRoleKey || anonKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials for the requested mode.');
  console.error('Dry run needs VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY. Write mode also needs SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (WRITE_MODE && !serviceRoleKey) {
  console.error('Write mode requires SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const LEGACY_PRODUCT_ALIASES = {
  'ss-bd-01': 'v2-210',
  'ss-bd-02': 'v2-211',
  'birthday-happy-birthday-v1': 'bday-1',
  'encouragement-sunrise-sunflowers-you-ve-got-this': 'enc-1',
  'friendship-thinking-of-you-orchids-and-roses-v1': 'friend-4',
  'friendship-thinking-of-you-white-orchids-white-roses-v1': 'friend-4',
  'congratulations-bouquet-v67': 'cel-1',
  'congratulations-rose-bloom-v86': 'cel-1',
  'i-love-you-rose-bloom': 'love-1',
  'i-love-you-rose-bloom-2': 'love-1',
};

const PROMPT_ENGINE_PATH = path.join(process.cwd(), 'public', 'prompt-engine.html');
const REPORT_PATH = path.join(process.cwd(), 'reports', 'prompt-id-backfill-report.json');

function parsePromptEntries(html) {
  return [...html.matchAll(/\{id:'([^']+)',title:(?:"([^"]+)"|'([^']+)'),cat:(?:"([^"]+)"|'([^']+)')/g)].map((match) => ({
    id: match[1],
    title: match[2] || match[3],
    cat: match[4] || match[5],
  }));
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function cleanLegacyName(name) {
  return String(name || '')
    .replace(/^\s*[A-Z]{1,4}-\d{2,3}\s+[—-]\s+/u, '')
    .replace(/\(vault\)/gi, '')
    .replace(/\bvault bloom\b/gi, '')
    .replace(/\bbloom\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSuggestedMatches(product, prompts, promptIdSet) {
  if (product.prompt_id && promptIdSet.has(product.prompt_id)) {
    return [{ promptId: product.prompt_id, reason: 'prompt_id' }];
  }
  if (promptIdSet.has(product.slug)) {
    return [{ promptId: product.slug, reason: 'slug' }];
  }
  if (LEGACY_PRODUCT_ALIASES[product.slug] && promptIdSet.has(LEGACY_PRODUCT_ALIASES[product.slug])) {
    return [{ promptId: LEGACY_PRODUCT_ALIASES[product.slug], reason: 'alias' }];
  }

  const cleaned = normalize(cleanLegacyName(product.name));
  if (!cleaned) return [];

  const titleCandidates = prompts.filter((prompt) => {
    const title = normalize(prompt.title);
    return cleaned === title || cleaned.includes(title) || title.includes(cleaned);
  });

  return titleCandidates.map((candidate) => ({
    promptId: candidate.id,
    promptTitle: candidate.title,
    promptCategory: candidate.cat,
    reason: 'candidate-title',
  }));
}

async function main() {
  const html = fs.readFileSync(PROMPT_ENGINE_PATH, 'utf8');
  const prompts = parsePromptEntries(html);
  const promptIdSet = new Set(prompts.map((prompt) => prompt.id));

  let { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, prompt_id, category, is_active')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error?.code === '42703') {
    ({ data: products, error } = await supabase
      .from('products')
      .select('id, name, slug, category, is_active')
      .eq('is_active', true)
      .order('updated_at', { ascending: false }));
  }

  if (error) {
    throw error;
  }

  const directMatches = [];
  const aliasMatches = [];
  const alreadyBackfilled = [];
  const unmatched = [];
  const ambiguous = [];

  for (const product of products || []) {
    const suggestions = getSuggestedMatches(product, prompts, promptIdSet);
    if (suggestions.length === 1) {
      const match = suggestions[0];
      if (match.reason === 'prompt_id') {
        alreadyBackfilled.push({ ...product, resolved_prompt_id: match.promptId });
      } else if (match.reason === 'slug') {
        directMatches.push({ ...product, resolved_prompt_id: match.promptId });
      } else if (match.reason === 'alias') {
        aliasMatches.push({ ...product, resolved_prompt_id: match.promptId });
      } else {
        ambiguous.push({ ...product, suggestions });
      }
      continue;
    }

    if (suggestions.length > 1) {
      ambiguous.push({ ...product, suggestions });
      continue;
    }

    unmatched.push(product);
  }

  const toWrite = [...directMatches, ...aliasMatches].filter((product) => product.prompt_id !== product.resolved_prompt_id);

  if (WRITE_MODE && toWrite.length) {
    for (const product of toWrite) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ prompt_id: product.resolved_prompt_id })
        .eq('id', product.id);

      if (updateError) {
        throw new Error(`Failed updating ${product.slug}: ${updateError.message}`);
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    writeMode: WRITE_MODE,
    promptCount: prompts.length,
    activeProductCount: products?.length || 0,
    alreadyBackfilledCount: alreadyBackfilled.length,
    directMatchCount: directMatches.length,
    aliasMatchCount: aliasMatches.length,
    toWriteCount: toWrite.length,
    ambiguousCount: ambiguous.length,
    unmatchedCount: unmatched.length,
    directMatches,
    aliasMatches,
    ambiguous,
    unmatched,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`Prompt IDs in engine: ${prompts.length}`);
  console.log(`Active products in Supabase: ${products?.length || 0}`);
  console.log(`Already backfilled: ${alreadyBackfilled.length}`);
  console.log(`Direct slug matches: ${directMatches.length}`);
  console.log(`Legacy alias matches: ${aliasMatches.length}`);
  console.log(`Would write prompt_id for: ${toWrite.length}`);
  console.log(`Ambiguous/manual review: ${ambiguous.length}`);
  console.log(`Unmatched/manual review: ${unmatched.length}`);
  console.log(`Report written to: ${REPORT_PATH}`);

  if (!WRITE_MODE) {
    console.log('Dry run only. Re-run with --write to apply direct and alias matches.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
