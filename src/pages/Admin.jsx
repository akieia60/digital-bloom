import { useState, useEffect } from 'react';
import { supabase, uploadProductImage, uploadProductVideo } from '../lib/supabase';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image_url: '',
    video_url: '',
    category: 'mixed',
    occasions: '',
    stock: 10,
    is_active: true,
    // NEW: Digital product fields
    product_type: 'physical',
    animation_style: '',
    prompt_used: '',
    trim_style: '',
    embellishments: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showMessage('Error loading products: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'image_file') setImageFile(files[0]);
      if (name === 'video_file') setVideoFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      image_url: '',
      video_url: '',
      category: 'mixed',
      occasions: '',
      stock: 10,
      is_active: true,
      product_type: 'physical',
      animation_style: '',
      prompt_used: '',
      trim_style: '',
      embellishments: ''
    });
    setEditingProduct(null);
    setImageFile(null);
    setVideoFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let currentImageUrl = formData.image_url;
      let currentVideoUrl = formData.video_url;

      // Handle Image Upload
      if (imageFile) {
        showMessage('Uploading image...', 'info');
        const uploadedUrl = await uploadProductImage(imageFile);
        if (uploadedUrl) currentImageUrl = uploadedUrl;
      }

      // Handle Video Upload
      if (videoFile) {
        showMessage('Uploading video...', 'info');
        const uploadedUrl = await uploadProductVideo(videoFile);
        if (uploadedUrl) currentVideoUrl = uploadedUrl;
      }

      // Prepare data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: currentImageUrl,
        video_url: currentVideoUrl || null,
        category: formData.category,
        occasions: formData.occasions.split(',').map(o => o.trim()).filter(Boolean),
        stock: parseInt(formData.stock),
        is_active: formData.is_active,
        // NEW: Digital product fields
        product_type: formData.product_type,
        animation_style: formData.animation_style || null,
        prompt_used: formData.prompt_used || null,
        luxury_features: formData.trim_style || formData.embellishments ? {
          trim: formData.trim_style || null,
          embellishments: formData.embellishments || null
        } : null
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showMessage('Product updated successfully!');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        showMessage('Product added successfully!');
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showMessage('Error: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      video_url: product.video_url || '',
      category: product.category,
      occasions: product.occasions?.join(', ') || '',
      stock: product.stock,
      is_active: product.is_active,
      product_type: product.product_type || 'physical',
      animation_style: product.animation_style || '',
      prompt_used: product.prompt_used || '',
      trim_style: product.luxury_features?.trim || '',
      embellishments: product.luxury_features?.embellishments || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('Product deleted successfully!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('Error: ' + error.message, 'error');
    }
  };

  const categories = ['roses', 'tulips', 'lilies', 'mixed', 'digital-art'];
  const occasionOptions = ['anniversary', 'birthday', 'romance', 'valentine', 'wedding', 'sympathy', 'thank-you', 'just-because', 'get-well'];

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🌸 Admin Panel</h1>
            <p className="text-gray-400">Manage your flower arrangements</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {showForm ? '✕ Close Form' : '+ Add New Product'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 border border-red-500 text-red-200' : 'bg-green-500/20 border border-green-500 text-green-200'}`}>
            {message.text}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="e.g., Red Rose Bouquet"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="auto-generated from name"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="49.99"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="10"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Occasions */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Occasions (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="occasions"
                    value={formData.occasions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="anniversary, birthday, romance"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Suggestions: {occasionOptions.join(', ')}
                  </p>
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Type *
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="physical">Physical (Flower Arrangement)</option>
                    <option value="digital">Digital (Video Download)</option>
                  </select>
                </div>
              </div>

              {/* DIGITAL PRODUCT FIELDS - Only show if digital */}
              {formData.product_type === 'digital' && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">
                    🎬 Digital Product Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Animation Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Animation Style
                      </label>
                      <select
                        name="animation_style"
                        value={formData.animation_style}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select animation...</option>
                        <option value="heartbeat-pulse">Heartbeat Pulse</option>
                        <option value="wave-effect">Wave Effect</option>
                        <option value="circular-pulse">Circular Pulse</option>
                        <option value="music-reactive">Music Reactive</option>
                        <option value="rising-intertwine">Rising & Intertwining</option>
                        <option value="love-story">Love Story Silhouette</option>
                        <option value="custom">Custom/Other</option>
                      </select>
                    </div>

                    {/* Trim Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trim/Edge Style
                      </label>
                      <select
                        name="trim_style"
                        value={formData.trim_style}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select trim...</option>
                        <option value="diamond">Diamond Encrusted</option>
                        <option value="gold">Gold Metallic</option>
                        <option value="silver">Silver Metallic</option>
                        <option value="white">White Trim</option>
                        <option value="blue">Blue Glow</option>
                        <option value="orange">Orange Gradient</option>
                      </select>
                    </div>

                    {/* Embellishments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Embellishments
                      </label>
                      <input
                        type="text"
                        name="embellishments"
                        value={formData.embellishments}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g., pearls, sparkles, glow effects"
                      />
                    </div>

                    {/* Prompt Used */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        AI Prompt Used
                      </label>
                      <input
                        type="text"
                        name="prompt_used"
                        value={formData.prompt_used}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g., Diamond Crusted + Heartbeat Pulse"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-800/20 rounded p-3 text-sm text-purple-200">
                    💡 <strong>Tip:</strong> For digital products, set stock to 999 (unlimited downloads) and use Video URL for the MP4 file.
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  placeholder="A beautiful description of your arrangement..."
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Image (Upload new or use URL below)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="image_file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                  {imageFile && <span className="text-green-400 text-sm">📁 {imageFile.name} ready</span>}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL (Current or fallback)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Video Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Video (Upload new or use path below)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="video_file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                  {videoFile && <span className="text-green-400 text-sm">📁 {videoFile.name} ready</span>}
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video URL/Path
                </label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  placeholder="/videos/my-flower.mp4"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-rose-500 focus:ring-rose-500"
                />
                <label className="text-sm font-medium text-gray-300">
                  Product is active (visible to customers)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? '⌛ Uploading...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            Products ({products.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products yet.</p>
              <p className="text-gray-500 mt-2">Click "Add New Product" to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {product.video_url ? (
                            <video
                              src={product.video_url}
                              className="w-12 h-12 object-cover rounded-lg bg-black"
                              muted
                              loop
                              preload="none"
                              poster={product.image_url}
                              onMouseOver={(e) => e.target.play()}
                              onMouseOut={(e) => e.target.pause()}
                            />
                          ) : (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 capitalize">{product.category}</td>
                      <td className="py-3 px-4 text-gray-300">${Number(product.price).toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-300">{product.stock}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-2"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
