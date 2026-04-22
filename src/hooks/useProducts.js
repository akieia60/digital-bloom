import { useState, useEffect } from 'react';
import { getProducts, getProductById, getProductBySlug, isSupabaseConfigured } from '../lib/supabase';
import { flowers } from '../data/flowers';

const normalizeProduct = (product) => {
  if (!product) return product;

  const occasions = Array.isArray(product.occasions)
    ? product.occasions
    : typeof product.occasions === 'string'
      ? product.occasions.split(',').map((occasion) => occasion.trim()).filter(Boolean)
      : [];

  return {
    ...product,
    occasions,
    price: Number(product.price),
    stock: Number(product.stock)
  };
};

const findMockProduct = (id) => {
  if (!id) return null;
  return (
    flowers.find((flower) => String(flower.id) === String(id)) ||
    flowers.find((flower) => flower.slug === id)
  );
};

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
          setProducts(data.map(normalizeProduct));
          setUsingMockData(false);
          console.log('✅ Loaded', data.length, 'products from Supabase');
        } else {
          if (isSupabaseConfigured) {
            setProducts([]);
            setUsingMockData(false);
          } else {
            // Fallback to mock data only if Supabase is not configured
            console.log('⚠️ Supabase not configured, using demo data');
            setProducts(flowers.map(normalizeProduct));
            setUsingMockData(true);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);

        if (isSupabaseConfigured) {
          setProducts([]);
          setUsingMockData(false);
        } else {
          // Fallback to mock data on setup error only
          setProducts(flowers.map(normalizeProduct));
          setUsingMockData(true);
        }
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
        const normalizedId = Number.isNaN(Number(id)) ? id : Number(id);
        let data = await getProductById(normalizedId);

        if (!data && typeof id === 'string') {
          data = await getProductBySlug(id);
        }

        if (data) {
          setProduct(normalizeProduct(data));
          setUsingMockData(false);
        } else {
          if (isSupabaseConfigured) {
            setProduct(null);
            setUsingMockData(false);
          } else {
            // Fallback to mock data if Supabase is not configured
            const mockProduct = findMockProduct(id);
            setProduct(mockProduct ? normalizeProduct(mockProduct) : null);
            setUsingMockData(true);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);

        if (isSupabaseConfigured) {
          setProduct(null);
          setUsingMockData(false);
        } else {
          // Fallback to mock data on setup error only
          const mockProduct = findMockProduct(id);
          setProduct(mockProduct ? normalizeProduct(mockProduct) : null);
          setUsingMockData(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error, usingMockData };
};
