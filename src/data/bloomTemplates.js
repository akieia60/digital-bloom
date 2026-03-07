/**
 * Digital Bloom — Curated Bloom Style Templates
 * Used by the Bloom Builder Step 3 (style selection).
 *
 * Each template maps to a real video asset in /public/videos/shop/
 * and defines which categories and tones it pairs best with.
 *
 * Asset naming convention (existing public/videos/shop/):
 *  {category}_{seriesname}_{type}_{variant}.mp4
 */

export const BLOOM_TEMPLATES = [
  {
    id: 'classic-rose',
    name: 'Classic Rose',
    tagline: 'Timeless. Warm. Unmistakable.',
    description: 'A lush cascade of roses — the most beloved bloom, rendered in rich cinematic depth.',
    videoSrc: '/videos/shop/birthday_birthday_roses_bloom_v1.mp4',
    posterColor: '#C41E3A',
    palette: { primary: '#C41E3A', secondary: '#FFB6C1', accent: '#D4AF37' },
    bestFor: ['birthday', 'love', 'anniversary', 'congratulations', 'thankyou'],
    tones: ['heartfelt', 'romantic', 'elegant', 'uplifting'],
    premium: false,
  },
  {
    id: 'rose-bloom-v2',
    name: 'Rose in Bloom',
    tagline: 'Unfolding beauty. Pure emotion.',
    description: 'Watch roses open frame by frame — a metaphor for every relationship that\'s ever grown.',
    videoSrc: '/videos/shop/birthday_birthday_roses_bloom_v2.mp4',
    posterColor: '#FF69B4',
    palette: { primary: '#FF69B4', secondary: '#FFD6E8', accent: '#C41E3A' },
    bestFor: ['birthday', 'love', 'anniversary', 'encouragement'],
    tones: ['heartfelt', 'romantic', 'playful', 'uplifting'],
    premium: false,
  },
  {
    id: 'golden-roses',
    name: 'Golden Roses',
    tagline: 'Luxurious. Rare. Extraordinary.',
    description: 'Gold-kissed blooms that signal something above the ordinary — for moments that demand presence.',
    videoSrc: '/videos/shop/general_general_goldenroses_bloom_v1.mp4',
    posterColor: '#D4AF37',
    palette: { primary: '#D4AF37', secondary: '#F4E4C1', accent: '#B8860B' },
    bestFor: ['anniversary', 'congratulations', 'love', 'thankyou', 'birthday'],
    tones: ['elegant', 'romantic', 'deep', 'heartfelt'],
    premium: true,
  },
  {
    id: 'rainbow-rose',
    name: 'Rainbow Rose',
    tagline: 'Joy in every petal.',
    description: 'A burst of color and life — every shade of happiness in a single, unforgettable bloom.',
    videoSrc: '/videos/shop/general_general_rainbowrose_bloom_v1.mp4',
    posterColor: '#FF8C42',
    palette: { primary: '#FF8C42', secondary: '#FFD23F', accent: '#B45FFF' },
    bestFor: ['birthday', 'congratulations', 'encouragement', 'thankyou'],
    tones: ['playful', 'uplifting', 'heartfelt'],
    premium: false,
  },
  {
    id: 'lotus-bloom',
    name: 'Lotus Bloom',
    tagline: 'Rising. Resilient. Beautiful.',
    description: 'The lotus rises from depth to surface, radiating calm and extraordinary grace.',
    videoSrc: '/videos/shop/general_general_lotus_bloom_v1.mp4',
    posterColor: '#7B9FFF',
    palette: { primary: '#7B9FFF', secondary: '#E8F0FE', accent: '#4ECDC4' },
    bestFor: ['sympathy', 'encouragement', 'thankyou', 'anniversary'],
    tones: ['deep', 'elegant', 'uplifting', 'heartfelt'],
    premium: false,
  },
  {
    id: 'iloveyou-roses',
    name: 'Love in Bloom',
    tagline: 'For the words that matter most.',
    description: 'Roses that unfurl in the quiet language of love — made for moments that need no explanation.',
    videoSrc: '/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4',
    posterColor: '#FF3B7F',
    palette: { primary: '#FF3B7F', secondary: '#FFD6E8', accent: '#C41E3A' },
    bestFor: ['love', 'anniversary', 'birthday', 'encouragement'],
    tones: ['romantic', 'heartfelt', 'deep', 'elegant'],
    premium: false,
  },
  {
    id: 'iloveyou-golden',
    name: 'Golden Love',
    tagline: 'A love worth gilding.',
    description: 'Gold and rose intertwined — this bloom says what love looks like when it\'s been tended carefully.',
    videoSrc: '/videos/shop/iloveyou_iloveyou_goldenroses_bloom_v1.mp4',
    posterColor: '#D4AF37',
    palette: { primary: '#D4AF37', secondary: '#FFB6C1', accent: '#C41E3A' },
    bestFor: ['love', 'anniversary'],
    tones: ['romantic', 'elegant', 'deep'],
    premium: true,
  },
  {
    id: 'iloveyou-v2',
    name: 'Love Eternal',
    tagline: 'Enduring. Certain. Yours.',
    description: 'A deeper, more cinematic rose experience — for a love that has weathered time and only grown.',
    videoSrc: '/videos/shop/iloveyou_iloveyou_roses_bloom_v2.mp4',
    posterColor: '#C41E3A',
    palette: { primary: '#C41E3A', secondary: '#FF80AB', accent: '#D4AF37' },
    bestFor: ['love', 'anniversary'],
    tones: ['romantic', 'deep', 'heartfelt'],
    premium: false,
  },
  {
    id: 'congratulations-v1',
    name: 'Victory Bloom',
    tagline: 'You earned this moment.',
    description: 'Roses that rise and burst with the energy of achievement — built for a winner.',
    videoSrc: '/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4',
    posterColor: '#B45FFF',
    palette: { primary: '#B45FFF', secondary: '#E8D5FF', accent: '#D4AF37' },
    bestFor: ['congratulations', 'birthday', 'encouragement'],
    tones: ['uplifting', 'heartfelt', 'elegant', 'playful'],
    premium: false,
  },
  {
    id: 'congratulations-v2',
    name: 'Crown Bloom',
    tagline: 'The next chapter is glorious.',
    description: 'A richer, more dramatic congratulations bloom — for milestones that deserve full ceremony.',
    videoSrc: '/videos/shop/congratulations_congratulations_roses_bloom_v2.mp4',
    posterColor: '#9B59B6',
    palette: { primary: '#9B59B6', secondary: '#D7BDE2', accent: '#D4AF37' },
    bestFor: ['congratulations'],
    tones: ['elegant', 'uplifting', 'deep'],
    premium: true,
  },
  {
    id: 'thinking-of-you',
    name: 'Thinking of You',
    tagline: 'A soft reminder: you matter.',
    description: 'Gentle roses that carry warmth across any distance — because some people deserve to know.',
    videoSrc: '/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4',
    posterColor: '#FF8C42',
    palette: { primary: '#FF8C42', secondary: '#FFE0CC', accent: '#4ECDC4' },
    bestFor: ['encouragement', 'sympathy', 'thankyou'],
    tones: ['heartfelt', 'uplifting', 'elegant'],
    premium: false,
  },
  {
    id: 'memorial',
    name: 'In Memoriam',
    tagline: 'Their light endures.',
    description: 'An artistic bloom made for the depth of loss — honoring presence that changed everything.',
    videoSrc: '/videos/shop/memorial_memorial_roses_artistic_v1.mp4',
    posterColor: '#7B9FFF',
    palette: { primary: '#7B9FFF', secondary: '#D6E4FF', accent: '#FFFFFF' },
    bestFor: ['sympathy'],
    tones: ['deep', 'heartfelt', 'elegant'],
    premium: false,
  },
  {
    id: 'valentine-v1',
    name: 'Valentine',
    tagline: 'Love in its purest form.',
    description: 'A classic Valentine\'s bloom — unapologetically romantic and beautifully intentional.',
    videoSrc: '/videos/shop/valentine_valentine_roses_bloom_v1.mp4',
    posterColor: '#FF6B6B',
    palette: { primary: '#FF6B6B', secondary: '#FFD6D6', accent: '#C41E3A' },
    bestFor: ['love', 'anniversary'],
    tones: ['romantic', 'heartfelt', 'playful'],
    premium: false,
  },
  {
    id: 'valentine-v2',
    name: 'Deep Red',
    tagline: 'Bold. Passionate. Unforgettable.',
    description: 'Rich crimson roses for a love that doesn\'t whisper — it announces.',
    videoSrc: '/videos/shop/valentine_valentine_roses_bloom_v2.mp4',
    posterColor: '#C41E3A',
    palette: { primary: '#C41E3A', secondary: '#FF6B6B', accent: '#D4AF37' },
    bestFor: ['love', 'anniversary'],
    tones: ['romantic', 'deep'],
    premium: false,
  },
  {
    id: 'glass-stiletto',
    name: 'Glass Stiletto',
    tagline: 'Fashion. Floral. Fierce.',
    description: 'The most editorial bloom in our collection — where high fashion meets natural beauty in motion.',
    videoSrc: '/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v1.mp4',
    posterColor: '#1D1D1F',
    palette: { primary: '#1D1D1F', secondary: '#D4AF37', accent: '#FFFFFF' },
    bestFor: ['birthday', 'congratulations', 'love', 'anniversary'],
    tones: ['elegant', 'deep', 'romantic'],
    premium: true,
  },
  {
    id: 'glass-stiletto-v2',
    name: 'Glass Stiletto II',
    tagline: 'Art. Roses. Power.',
    description: 'The second volume of our most distinctive series — for those who understand that flowers can be architectural.',
    videoSrc: '/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v2.mp4',
    posterColor: '#2D2D2F',
    palette: { primary: '#2D2D2F', secondary: '#C41E3A', accent: '#D4AF37' },
    bestFor: ['birthday', 'congratulations', 'anniversary'],
    tones: ['elegant', 'deep'],
    premium: true,
  },
  {
    id: 'general-roses',
    name: 'Simply Roses',
    tagline: 'Sometimes, just roses.',
    description: 'The original. Clean, classic, beautiful. For when the right words deserve an uncomplicated bloom.',
    videoSrc: '/videos/shop/general_general_roses_bloom_v1.mp4',
    posterColor: '#FF69B4',
    palette: { primary: '#FF69B4', secondary: '#FFB6C1', accent: '#FFFFFF' },
    bestFor: ['birthday', 'thankyou', 'congratulations', 'encouragement', 'love', 'anniversary', 'sympathy'],
    tones: ['heartfelt', 'elegant', 'playful', 'uplifting', 'romantic', 'deep'],
    premium: false,
  },
];

/**
 * Get templates filtered by category and/or tone.
 * If no match, returns all templates for that category regardless of tone.
 */
export function getFilteredTemplates(categoryId, toneId) {
  let filtered = BLOOM_TEMPLATES.filter((t) =>
    t.bestFor.includes(categoryId)
  );

  if (toneId && filtered.length > 0) {
    const toneFiltered = filtered.filter((t) => t.tones.includes(toneId));
    // Only apply tone filter if it returns results
    if (toneFiltered.length > 0) {
      filtered = toneFiltered;
    }
  }

  // If still nothing, return all templates
  return filtered.length > 0 ? filtered : BLOOM_TEMPLATES;
}

/**
 * Get a single template by ID.
 */
export function getTemplateById(id) {
  return BLOOM_TEMPLATES.find((t) => t.id === id) || null;
}
