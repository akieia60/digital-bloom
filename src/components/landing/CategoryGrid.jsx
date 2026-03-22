import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: "Happy Mother's Day",
    slug: 'mothers-day',
    accent: '#FF4DA6',
    previewVideo: '/videos/category-previews/preview_mothers-day_grok1.mp4',
  },
  {
    name: 'Happy Birthday',
    slug: 'birthday',
    accent: '#FFD23F',
    previewVideo: '/videos/shop/birthday_birthday_roses_bloom_v1.mp4',
  },
  {
    name: 'Love & Romance',
    slug: 'love',
    accent: '#FF3B7F',
    previewVideo: '/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4',
  },
  {
    name: 'Congratulations',
    slug: 'celebration',
    accent: '#B45FFF',
    previewVideo: '/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4',
  },
  {
    name: 'Memorial & Sympathy',
    slug: 'grief',
    accent: '#7B9FFF',
    previewVideo: '/videos/shop/memorial_memorial_roses_artistic_v1.mp4',
  },
  {
    name: 'Thinking of You',
    slug: 'friendship',
    accent: '#FF8C42',
    previewVideo: '/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4',
  },
  {
    name: 'Luxury Collection',
    slug: 'luxury',
    accent: '#D4AF37',
    previewVideo: '/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v1.mp4',
  },
  {
    name: 'General Collection',
    slug: 'general',
    accent: '#9E9E9E',
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
      { threshold: 0.08, rootMargin: '0px 0px -10px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-idx]');
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cat-stack-section" ref={sectionRef}>
      {/* Section header */}
      <div className="cat-stack-header">
        <span className="cat-stack-eyebrow">Browse by Occasion</span>
        <h2 className="cat-stack-headline">Find the Perfect Bloom</h2>
      </div>

      {/* Stacked category list */}
      <div className="cat-stack-list">
        {CATEGORIES.map((cat, idx) => {
          const visible = visibleItems.has(String(idx));
          return (
            <div
              key={cat.slug}
              className={`cat-stack-item ${visible ? 'cat-stack-item--visible' : ''}`}
              data-idx={idx}
              style={{ transitionDelay: `${idx * 0.07}s` }}
            >
              {/* Category name row — full width */}
              <div className="cat-stack-name-row">
                <h3 className="cat-stack-name">{cat.name}</h3>
              </div>

              {/* Divider line — full width */}
              <div className="cat-stack-divider" style={{ background: cat.accent }} />

              {/* Full-width square bloom — tap to open */}
              <Link
                to={`/shop/${cat.slug}`}
                className="cat-stack-bloom-link"
                aria-label={`Browse ${cat.name}`}
              >
                <div className="cat-stack-bloom-square">
                  {cat.previewVideo ? (
                    <video
                      src={cat.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="cat-stack-bloom-video"
                    />
                  ) : (
                    <div
                      className="cat-stack-bloom-placeholder"
                      style={{ background: cat.accent }}
                    />
                  )}
                  {/* Tap hint overlay */}
                  <div className="cat-stack-tap-hint">
                    <span className="cat-stack-tap-text">Tap to explore</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
