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
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-pure-gold/20 border-t-pure-gold rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Preparing the Studio</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-display text-white mb-6">Piece not found in collection.</h2>
          <Link to="/" className="btn-secondary px-8 py-3 rounded-full text-[10px] uppercase tracking-widest">Return to Gallery</Link>
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
    <div className="min-h-screen bg-obsidian text-white pt-32 pb-24">
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
          className="group flex items-center text-white/40 hover:text-white transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center mr-4 group-hover:border-pure-gold/40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Return to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
          {/* Cinematic Viewport */}
          <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden glass border border-white/5 shadow-2xl">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40"></div>
            
            <div className="absolute bottom-8 left-8">
              <span className="px-4 py-1.5 glass border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-semibold text-pure-gold">
                Masterpiece Edition
              </span>
            </div>
          </div>

          {/* Bespoke Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-semibold mb-4 block">
                {product.category || 'Luxury Bloom'}
              </span>
              <h1 className="text-5xl sm:text-6xl font-medium font-display tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-3xl font-light tracking-tight text-white/90">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <p className="text-lg text-white/50 mb-12 font-light leading-relaxed max-w-xl italic">
             "{product.description}"
            </p>

            <div className="space-y-12">
              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-pure-gold mb-2 font-semibold">Format</h3>
                  <p className="text-xs text-white/40 font-light">4K Cinematic Video (MP4)</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-pure-gold mb-2 font-semibold">Delivery</h3>
                  <p className="text-xs text-white/40 font-light">Instant Global Download</p>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-6">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="w-full btn-primary py-6 rounded-full text-sm font-bold tracking-[0.3em] uppercase transition-all shadow-xl shadow-white/5"
                >
                  Personalize & Gift 💎
                </button>
                
                <div className="flex items-center justify-center space-x-4 opacity-30 text-[9px] uppercase tracking-[0.3em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>4K Resolution</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Bespoke Music</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Lifetime Access</span>
                </div>
              </div>

              {/* Success Notification */}
              {showSuccess && (
                <div className="animate-fade-in glass border border-green-500/30 p-4 rounded-2xl flex items-center space-x-4 bg-green-500/5">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Bespoke product added to cart.</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Ready for checkout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Extension */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/5 pt-24">
            <h2 className="text-3xl font-display font-medium text-white mb-16 tracking-tight">You may also admire</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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
