import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import '../styles/gallery.css';

const CATEGORIES = [
  { name: "Mother's Day", slug: 'mothers-day', tagline: 'Celebrate the woman who gave you everything' },
  { name: 'Birthday', slug: 'birthday', tagline: 'Make their special day unforgettable' },
  { name: 'Love & Romance', slug: 'love', tagline: 'Express your deepest feelings' },
  { name: "Valentine's Day", slug: 'valentine', tagline: 'For the one who has your heart' },
  { name: 'Congratulations', slug: 'celebration', tagline: 'Celebrate their achievements in style' },
  { name: 'Memorial & Sympathy', slug: 'grief', tagline: 'Honor those we hold dear' },
  { name: 'Thinking of You', slug: 'friendship', tagline: 'Let them know they matter' },
  { name: 'Luxury Collection', slug: 'luxury', tagline: 'Where fashion meets floral artistry' },
  { name: 'General Collection', slug: 'general', tagline: 'Beautiful blooms for every moment' },
];

function CategorySection({ cat, products }) {
  const catProducts = products.filter((p) => p.category === cat.slug);
  if (catProducts.length === 0) return null;

  return (
    <section className="gallery-section">
      <div className="gallery-section__header">
        <div className="gallery-section__info">
          <h2 className="gallery-section__title">{cat.name}</h2>
          <p className="gallery-section__tagline">{cat.tagline}</p>
        </div>
        <Link to={`/shop/${cat.slug}`} className="gallery-section__see-all">
          See all →
        </Link>
      </div>
      <div className="gallery-grid">
        {catProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Shop({ searchQuery, setSearchQuery }) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

  // Search mode — use ProductGrid
  if (searchQuery) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <ProductGrid searchQuery={searchQuery} />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">

        {/* ── PAGE HEADER ── */}
        <header className="gallery-header">
          <div className="gallery-header__meta">
            <h1 className="gallery-header__title">Choose Your Occasion</h1>
            <p className="gallery-header__count">
              Browse curated digital bloom experiences crafted for every moment.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="gallery-search">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search blooms…"
              className="gallery-search__input"
            />
            <button type="submit" className="gallery-search__btn">
              Search
            </button>
          </form>
        </header>

        {/* ── CATEGORY SECTIONS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[var(--accent-gold)] rounded-full animate-spin" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', color: '#6E6E73' }}>Loading collection...</p>
          </div>
        ) : (
          <div className="gallery-sections">
            {CATEGORIES.map((cat) => (
              <CategorySection key={cat.slug} cat={cat} products={products} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
