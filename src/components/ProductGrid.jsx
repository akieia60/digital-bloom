import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PRICING_TIERS } from '../config/pricingTiers';

const CATEGORY_DISPLAY = {
  'mothers-day': { label: "Mother's Day Collection", tagline: 'Celebrate the woman who gave you everything' },
  'birthday': { label: 'Birthday Collection', tagline: 'Make their special day unforgettable' },
  'love': { label: 'Love & Romance', tagline: 'Express your deepest feelings' },
  'valentine': { label: "Valentine's Day", tagline: 'For the one who has your heart' },
  'celebration': { label: 'Congratulations', tagline: 'Celebrate their achievements in style' },
  'grief': { label: 'Memorial & Sympathy', tagline: 'Honor those we hold dear' },
  'friendship': { label: 'Thinking of You', tagline: 'Let them know they matter' },
  'luxury': { label: 'Glass Stiletto Series', tagline: 'Where fashion meets floral artistry' },
  'zodiac': { label: 'Zodiac Collection', tagline: 'Written in the stars' },
  'general': { label: 'General Collection', tagline: 'Beautiful blooms for every moment' },
};

const ProductGrid = ({ searchQuery = '', category = null }) => {
  const { products, loading, usingMockData } = useProducts();
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

      const matchesCategory = !categoryFilter || 
        product.category === categoryFilter;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-base font-medium text-white/40">Loading collection...</h3>
        </div>
      </div>
    );
  }

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-24">
      <div className="flex flex-col space-y-8 sm:space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 sm:pb-8">
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
            <p className="text-sm text-white/40 font-light tracking-wide">
              {filteredProducts.length} experience{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-white/[0.03] rounded-3xl border border-white/5">
            <h3 className="text-lg sm:text-xl font-light text-white/40">
              No experiences found.
            </h3>
          </div>
        ) : (
          orderedCategories.map((catId) => {
            const catInfo = CATEGORY_DISPLAY[catId] || { label: catId, tagline: '' };
            const catProducts = groupedProducts[catId];

            return (
              <section key={catId} className="space-y-8">
                {!categoryFilter && orderedCategories.length > 1 && (
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
                      {catInfo.label}
                    </h3>
                    <p className="text-[12px] text-white/30 mt-2 font-light">
                      {catInfo.tagline}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
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
