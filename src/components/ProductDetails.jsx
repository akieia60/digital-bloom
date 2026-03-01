import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import Customizer from './Customizer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { product, loading } = useProduct(id);
  const { products } = useProducts();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(f => f.category === product.category && f.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#D2D2D7] border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-display text-[#1D1D1F] mb-6">Product not found.</h2>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-[12px] uppercase tracking-widest border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const handleCustomizationComplete = (customization) => {
    addToCart(product, 1, customization);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] pt-32 pb-24">
      {/* Customizer Overlay */}
      <Customizer 
        product={product} 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)}
        onComplete={handleCustomizationComplete}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-[#6E6E73] hover:text-[#1D1D1F] transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-full border border-[#D2D2D7] flex items-center justify-center mr-4 group-hover:border-[#1D1D1F]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[11px] uppercase tracking-[0.15em] font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
          {/* Video Viewport */}
          <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-[#F5F5F7] border border-[#D2D2D7]/30 shadow-lg">
            <video
              src={product.video_file_url || product.video_url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={product.image_url}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-30"></div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-4 block">
                {product.category || 'Digital Experience'}
              </span>
              <h1 className="text-4xl sm:text-5xl font-medium font-display tracking-tight leading-tight mb-6 text-[#1D1D1F]">
                {product.name}
              </h1>
              <p className="text-3xl font-light tracking-tight text-[#1D1D1F]">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <p className="text-lg text-[#6E6E73] mb-12 font-light leading-relaxed max-w-xl">
              {product.description}
            </p>

            <div className="space-y-10">
              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-8 border-t border-[#D2D2D7]/50 pt-10">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] mb-2 font-semibold">Format</h3>
                  <p className="text-sm text-[#6E6E73] font-light">4K Cinematic Video (MP4)</p>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] mb-2 font-semibold">Delivery</h3>
                  <p className="text-sm text-[#6E6E73] font-light">Instant Digital Download</p>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="space-y-6">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="w-full py-5 rounded-full text-sm font-medium tracking-[0.2em] uppercase transition-all bg-[#1D1D1F] text-white hover:bg-[#D4AF37] hover:text-[#1D1D1F] shadow-lg"
                >
                  Customize Experience
                </button>
                
                <div className="flex items-center justify-center space-x-4 text-[10px] uppercase tracking-[0.2em] text-[#6E6E73]/60">
                  <span>4K Resolution</span>
                  <span className="w-1 h-1 rounded-full bg-[#D2D2D7]"></span>
                  <span>Custom Music</span>
                  <span className="w-1 h-1 rounded-full bg-[#D2D2D7]"></span>
                  <span>Lifetime Access</span>
                </div>
              </div>

              {/* Success Notification */}
              {showSuccess && (
                <div className="animate-fade-in bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1F]">Added to cart.</p>
                    <p className="text-[10px] text-[#6E6E73] uppercase tracking-widest mt-1">Ready to customize</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#D2D2D7]/50 pt-24">
            <h2 className="text-3xl font-display font-medium text-[#1D1D1F] mb-16 tracking-tight">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map(flower => (
                <ProductCard key={flower.id} product={flower} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
