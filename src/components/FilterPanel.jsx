import OCCASIONS from '../data/occasions';

// Derive filter categories from the occasions data (source of truth)
const categories = Object.entries(OCCASIONS).map(([id, data]) => ({
  id,
  name: data.name,
  count: 0  // count is populated dynamically from Supabase, not static data
}));

const occasions = Object.entries(OCCASIONS).map(([id, data]) => ({
  id,
  name: data.name
}));

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
    <div className="bg-white rounded-2xl p-6 sticky top-24 border border-[#D2D2D7]/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-[#1D1D1F]">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#D4AF37] hover:text-[#1D1D1F] font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-[#6E6E73] mb-4 uppercase tracking-wider">Category</h3>
          <div className="space-y-3">
            {categories.map(category => (
              <label key={category.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-5 h-5 text-[#D4AF37] border-[#D2D2D7] rounded focus:ring-[#D4AF37] bg-white"
                />
                <span className="ml-3 text-sm text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors">
                  {category.name} <span className="text-[#D2D2D7]">({category.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#D2D2D7]/50 pt-8">
          <h3 className="text-sm font-semibold text-[#6E6E73] mb-4 uppercase tracking-wider">Occasion</h3>
          <div className="space-y-3">
            {occasions.map(occasion => (
              <label key={occasion.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occasion.id)}
                  onChange={() => handleOccasionChange(occasion.id)}
                  className="w-5 h-5 text-[#D4AF37] border-[#D2D2D7] rounded focus:ring-[#D4AF37] bg-white"
                />
                <span className="ml-3 text-sm text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors">
                  {occasion.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#D2D2D7]/50 pt-8">
          <h3 className="text-sm font-semibold text-[#6E6E73] mb-4 uppercase tracking-wider">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#1D1D1F] font-semibold">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-3 py-2 text-sm bg-[#F5F5F7] border border-[#D2D2D7] rounded-lg text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
              />
              <span className="text-[#6E6E73]">to</span>
              <input
                type="number"
                min={priceRange[0]}
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                className="w-20 px-3 py-2 text-sm bg-[#F5F5F7] border border-[#D2D2D7] rounded-lg text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
