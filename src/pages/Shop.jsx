import { useState } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

export default function Shop({ searchQuery, setSearchQuery }) {
  return (
    <>
      <Hero />
      <div id="products-section">
        <ProductGrid searchQuery={searchQuery} />
      </div>
    </>
  );
}
