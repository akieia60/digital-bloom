import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ============================================
// PRODUCT QUERIES
// ============================================

/**
 * Fetch active products from Supabase.
 * @param {object} options
 * @param {number|null} options.tier - Filter by pricing tier (1-4), or null for all
 */
export const getProducts = async ({ tier = null } = {}) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (tier !== null) {
    query = query.eq('tier', tier);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const getProductBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const getProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data;
};

// ============================================
// PURCHASE QUERIES
// ============================================

export const createPurchase = async (purchaseData) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert(purchaseData)
    .select()
    .single();

  if (error) {
    console.error('Error creating purchase:', error);
    return null;
  }

  return data;
};

export const updatePurchaseStatus = async (sessionId, status, additionalData = {}) => {
  try {
    // 1. Get the purchase to check product types
    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('stripe_session_id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    const updates = {
      status,
      ...additionalData,
      updated_at: new Date().toISOString()
    };

    // 2. If completed and digital, set download URL (no expiry — bloom links last forever per FAQ)
    if (status === 'completed' && purchase.products?.product_type === 'digital') {
      updates.download_expires_at = null;
      updates.download_url = purchase.products.video_file_url || purchase.products.video_url;
      updates.download_count = 0;
    }

    const { data, error } = await supabase
      .from('purchases')
      .update(updates)
      .eq('stripe_session_id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating purchase:', error);
    return null;
  }
};

export const getUserPurchases = async (userId) => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      products (
        name,
        image_url,
        category
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }

  return data;
};

// ============================================
// BLOOM DELIVERY QUERIES
// ============================================

/**
 * Save bloom delivery data to a purchase record.
 * Sets bloom_slug and composition_manifest for delivery page rendering.
 * 
 * @param {string} purchaseId - Purchase UUID
 * @param {string} bloomSlug - Unique delivery slug
 * @param {Object} compositionManifest - Full composition data (customization, extras, etc.)
 * @returns {Object|null} Updated purchase record
 */
export const saveBloomDelivery = async (purchaseId, bloomSlug, compositionManifest) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .update({
        bloom_slug: bloomSlug,
        composition_manifest: compositionManifest,
        updated_at: new Date().toISOString(),
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving bloom delivery:', error);
    return null;
  }
};

/**
 * Fetch a bloom delivery by its unique slug.
 * Returns purchase + product data for the delivery page.
 * 
 * @param {string} bloomSlug - Unique delivery identifier
 * @returns {Object|null} Purchase with product data
 */
export const getBloomBySlug = async (bloomSlug) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('bloom_slug', bloomSlug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bloom by slug:', error);
    return null;
  }
};

// ============================================
// CART QUERIES (if using persistent cart)
// ============================================

export const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  return data;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity
    }, {
      onConflict: 'user_id,product_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding to cart:', error);
    return null;
  }

  return data;
};

export const removeFromCart = async (userId, productId) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing from cart:', error);
    return false;
  }

  return true;
};

export const clearCart = async (userId) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }

  return true;
};

// ============================================
// STORAGE HELPERS
// ============================================

export const uploadProductImage = async (file, folder = 'products') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-media')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-media')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const uploadProductVideo = async (file, folder = 'videos') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-media')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading video:', error);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-media')
    .getPublicUrl(filePath);

  return publicUrl;
};

// ============================================
// PROMPT LIBRARY QUERIES
// ============================================

/**
 * Get all prompts from the library
 */
export async function getAllPrompts() {
  const { data, error } = await supabase
    .from('prompt_library')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prompts:', error)
    return []
  }

  return data
}

/**
 * Get prompts by category
 */
export async function getPromptsByCategory(category) {
  const { data, error } = await supabase
    .from('prompt_library')
    .select('*')
    .eq('prompt_category', category)
    .order('recommended_price', { ascending: false })

  if (error) {
    console.error('Error fetching prompts by category:', error)
    return []
  }

  return data
}

/**
 * Get single prompt by name
 */
export async function getPromptByName(promptName) {
  const { data, error } = await supabase
    .from('prompt_library')
    .select('*')
    .eq('prompt_name', promptName)
    .single()

  if (error) {
    console.error('Error fetching prompt:', error)
    return null
  }

  return data
}

/**
 * Get products with their video URLs
 */
export async function getDigitalProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_type', 'digital')
    .eq('is_active', true)
    .not('video_file_url', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching digital products:', error)
    return []
  }

  return data
}
