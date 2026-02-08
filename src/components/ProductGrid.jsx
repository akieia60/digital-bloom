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
    <div id="products-section" className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
      {usingMockData && (
        <div className="mb-12 glass border border-white/5 rounded-2xl p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            Preview Collection Only • <span className="text-pure-gold/50 cursor-pointer hover:text-pure-gold transition-colors">Connect Live Data</span>
          </p>
        </div>
      )}

      {/* Grid Layout - Professional Gallery */}
      <div className="flex flex-col space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-medium font-display tracking-tight text-white mb-4">
              {searchQuery ? `Results for "${searchQuery}"` : 'Digital Gallery'}
            </h2>
            <p className="text-sm text-white/40 font-light tracking-wide uppercase">
              {filteredProducts.length} Bespoke Items Available
            </p>
          </div>
          
          {/* Top-level subtle filter summary */}
          <div className="mt-6 md:mt-0 flex items-center space-x-6">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Sort by Elegance</span>
            <div className="h-px w-12 bg-white/10"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-32 glass rounded-3xl">
              <h3 className="text-xl font-light text-white/40 italic">A masterpiece is yet to be found.</h3>
            </div>
          ) : (
            filteredProducts.map(flower => (
              <ProductCard key={flower.id} product={flower} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
