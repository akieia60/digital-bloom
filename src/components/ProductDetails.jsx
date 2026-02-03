import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import VideoPlayer from './VideoPlayer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const { product, loading } = useProduct(id);
  const { products } = useProducts();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(f => f.category === product.category && f.id !== product.id)
      .slice(0, 3);
  }, [product, products]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-900">Loading product...</h3>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          {product.video_url ? (
            <VideoPlayer
              videoUrl={product.video_url}
              posterUrl={product.image_url || product.image}
              alt={product.name}
            />
          ) : (
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', product.image_url || product.image);
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-4 flex gap-2">
            <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
              {product.category}
            </span>
            {product.product_type === 'digital' && (
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg">
                🎬 Digital Download
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <p className="text-3xl font-bold text-primary-600 mb-6">
            ${product.price}
          </p>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Perfect for:</h3>
            <div className="flex flex-wrap gap-2">
              {product.occasions.map(occasion => (
                <span
                  key={occasion}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                >
                  {occasion.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Availability:</span>{' '}
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {/* Only show quantity selector for physical products */}
            {product.product_type !== 'digital' && (
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-8 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {showSuccess ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added to Cart!</span>
                </>
              ) : product.product_type === 'digital' ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Purchase & Download</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {product.product_type === 'digital' ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Instant Download</p>
                    <p>Get your video immediately after purchase</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">High-Quality MP4</p>
                    <p>Perfect for TikTok, Instagram, and social media</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Single Download License</p>
                    <p>Link valid for 48 hours (1 download)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p>On orders over $50</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(flower => (
              <ProductCard key={flower.id} product={flower} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
