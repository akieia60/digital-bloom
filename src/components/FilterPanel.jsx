import { categories, occasions } from '../data/flowers';

const FilterPanel = ({
  selectedCategories,
  setSelectedCategories,
  selectedOccasions,
  setSelectedOccasions,
  priceRange,
  setPriceRange
}) => {
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleOccasionChange = (occasionId) => {
    setSelectedOccasions(prev =>
      prev.includes(occasionId)
        ? prev.filter(id => id !== occasionId)
        : [...prev, occasionId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedOccasions.length > 0 || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="glass rounded-2xl p-6 sticky top-24 border border-gold/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-playfair font-bold gradient-text">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-rose-pink hover:text-rose-red font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">Category</h3>
          <div className="space-y-3">
            {categories.map(category => (
              <label key={category.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-5 h-5 text-gold border-gold/30 rounded focus:ring-gold focus:ring-offset-dark-bg bg-white/5"
                />
                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                  {category.name} <span className="text-white/40">({category.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gold/10 pt-8">
          <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">Occasion</h3>
          <div className="space-y-3">
            {occasions.map(occasion => (
              <label key={occasion.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occasion.id)}
                  onChange={() => handleOccasionChange(occasion.id)}
                  className="w-5 h-5 text-gold border-gold/30 rounded focus:ring-gold focus:ring-offset-dark-bg bg-white/5"
                />
                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                  {occasion.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gold/10 pt-8">
          <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-white/80 font-semibold">
              <span className="text-gold">${priceRange[0]}</span>
              <span className="text-gold">${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-3 py-2 text-sm bg-white/5 border border-gold/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <span className="text-white/50">to</span>
              <input
                type="number"
                min={priceRange[0]}
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                className="w-20 px-3 py-2 text-sm bg-white/5 border border-gold/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
