import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { useProducts } from '../hooks/useProducts';

const ProductGrid = ({ searchQuery }) => {
  const { products, loading, usingMockData } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const filteredProducts = useMemo(() => {
    return products.filter(flower => {
      const matchesSearch = flower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          flower.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 ||
                             selectedCategories.includes(flower.category);

      const matchesOccasion = selectedOccasions.length === 0 ||
                             selectedOccasions.some(occasion => flower.occasions.includes(occasion));

      const matchesPrice = flower.price >= priceRange[0] && flower.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesOccasion && matchesPrice;
    });
  }, [products, searchQuery, selectedCategories, selectedOccasions, priceRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white">Loading luxury products...</h3>
        </div>
      </div>
    );
  }

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {usingMockData && (
        <div className="mb-6 glass border border-gold/30 rounded-2xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gold mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gold">Using Demo Data</h3>
              <p className="text-sm text-white/70 mt-1">
                Configure Supabase to use real product data. See <code className="bg-white/10 px-2 py-0.5 rounded text-gold">env</code> for setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterPanel
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedOccasions={selectedOccasions}
            setSelectedOccasions={setSelectedOccasions}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-4xl font-bold font-playfair gradient-text mb-2">
              {searchQuery ? `Search results for "${searchQuery}"` : '✨ Luxury Collection'}
            </h2>
            <p className="text-white/60 text-lg">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'premium product' : 'premium products'} found
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl">
              <svg
                className="mx-auto h-24 w-24 text-gold/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-white">No flowers found</h3>
              <p className="mt-2 text-white/60">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(flower => (
                <ProductCard key={flower.id} product={flower} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductGrid;
