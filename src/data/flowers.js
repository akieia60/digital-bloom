export const flowers = [
  {
    id: 1,
    name: "Rose Stiletto Luxury",
    slug: "rose-stiletto-luxury",
    price: 12.99,
    category: "luxury",
    description: "Stunning 3D animated roses on a designer heel. Rotating video with pearl accents and floating petals. The ultimate luxury statement.",
    occasions: ["romance", "anniversary", "viral-content"],
    video_url: "/videos/grok-video-06fc35b4-7fae-420e-a7e9-a056c87ac8f1-2.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 101,
    name: "Ethereal Rose Pulse",
    slug: "ethereal-rose-pulse",
    price: 14.99,
    category: "premium-3d",
    description: "A mesmerizing 3D rose with a rhythmic light pulse, creating a deep emotional connection. Perfect for heartfelt declarations.",
    occasions: ["romance", "anniversary"],
    video_url: "/videos/ethereal-rose-pulse.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 102,
    name: "Luxury Diamond Bloom",
    slug: "luxury-diamond-bloom",
    price: 19.99,
    category: "luxury",
    description: "Exquisite 3D flowers encrusted with virtual diamonds, reflecting light in a stunning display of digital opulence.",
    occasions: ["anniversary", "celebration"],
    video_url: "/videos/luxury-diamond-bloom.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 103,
    name: "Velvet Night Garden",
    slug: "velvet-night-garden",
    price: 14.99,
    category: "premium-3d",
    description: "Deep, velvety textures moving gracefully in a moonlit digital garden. Mysterious and profoundly beautiful.",
    occasions: ["romance", "thinking-of-you"],
    video_url: "/videos/velvet-night-garden.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 105,
    name: "Golden Starlight Roses",
    slug: "golden-starlight-roses",
    price: 15.99,
    category: "luxury",
    description: "A bouquet of golden roses shimmering under a celestial digital sky. Pure elegance in motion.",
    occasions: ["anniversary", "romance"],
    video_url: "/videos/golden-starlight-roses.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 106,
    name: "Crystal Flower Symphony",
    slug: "crystal-flower-symphony",
    price: 16.99,
    category: "premium-3d",
    description: "Translucent crystal petals blooming in a synchronized symphony of light and color.",
    occasions: ["celebration", "viral-content"],
    video_url: "/videos/crystal-flower-symphony.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 107,
    name: "Midnight Mist Roses",
    slug: "midnight-mist-roses",
    price: 12.99,
    category: "premium-3d",
    description: "dark, atmospheric roses emerging from a digital mist. A sophisticated and edgy take on floral beauty.",
    occasions: ["romance", "viral-content"],
    video_url: "/videos/midnight-mist-roses.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 108,
    name: "Opulent Floral Motion",
    slug: "opulent-floral-motion",
    price: 18.99,
    category: "luxury",
    description: "High-fashion floral animation with fluid movement and rich, saturated colors. Designed to stand out.",
    occasions: ["viral-content", "celebration"],
    video_url: "/videos/opulent-floral-motion.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 10,
    name: "Enchanted Garden",
    slug: "enchanted-garden",
    price: 12.99,
    category: "premium-3d",
    description: "Magical 3D flower animation with enchanting visual storytelling and deep garden hues.",
    occasions: ["romance", "birthday", "viral-content"],
    video_url: "/videos/grok-video-0ef46ac4-961f-436b-a5c3-1ca9c6c19b40-3.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  },
  {
    id: 25,
    name: "Infinity Roses",
    slug: "infinity-roses",
    price: 12.99,
    category: "premium-3d",
    description: "Infinite beauty captured in 3D animation with mesmerizing loop effects for timeless love.",
    occasions: ["romance", "anniversary", "valentine"],
    video_url: "/videos/grok-video-f4d1b7c6-65f5-4308-b62e-41a7a72be2c3.mp4",
    image_url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    stock: 999,
    is_active: true
  }
];

export const categories = [
  { id: "premium-3d", name: "Premium 3D", count: flowers.filter(f => f.category === "premium-3d").length },
  { id: "luxury", name: "Luxury Collection", count: flowers.filter(f => f.category === "luxury").length },
  { id: "digital-art", name: "Digital Art", count: flowers.filter(f => f.category === "digital-art").length }
];

export const occasions = [
  { id: "romance", name: "Romance" },
  { id: "anniversary", name: "Anniversary" },
  { id: "birthday", name: "Birthday" },
  { id: "viral-content", name: "Viral Content" }
];
