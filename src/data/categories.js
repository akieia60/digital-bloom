/**
 * Digital Bloom — Canonical Category Taxonomy
 * ────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for categories across the entire app.
 *
 * Consumed by:
 *   • api/process-bloom.js    → CATEGORY_MAP
 *   • src/pages/Shop.jsx
 *   • src/pages/CategoryPage.jsx
 *   • src/components/ProductGrid.jsx
 *   • src/components/landing/CategoryGrid.jsx
 *   • src/pages/Admin.jsx      → progress dashboard
 *   • public/prompt-engine.html (kept in sync via validate-categories.js)
 *   • scripts/generate-sitemap.js
 *
 * Any drift between this file and those consumers is caught by
 * `node scripts/validate-categories.js`, which runs on every build.
 *
 * HOW TO ADD OR RENAME A CATEGORY:
 *   1. Edit this file.
 *   2. Update prompt-engine.html so cat: strings stay in the allow-list.
 *   3. Run `node scripts/validate-categories.js` before committing.
 *   4. Deploy. No other files need to be touched.
 */

export const CATEGORIES = [
  {
    slug: 'mothers-day',
    name: "Mother's Day",
    title: "Mother's Day Blooms",
    tagline: 'Celebrate the woman who made everything bloom.',
    emoji: '💐',
    accent: '#FF4DA6',
    promptEngineLabels: ["Mother's Day"],
    expectedPrompts: 17,
  },
  {
    slug: 'fathers-day',
    name: "Father's Day",
    title: "Father's Day Blooms",
    tagline: 'The strongest roots grow the tallest flowers.',
    emoji: '👑',
    accent: '#2980B9',
    promptEngineLabels: ["Father's Day"],
    expectedPrompts: 14,
  },
  {
    // Added 2026-04-26 — Monique started generating Graduation blooms
    // (Gamble's "first gen college grad" + "single mom worked night
    // school" seeds). expectedPrompts is 0 because Graduation prompts
    // live in the database (Monique-generated), NOT as hardcoded entries
    // in prompt-engine.html — so the validate-categories build guard
    // isn't counting them. The publish flow needs this entry so cards
    // with cat='Graduation' can route through process-bloom.js.
    slug: 'graduation',
    name: 'Graduation',
    title: 'Graduation Blooms',
    tagline: 'For every diploma earned the long way home.',
    emoji: '🎓',
    accent: '#D4AF37',
    promptEngineLabels: ['Graduation'],
    expectedPrompts: 0,
  },
  {
    slug: 'birthday',
    name: 'Birthday',
    title: 'Birthday Blooms',
    tagline: 'Make their special day absolutely unforgettable.',
    emoji: '🎂',
    accent: '#FFD23F',
    promptEngineLabels: ['Birthday'],
    expectedPrompts: 14,
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    title: 'Anniversary Blooms',
    tagline: 'Celebrating every year you chose each other.',
    emoji: '💍',
    accent: '#C0392B',
    promptEngineLabels: ['Anniversary'],
    expectedPrompts: 10,
  },
  {
    slug: 'love',
    name: 'Love',
    title: 'Love & Romance',
    tagline: 'Express your deepest feelings without saying a word.',
    emoji: '❤️',
    accent: '#FF3B7F',
    promptEngineLabels: ['Love'],
    expectedPrompts: 14,
  },
  {
    slug: 'valentine',
    name: "Valentine's Day",
    title: "Valentine's Day Blooms",
    tagline: 'For the one who has your heart — now and always.',
    emoji: '💕',
    accent: '#FF6B6B',
    promptEngineLabels: ["Valentine's Day"],
    expectedPrompts: 4,
  },
  {
    slug: 'friendship',
    name: 'Friendship',
    title: 'Thinking of You',
    tagline: 'Let them know they matter — today and every day.',
    emoji: '💛',
    accent: '#FF8C42',
    promptEngineLabels: ['Friendship'],
    expectedPrompts: 16,
  },
  {
    slug: 'thank-you',
    name: 'Thank You',
    title: 'Thank You Blooms',
    tagline: 'Gratitude in full bloom.',
    emoji: '🙏',
    accent: '#27AE60',
    promptEngineLabels: ['Thank You'],
    expectedPrompts: 13,
  },
  {
    slug: 'encouragement',
    name: 'Encouragement',
    title: 'Encouragement Blooms',
    tagline: 'Send strength when they need it most.',
    emoji: '💪',
    accent: '#F39C12',
    promptEngineLabels: ['Encouragement'],
    expectedPrompts: 12,
  },
  {
    slug: 'celebration',
    name: 'Celebration',
    title: 'Celebration & Congratulations',
    tagline: 'Celebrate their achievements in style.',
    emoji: '🎉',
    accent: '#B45FFF',
    promptEngineLabels: ['Celebration', 'Congratulations'],
    expectedPrompts: 24,
  },
  {
    slug: 'sympathy',
    name: 'Sympathy',
    title: 'Sympathy & Get Well',
    tagline: 'Thinking of them when they need it most.',
    emoji: '🌿',
    accent: '#8DB4A5',
    promptEngineLabels: ['Sympathy'],
    expectedPrompts: 10,
  },
  {
    slug: 'grief',
    name: 'Memorial',
    title: 'Memorial & Remembrance',
    tagline: 'Honor those we hold dear — their light never fades.',
    emoji: '🕊️',
    accent: '#7B9FFF',
    promptEngineLabels: ['Grief'],
    expectedPrompts: 14,
  },
  {
    slug: 'luxury',
    name: 'Luxury',
    title: 'Glass Stiletto Series',
    tagline: 'Where fashion meets floral artistry.',
    emoji: '💎',
    accent: '#D4AF37',
    promptEngineLabels: ['Luxury — Glass Stiletto'],
    expectedPrompts: 10,
  },
  {
    slug: 'zodiac',
    name: 'Zodiac',
    title: 'Zodiac Collection',
    tagline: 'Written in the stars — a bloom for your sign.',
    emoji: '✨',
    accent: '#9B59B6',
    promptEngineLabels: ['Zodiac / Celestial Saga'],
    expectedPrompts: 21,
  },
  {
    slug: 'signature-stories',
    name: 'Signature Stories',
    title: 'Signature Stories',
    tagline: 'Premium blooms crafted for the moments that matter most.',
    emoji: '📖',
    accent: '#D4AF37',
    promptEngineLabels: ['Signature Stories', 'Signature Series'],
    expectedPrompts: 2,
  },
  {
    slug: 'acknowledgement',
    name: 'Acknowledgement',
    title: 'Acknowledgement Blooms',
    tagline: 'Give them their flowers — because real recognizes real.',
    emoji: '🤜',
    accent: '#D4AF37',
    promptEngineLabels: ['Acknowledgement'],
    expectedPrompts: 20,
  },
  {
    slug: 'christmas',
    name: 'Christmas',
    title: 'Christmas Blooms',
    tagline: 'Season\'s greetings, in full bloom.',
    emoji: '🎄',
    accent: '#C0392B',
    promptEngineLabels: ['Christmas'],
    expectedPrompts: 7,
  },
  {
    slug: 'holidays',
    name: 'Holidays',
    title: 'Holiday Blooms',
    tagline: "A bloom for every season — from New Year's to Thanksgiving, and every celebration in between.",
    emoji: '🎊',
    accent: '#D4AF37',
    promptEngineLabels: [
      'Holidays',
      "New Year's",
      'Easter',
      '4th of July',
      'Halloween',
      'Thanksgiving',
      'Hanukkah',
      'Kwanzaa',
      'Labor Day',
      'Veterans Day',
      'Inclusive & Special',
    ],
    expectedPrompts: 27,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Derived lookups (do not edit by hand — these come from CATEGORIES above)
// ────────────────────────────────────────────────────────────────────────────

/** Map from prompt-engine `cat:` string → canonical site slug. */
export const PROMPT_ENGINE_CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.flatMap((c) =>
    (c.promptEngineLabels || [c.name]).map((label) => [label, c.slug])
  )
);

/** Slugs in site display order. */
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/** O(1) lookup by slug. */
export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

/** Total expected prompts across all categories — should equal 249. */
export const TOTAL_EXPECTED_PROMPTS = CATEGORIES.reduce(
  (sum, c) => sum + (c.expectedPrompts || 0),
  0
);
