import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PRICING_TIERS } from '../config/pricingTiers';
import { categories } from '../data/flowers';

/**
 * ProductGrid — Digital Bloom
 * Renders the product gallery organized by category/occasion.
 * Supports tier filtering, search, and category filtering from landing page.
 */

const CATEGORY_DISPLAY = {
  'mothers-day': { label: "Mother's Day Collection", emoji: '', tagline: 'Celebrate the woman who gave you everything' },
  'birthday': { label: 'Birthday Collection', emoji: '', tagline: 'Make their special day unforgettable' },
  'love': { label: 'Love & Romance', emoji: '', tagline: 'Express your deepest feelings' },
  'valentine': { label: "Valentine's Day", emoji: '', tagline: 'For the one who has your heart' },
  'celebration': { label: 'Congratulations', emoji: '', tagline: 'Celebrate their achievements in style' },
  'grief': { label: 'Grief & Sympathy', emoji: '', tagline: 'Honor those we hold dear' },
  'friendship': { label: 'Thinking of You', emoji: '', tagline: 'Let them know they matter' },
  'luxury': { label: 'Glass Stiletto Series', emoji: '', tagline: 'Where fashion meets floral artistry' },
  'general': { label: 'General Collection', emoji: '', tagline: 'Beautiful blooms for every moment' },
};

const ProductGrid = ({ searchQuery = '' }) => {
  const { products, loading, usingMockData } = useProducts();
  const [searchParams] = useSearchParams();
  const tierFilter = searchParams.get('tier') ? parseInt(searchParams.get('tier')) : null;
  const categoryFilter = searchParams.get('category') || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === null || product.tier === tierFilter;

      // Match category filter from landing page category grid
      const matchesCategory = !categoryFilter || 
        product.category === categoryFilter ||
        (product.occasions && product.occasions.includes(categoryFilter));

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [products, searchQuery, tierFilter, categoryFilter]);

  // Group products by category for display
  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [filteredProducts]);

  // Determine category display order (prioritize categories with more products)
  const categoryOrder = [
    'mothers-day', 'birthday', 'love', 'valentine',
    'celebration', 'grief', 'friendship', 'luxury', 'general'
  ];

  const orderedCategories = categoryOrder.filter(cat => groupedProducts[cat]?.length > 0);

  // Find the active tier label if filtering
  const activeTierLabel = tierFilter
    ? PRICING_TIERS.find((t) => t.tier === tierFilter)?.name
    : null;

  const activeCategoryLabel = categoryFilter
    ? CATEGORY_DISPLAY[categoryFilter]?.label || categoryFilter
    : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-gold mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white">Loading luxury products...</h3>
        </div>
      </div>
    );
  }

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-24">
      {usingMockData && (
        <div className="mb-8 sm:mb-12 glass border border-white/5 rounded-2xl p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            Preview Collection Only ·{' '}
            <span className="text-pure-gold/50 cursor-pointer hover:text-pure-gold transition-colors">
              Connect Live Data
            </span>
          </p>
        </div>
      )}

      <div className="flex flex-col space-y-8 sm:space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 sm:pb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium font-display tracking-tight text-white mb-3 sm:mb-4">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategoryLabel
                ? activeCategoryLabel
                : activeTierLabel
                ? `${activeTierLabel} Gallery`
                : 'Digital Gallery'}
            </h2>
            <p className="text-xs sm:text-sm text-white/40 font-light tracking-wide uppercase">
              {filteredProducts.length} Bespoke Item{filteredProducts.length !== 1 ? 's' : ''} Available
            </p>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-0 flex items-center space-x-6">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Sort by Elegance</span>
            <div className="h-px w-12 bg-white/10"></div>
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 sm:py-32 glass rounded-3xl">
            <h3 className="text-lg sm:text-xl font-light text-white/40 italic">
              A masterpiece is yet to be found.
            </h3>
          </div>
        ) : (
          orderedCategories.map((catId) => {
            const catInfo = CATEGORY_DISPLAY[catId] || { label: catId, tagline: '' };
            const catProducts = groupedProducts[catId];

            return (
              <section key={catId} className="space-y-8">
                {/* Category Header — only show if not filtering by single category */}
                {!categoryFilter && orderedCategories.length > 1 && (
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-xl sm:text-2xl font-display font-medium text-pure-gold tracking-tight">
                      {catInfo.label}
                    </h3>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mt-2 font-light">
                      {catInfo.tagline}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
