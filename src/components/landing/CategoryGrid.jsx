import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: "Happy Mother's Day",
    slug: 'mothers-day',
    accent: '#FF4DA6',
    tagline: 'Celebrate the woman who gave you everything',
    previewVideo: '/videos/category-previews/preview_mothers-day_grok1.mp4',
  },
  {
    name: 'Happy Birthday',
    slug: 'birthday',
    accent: '#FFD23F',
    tagline: 'Make their special day unforgettable',
    previewVideo: '/videos/shop/birthday_birthday_roses_bloom_v1.mp4',
  },
  {
    name: 'Love & Romance',
    slug: 'love',
    accent: '#FF3B7F',
    tagline: 'Express your deepest feelings',
    previewVideo: '/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4',
  },
  {
    name: 'Congratulations',
    slug: 'celebration',
    accent: '#B45FFF',
    tagline: 'Celebrate their achievements in style',
    previewVideo: '/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4',
  },
  {
    name: 'Memorial & Sympathy',
    slug: 'grief',
    accent: '#7B9FFF',
    tagline: 'Honor those we hold dear',
    previewVideo: '/videos/shop/memorial_memorial_roses_artistic_v1.mp4',
  },
  {
    name: 'Thinking of You',
    slug: 'friendship',
    accent: '#FF8C42',
    tagline: 'Let them know they matter',
    previewVideo: '/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4',
  },
  {
    name: 'Luxury Collection',
    slug: 'luxury',
    accent: '#D4AF37',
    tagline: 'Where fashion meets floral artistry',
    previewVideo: '/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v1.mp4',
  },
  {
    name: 'General Collection',
    slug: 'general',
    accent: '#9E9E9E',
    tagline: 'Beautiful blooms for every moment',
    previewVideo: '/videos/shop/general_general_goldenroses_bloom_v1.mp4',
  },
];

export default function CategoryGrid() {
  const sectionRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute('data-idx');
            setVisibleItems((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-idx]');
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sq-cat-section" ref={sectionRef}>
      <div className="sq-cat-container">
        {/* Section header */}
        <div className="sq-cat-header">
          <span className="sq-cat-eyebrow">Browse by Occasion</span>
          <h2 className="sq-cat-headline">Find the Perfect Bloom</h2>
          <p className="sq-cat-subline">Send a message they'll never forget</p>
        </div>

        {/* Square card grid — 2 columns */}
        <div className="sq-cat-grid">
          {CATEGORIES.map((cat, idx) => {
            const visible = visibleItems.has(String(idx));
            return (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={`sq-cat-card ${visible ? 'sq-cat-card--visible' : ''}`}
                data-idx={idx}
                style={{ transitionDelay: `${(idx % 6) * 0.06}s` }}
              >
                {/* Square video/image area */}
                <div className="sq-cat-card__media">
                  {cat.previewVideo ? (
                    <video
                      src={cat.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="sq-cat-card__video"
                    />
                  ) : (
                    <div
                      className="sq-cat-card__placeholder"
                      style={{ background: cat.accent }}
                    />
                  )}
                  {/* Accent border-bottom */}
                  <div
                    className="sq-cat-card__accent"
                    style={{ background: cat.accent }}
                  />
                </div>

                {/* Text below image */}
                <div className="sq-cat-card__body">
                  <h3 className="sq-cat-card__title">{cat.name}</h3>
                  <p className="sq-cat-card__tagline">{cat.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
