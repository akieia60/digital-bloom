import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFounderAuth } from '../hooks/useFounderAuth';
import FounderLogin from '../components/FounderLogin';
import GrokVideoGenerator from '../components/tracker/GrokVideoGenerator';
import PromptEnhancer from '../components/tracker/PromptEnhancer';
import ViralHooksScorer from '../components/tracker/ViralHooksScorer';
import PromptVersionHistory from '../components/tracker/PromptVersionHistory';
import ExportTools from '../components/tracker/ExportTools';
import { useToast } from '../components/tracker/Toast';
import {
  VISUAL_DOCTRINE,
  CONSISTENCY_RULES,
  HIGGS_FIELD_SUFFIX,
  SIGNATURE_SERIES,
  BLOOM_COLLECTION_SERIES,
  MOTHERS_DAY_COLLECTION,
  BIRTHDAY_CELEBRATION,
  HOLIDAY_COLLECTION,
  INCLUSIVE_SPECIAL_CATEGORIES,
  ORIGINAL_PROMPTS,
  LAUNCH_PROMPTS,
  VAULT_EXPANSION_PHASE_1,
  ALL_PROMPTS,
  V2_ALL_PROMPTS,
} from '../data/promptVaultData';
import { CELESTIAL_SAGA } from '../data/celestialSagaData';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY_COMPLETED = 'db_prompt_vault_completed';
const STORAGE_KEY_HIGGS = 'db_prompt_vault_higgs';
const TOTAL_PROMPTS = ALL_PROMPTS.length;

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all', label: 'All Prompts', count: ALL_PROMPTS.length },
  { key: 'original', label: 'Original Collection', count: ORIGINAL_PROMPTS.length },
  { key: 'launch', label: 'New — Launch Prompts', count: LAUNCH_PROMPTS.length },
  { key: 'expansion', label: 'Vault Expansion', count: VAULT_EXPANSION_PHASE_1.length },
  { key: 'v2library', label: 'v2.0 Library', count: V2_ALL_PROMPTS.length },
];

const CATEGORY_FILTERS = [
  { key: 'signature', label: 'Signature Series' },
  { key: 'bloom', label: 'Bloom Collection' },
  { key: 'mothers', label: "Mother's Day" },
  { key: 'zodiac', label: 'Celestial Saga' },
  { key: 'birthday', label: 'Birthday & Celebration' },
  { key: 'holiday', label: 'Holiday Collection' },
  { key: 'inclusive', label: 'Inclusive & Special' },
  { key: 'occasions', label: 'Occasions' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'flowertypes', label: 'Flower Types' },
  { key: 'mens', label: "Men's Themes" },
];

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_MAP = {
  "Mother's Day Collection": { label: 'PRIORITY', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  // "Missing Zodiac Signs" removed — replaced by Celestial Saga
};

// ─── Series definitions for new prompts ───────────────────────────────────────
const NEW_SERIES = [
  {
    key: 'mothers',
    title: "Mother's Day Collection",
    subtitle: 'Prompts 21–22 — Week 1 Priority',
    prompts: MOTHERS_DAY_COLLECTION,
    priority: PRIORITY_MAP["Mother's Day Collection"],
  },
  // Zodiac entry removed — replaced by Celestial Saga (rendered via CelestialSagaSection)
  {
    key: 'birthday',
    title: 'Birthday & Celebration',
    subtitle: 'Prompts 30–34 — Weeks 5–6',
    prompts: BIRTHDAY_CELEBRATION,
  },
  {
    key: 'holiday',
    title: 'Holiday Collection',
    subtitle: 'Prompts 35–44 — Week 7',
    prompts: HOLIDAY_COLLECTION,
  },
  {
    key: 'inclusive',
    title: 'Inclusive & Special Categories',
    subtitle: 'Prompts 45–54 — Week 7',
    prompts: INCLUSIVE_SPECIAL_CATEGORIES,
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

// ─── Priority Badge Component ─────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  if (!priority) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${priority.color}`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {priority.label}
    </span>
  );
}

// ─── Week Badge Component ─────────────────────────────────────────────────────
function WeekBadge({ week }) {
  if (!week) return null;
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
      Week {week}
    </span>
  );
}

// ─── Copy Button Component ────────────────────────────────────────────────────
function CopyButton({ text, label, variant = 'gold', size = 'normal' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const colorClasses = {
    gold: copied
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/25 active:scale-[0.97]',
    blue: copied
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 active:scale-[0.97]',
    purple: copied
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-purple-500/15 text-purple-400 border border-purple-500/25 hover:bg-purple-500/25 active:scale-[0.97]',
  };

  const sizeClasses = size === 'small' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 sm:py-2 text-sm';

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-300 border ${colorClasses[variant]} ${sizeClasses}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── Mega-Prompt Section Component ────────────────────────────────────────────
function MegaPromptSection({ title, text, variant, stepNumber, higgsEnabled }) {
  let fullText = text;
  if (higgsEnabled && stepNumber === 1) {
    fullText = text + '\n\n' + HIGGS_FIELD_SUFFIX;
  }

  const stepColors = {
    1: { border: 'border-[#D4AF37]/20', bg: 'bg-[#D4AF37]/5', label: 'text-[#D4AF37]', badge: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/25' },
    2: { border: 'border-blue-500/20', bg: 'bg-blue-500/5', label: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    3: { border: 'border-purple-500/20', bg: 'bg-purple-500/5', label: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  };

  const colors = stepColors[stepNumber] || stepColors[1];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 mb-3`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border ${colors.badge}`}>
            {stepNumber}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${colors.label}`}>
            {title}
          </span>
        </div>
        <CopyButton text={fullText} label={`Copy ${title}`} variant={variant} size="small" />
      </div>
      <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
        <pre className="whitespace-pre-wrap text-sm text-white/60 leading-relaxed font-sans">
          {text}
        </pre>
        {higgsEnabled && stepNumber === 1 && (
          <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
            <p className="text-sm text-[#D4AF37]/70 italic">
              + {HIGGS_FIELD_SUFFIX}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PromptCard Component (Mega-Prompt Format) ───────────────────────────────
function PromptCard({ prompt, completed, onToggleComplete, higgsEnabled, onGenerateVideo, onEnhance, onScore, onHistory }) {
  const [expanded, setExpanded] = useState(false);

  const isNewPrompt = prompt.id >= 21;
  const priority = isNewPrompt ? PRIORITY_MAP[prompt.category] : null;
  const hasMegaPrompt = !!(prompt.iteration1 && prompt.iteration2);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        completed
          ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
          : 'border-white/[0.06] bg-white/[0.02]'
      }`}
    >
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        {/* Title Row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Checkbox */}
          <label className="flex-shrink-0 mt-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggleComplete(prompt.id)}
              className="sr-only peer"
            />
            <div
              className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-[#D4AF37]/40 hover:border-[#D4AF37]/70'
              }`}
            >
              {completed && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>

          {/* Title + Reference/Category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#D4AF37]/60">#{prompt.id}</span>
              {hasMegaPrompt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-gradient-to-r from-[#D4AF37]/20 to-purple-500/20 text-[#D4AF37] border border-[#D4AF37]/20">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  MEGA-PROMPT
                </span>
              )}
              {completed && (
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">Done</span>
              )}
              {priority && <PriorityBadge priority={priority} />}
              {prompt.week && <WeekBadge week={prompt.week} />}
            </div>
            <h3
              className={`text-base sm:text-lg font-display font-semibold mt-1 leading-tight ${
                completed ? 'text-white/50 line-through decoration-emerald-500/40' : 'text-white/90'
              }`}
            >
              {prompt.title}
            </h3>
            {/* Show reference for original prompts, category for new ones */}
            {prompt.reference && (
              <p className="text-xs text-white/30 mt-1 italic">
                reference: {prompt.reference}
              </p>
            )}
            {prompt.category && (
              <p className="text-xs text-white/30 mt-1 italic">
                {prompt.category}
              </p>
            )}
          </div>
        </div>

        {/* Mood Tags (original prompts) or Category Tag (new prompts) */}
        <div className="flex flex-wrap gap-1.5 mb-3 ml-9">
          {prompt.mood &&
            prompt.mood.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#D4AF37]/10 text-[#D4AF37]/80 border border-[#D4AF37]/15"
              >
                {tag}
              </span>
            ))}
          {prompt.category && (
            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400/80 border border-purple-500/15">
              {prompt.category}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-9 flex-wrap">
          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              expanded
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{expanded ? 'Hide Mega-Prompt' : hasMegaPrompt ? 'View Mega-Prompt' : 'View Prompt'}</span>
          </button>

          {/* Generate Video Button */}
          <button
            onClick={() => onGenerateVideo(prompt)}
            title="Generate Video"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37]/80 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Video</span>
          </button>

          {/* Enhance Button */}
          <button
            onClick={() => onEnhance(prompt)}
            title="Enhance Prompt"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium bg-purple-500/10 text-purple-400/80 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">Enhance</span>
          </button>

          {/* Score Button */}
          <button
            onClick={() => onScore(prompt)}
            title="Score Hook"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-400/80 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden sm:inline">Score</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => onHistory(prompt)}
            title="Version History"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium bg-blue-500/10 text-blue-400/80 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {/* Expandable Mega-Prompt Content */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          expanded ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 ml-9">
          {/* Mega-Prompt Workflow Header */}
          {hasMegaPrompt && (
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <div className="w-8 h-px bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="w-8 h-px bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
                3-Step Mega-Prompt Workflow
              </span>
            </div>
          )}

          {/* Step 1: Initial Prompt */}
          <MegaPromptSection
            title="Initial Prompt"
            text={prompt.prompt}
            variant="gold"
            stepNumber={1}
            higgsEnabled={higgsEnabled}
          />

          {/* Step 2: Iteration 1 */}
          {prompt.iteration1 && (
            <MegaPromptSection
              title="Iteration 1"
              text={prompt.iteration1}
              variant="blue"
              stepNumber={2}
              higgsEnabled={false}
            />
          )}

          {/* Step 3: Iteration 2 */}
          {prompt.iteration2 && (
            <MegaPromptSection
              title="Iteration 2"
              text={prompt.iteration2}
              variant="purple"
              stepNumber={3}
              higgsEnabled={false}
            />
          )}

          {/* Copy All Button */}
          {hasMegaPrompt && (
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <CopyButton
                text={`=== INITIAL PROMPT ===\n\n${prompt.prompt}${higgsEnabled ? '\n\n' + HIGGS_FIELD_SUFFIX : ''}\n\n=== ITERATION 1 ===\n\n${prompt.iteration1}\n\n=== ITERATION 2 ===\n\n${prompt.iteration2}`}
                label="Copy All 3 Steps"
                variant="gold"
                size="normal"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── Celestial Saga Clip Card ─────────────────────────────────────────────────
const CLIP_COLORS = [
  { border: 'border-[#D4AF37]/20', bg: 'bg-[#D4AF37]/5', label: 'text-[#D4AF37]', badge: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/25', variant: 'gold' },
  { border: 'border-blue-500/20', bg: 'bg-blue-500/5', label: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25', variant: 'blue' },
  { border: 'border-purple-500/20', bg: 'bg-purple-500/5', label: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25', variant: 'purple' },
  { border: 'border-amber-500/20', bg: 'bg-amber-500/5', label: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25', variant: 'gold' },
];

const CLIP_LABELS = [
  'Clip 1 — Symbol Formation',
  'Clip 2 — Creature/Figure',
  'Clip 3 — Bloom Transformation',
  'Clip 4 — Constellation Finale',
];

function CelestialSagaCard({ sign }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Celestial icon */}
          <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg border-2 border-[#D4AF37]/40 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#D4AF37]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/20">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                4-CLIP SEQUENCE
              </span>
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                Celestial Saga
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-semibold mt-1 leading-tight text-white/90">
              {sign.sign} &mdash; {sign.title}
            </h3>
            <p className="text-xs text-white/30 mt-1 italic">
              Generate each clip as a separate 10-second video. Stitch externally. Do not modify order.
            </p>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 ml-9 flex-wrap">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              expanded
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{expanded ? 'Hide Clips' : 'View 4 Clips'}</span>
          </button>
          <CopyButton
            text={sign.clips.map((c, i) => `=== ${CLIP_LABELS[i]} ===\n\n${c}`).join('\n\n')}
            label="Copy All 4"
            variant="gold"
            size="small"
          />
        </div>
      </div>

      {/* Expandable Clip Content */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          expanded ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 ml-9">
          {/* Clip sequence guide */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold border ${CLIP_COLORS[i].badge}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
              4-Clip Cinematic Sequence &mdash; 10 sec each
            </span>
          </div>

          {sign.clips.map((clip, i) => {
            const colors = CLIP_COLORS[i];
            return (
              <div key={i} className={`rounded-xl border ${colors.border} ${colors.bg} p-4 mb-3`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border ${colors.badge}`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${colors.label}`}>
                      {CLIP_LABELS[i]}
                    </span>
                  </div>
                  <CopyButton
                    text={clip}
                    label={`Copy Clip ${i + 1}`}
                    variant={colors.variant}
                    size="small"
                  />
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <pre className="whitespace-pre-wrap text-sm text-white/60 leading-relaxed font-sans">
                    {clip}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Celestial Saga Section ───────────────────────────────────────────────────
function CelestialSagaSection({ signs }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-white/90">
              Digital Bloom &mdash; Celestial Saga
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              NEW SERIES
            </span>
          </div>
          <p className="text-xs text-white/30 mt-0.5">
            12 Zodiac Signs &mdash; 4 Cinematic Clips Each &mdash; Stitch Externally
          </p>
        </div>
        <span className="text-xs font-mono text-[#D4AF37]/60">
          {signs.length} signs
        </span>
      </div>
      <div className="space-y-3">
        {signs.map((sign) => (
          <CelestialSagaCard key={sign.id} sign={sign} />
        ))}
      </div>
    </div>
  );
}

// ─── Series Section Component ─────────────────────────────────────────────────
function SeriesSection({ title, subtitle, prompts, completedMap, onToggleComplete, higgsEnabled, priority, onGenerateVideo, onEnhance, onScore, onHistory }) {
  const completedCount = prompts.filter((p) => completedMap[p.id]).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-white/90">{title}</h2>
            {priority && <PriorityBadge priority={priority} />}
          </div>
          {subtitle && <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs font-mono text-[#D4AF37]/60">
          {completedCount}/{prompts.length}
        </span>
      </div>
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            completed={!!completedMap[prompt.id]}
            onToggleComplete={onToggleComplete}
            higgsEnabled={higgsEnabled}
            onGenerateVideo={onGenerateVideo}
            onEnhance={onEnhance}
            onScore={onScore}
            onHistory={onHistory}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main PromptVault Page ────────────────────────────────────────────────────
const PromptVault = () => {
  const { loading, user, isFounder, error, signIn, signOut } = useFounderAuth();

  // ── Completed state ──
  const [completedMap, setCompletedMap] = useState(() => loadFromStorage(STORAGE_KEY_COMPLETED, {}));

  // ── Higgs Field toggle ──
  const [higgsEnabled, setHiggsEnabled] = useState(() => loadFromStorage(STORAGE_KEY_HIGGS, false));

  // ── Consistency rules collapsed ──
  const [rulesOpen, setRulesOpen] = useState(false);

  // ── Tracker tool modals ──
  const [videoModal, setVideoModal] = useState({ open: false, prompt: null });
  const [enhancerModal, setEnhancerModal] = useState({ open: false, prompt: null });
  const [scorerModal, setScorerModal] = useState({ open: false, prompt: null });
  const [historyModal, setHistoryModal] = useState({ open: false, prompt: null });
  const [showExport, setShowExport] = useState(false);

  const handleGenerateVideo = useCallback((p) => {
    setVideoModal({ open: true, prompt: p });
  }, []);

  const handleEnhance = useCallback((p) => {
    setEnhancerModal({ open: true, prompt: p });
  }, []);

  const handleScore = useCallback((p) => {
    setScorerModal({ open: true, prompt: p });
  }, []);

  const handleHistory = useCallback((p) => {
    setHistoryModal({ open: true, prompt: p });
  }, []);

  // ── Filter state ──
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Persist completed ──
  useEffect(() => {
    saveToStorage(STORAGE_KEY_COMPLETED, completedMap);
  }, [completedMap]);

  // ── Persist higgs ──
  useEffect(() => {
    saveToStorage(STORAGE_KEY_HIGGS, higgsEnabled);
  }, [higgsEnabled]);

  const toggleComplete = useCallback((id) => {
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const completedCount = ALL_PROMPTS.filter((p) => completedMap[p.id]).length;
  const progressPercent = Math.round((completedCount / TOTAL_PROMPTS) * 100);

  // ── Determine which series to show based on filters ──
  const showOriginal = useMemo(() => {
    if (activeCategory) {
      return activeCategory === 'signature' || activeCategory === 'bloom';
    }
    return activeTab === 'all' || activeTab === 'original';
  }, [activeTab, activeCategory]);

  const showLaunch = useMemo(() => {
    if (activeCategory) {
      return !['signature', 'bloom', 'occasions', 'relationships', 'flowertypes', 'mens'].includes(activeCategory);
    }
    return activeTab === 'all' || activeTab === 'launch';
  }, [activeTab, activeCategory]);

  const showExpansion = useMemo(() => {
    if (activeCategory) {
      return ['occasions', 'relationships', 'flowertypes', 'mens'].includes(activeCategory);
    }
    return activeTab === 'all' || activeTab === 'expansion';
  }, [activeTab, activeCategory]);

  const showCelestialSaga = useMemo(() => {
    if (activeCategory) return activeCategory === 'zodiac';
    return activeTab === 'all' || activeTab === 'launch';
  }, [activeTab, activeCategory]);

  const showV2Library = useMemo(() => {
    return activeTab === 'all' || activeTab === 'v2library';
  }, [activeTab]);

  const filteredNewSeries = useMemo(() => {
    if (!activeCategory) return NEW_SERIES;
    return NEW_SERIES.filter((s) => s.key === activeCategory);
  }, [activeCategory]);

  const EXPANSION_SERIES = useMemo(() => {
    const occasions = VAULT_EXPANSION_PHASE_1.filter(p => p.category === 'Occasions');
    const relationships = VAULT_EXPANSION_PHASE_1.filter(p => p.category === 'Relationships');
    const flowerTypes = VAULT_EXPANSION_PHASE_1.filter(p => p.category === 'Flower Types');
    const mensThemes = VAULT_EXPANSION_PHASE_1.filter(p => p.category === "Men's Themes");
    return [
      { key: 'occasions', title: 'Occasions', subtitle: 'Prompts 56\u201373 \u2014 Celebrations & Life Events', prompts: occasions },
      { key: 'relationships', title: 'Relationships', subtitle: 'Prompts 74\u201377 \u2014 Love & Connection', prompts: relationships },
      { key: 'flowertypes', title: 'Flower Types', subtitle: 'Prompts 78\u201381 \u2014 Featured Blooms', prompts: flowerTypes },
      { key: 'mens', title: "Men's Themes", subtitle: 'Prompts 82\u201385 \u2014 Masculine Luxury', prompts: mensThemes },
    ];
  }, []);

  const filteredExpansionSeries = useMemo(() => {
    if (!activeCategory) return EXPANSION_SERIES;
    return EXPANSION_SERIES.filter((s) => s.key === activeCategory);
  }, [activeCategory, EXPANSION_SERIES]);

  const V2_SERIES = useMemo(() => {
    const categories = [...new Set(V2_ALL_PROMPTS.map(p => p.category))];
    return categories.map(cat => ({
      key: cat.toLowerCase().replace(/[^a-z0-9]/g, ''),
      title: cat,
      subtitle: `v2.0 — ${V2_ALL_PROMPTS.filter(p => p.category === cat).length} prompts`,
      prompts: V2_ALL_PROMPTS.filter(p => p.category === cat),
    }));
  }, []);

  const handleCategoryClick = (key) => {
    setActiveCategory((prev) => (prev === key ? null : key));
    setActiveTab('all');
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setActiveCategory(null);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <span className="text-xs text-white/30 uppercase tracking-wider">Loading Vault...</span>
        </div>
      </div>
    );
  }

  // ── Auth gate ──
  if (!user || !isFounder) {
    return <FounderLogin onLogin={signIn} error={error} />;
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 glass border-b border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/founder"
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs">Dashboard</span>
          </Link>
          <button
            onClick={signOut}
            className="text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* ━━━ Header ━━━ */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 mb-4">
            <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text mb-2">
            Digital Bloom Prompt Vault
          </h1>
          <p className="text-xs text-white/30 mb-1">Visual Doctrine — Mega-Prompt Library</p>
          <p className="text-[10px] text-[#D4AF37]/50 mb-3">
            Each prompt includes 3-step mega-prompt workflow: Initial Prompt → Iteration 1 → Iteration 2
          </p>

          {/* Doctrine Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {VISUAL_DOCTRINE.map((note) => (
              <span
                key={note}
                className="inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-[#D4AF37]/8 text-[#D4AF37]/60 border border-[#D4AF37]/10"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* ━━━ Mega-Prompt Workflow Guide ━━━ */}
        <div className="glass rounded-2xl border border-[#D4AF37]/15 p-4 sm:p-5 mb-4 bg-gradient-to-br from-[#D4AF37]/[0.03] to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-display font-semibold text-[#D4AF37]">Mega-Prompt Workflow</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#D4AF37]/[0.06] border border-[#D4AF37]/10">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex-shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-[11px] font-semibold text-[#D4AF37]/80">Initial Prompt</p>
                <p className="text-[10px] text-white/30">Paste into Grok Imagine first</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-500/[0.06] border border-blue-500/10">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-[11px] font-semibold text-blue-400/80">Iteration 1</p>
                <p className="text-[10px] text-white/30">Paste after first result</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-500/[0.06] border border-purple-500/10">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-[11px] font-semibold text-purple-400/80">Iteration 2</p>
                <p className="text-[10px] text-white/30">Paste after second result</p>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ Progress Tracker ━━━ */}
        <div className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-display font-semibold text-white/80">Progress</span>
            <span className="text-sm font-mono text-[#D4AF37]">
              {completedCount} of {TOTAL_PROMPTS} completed
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background:
                  progressPercent === 100
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : 'linear-gradient(90deg, #D4AF37, #F5D76E)',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/25">
            <span>{ORIGINAL_PROMPTS.length} original + {LAUNCH_PROMPTS.length} new launch prompts</span>
            <span>{progressPercent}%</span>
          </div>
          {progressPercent === 100 && (
            <p className="text-xs text-emerald-400 mt-2 text-center font-medium">
              All prompts completed! Your collection is ready.
            </p>
          )}
        </div>

        {/* ━━━ Filter Tabs ━━━ */}
        <div className="glass rounded-2xl border border-white/[0.06] p-3 sm:p-4 mb-4">
          {/* Main Tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.key && !activeCategory
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                {tab.label}
                <span className="text-[10px] font-mono opacity-60">{tab.count}</span>
              </button>
            ))}
          </div>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/[0.03] text-white/30 border border-white/[0.04] hover:bg-white/[0.06] hover:text-white/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ━━━ Higgs Field Toggle ━━━ */}
        <div className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-semibold text-white/80">Higgs Field Mode</span>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    higgsEnabled
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {higgsEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-white/30 mt-1 leading-relaxed">
                When enabled, Initial Prompt copies include: "{HIGGS_FIELD_SUFFIX}"
              </p>
            </div>
            <button
              onClick={() => setHiggsEnabled((prev) => !prev)}
              className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-all duration-300 ${
                higgsEnabled
                  ? 'bg-[#D4AF37]'
                  : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  higgsEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ━━━ Consistency Rules ━━━ */}
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">&#x1F4D0;</span>
              <span className="text-sm font-display font-semibold text-white/80">
                Consistency Rules
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Apply to all</span>
            </div>
            <svg
              className={`w-4 h-4 text-white/30 transition-transform duration-200 ${rulesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              rulesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="space-y-2">
                {CONSISTENCY_RULES.map((rule) => (
                  <div
                    key={rule}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 flex-shrink-0" />
                    <span className="text-sm text-white/60">{rule}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/25 mt-3 italic">
                All prompts work for Grok Imagine and Higgs Field.
              </p>
            </div>
          </div>
        </div>

        {/* ━━━ Original Series ━━━ */}
        {showOriginal && (!activeCategory || activeCategory === 'signature') && (
          <SeriesSection
            title="Signature Series"
            subtitle="Prompts 1–6, 55 — Core brand animations + Mega-Prompt"
            prompts={SIGNATURE_SERIES}
            completedMap={completedMap}
            onToggleComplete={toggleComplete}
            higgsEnabled={higgsEnabled}
            onGenerateVideo={handleGenerateVideo}
            onEnhance={handleEnhance}
            onScore={handleScore}
            onHistory={handleHistory}
          />
        )}

        {showOriginal && (!activeCategory || activeCategory === 'bloom') && (
          <SeriesSection
            title="Bloom Collection Series"
            subtitle="Prompts 7–20 — Extended floral collection"
            prompts={BLOOM_COLLECTION_SERIES}
            completedMap={completedMap}
            onToggleComplete={toggleComplete}
            higgsEnabled={higgsEnabled}
            onGenerateVideo={handleGenerateVideo}
            onEnhance={handleEnhance}
            onScore={handleScore}
            onHistory={handleHistory}
          />
        )}

        {/* ━━━ New Launch Series ━━━ */}
        {showLaunch && (
          <>
            {/* Divider between original and new */}
            {showOriginal && !activeCategory && (
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                <span className="text-xs font-display font-semibold text-[#D4AF37]/60 uppercase tracking-widest">
                  April 2026 Launch Prompts
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              </div>
            )}

            {filteredNewSeries.map((series) => (
              <SeriesSection
                key={series.key}
                title={series.title}
                subtitle={series.subtitle}
                prompts={series.prompts}
                completedMap={completedMap}
                onToggleComplete={toggleComplete}
                higgsEnabled={higgsEnabled}
                priority={series.priority}
                onGenerateVideo={handleGenerateVideo}
                onEnhance={handleEnhance}
                onScore={handleScore}
                onHistory={handleHistory}
              />
            ))}

            {/* ━━━ Celestial Saga ━━━ */}
            {showCelestialSaga && (
              <CelestialSagaSection signs={CELESTIAL_SAGA} />
            )}
          </>
        )}

        {/* ━━━ Vault Expansion Phase 1 ━━━ */}
        {showExpansion && (
          <>
            {(showOriginal || showLaunch) && !activeCategory && (
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                <span className="text-xs font-display font-semibold text-[#D4AF37]/60 uppercase tracking-widest">
                  Vault Expansion — Phase 1
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              </div>
            )}

            {filteredExpansionSeries.map((series) => (
              <SeriesSection
                key={series.key}
                title={series.title}
                subtitle={series.subtitle}
                prompts={series.prompts}
                completedMap={completedMap}
                onToggleComplete={toggleComplete}
                higgsEnabled={higgsEnabled}
                onGenerateVideo={handleGenerateVideo}
                onEnhance={handleEnhance}
                onScore={handleScore}
                onHistory={handleHistory}
              />
            ))}
          </>
        )}

        {/* ━━━ v2.0 Master Prompt Library ━━━ */}
        {showV2Library && (
          <>
            {(showOriginal || showLaunch || showExpansion) && (
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                <span className="text-xs font-display font-semibold text-[#D4AF37]/60 uppercase tracking-widest">
                  v2.0 Master Library — Feldt Framework
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              </div>
            )}
            {V2_SERIES.map((series) => (
              <SeriesSection
                key={series.key}
                title={series.title}
                subtitle={series.subtitle}
                prompts={series.prompts}
                completedMap={completedMap}
                onToggleComplete={toggleComplete}
                higgsEnabled={higgsEnabled}
                onGenerateVideo={handleGenerateVideo}
                onEnhance={handleEnhance}
                onScore={handleScore}
                onHistory={handleHistory}
              />
            ))}
          </>
        )}

        {/* ━━━ Export Button ━━━ */}
        <div className="flex justify-center py-4">
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export All Prompts
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-[10px] text-white/20 uppercase tracking-wider">
            Digital Bloom — Mega-Prompt Vault
          </p>
          <p className="text-[10px] text-white/15 mt-1">
            {TOTAL_PROMPTS} animation mega-prompts · Visual Doctrine · 3-Step Workflow
          </p>
        </div>
      </div>

      {/* ━━━ Tracker Modals ━━━ */}
      <GrokVideoGenerator
        prompt={videoModal.prompt?.prompt || ''}
        promptName={videoModal.prompt?.title || ''}
        onClose={() => setVideoModal({ open: false, prompt: null })}
        isOpen={videoModal.open}
      />

      <PromptEnhancer
        prompt={enhancerModal.prompt?.prompt || ''}
        onEnhanced={(text) => {
          // Enhanced prompt can be used for video generation
          setEnhancerModal({ open: false, prompt: null });
          if (enhancerModal.prompt) {
            setVideoModal({ open: true, prompt: { ...enhancerModal.prompt, prompt: text } });
          }
        }}
        onClose={() => setEnhancerModal({ open: false, prompt: null })}
        isOpen={enhancerModal.open}
      />

      <ViralHooksScorer
        prompt={scorerModal.prompt?.prompt || ''}
        onClose={() => setScorerModal({ open: false, prompt: null })}
        isOpen={scorerModal.open}
      />

      <PromptVersionHistory
        promptId={historyModal.prompt ? `prompt_${historyModal.prompt.id}` : ''}
        promptName={historyModal.prompt?.title || ''}
        currentText={historyModal.prompt?.prompt || ''}
        onRestore={() => {}}
        onClose={() => setHistoryModal({ open: false, prompt: null })}
        isOpen={historyModal.open}
      />

      <ExportTools
        data={ALL_PROMPTS.map(p => ({
          id: p.id,
          title: p.title,
          prompt: p.prompt,
          iteration1: p.iteration1 || '',
          iteration2: p.iteration2 || '',
          category: p.category || '',
          completed: completedMap[p.id] ? 'Yes' : 'No',
        }))}
        filename="digital-bloom-prompts"
        onClose={() => setShowExport(false)}
        isOpen={showExport}
      />
    </div>
  );
};

export default PromptVault;
