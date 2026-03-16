import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: "Happy Mother's Day",
    slug: 'mothers-day',
    accent: '#FF4DA6',
    tagline: 'Celebrate the woman who gave you everything',
    gradient: 'linear-gradient(135deg, #1a0010 0%, #3d0025 50%, #1a000d 100%)',
    glowColor: 'rgba(255,77,166,0.28)',
    previewVideo: '/videos/category-previews/preview_mothers-day_grok1.mp4',
  },
  {
    name: 'Happy Birthday',
    slug: 'birthday',
    accent: '#FFD23F',
    tagline: 'Make their special day unforgettable',
    gradient: 'linear-gradient(135deg, #1a1500 0%, #3d3000 50%, #1a1200 100%)',
    glowColor: 'rgba(255,210,63,0.22)',
  },
  {
    name: 'Love & Romance',
    slug: 'love',
    accent: '#FF3B7F',
    tagline: 'Express your deepest feelings',
    gradient: 'linear-gradient(135deg, #1a0010 0%, #3d0020 50%, #1a000d 100%)',
    glowColor: 'rgba(255,59,127,0.25)',
  },
  {
    name: "Valentine's Day",
    slug: 'valentine',
    accent: '#FF6B6B',
    tagline: 'For the one who has your heart',
    gradient: 'linear-gradient(135deg, #1a0000 0%, #3d0a0a 50%, #1a0505 100%)',
    glowColor: 'rgba(255,107,107,0.22)',
  },
  {
    name: 'Congratulations',
    slug: 'celebration',
    accent: '#B45FFF',
    tagline: 'Celebrate their achievements in style',
    gradient: 'linear-gradient(135deg, #0d0018 0%, #220040 50%, #0d000f 100%)',
    glowColor: 'rgba(180,95,255,0.25)',
  },
  {
    name: 'Memorial & Sympathy',
    slug: 'grief',
    accent: '#7B9FFF',
    tagline: 'Honor those we hold dear',
    gradient: 'linear-gradient(135deg, #000d1a 0%, #001a3d 50%, #00091a 100%)',
    glowColor: 'rgba(123,159,255,0.22)',
  },
  {
    name: 'Thinking of You',
    slug: 'friendship',
    accent: '#FF8C42',
    tagline: 'Let them know they matter',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0800 100%)',
    glowColor: 'rgba(255,140,66,0.22)',
  },
  {
    name: 'Luxury Collection',
    slug: 'luxury',
    accent: '#D4AF37',
    tagline: 'Where fashion meets floral artistry',
    gradient: 'linear-gradient(135deg, #0d0a00 0%, #2a2000 50%, #0d0a00 100%)',
    glowColor: 'rgba(212,175,55,0.28)',
  },
  {
    name: 'General Collection',
    slug: 'general',
    accent: '#9E9E9E',
    tagline: 'Beautiful blooms for every moment',
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f1f 50%, #0d0d0d 100%)',
    glowColor: 'rgba(158,158,158,0.15)',
  },
];

// Decorative floral SVG rendered inside each bloom card
function BloomIcon({ accent }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="90"
      height="90"
      aria-hidden="true"
    >
      {/* Outer petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 70 + 32 * Math.cos(rad);
        const cy = 70 + 32 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="13"
            ry="21"
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
            fill={accent}
            opacity="0.5"
          />
        );
      })}
      {/* Inner petals */}
      {[22, 67, 112, 157, 202, 247].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 70 + 18 * Math.cos(rad);
        const cy = 70 + 18 * Math.sin(rad);
        return (
          <ellipse
            key={`inner-${i}`}
            cx={cx}
            cy={cy}
            rx="8"
            ry="14"
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
            fill={accent}
            opacity="0.7"
          />
        );
      })}
      {/* Center */}
      <circle cx="70" cy="70" r="13" fill={accent} opacity="0.95" />
      <circle cx="70" cy="70" r="7" fill="#fff" opacity="0.15" />
    </svg>
  );
}

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
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-idx]');
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cat-list-section" ref={sectionRef}>
      <div className="cat-list-container">
        {/* Section header */}
        <div className="cat-list-header">
          <span className="cat-list-eyebrow">Browse by Occasion</span>
          <h2 className="cat-list-headline">Find the Perfect Bloom</h2>
          <p className="cat-list-subtext">
            Every occasion deserves its own expression. Choose a category below.
          </p>
        </div>

        {/* Vertical list — each entry = title row + bloom card */}
        <div className="cat-list">
          {CATEGORIES.map((cat, idx) => {
            const visible = visibleItems.has(String(idx));
            return (
              <div
                key={cat.slug}
                className={`cat-list-item ${visible ? 'cat-list-item--visible' : ''}`}
                data-idx={idx}
                style={{ transitionDelay: `${(idx % 5) * 0.07}s` }}
              >
                {/* Title row — full-width clickable header */}
                <Link to={`/shop/${cat.slug}`} className="cat-list-title-row">
                  <span
                    className="cat-list-title-row__name"
                    style={{ color: cat.accent }}
                  >
                    {cat.name}
                  </span>
                  <span className="cat-list-title-row__arrow" style={{ color: cat.accent }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12H19M12 5L19 12L12 19" />
                    </svg>
                  </span>
                </Link>

                {/* Large bloom preview card — also links to same category page */}
                <Link
                  to={`/shop/${cat.slug}`}
                  className="cat-list-bloom-card"
                  style={{ background: cat.gradient }}
                >
                  {/* Radial glow */}
                  <div
                    className="cat-list-bloom-card__glow"
                    style={{
                      background: `radial-gradient(ellipse at 50% 50%, ${cat.glowColor} 0%, transparent 65%)`,
                    }}
                  />

                  {/* Floral illustration or video preview */}
                  <div className="cat-list-bloom-card__icon">
                    {cat.previewVideo ? (
                      <video
                        src={cat.previewVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          borderRadius: 'inherit',
                          opacity: 0.7,
                        }}
                      />
                    ) : (
                      <BloomIcon accent={cat.accent} />
                    )}
                  </div>

                  {/* Card text overlay */}
                  <div className="cat-list-bloom-card__info">
                    <span
                      className="cat-list-bloom-card__label"
                      style={{ color: cat.accent }}
                    >
                      {cat.name}
                    </span>
                    <span className="cat-list-bloom-card__tagline">{cat.tagline}</span>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="cat-list-bloom-card__line"
                    style={{ background: cat.accent }}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
