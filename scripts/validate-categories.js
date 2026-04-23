#!/usr/bin/env node
/**
 * validate-categories.js
 * ────────────────────────────────────────────────────────────
 * Build-time guard that catches category drift BEFORE deploy.
 *
 * Checks:
 *   1. Every `cat:` string in public/prompt-engine.html maps to a canonical
 *      slug via PROMPT_ENGINE_CATEGORY_MAP (from src/data/categories.js).
 *   2. Per-category prompt counts match `expectedPrompts` in categories.js
 *      (catches accidental deletions in the prompt engine).
 *   3. Total prompt count matches TOTAL_EXPECTED_PROMPTS.
 *
 * Wire into package.json as a `prebuild` or `vercel-build` step so Vercel
 * deployments fail loudly instead of silently routing uploads to the wrong
 * category.
 *
 * Usage:   node scripts/validate-categories.js
 * Exits:   0 on success, 1 on any mismatch.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES,
  PROMPT_ENGINE_CATEGORY_MAP,
  TOTAL_EXPECTED_PROMPTS,
} from '../src/data/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HTML_PATH = path.join(__dirname, '..', 'public', 'prompt-engine.html');
const VALIDATION_SCOPE_START = 'const PROMPTS = [';
const VALIDATION_SCOPE_END = 'const ACKNOWLEDGEMENT_PACK = [';

// ── Read the prompt engine ────────────────────────────────────────────
if (!fs.existsSync(HTML_PATH)) {
  console.error(`❌ prompt-engine.html not found at ${HTML_PATH}`);
  process.exit(1);
}
const html = fs.readFileSync(HTML_PATH, 'utf8');
const scopeStart = html.indexOf(VALIDATION_SCOPE_START);
const scopeEnd = html.indexOf(VALIDATION_SCOPE_END);

if (scopeStart === -1 || scopeEnd === -1 || scopeEnd <= scopeStart) {
  console.error(
    '❌ Could not isolate the built-in prompt library in prompt-engine.html.'
  );
  process.exit(1);
}

// Validate only the built-in prompt catalog.
// Custom-library tooling can define ad hoc categories that are not yet
// storefront-mapped, and those should not block production deploys.
const validationHtml = html.slice(scopeStart, scopeEnd);

// ── Extract every cat:'...' or cat:"..." value ────────────────────────
// Matches cat:'Mother\'s Day' and cat:"Thanksgiving" — handles escaped quotes.
const catRegex = /\bcat:\s*(['"])((?:\\\1|(?!\1).)*)\1/g;
const catStrings = [];
let m;
while ((m = catRegex.exec(validationHtml)) !== null) {
  catStrings.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
}

if (catStrings.length === 0) {
  console.error('❌ No cat: strings found in prompt-engine.html. Regex broken?');
  process.exit(1);
}

// ── 1. Every cat: must map to a canonical slug ────────────────────────
const unmapped = new Set();
const perCatCount = {};
for (const c of catStrings) {
  if (!PROMPT_ENGINE_CATEGORY_MAP[c]) unmapped.add(c);
  const slug = PROMPT_ENGINE_CATEGORY_MAP[c] || '__UNMAPPED__';
  perCatCount[slug] = (perCatCount[slug] || 0) + 1;
}

const errors = [];

if (unmapped.size > 0) {
  errors.push(
    `Unmapped cat: strings in prompt-engine.html — add to promptEngineLabels in src/data/categories.js:\n  - ${[...unmapped].join('\n  - ')}`
  );
}

// ── 2. Per-category counts ────────────────────────────────────────────
const countMismatches = [];
for (const cat of CATEGORIES) {
  if (cat.expectedPrompts == null) continue;
  const actual = perCatCount[cat.slug] || 0;
  if (actual !== cat.expectedPrompts) {
    countMismatches.push(
      `  - ${cat.slug.padEnd(20)} expected ${cat.expectedPrompts}, found ${actual}`
    );
  }
}
if (countMismatches.length > 0) {
  errors.push(
    `Per-category prompt counts drifted:\n${countMismatches.join('\n')}\n  (update expectedPrompts in categories.js, OR restore missing prompts in prompt-engine.html)`
  );
}

// ── 3. Total count ────────────────────────────────────────────────────
if (catStrings.length !== TOTAL_EXPECTED_PROMPTS) {
  errors.push(
    `Total prompt count: expected ${TOTAL_EXPECTED_PROMPTS}, found ${catStrings.length}`
  );
}

// ── Report ────────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error('\n❌ Category validation FAILED:\n');
  for (const e of errors) console.error(e + '\n');
  console.error(
    'Fix these before deploying — uploads will silently misroute otherwise.\n'
  );
  process.exit(1);
}

console.log(
  `✅ Categories OK — ${catStrings.length} prompts across ${CATEGORIES.length} canonical categories, all mapped.`
);
