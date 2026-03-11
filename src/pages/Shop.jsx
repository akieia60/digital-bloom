import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const CATEGORIES = [
  { name: "Happy Mother's Day", slug: 'mothers-day', accent: '#FF4DA6', tagline: 'Celebrate the woman who gave you everything' },
  { name: 'Happy Birthday', slug: 'birthday', accent: '#FFD23F', tagline: 'Make their special day unforgettable' },
  { name: 'Love & Romance', slug: 'love', accent: '#FF3B7F', tagline: 'Express your deepest feelings' },
  { name: "Valentine's Day", slug: 'valentine', accent: '#FF6B6B', tagline: 'For the one who has your heart' },
  { name: 'Congratulations', slug: 'celebration', accent: '#B45FFF', tagline: 'Celebrate their achievements in style' },
  { name: 'Memorial & Sympathy', slug: 'grief', accent: '#7B9FFF', tagline: 'Honor those we hold dear' },
  { name: 'Thinking of You', slug: 'friendship', accent: '#FF8C42', tagline: 'Let them know they matter' },
  { name: 'Luxury Collection', slug: 'luxury', accent: '#D4AF37', tagline: 'Where fashion meets floral artistry' },
  { name: 'Zodiac Collection', slug: 'zodiac', accent: '#9B59B6', tagline: 'Written in the stars', comingSoon: true },
  { name: 'General Collection', slug: 'general', accent: '#9E9E9E', tagline: 'Beautiful blooms for every moment' },
];

function CategoryRow({ cat, products }) {
  const scrollRef = useRef(null);
  const catProducts = products.filter((p) => p.category === cat.slug);

  return (
    <div className="mb-10">
      {/* Row header */}
      {cat.comingSoon ? (
        <div className="flex items-center justify-between px-4 sm:px-6 mb-4 opacity-50 cursor-default">
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
          className="group flex items-center justify-between px-4 sm:px-6 mb-4"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="font-display font-semibold text-lg sm:text-xl transition-all duration-200 group-hover:brightness-125"
            style={{ color: cat.accent }}
          >
            {cat.name}
          </span>
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-all duration-200">
            <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
              See all
            </span>
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              style={{ color: cat.accent }}
              fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
            >
              <path d="M5 12H19M12 5L19 12L12 19" />
            </svg>
          </div>
        </Link>
      )}

      {/* Horizontal scroll strip */}
      {cat.comingSoon ? (
        <div className="px-4 sm:px-6 py-6 rounded-2xl mx-4 sm:mx-6 border border-[var(--border-subtle)] text-center opacity-40">
          <p className="text-sm text-[var(--text-muted)]">Coming soon — {cat.tagline}</p>
        </div>
      ) : catProducts.length === 0 ? (
        <div className="px-4 sm:px-6">
          <Link
            to={`/shop/${cat.slug}`}
            className="flex items-center justify-center h-40 rounded-2xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <span className="text-sm text-[var(--text-muted)]" style={{ color: cat.accent }}>
              Browse {cat.name} →
            </span>
          </Link>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {catProducts.slice(0, 10).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-36 sm:w-44">
              <ProductCard product={product} compact />
            </div>
          ))}

          {/* "See all" card at end of row */}
          <Link
            to={`/shop/${cat.slug}`}
            className="flex-shrink-0 w-36 sm:w-44 flex items-center justify-center rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
            style={{ textDecoration: 'none', minHeight: '176px' }}
          >
            <div className="text-center px-3">
              <svg
                className="w-6 h-6 mx-auto mb-2 opacity-40"
                style={{ color: cat.accent }}
                fill="none" stroke="currentColor" strokeWidth={1.5}
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
              >
                <path d="M5 12H19M12 5L19 12L12 19" />
              </svg>
              <span className="text-[11px] text-[var(--text-muted)] leading-tight">See all</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Shop({ searchQuery, setSearchQuery }) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const { products, loading } = useProducts();

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

      {/* Netflix-style category rows */}
      <section className="pb-32">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          CATEGORIES.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} products={products} />
          ))
        )}
      </section>
    </div>
  );
}
