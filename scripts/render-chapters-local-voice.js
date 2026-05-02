#!/usr/bin/env node
// Render all guide chapters using Ak's local Apple Personal Voice.
// No ElevenLabs. No /api/tts. Pure macOS `say` + `ffmpeg`.
//
// Usage:
//   node scripts/render-chapters-local-voice.js          # render all
//   node scripts/render-chapters-local-voice.js 22       # render only chapter 22
//   node scripts/render-chapters-local-voice.js 18 19 22 # render specific chapters

import { readFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
const GUIDE = join(REPO, 'public', 'guide.html');
const OUT_DIR = join(REPO, 'public', 'audio', 'chapters');
const VOICE = process.env.SPEAK_VOICE || 'Akieia’s Personal Voice 1';

mkdirSync(OUT_DIR, { recursive: true });

// Pull `const chapters = [ ... ];` block out of guide.html and eval it in a sandbox.
const html = readFileSync(GUIDE, 'utf8');
const start = html.indexOf('const chapters = [');
if (start < 0) { console.error('Could not find chapters array in guide.html'); process.exit(1); }

let depth = 0, i = html.indexOf('[', start), end = -1;
for (; i < html.length; i++) {
  const c = html[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) { console.error('Unbalanced chapters array'); process.exit(1); }

const arrSrc = html.slice(start + 'const chapters = '.length, end + 1);
let chapters;
try {
  chapters = (new Function(`return ${arrSrc};`))();
} catch (e) {
  console.error('Failed to parse chapters array:', e.message);
  process.exit(1);
}

console.log(`Loaded ${chapters.length} chapters from guide.html`);
console.log(`Voice: ${VOICE}`);
console.log(`Output: ${OUT_DIR}\n`);

const onlyArgs = process.argv.slice(2).map(Number).filter(n => Number.isFinite(n));
const targets = onlyArgs.length > 0
  ? onlyArgs.map(n => n - 1).filter(idx => idx >= 0 && idx < chapters.length)
  : chapters.map((_, idx) => idx);

let ok = 0, fail = 0;
for (const idx of targets) {
  const num = String(idx + 1).padStart(2, '0');
  const ch = chapters[idx];
  const aiff = join(tmpdir(), `chapter-${num}.aiff`);
  const mp3 = join(OUT_DIR, `chapter-${num}.mp3`);

  process.stdout.write(`[${num}] ${ch.t} ... `);
  const t0 = Date.now();

  try {
    execFileSync('say', ['-v', VOICE, '-o', aiff, ch.s], {
      stdio: ['ignore', 'ignore', 'pipe'],
      maxBuffer: 1024 * 1024,
    });
    spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff,
      '-codec:a', 'libmp3lame', '-b:a', '96k', '-ar', '44100', mp3],
      { stdio: ['ignore', 'inherit', 'inherit'] });
    if (!existsSync(mp3)) throw new Error('mp3 not written');
    const sz = statSync(mp3).size;
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`done (${(sz / 1024).toFixed(0)} KB, ${secs}s)`);
    ok++;
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
    fail++;
  }
}

console.log(`\n${ok} rendered, ${fail} failed.`);
process.exit(fail ? 1 : 0);
