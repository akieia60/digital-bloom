import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORIES } from '../data/categories';
import '../styles/gallery.css';

function BackButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <button
      onClick={() => navigate(-1)}
      type="button"
      aria-label={t('common_back') || 'Back'}
      className="db-sticky-back"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{t('common_back') || 'Back'}</span>
    </button>
  );
}

// Category list is sourced from the canonical taxonomy in
// src/data/categories.js. Auto-hide logic below means empty categories never
// render a header, so the site stays clean while Ak is still filling them in.
function CategorySection({ cat, products }) {
  const { t } = useLanguage();
  const catProducts = products.filter((p) => p.category === cat.slug);
  if (catProducts.length === 0) return null;

  // Preserve language keys if they exist in the i18n bundle; otherwise fall
  // back to the canonical name/tagline from categories.js.
  const nameKey = `cat_${cat.slug.replace(/-/g, '_')}`;
  const taglineKey = `${nameKey}_tagline`;
  const translatedName = t(nameKey);
  const translatedTagline = t(taglineKey);
  const title = translatedName && translatedName !== nameKey ? translatedName : cat.title;
  const tagline = translatedTagline && translatedTagline !== taglineKey ? translatedTagline : cat.tagline;

  return (
    <section className="gallery-section">
      <div className="gallery-section__header">
        <div className="gallery-section__info">
          <h2 className="gallery-section__title">{title}</h2>
          <p className="gallery-section__tagline">{tagline}</p>
        </div>
        <Link to={`/shop/${cat.slug}`} className="gallery-section__see-all">
          {t('shop_see_all')}
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
  const { t } = useLanguage();
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();

  // Sync ?search=X from the URL into the App-level searchQuery so deep links
  // like /shop?search=friend (from CategoryPage's "search all blooms" escape
  // hatch) actually run the global search instead of dropping users on a
  // blank shop page.
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch && urlSearch !== searchQuery) {
      if (setSearchQuery) setSearchQuery(urlSearch);
      setLocalSearch(urlSearch);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

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

        {/* ── BACK BUTTON ── */}
        <BackButton />

        {/* ── PAGE HEADER ── */}
        <header className="gallery-header">
          <div className="gallery-header__meta">
            <h1 className="gallery-header__title">{t('shop_title')}</h1>
            <p className="gallery-header__count">
              {t('shop_subtitle')}
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="gallery-search">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('shop_search_placeholder')}
              className="gallery-search__input"
            />
            <button type="submit" className="gallery-search__btn">
              {t('shop_search_button')}
            </button>
          </form>
        </header>

        {/* ── CATEGORY SECTIONS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[var(--accent-gold)] rounded-full animate-spin" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', color: '#6E6E73' }}>{t('shop_loading')}</p>
          </div>
        ) : (
          <div className="gallery-sections">
            {CATEGORIES.filter((cat) => !cat.hidden).map((cat) => (
              <CategorySection key={cat.slug} cat={cat} products={products} />
            ))}
            {/* Empty-state helper — shown only while the entire site has no
                products yet (e.g. on first launch). Individual empty sections
                already auto-hide via CategorySection's early return. */}
            {products.length === 0 && (
              <div className="gallery-empty">
                <div className="gallery-empty__icon">🌸</div>
                <h3 className="gallery-empty__title">Collections launching soon</h3>
                <p className="gallery-empty__text">New experiences are being crafted daily.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
