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
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: 'Thank You',
      messagePlaceholder: 'e.g., Happy Mother\'s Day, Mom!',
      toPlaceholder: 'Mom, Grandma, Auntie...',
    },
  },
  'birthday': {
    name: 'Birthday',
    title: 'Birthday Blooms',
    tagline: 'Make their special day absolutely unforgettable.',
    accent: '#FFD23F',
    emoji: '🎂',
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'warm',
      balloonMessage: 'Happy Birthday',
      messagePlaceholder: 'e.g., Happy Birthday!',
      toPlaceholder: 'Birthday star\'s name',
    },
  },
  'love': {
    name: 'Love',
    title: 'Love & Romance',
    tagline: 'Express your deepest feelings without saying a word.',
    accent: '#FF3B7F',
    emoji: '❤️',
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: 'I Love You',
      messagePlaceholder: 'e.g., You mean everything to me',
      toPlaceholder: 'Your love\'s name',
    },
  },
  'valentine': {
    name: "Valentine's Day",
    title: "Valentine's Day Blooms",
    tagline: 'For the one who has your heart — now and always.',
    accent: '#FF6B6B',
    emoji: '💕',
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: 'I Love You',
      messagePlaceholder: 'e.g., Be my Valentine',
      toPlaceholder: 'Your Valentine\'s name',
    },
  },
  'celebration': {
    name: 'Congratulations',
    title: 'Congratulations Blooms',
    tagline: 'Celebrate their achievements in style.',
    accent: '#B45FFF',
    emoji: '🎉',
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'elegant',
      balloonMessage: 'Congratulations',
      messagePlaceholder: 'e.g., So proud of you!',
      toPlaceholder: 'The achiever\'s name',
    },
  },
  'grief': {
    name: 'Memorial',
    title: 'Memorial & Sympathy',
    tagline: 'Honor those we hold dear — their light never fades.',
    accent: '#7B9FFF',
    emoji: '🕊️',
    customizerDefaults: {
      occasion: 'sympathy',
      colorTheme: 'cool',
      messagePlaceholder: 'e.g., Thinking of you during this time',
      toPlaceholder: 'Their name',
    },
  },
  'friendship': {
    name: 'Thinking of You',
    title: 'Thinking of You',
    tagline: 'Let them know they matter — today and every day.',
    accent: '#FF8C42',
    emoji: '💛',
    customizerDefaults: {
      occasion: 'encouragement',
      colorTheme: 'warm',
      balloonMessage: "You're the Best",
      messagePlaceholder: 'e.g., Just wanted you to know I care',
      toPlaceholder: 'Friend\'s name',
    },
  },
  'luxury': {
    name: 'Luxury',
    title: 'Glass Stiletto Series',
    tagline: 'Where fashion meets floral artistry.',
    accent: '#D4AF37',
    emoji: '💎',
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'elegant',
      messagePlaceholder: 'e.g., You deserve the finest',
      toPlaceholder: 'Recipient name',
    },
  },
  'zodiac': {
    name: 'Zodiac',
    title: 'Zodiac Collection',
    tagline: 'Written in the stars — a bloom for your sign.',
    accent: '#9B59B6',
    emoji: '✨',
    customizerDefaults: {
      colorTheme: 'cool',
      messagePlaceholder: 'e.g., The stars aligned for you',
      toPlaceholder: 'Recipient name',
    },
  },
  'general': {
    name: 'General',
    title: 'General Collection',
    tagline: 'Beautiful blooms for every moment.',
    accent: '#6E6E73',
    emoji: '🌸',
    customizerDefaults: {
      messagePlaceholder: 'e.g., Happy Birthday!',
      toPlaceholder: 'Recipient name',
    },
  },
};

export default OCCASIONS;
