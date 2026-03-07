/**
 * Digital Bloom — Bloom Style Templates
 *
 * Each template represents a curated pairing of:
 *   - A real video asset from public/videos/shop/
 *   - A visual theme (name, colors, label)
 *   - Compatible categories and tones
 *   - Tier and pricing
 *
 * Templates are shown in Step 3 of the Bloom Builder.
 * They are filtered by the user's selected category from Step 1.
 */

export const bloomTemplates = [
  // ─── BIRTHDAY ──────────────────────────────────────────────────────
  {
    id: 'birthday-roses-v1',
    name: 'Birthday Roses',
    label: 'Classic',
    description: 'Lush roses unfurl in a warm, celebratory burst — the quintessential birthday bloom.',
    videoUrl: '/videos/shop/birthday_birthday_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['birthday'],
    tones: ['heartfelt', 'elegant', 'uplifting', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#FFD23F',
    labelColor: '#1D1D1F',
    popular: true,
  },
  {
    id: 'birthday-roses-v2',
    name: 'Birthday Bloom',
    label: 'Playful',
    description: 'A vibrant, joyful rose bloom with warm golden tones — perfect for a fun, energetic birthday.',
    videoUrl: '/videos/shop/birthday_birthday_roses_bloom_v2.mp4',
    posterUrl: null,
    categories: ['birthday'],
    tones: ['playful', 'uplifting', 'romantic'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF4DA6',
    labelColor: '#FFFFFF',
    popular: false,
  },
  {
    id: 'birthday-roses-transition',
    name: 'Birthday Reveal',
    label: 'Cinematic',
    description: 'A dramatic bloom reveal with layered transitions — built for a birthday that deserves a moment.',
    videoUrl: '/videos/shop/birthday_birthday_roses_transition_v1.mp4',
    posterUrl: null,
    categories: ['birthday'],
    tones: ['elegant', 'deep', 'romantic'],
    tier: 3,
    price: 9.99,
    accentColor: '#D4AF37',
    labelColor: '#1D1D1F',
    popular: false,
  },

  // ─── CONGRATULATIONS ───────────────────────────────────────────────
  {
    id: 'congrats-roses-v1',
    name: 'Congratulations Bloom',
    label: 'Triumphant',
    description: 'Roses rise in a powerful, celebratory bloom — marking achievement with beauty and intention.',
    videoUrl: '/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['congratulations'],
    tones: ['heartfelt', 'uplifting', 'elegant', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#B45FFF',
    labelColor: '#FFFFFF',
    popular: true,
  },
  {
    id: 'congrats-roses-v2',
    name: 'Golden Achievement',
    label: 'Premium',
    description: 'A rich, layered bloom experience that communicates prestige, pride, and genuine celebration.',
    videoUrl: '/videos/shop/congratulations_congratulations_roses_bloom_v2.mp4',
    posterUrl: null,
    categories: ['congratulations'],
    tones: ['elegant', 'romantic', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#D4AF37',
    labelColor: '#1D1D1F',
    popular: false,
  },

  // ─── I LOVE YOU ────────────────────────────────────────────────────
  {
    id: 'iloveyou-roses-v1',
    name: 'Red Rose Declaration',
    label: 'Romantic',
    description: 'Deep crimson roses bloom in slow motion — a timeless declaration of love.',
    videoUrl: '/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['iloveyou', 'anniversary'],
    tones: ['romantic', 'heartfelt', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF3B7F',
    labelColor: '#FFFFFF',
    popular: true,
  },
  {
    id: 'iloveyou-roses-v2',
    name: 'Love in Bloom',
    label: 'Tender',
    description: 'A softer, more intimate rose bloom — quiet love expressed with extraordinary beauty.',
    videoUrl: '/videos/shop/iloveyou_iloveyou_roses_bloom_v2.mp4',
    posterUrl: null,
    categories: ['iloveyou', 'anniversary'],
    tones: ['heartfelt', 'uplifting', 'elegant'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF80AB',
    labelColor: '#1D1D1F',
    popular: false,
  },
  {
    id: 'iloveyou-goldenroses',
    name: 'Golden Love',
    label: 'Luxe',
    description: 'Golden roses unfurl in a cinematic display — love elevated to art.',
    videoUrl: '/videos/shop/iloveyou_iloveyou_goldenroses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['iloveyou', 'anniversary', 'thankyou'],
    tones: ['romantic', 'elegant', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#D4AF37',
    labelColor: '#1D1D1F',
    popular: false,
  },

  // ─── ANNIVERSARY ───────────────────────────────────────────────────
  {
    id: 'valentine-roses-v1',
    name: 'Anniversary Rose',
    label: 'Timeless',
    description: 'Classic roses bloom in a rich, velvety display — enduring love made visible.',
    videoUrl: '/videos/shop/valentine_valentine_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['anniversary', 'iloveyou'],
    tones: ['romantic', 'heartfelt', 'elegant'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF6B6B',
    labelColor: '#FFFFFF',
    popular: true,
  },
  {
    id: 'valentine-roses-v2',
    name: 'Deep Romance',
    label: 'Intimate',
    description: 'A deeply romantic bloom with layered petals — crafted for love that has history.',
    videoUrl: '/videos/shop/valentine_valentine_roses_bloom_v2.mp4',
    posterUrl: null,
    categories: ['anniversary', 'iloveyou'],
    tones: ['deep', 'romantic', 'heartfelt'],
    tier: 2,
    price: 4.99,
    accentColor: '#C41E3A',
    labelColor: '#FFFFFF',
    popular: false,
  },

  // ─── SYMPATHY ──────────────────────────────────────────────────────
  {
    id: 'memorial-roses',
    name: 'In Remembrance',
    label: 'Gentle',
    description: 'Soft roses bloom in muted, peaceful tones — a dignified expression of love and loss.',
    videoUrl: '/videos/shop/memorial_memorial_roses_artistic_v1.mp4',
    posterUrl: null,
    categories: ['sympathy'],
    tones: ['heartfelt', 'elegant', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#7B9FFF',
    labelColor: '#1D1D1F',
    popular: false,
  },

  // ─── ENCOURAGEMENT ─────────────────────────────────────────────────
  {
    id: 'thinkingofyou-roses',
    name: 'Thinking of You',
    label: 'Warm',
    description: 'A warm rose bloom that says: you are seen, you are thought of, you matter.',
    videoUrl: '/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['encouragement', 'thankyou'],
    tones: ['heartfelt', 'uplifting', 'playful'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF8C42',
    labelColor: '#FFFFFF',
    popular: false,
  },
  {
    id: 'general-goldenroses',
    name: 'Golden Strength',
    label: 'Empowering',
    description: 'Golden roses rise in a bold, radiant bloom — a send-off for someone on a big journey.',
    videoUrl: '/videos/shop/general_general_goldenroses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['encouragement', 'congratulations', 'thankyou'],
    tones: ['uplifting', 'elegant', 'deep'],
    tier: 2,
    price: 4.99,
    accentColor: '#D4AF37',
    labelColor: '#1D1D1F',
    popular: true,
  },
  {
    id: 'general-lotus',
    name: 'Lotus Rising',
    label: 'Spiritual',
    description: 'A lotus bloom opening from darkness into light — resilience and hope made cinematic.',
    videoUrl: '/videos/shop/general_general_lotus_bloom_v1.mp4',
    posterUrl: null,
    categories: ['encouragement', 'sympathy'],
    tones: ['deep', 'uplifting', 'heartfelt'],
    tier: 2,
    price: 4.99,
    accentColor: '#9B59B6',
    labelColor: '#FFFFFF',
    popular: false,
  },

  // ─── THANK YOU ─────────────────────────────────────────────────────
  {
    id: 'general-rainbowrose',
    name: 'Rainbow Gratitude',
    label: 'Joyful',
    description: 'A vibrant multi-color rose bloom — gratitude expressed in every color of joy.',
    videoUrl: '/videos/shop/general_general_rainbowrose_bloom_v1.mp4',
    posterUrl: null,
    categories: ['thankyou', 'encouragement', 'birthday'],
    tones: ['playful', 'uplifting', 'heartfelt'],
    tier: 2,
    price: 4.99,
    accentColor: '#FF4DA6',
    labelColor: '#FFFFFF',
    popular: false,
  },
  {
    id: 'general-roses',
    name: 'Classic Thank You',
    label: 'Timeless',
    description: 'Elegant roses bloom in a pure, grateful expression — simple, sincere, and beautiful.',
    videoUrl: '/videos/shop/general_general_roses_bloom_v1.mp4',
    posterUrl: null,
    categories: ['thankyou', 'encouragement'],
    tones: ['heartfelt', 'elegant', 'romantic'],
    tier: 2,
    price: 4.99,
    accentColor: '#6E6E73',
    labelColor: '#FFFFFF',
    popular: false,
  },
];

/**
 * Get templates filtered by category and optionally by tone.
 * @param {string} category - e.g. 'birthday'
 * @param {string|null} tone - e.g. 'heartfelt', or null for all
 * @returns {Array} filtered templates
 */
export function getTemplates(category, tone = null) {
  return bloomTemplates.filter((t) => {
    const categoryMatch = t.categories.includes(category);
    const toneMatch = !tone || t.tones.includes(tone);
    return categoryMatch && toneMatch;
  });
}

/**
 * Get a single template by ID.
 */
export function getTemplateById(id) {
  return bloomTemplates.find((t) => t.id === id) || null;
}

export default bloomTemplates;
