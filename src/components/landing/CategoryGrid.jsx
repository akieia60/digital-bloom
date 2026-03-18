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
    <section className="circle-cat-section" ref={sectionRef}>
      <div className="circle-cat-container">
        {/* Section header */}
        <div className="circle-cat-header">
          <span className="circle-cat-eyebrow">Browse by Occasion</span>
          <h2 className="circle-cat-headline">Find the Perfect Bloom</h2>
        </div>

        {/* Circle card rows */}
        <div className="circle-cat-list">
          {CATEGORIES.map((cat, idx) => {
            const visible = visibleItems.has(String(idx));
            return (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={`circle-cat-row ${visible ? 'circle-cat-row--visible' : ''}`}
                data-idx={idx}
                style={{ transitionDelay: `${(idx % 6) * 0.06}s` }}
              >
                {/* Circle video preview */}
                <div className="circle-cat-row__media">
                  {cat.previewVideo ? (
                    <video
                      src={cat.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="circle-cat-row__video"
                    />
                  ) : (
                    <div
                      className="circle-cat-row__placeholder"
                      style={{ background: cat.accent }}
                    />
                  )}
                  {/* Subtle ring accent */}
                  <div
                    className="circle-cat-row__ring"
                    style={{ borderColor: cat.accent }}
                  />
                </div>

                {/* Text content */}
                <div className="circle-cat-row__content">
                  <h3 className="circle-cat-row__title">{cat.name}</h3>
                  <p className="circle-cat-row__tagline">{cat.tagline}</p>
                </div>

                {/* Arrow */}
                <div className="circle-cat-row__arrow" style={{ color: cat.accent }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
