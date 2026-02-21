import { useState } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import PricingTiers from '../components/PricingTiers';

export default function Shop({ searchQuery, setSearchQuery }) {
  const [showTiers, setShowTiers] = useState(true);

  return (
    <>
      <Hero />

      {/* Pricing Tiers Section */}
      {showTiers && (
        <div className="border-b border-white/5">
          <PricingTiers />
        </div>
      )}

      {/* Product Gallery */}
      <div id="products-section">
        <ProductGrid searchQuery={searchQuery} />
      </div>
    </>
  );
}
