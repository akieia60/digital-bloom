import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="glass rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl hover:shadow-gold/20 hover:border-gold/40 relative">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-dark-bg to-dark-secondary group/video">
          {product.video_file_url || product.video_url ? (
            <video
              src={product.video_file_url || product.video_url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={product.image_url}
              onContextMenu={(e) => e.preventDefault()}
              controlsList="nodownload"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          )}

          {/* Glowing border on video hover */}
          {(product.video_file_url || product.video_url) && (
            <div className="absolute inset-0 border-2 border-gold/0 group-hover/video:border-gold/30 transition-all duration-500 pointer-events-none" />
          )}

          {/* Badge */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className="inline-block bg-gradient-to-r from-rose-red to-rose-pink px-3 py-1 rounded-full text-xs font-semibold text-white capitalize shadow-lg">
              {product.category || 'Premium 3D'}
            </span>
            {product.product_type === 'digital' && (
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg animate-pulse">
                Digital Motion
              </span>
            )}
          </div>

          {/* Success Animation */}
          {showSuccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-red/90 to-rose-pink/90 flex items-center justify-center animate-fade-in backdrop-blur-sm">
              <div className="text-white text-center">
                <svg className="w-16 h-16 mx-auto mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-semibold text-lg">Added to cart!</p>
              </div>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg/100 to-transparent pointer-events-none"></div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-playfair font-semibold text-gold mb-2 group-hover:gradient-text transition-all">
            {product.name}
          </h3>
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold gradient-text">
              ${Number(product.price).toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-rose-red to-rose-pink hover:from-rose-pink hover:to-rose-red text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-rose-red/50 hover:scale-105"
            >
              Add to Cart
            </button>
          </div>

          {product.stock && product.stock < 10 && (
            <p className="text-xs text-rose-pink mt-3 font-medium">
              Limited Availability: Only {product.stock} left
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
