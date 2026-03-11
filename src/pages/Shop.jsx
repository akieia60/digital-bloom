import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

const CATEGORIES = [
  { name: "Happy Mother's Day", slug: 'mothers-day', accent: '#FF4DA6', tagline: 'Celebrate the woman who gave you everything', gradient: 'linear-gradient(135deg, #1a0010 0%, #3d0025 50%, #1a000d 100%)', glow: 'rgba(255,77,166,0.22)' },
  { name: 'Happy Birthday', slug: 'birthday', accent: '#FFD23F', tagline: 'Make their special day unforgettable', gradient: 'linear-gradient(135deg, #1a1500 0%, #3d3000 50%, #1a1200 100%)', glow: 'rgba(255,210,63,0.18)' },
  { name: 'Love & Romance', slug: 'love', accent: '#FF3B7F', tagline: 'Express your deepest feelings', gradient: 'linear-gradient(135deg, #1a0010 0%, #3d0020 50%, #1a000d 100%)', glow: 'rgba(255,59,127,0.2)' },
  { name: "Valentine's Day", slug: 'valentine', accent: '#FF6B6B', tagline: 'For the one who has your heart', gradient: 'linear-gradient(135deg, #1a0000 0%, #3d0a0a 50%, #1a0505 100%)', glow: 'rgba(255,107,107,0.18)' },
  { name: 'Congratulations', slug: 'celebration', accent: '#B45FFF', tagline: 'Celebrate their achievements in style', gradient: 'linear-gradient(135deg, #0d0018 0%, #220040 50%, #0d000f 100%)', glow: 'rgba(180,95,255,0.2)' },
  { name: 'Memorial & Sympathy', slug: 'grief', accent: '#7B9FFF', tagline: 'Honor those we hold dear', gradient: 'linear-gradient(135deg, #000d1a 0%, #001a3d 50%, #00091a 100%)', glow: 'rgba(123,159,255,0.18)' },
  { name: 'Thinking of You', slug: 'friendship', accent: '#FF8C42', tagline: 'Let them know they matter', gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0800 100%)', glow: 'rgba(255,140,66,0.18)' },
  { name: 'Luxury Collection', slug: 'luxury', accent: '#D4AF37', tagline: 'Where fashion meets floral artistry', gradient: 'linear-gradient(135deg, #0d0a00 0%, #2a2000 50%, #0d0a00 100%)', glow: 'rgba(212,175,55,0.22)' },
  { name: 'Zodiac Collection', slug: 'zodiac', accent: '#9B59B6', tagline: 'Written in the stars', gradient: 'linear-gradient(135deg, #0d0013 0%, #1e003d 50%, #0d0013 100%)', glow: 'rgba(155,89,182,0.18)', comingSoon: true },
  { name: 'General Collection', slug: 'general', accent: '#9E9E9E', tagline: 'Beautiful blooms for every moment', gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f1f 50%, #0d0d0d 100%)', glow: 'rgba(158,158,158,0.12)' },
];

export default function Shop({ searchQuery, setSearchQuery }) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

  if (searchQuery) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)]">
        <ProductGrid searchQuery={searchQuery} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Shop Hero */}
      <section className="pt-32 pb-8 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-[var(--text-primary)] tracking-tight mb-6 italic">
          Choose Your Occasion
        </h1>
        <p className="text-base text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed mb-8">
          Browse curated digital bloom experiences crafted for every moment.
        </p>
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex max-w-sm mx-auto gap-2">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search blooms…"
            className="flex-1 px-4 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-full bg-[var(--accent-gold)] text-[var(--bg-page)] text-sm font-semibold hover:bg-[var(--accent-gold-hover)] transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      {/* Vertical occasion list */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-32">
        <div className="flex flex-col gap-0">
          {CATEGORIES.map((cat, idx) => (
            <div key={cat.slug}>
              {/* Title row */}
              {cat.comingSoon ? (
                <div className="flex items-center justify-between py-4 border-t border-[var(--border-subtle)] opacity-50 cursor-default">
                  <span className="font-display font-semibold text-lg sm:text-xl" style={{ color: cat.accent }}>
                    {cat.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border-default)] text-[var(--text-muted)]">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <Link
                  to={`/shop/${cat.slug}`}
                  className="flex items-center justify-between py-4 border-t border-[var(--border-subtle)] group"
                  style={{ textDecoration: 'none' }}
                >
                  <span
                    className="font-display font-semibold text-lg sm:text-xl transition-all duration-200 group-hover:brightness-125"
                    style={{ color: cat.accent }}
                  >
                    {cat.name}
                  </span>
                  <svg
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                    style={{ color: cat.accent }}
                    fill="none" stroke="currentColor" strokeWidth={1.5}
                    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                  >
                    <path d="M5 12H19M12 5L19 12L12 19" />
                  </svg>
                </Link>
              )}

              {/* Large bloom card */}
              {!cat.comingSoon && (
                <Link
                  to={`/shop/${cat.slug}`}
                  className="group flex items-center gap-6 rounded-2xl mb-6 overflow-hidden border border-[var(--border-subtle)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: cat.gradient, minHeight: '120px', padding: '24px 28px', textDecoration: 'none', position: 'relative' }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${cat.glow} 0%, transparent 65%)`, pointerEvents: 'none' }} />
                  <div className="relative z-10 flex-1">
                    <span className="block font-display font-semibold text-xl sm:text-2xl mb-1" style={{ color: cat.accent }}>
                      {cat.name}
                    </span>
                    <span className="block text-sm text-[var(--text-secondary)] font-light">
                      {cat.tagline}
                    </span>
                  </div>
                  <div className="relative z-10 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ color: cat.accent }}>
                      <path d="M5 12H19M12 5L19 12L12 19" />
                    </svg>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: cat.accent, opacity: 0.5 }} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
