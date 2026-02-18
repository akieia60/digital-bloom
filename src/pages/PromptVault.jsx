import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFounderAuth } from '../hooks/useFounderAuth';
import FounderLogin from '../components/FounderLogin';
import {
  VISUAL_DOCTRINE,
  CONSISTENCY_RULES,
  HIGGS_FIELD_SUFFIX,
  SIGNATURE_SERIES,
  BLOOM_COLLECTION_SERIES,
  MOTHERS_DAY_COLLECTION,
  MISSING_ZODIAC_SIGNS,
  BIRTHDAY_CELEBRATION,
  HOLIDAY_COLLECTION,
  INCLUSIVE_SPECIAL_CATEGORIES,
  ORIGINAL_PROMPTS,
  LAUNCH_PROMPTS,
  ALL_PROMPTS,
} from '../data/promptVaultData';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY_COMPLETED = 'db_prompt_vault_completed';
const STORAGE_KEY_HIGGS = 'db_prompt_vault_higgs';
const TOTAL_PROMPTS = ALL_PROMPTS.length; // 54

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all', label: 'All Prompts', count: ALL_PROMPTS.length },
  { key: 'original', label: 'Original Collection', count: ORIGINAL_PROMPTS.length },
  { key: 'launch', label: 'New — Launch Prompts', count: LAUNCH_PROMPTS.length },
];

const CATEGORY_FILTERS = [
  { key: 'signature', label: 'Signature Series' },
  { key: 'bloom', label: 'Bloom Collection' },
  { key: 'mothers', label: "Mother's Day" },
  { key: 'zodiac', label: 'Zodiac Signs' },
  { key: 'birthday', label: 'Birthday & Celebration' },
  { key: 'holiday', label: 'Holiday Collection' },
  { key: 'inclusive', label: 'Inclusive & Special' },
];

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_MAP = {
  "Mother's Day Collection": { label: 'PRIORITY', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  "Missing Zodiac Signs": { label: 'HIGH PRIORITY', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
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
  {
    key: 'zodiac',
    title: 'Missing Zodiac Signs',
    subtitle: 'Prompts 23–29 — Weeks 2–5',
    prompts: MISSING_ZODIAC_SIGNS,
    priority: PRIORITY_MAP["Missing Zodiac Signs"],
  },
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

// ─── PromptCard Component ─────────────────────────────────────────────────────
function PromptCard({ prompt, completed, onToggleComplete, higgsEnabled }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isNewPrompt = prompt.id >= 21;
  const priority = isNewPrompt ? PRIORITY_MAP[prompt.category] : null;

  const handleCopy = async () => {
    let text = prompt.prompt;
    if (higgsEnabled) {
      text = text + '\n\n' + HIGGS_FIELD_SUFFIX;
    }
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
        <div className="flex items-center gap-2 ml-9">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/25 active:scale-[0.97]'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Prompt
              </>
            )}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 sm:py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white/70 transition-all"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="hidden sm:inline">{expanded ? 'Hide' : 'View'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Prompt Text */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 ml-9">
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04]">
            <pre className="whitespace-pre-wrap text-sm text-white/60 leading-relaxed font-sans">
              {prompt.prompt}
            </pre>
            {higgsEnabled && (
              <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
                <p className="text-sm text-[#D4AF37]/70 italic">
                  + {HIGGS_FIELD_SUFFIX}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Series Section Component ─────────────────────────────────────────────────
function SeriesSection({ title, subtitle, prompts, completedMap, onToggleComplete, higgsEnabled, priority }) {
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
      return !['signature', 'bloom'].includes(activeCategory);
    }
    return activeTab === 'all' || activeTab === 'launch';
  }, [activeTab, activeCategory]);

  const filteredNewSeries = useMemo(() => {
    if (!activeCategory) return NEW_SERIES;
    return NEW_SERIES.filter((s) => s.key === activeCategory);
  }, [activeCategory]);

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
          <p className="text-xs text-white/30 mb-3">Visual Doctrine — Animation Prompt Library</p>

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
                When enabled, copies include: "{HIGGS_FIELD_SUFFIX}"
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
            subtitle="Prompts 1–6 — Core brand animations"
            prompts={SIGNATURE_SERIES}
            completedMap={completedMap}
            onToggleComplete={toggleComplete}
            higgsEnabled={higgsEnabled}
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
              />
            ))}
          </>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-[10px] text-white/20 uppercase tracking-wider">
            Digital Bloom — Prompt Vault
          </p>
          <p className="text-[10px] text-white/15 mt-1">
            {TOTAL_PROMPTS} animation prompts · Visual Doctrine
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptVault;
