import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PRICING_TIERS } from '../config/pricingTiers';

/**
 * ProductGrid — Digital Bloom
 * Renders the product gallery with optional tier and search filtering.
 * Prices are always read from the database product objects — never hardcoded.
 */
const ProductGrid = ({ searchQuery = '' }) => {
  const { products, loading, usingMockData } = useProducts();
  const [searchParams] = useSearchParams();
  const tierFilter = searchParams.get('tier') ? parseInt(searchParams.get('tier')) : null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === null || product.tier === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [products, searchQuery, tierFilter]);

  // Find the active tier label if filtering
  const activeTierLabel = tierFilter
    ? PRICING_TIERS.find((t) => t.tier === tierFilter)?.name
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 sm:py-32 glass rounded-3xl">
              <h3 className="text-lg sm:text-xl font-light text-white/40 italic">
                A masterpiece is yet to be found.
              </h3>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
