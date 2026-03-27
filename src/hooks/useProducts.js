import { useState, useEffect } from 'react';
import { getProducts, getProductById } from '../lib/supabase';
import { flowers } from '../data/flowers';

/**
 * Custom hook to fetch products from Supabase.
 * Falls back to mock data if Supabase is not configured or returns empty.
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
        const data = await getProducts({ tier });

        if (data && data.length > 0) {
          setProducts(data);
          setUsingMockData(false);
          if (import.meta.env.DEV) console.log('✅ Loaded', data.length, 'products from Supabase');
        } else {
          // Fallback to mock data only if database is empty
          if (import.meta.env.DEV) console.log('⚠️ No products in database, using demo data');
          const filtered = tier ? flowers.filter((f) => f.tier === tier) : flowers;
          setProducts(filtered);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback to mock data on error
        const filtered = tier ? flowers.filter((f) => f.tier === tier) : flowers;
        setProducts(filtered);
        setUsingMockData(true);
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
 * Falls back to mock data if Supabase is not configured.
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
        const data = await getProductById(id);

        if (data) {
          setProduct(data);
          setUsingMockData(false);
        } else {
          // Fallback to mock data if product not found in database
          const mockProduct = flowers.find((f) => f.id === parseInt(id));
          setProduct(mockProduct || null);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        const mockProduct = flowers.find((f) => f.id === parseInt(id));
        setProduct(mockProduct || null);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error, usingMockData };
};
