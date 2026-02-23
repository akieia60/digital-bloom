/**
 * Digital Bloom — Product Catalog
 * Real video products organized by occasion/category.
 * Videos sourced from the "Digital Bloom Videos - Organized" Google Drive folder.
 * Tier assignment based on video duration:
 *   Tier 1 (Single Bloom): 6-10s
 *   Tier 2 (Bloom Experience): 25-35s
 *   Tier 3 (Premium Bloom): 35-45s
 */

export const flowers = [
  // ═══════════════════════════════════════════
  // MOTHER'S DAY COLLECTION (NEW — Feb 22, 2026)
  // ═══════════════════════════════════════════
  {
    id: 201,
    name: "Mother's Day Premium Bloom",
    slug: "mothers-day-premium-bloom",
    price: 9.99,
    tier: 3,
    category: "mothers-day",
    description: "A stunning 45-second cinematic bloom crafted to honor the most important woman in your life. Lush roses unfurl in a breathtaking display of love and gratitude.",
    occasions: ["mothers-day", "love", "appreciation"],
    video_url: "/videos/shop/mothersday_digitalbloom_mothersday_bloom_45s.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 202,
    name: "Mother's Day Rose Garden",
    slug: "mothers-day-rose-garden",
    price: 4.99,
    tier: 2,
    category: "mothers-day",
    description: "A beautiful 32-second multi-scene bloom experience celebrating motherhood. Elegant roses bloom in a cascade of warmth and tenderness.",
    occasions: ["mothers-day", "love"],
    video_url: "/videos/shop/mothersday_digitalbloom_mothersday_bloom_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 203,
    name: "Mother's Day Gentle Bloom",
    slug: "mothers-day-gentle-bloom",
    price: 4.99,
    tier: 2,
    category: "mothers-day",
    description: "A gentle and heartfelt 32-second bloom that captures the softness of a mother's love. Perfect for saying 'thank you' in the most beautiful way.",
    occasions: ["mothers-day", "appreciation"],
    video_url: "/videos/shop/mothersday_digitalbloom_mothersday_bloom_v3.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 204,
    name: "Mother's Day Radiant Roses",
    slug: "mothers-day-radiant-roses",
    price: 4.99,
    tier: 2,
    category: "mothers-day",
    description: "Radiant roses bloom in a 32-second cinematic experience designed to make Mom feel truly special. A digital bouquet that lasts forever.",
    occasions: ["mothers-day", "love", "birthday"],
    video_url: "/videos/shop/mothersday_digitalbloom_mothersday_bloom_v4.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 205,
    name: "Mother's Day Eternal Love",
    slug: "mothers-day-eternal-love",
    price: 4.99,
    tier: 2,
    category: "mothers-day",
    description: "A 32-second bloom experience expressing eternal love and gratitude. Delicate petals unfold in a mesmerizing dance of appreciation.",
    occasions: ["mothers-day", "love"],
    video_url: "/videos/shop/mothersday_digitalbloom_mothersday_bloom_v6.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // BIRTHDAY COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 301,
    name: "Birthday Rose Celebration",
    slug: "birthday-rose-celebration",
    price: 1.99,
    tier: 1,
    category: "birthday",
    description: "A vibrant rose bloom to celebrate their special day. Quick, joyful, and unforgettable — the perfect digital birthday gift.",
    occasions: ["birthday", "celebration"],
    video_url: "/videos/shop/birthday_birthday_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 302,
    name: "Birthday Bloom Surprise",
    slug: "birthday-bloom-surprise",
    price: 1.99,
    tier: 1,
    category: "birthday",
    description: "Surprise them with a stunning digital bloom that captures the excitement of birthdays. A modern twist on the classic bouquet.",
    occasions: ["birthday", "celebration"],
    video_url: "/videos/shop/birthday_birthday_roses_bloom_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 303,
    name: "Birthday Rose Transition",
    slug: "birthday-rose-transition",
    price: 1.99,
    tier: 1,
    category: "birthday",
    description: "A dynamic rose transition that transforms into a birthday celebration. Eye-catching and perfect for sharing on social media.",
    occasions: ["birthday", "viral-content"],
    video_url: "/videos/shop/birthday_birthday_roses_transition_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // I LOVE YOU COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 401,
    name: "I Love You — Rose Bloom",
    slug: "i-love-you-rose-bloom",
    price: 1.99,
    tier: 1,
    category: "love",
    description: "Express your deepest feelings with this intimate rose bloom. Three words, one unforgettable digital experience.",
    occasions: ["romance", "anniversary", "love"],
    video_url: "/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 402,
    name: "I Love You — Crimson Petals",
    slug: "i-love-you-crimson-petals",
    price: 1.99,
    tier: 1,
    category: "love",
    description: "Deep crimson petals unfold in a declaration of love. A timeless gesture reimagined for the digital age.",
    occasions: ["romance", "anniversary", "valentine"],
    video_url: "/videos/shop/iloveyou_iloveyou_roses_bloom_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 403,
    name: "I Love You — Golden Roses",
    slug: "i-love-you-golden-roses",
    price: 1.99,
    tier: 1,
    category: "love",
    description: "Luxurious golden roses bloom in a mesmerizing display of devotion. For love that shines like gold.",
    occasions: ["romance", "anniversary", "love"],
    video_url: "/videos/shop/iloveyou_iloveyou_goldenroses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // VALENTINE'S DAY COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 501,
    name: "Valentine Rose Bloom",
    slug: "valentine-rose-bloom",
    price: 1.99,
    tier: 1,
    category: "valentine",
    description: "A romantic rose bloom designed for Valentine's Day. Send love in the most beautiful digital form.",
    occasions: ["valentine", "romance", "love"],
    video_url: "/videos/shop/valentine_valentine_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 502,
    name: "Valentine Passion Bloom",
    slug: "valentine-passion-bloom",
    price: 1.99,
    tier: 1,
    category: "valentine",
    description: "Passionate roses bloom in a fiery display of Valentine's love. Bold, beautiful, and unforgettable.",
    occasions: ["valentine", "romance"],
    video_url: "/videos/shop/valentine_valentine_roses_bloom_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // CONGRATULATIONS COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 601,
    name: "Congratulations Grand Bloom",
    slug: "congratulations-grand-bloom",
    price: 1.99,
    tier: 1,
    category: "celebration",
    description: "Celebrate their achievement with a grand rose bloom. Perfect for graduations, promotions, and milestones.",
    occasions: ["celebration", "graduation", "encouragement"],
    video_url: "/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 602,
    name: "Congratulations Joy Bloom",
    slug: "congratulations-joy-bloom",
    price: 1.99,
    tier: 1,
    category: "celebration",
    description: "A joyful bloom bursting with pride and happiness. Send your congratulations in style.",
    occasions: ["celebration", "graduation"],
    video_url: "/videos/shop/congratulations_congratulations_roses_bloom_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // MEMORIAL / GRIEF & SYMPATHY COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 701,
    name: "Memorial Rose Tribute",
    slug: "memorial-rose-tribute",
    price: 1.99,
    tier: 1,
    category: "grief",
    description: "A reverent and artistic rose tribute to honor those we've lost. A beautiful way to remember and celebrate their legacy.",
    occasions: ["grief", "memorial", "sympathy"],
    video_url: "/videos/shop/memorial_memorial_roses_artistic_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // THINKING OF YOU COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 801,
    name: "Thinking of You Bloom",
    slug: "thinking-of-you-bloom",
    price: 1.99,
    tier: 1,
    category: "friendship",
    description: "Let someone know they're on your mind with this gentle, thoughtful bloom. A small gesture with big meaning.",
    occasions: ["friendship", "thinking-of-you", "encouragement"],
    video_url: "/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // GLASS STILETTO SERIES (Luxury / Signature)
  // ═══════════════════════════════════════════
  {
    id: 901,
    name: "Glass Stiletto Rose I",
    slug: "glass-stiletto-rose-1",
    price: 1.99,
    tier: 1,
    category: "luxury",
    description: "Stunning 3D roses on a designer glass stiletto heel. The ultimate luxury statement piece — art meets fashion.",
    occasions: ["viral-content", "love", "celebration"],
    video_url: "/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 902,
    name: "Glass Stiletto Rose II",
    slug: "glass-stiletto-rose-2",
    price: 1.99,
    tier: 1,
    category: "luxury",
    description: "The second piece in our iconic Glass Stiletto Series. Crystalline beauty meets floral artistry in motion.",
    occasions: ["viral-content", "love"],
    video_url: "/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },

  // ═══════════════════════════════════════════
  // GENERAL COLLECTION
  // ═══════════════════════════════════════════
  {
    id: 1001,
    name: "Classic Rose Bloom",
    slug: "classic-rose-bloom",
    price: 1.99,
    tier: 1,
    category: "general",
    description: "The timeless Digital Bloom classic. A beautiful rose blooming in exquisite detail — perfect for any occasion.",
    occasions: ["love", "friendship", "appreciation"],
    video_url: "/videos/shop/general_general_roses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 1002,
    name: "Golden Roses Experience",
    slug: "golden-roses-experience",
    price: 4.99,
    tier: 2,
    category: "general",
    description: "A luxurious 34-second golden roses bloom experience. Shimmering petals unfold in a cascade of opulence and warmth.",
    occasions: ["anniversary", "love", "celebration"],
    video_url: "/videos/shop/general_general_goldenroses_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 1003,
    name: "Lotus Bloom",
    slug: "lotus-bloom",
    price: 1.99,
    tier: 1,
    category: "general",
    description: "A serene lotus flower blooming in peaceful elegance. Symbolizing purity and new beginnings.",
    occasions: ["encouragement", "friendship", "appreciation"],
    video_url: "/videos/shop/general_general_lotus_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 1004,
    name: "Rainbow Rose Bloom",
    slug: "rainbow-rose-bloom",
    price: 1.99,
    tier: 1,
    category: "general",
    description: "A vibrant rainbow rose that celebrates diversity and joy. Every color tells a story of love and acceptance.",
    occasions: ["celebration", "friendship", "encouragement"],
    video_url: "/videos/shop/general_general_rainbowrose_bloom_v1.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
];

export const categories = [
  { id: "mothers-day", name: "Mother's Day", count: flowers.filter(f => f.category === "mothers-day").length },
  { id: "birthday", name: "Birthday", count: flowers.filter(f => f.category === "birthday").length },
  { id: "love", name: "Love & Romance", count: flowers.filter(f => f.category === "love").length },
  { id: "valentine", name: "Valentine's Day", count: flowers.filter(f => f.category === "valentine").length },
  { id: "celebration", name: "Congratulations", count: flowers.filter(f => f.category === "celebration").length },
  { id: "grief", name: "Grief & Sympathy", count: flowers.filter(f => f.category === "grief").length },
  { id: "friendship", name: "Friendship", count: flowers.filter(f => f.category === "friendship").length },
  { id: "luxury", name: "Glass Stiletto Series", count: flowers.filter(f => f.category === "luxury").length },
  { id: "general", name: "General Collection", count: flowers.filter(f => f.category === "general").length },
];

export const occasions = [
  { id: "mothers-day", name: "Mother's Day" },
  { id: "birthday", name: "Birthday" },
  { id: "love", name: "Love" },
  { id: "romance", name: "Romance" },
  { id: "valentine", name: "Valentine's Day" },
  { id: "anniversary", name: "Anniversary" },
  { id: "celebration", name: "Celebration" },
  { id: "graduation", name: "Graduation" },
  { id: "grief", name: "Grief & Sympathy" },
  { id: "friendship", name: "Friendship" },
  { id: "encouragement", name: "Encouragement" },
  { id: "viral-content", name: "Viral Content" },
];
