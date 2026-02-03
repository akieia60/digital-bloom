import { useState, useEffect } from 'react';
import { getProducts, getProductById } from '../lib/supabase';
import { flowers } from '../data/flowers';

/**
 * Custom hook to fetch products from Supabase
 * Falls back to mock data if Supabase is not configured
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProducts();

        if (data && data.length > 0) {
          setProducts(data);
          setUsingMockData(false);
          console.log('✅ Loaded', data.length, 'products from Supabase');
        } else {
          // Fallback to mock data only if database is empty
          console.log('⚠️ No products in database, using demo data');
          setProducts(flowers);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback to mock data on error
        setProducts(flowers);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, usingMockData };
};

/**
 * Custom hook to fetch a single product by ID
 * Falls back to mock data if Supabase is not configured
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

      // Using local data with videos for now - REMOVED to enable Supabase
      // const mockProduct = flowers.find(f => f.id === parseInt(id));
      // setProduct(mockProduct || null);
      // setUsingMockData(true);
      // setLoading(false);
      // return;

      try {
        const data = await getProductById(id);

        if (data) {
          setProduct(data);
          setUsingMockData(false);
        } else {
          // Fallback to mock data if product not found in database
          const mockProduct = flowers.find(f => f.id === parseInt(id));
          setProduct(mockProduct || null);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        // Fallback to mock data on error
        const mockProduct = flowers.find(f => f.id === parseInt(id));
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
