import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: "Mother's Day",
    slug: 'mothers-day',
    color: '#FF4DA6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 40C24 40 8 32 8 20C8 14 12 10 18 10C21 10 23 12 24 14C25 12 27 10 30 10C36 10 40 14 40 20C40 32 24 40 24 40Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 18C22 22 20 26 24 32C28 26 26 22 24 18Z" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      </svg>
    ),
  },
  {
    name: 'Birthday',
    slug: 'birthday',
    color: '#FFD23F',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 28H40" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
        <path d="M16 20V16M24 20V14M32 20V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="16" cy="13" r="2" fill="currentColor" opacity="0.7"/>
        <circle cx="24" cy="11" r="2" fill="currentColor" opacity="0.7"/>
        <circle cx="32" cy="13" r="2" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: 'Love',
    slug: 'love',
    color: '#FF3B7F',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 42S6 30 6 18C6 12 10 6 16 6C20 6 23 9 24 12C25 9 28 6 32 6C38 6 42 12 42 18C42 30 24 42 24 42Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Valentine's Day",
    slug: 'valentine',
    color: '#FF6B6B',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 42S6 30 6 18C6 12 10 6 16 6C20 6 23 9 24 12C25 9 28 6 32 6C38 6 42 12 42 18C42 30 24 42 24 42Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 20L22 24L30 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Congratulations',
    slug: 'celebration',
    color: '#B45FFF',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L26 16L38 10L30 20L42 24L30 28L38 38L26 32L24 44L22 32L10 38L18 28L6 24L18 20L10 10L22 16L24 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Memorial',
    slug: 'grief',
    color: '#7B9FFF',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8C20 8 14 12 14 20C14 28 24 40 24 40C24 40 34 28 34 20C34 12 28 8 24 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 16V28M20 22H28" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      </svg>
    ),
  },
  {
    name: 'Thinking of You',
    slug: 'friendship',
    color: '#FF8C42',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="30" cy="18" r="8" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 40C10 34 14 30 18 30C20 30 22 30.5 24 32C26 30.5 28 30 30 30C34 30 38 34 38 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    color: '#D4AF37',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 18L16 8H32L40 18L24 40L8 18Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 18H40M16 8L24 40M32 8L24 40M20 18L16 8M28 18L32 8" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: 'Zodiac',
    slug: 'zodiac',
    comingSoon: true,
    color: '#9B59B6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M24 6V42M6 24H42" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
  },
  {
    name: 'General',
    slug: 'general',
    color: '#6E6E73',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8C20 8 16 12 16 18C16 24 24 36 24 36C24 36 32 24 32 18C32 12 28 8 24 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function CategoryGrid() {
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const cards = sectionRef.current?.querySelectorAll('.cat-card');
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="category-grid-section" ref={sectionRef}>
      <div className="landing-container">
        {/* Header */}
        <div className="cat-header">
          <span className="cat-eyebrow">BROWSE BY OCCASION</span>
          <h2 className="cat-headline">Find the Perfect Bloom</h2>
          <p className="cat-subtext">
            Every occasion deserves its own expression. Choose a category and discover
            experiences crafted for the moments that matter most.
          </p>
        </div>

        {/* Grid — links to individual category pages */}
        <div className="cat-grid">
          {CATEGORIES.map((cat, index) => {
            const visible = visibleCards.has(String(index)) ? 'cat-card--visible' : '';
            const sharedStyle = {
              transitionDelay: `${(index % 5) * 0.08}s`,
              '--cat-color': cat.color,
            };

            if (cat.comingSoon) {
              return (
                <div
                  key={cat.slug}
                  className={`cat-card cat-card--coming-soon ${visible}`}
                  data-index={index}
                  style={sharedStyle}
                >
                  <div className="cat-card__icon">{cat.icon}</div>
                  <h3 className="cat-card__name">{cat.name}</h3>
                  <span className="cat-card__badge">Coming Soon</span>
                </div>
              );
            }

            return (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={`cat-card ${visible}`}
                data-index={index}
                style={sharedStyle}
              >
                <div className="cat-card__icon">{cat.icon}</div>
                <h3 className="cat-card__name">{cat.name}</h3>
                <span className="cat-card__arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12H19M12 5L19 12L12 19" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
