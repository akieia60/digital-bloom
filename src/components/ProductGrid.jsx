import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PRICING_TIERS } from '../config/pricingTiers';
import '../styles/gallery.css';

const CATEGORY_DISPLAY = {
  'mothers-day': { label: "Mother's Day Collection", tagline: 'Celebrate the woman who gave you everything', emoji: '🌸' },
  'birthday': { label: 'Birthday Collection', tagline: 'Make their special day unforgettable', emoji: '🎂' },
  'love': { label: 'Love & Romance', tagline: 'Express your deepest feelings', emoji: '❤️' },
  'valentine': { label: "Valentine's Day", tagline: 'For the one who has your heart', emoji: '💕' },
  'celebration': { label: 'Congratulations', tagline: 'Celebrate their achievements in style', emoji: '🎉' },
  'grief': { label: 'Memorial & Sympathy', tagline: 'Honor those we hold dear', emoji: '🕊️' },
  'friendship': { label: 'Thinking of You', tagline: 'Let them know they matter', emoji: '💐' },
  'luxury': { label: 'Glass Stiletto Series', tagline: 'Where fashion meets floral artistry', emoji: '👠' },
  'zodiac': { label: 'Zodiac Collection', tagline: 'Written in the stars', emoji: '✨' },
  'general': { label: 'General Collection', tagline: 'Beautiful blooms for every moment', emoji: '🌷' },
};

const ProductGrid = ({ searchQuery = '', category = null }) => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const tierFilter = searchParams.get('tier') ? parseInt(searchParams.get('tier')) : null;
  const categoryFilter = category || searchParams.get('category') || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === null || product.tier === tierFilter;
      const matchesCategory = !categoryFilter || product.category === categoryFilter;

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [products, searchQuery, tierFilter, categoryFilter]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const categoryOrder = [
    'mothers-day', 'birthday', 'love', 'valentine',
    'celebration', 'grief', 'friendship', 'luxury', 'zodiac', 'general'
  ];

  const orderedCategories = categoryOrder.filter(cat => groupedProducts[cat]?.length > 0);

  const activeTierLabel = tierFilter
    ? PRICING_TIERS.find((t) => t.tier === tierFilter)?.name
    : null;

  const activeCategoryLabel = categoryFilter
    ? CATEGORY_DISPLAY[categoryFilter]?.label || categoryFilter
    : null;

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[#E5E5EA] border-t-[var(--accent-gold)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#6E6E73] font-light tracking-wide">Loading collection...</p>
          </div>
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
            <h1 className="gallery-header__title">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategoryLabel || (activeTierLabel ? `${activeTierLabel} Gallery` : 'Digital Gallery')}
            </h1>
            <p className="gallery-header__count">
              {filteredProducts.length} experience{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {/* ── EMPTY STATE ── */}
        {filteredProducts.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty__icon">🌸</div>
            <h3 className="gallery-empty__title">No experiences found</h3>
            <p className="gallery-empty__text">Try a different search or browse all collections.</p>
            <Link to="/shop" className="gallery-empty__cta">Browse All</Link>
          </div>
        ) : (
          /* ── CATEGORY SECTIONS ── */
          <div className="gallery-sections">
            {orderedCategories.map((catId) => {
              const catInfo = CATEGORY_DISPLAY[catId] || { label: catId, tagline: '', emoji: '🌷' };
              const catProducts = groupedProducts[catId];
              const showHeader = !categoryFilter && orderedCategories.length > 1;

              return (
                <section key={catId} className="gallery-section">
                  {showHeader && (
                    <div className="gallery-section__header">
                      <div className="gallery-section__info">
                        <h2 className="gallery-section__title">
                          {catInfo.label}
                        </h2>
                        <p className="gallery-section__tagline">{catInfo.tagline}</p>
                      </div>
                      <Link
                        to={`/shop?category=${catId}`}
                        className="gallery-section__see-all"
                      >
                        See all →
                      </Link>
                    </div>
                  )}

                  <div className="gallery-grid">
                    {catProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
