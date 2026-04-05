import { useState, useEffect } from 'react';

// Supabase is the source of truth for products.
// If unavailable, we show an empty state rather than stale demo data.

/**
 * Custom hook to fetch products from Supabase.
 * Returns empty array if Supabase is not configured or returns empty.
 *
 * @param {object} options
 * @param {number|null} options.tier - Filter by pricing tier (1-4), or null for all
 */
export const useProducts = ({ tier = null } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { getProducts } = await import('../lib/supabase');
        const data = await getProducts({ tier });

        if (data && data.length > 0) {
          setProducts(data);
          setUsingMockData(false);
          if (import.meta.env.DEV) console.log('✅ Loaded', data.length, 'products from Supabase');
        } else {
          if (import.meta.env.DEV) console.log('⚠️ No products in database');
          setProducts([]);
          setUsingMockData(false);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
        setUsingMockData(false);
      } finally {
        setLoading(false);
      }
    
    };

    fetchProducts();
  }, [tier]);

  return { products, loading, error, usingMockData };
};

/**
 * Custom hook to fetch a single product by ID.
 * Returns null if not found in Supabase.
 */
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { getProductById } = await import('../lib/supabase');
        const data = await getProductById(id);

        if (data) {
          setProduct(data);
          setUsingMockData(false);
        } else {
          setProduct(null);
          setUsingMockData(false);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
        setUsingMockData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error, usingMockData };
};
