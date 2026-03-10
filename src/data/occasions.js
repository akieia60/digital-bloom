/**
 * Shared occasion metadata for Digital Bloom.
 * Used by CategoryPage, Shop, and CategoryGrid.
 *
 * Each occasion maps a category slug (matching Supabase `products.category`)
 * to its display name, emotional tagline, accent color, and emoji icon.
 */

const OCCASIONS = {
  'mothers-day': {
    name: "Mother's Day",
    title: "Mother's Day Blooms",
    tagline: 'Celebrate the woman who made everything bloom.',
    accent: '#FF4DA6',
    emoji: '💐',
  },
  'birthday': {
    name: 'Birthday',
    title: 'Birthday Blooms',
    tagline: 'Make their special day absolutely unforgettable.',
    accent: '#FFD23F',
    emoji: '🎂',
  },
  'love': {
    name: 'Love',
    title: 'Love & Romance',
    tagline: 'Express your deepest feelings without saying a word.',
    accent: '#FF3B7F',
    emoji: '❤️',
  },
  'valentine': {
    name: "Valentine's Day",
    title: "Valentine's Day Blooms",
    tagline: 'For the one who has your heart — now and always.',
    accent: '#FF6B6B',
    emoji: '💕',
  },
  'celebration': {
    name: 'Congratulations',
    title: 'Congratulations Blooms',
    tagline: 'Celebrate their achievements in style.',
    accent: '#B45FFF',
    emoji: '🎉',
  },
  'grief': {
    name: 'Memorial',
    title: 'Memorial & Sympathy',
    tagline: 'Honor those we hold dear — their light never fades.',
    accent: '#7B9FFF',
    emoji: '🕊️',
  },
  'friendship': {
    name: 'Thinking of You',
    title: 'Thinking of You',
    tagline: 'Let them know they matter — today and every day.',
    accent: '#FF8C42',
    emoji: '💛',
  },
  'luxury': {
    name: 'Luxury',
    title: 'Glass Stiletto Series',
    tagline: 'Where fashion meets floral artistry.',
    accent: '#D4AF37',
    emoji: '💎',
  },
  'zodiac': {
    name: 'Zodiac',
    title: 'Zodiac Collection',
    tagline: 'Written in the stars — a bloom for your sign.',
    accent: '#9B59B6',
    emoji: '✨',
  },
  'general': {
    name: 'General',
    title: 'General Collection',
    tagline: 'Beautiful blooms for every moment.',
    accent: '#6E6E73',
    emoji: '🌸',
  },
};

export default OCCASIONS;
