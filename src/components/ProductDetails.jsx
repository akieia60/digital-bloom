import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import Customizer from './Customizer';
import OCCASIONS from '../data/occasions';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
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

  const customizerDefaults = useMemo(() => {
    if (!product?.category) return {};
    const occasion = OCCASIONS[product.category];
    return occasion?.customizerDefaults || {};
  }, [product?.category]);

  // Auto-dismiss success after 6 seconds
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 6000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Reset success when customizer reopens
  const openCustomizer = useCallback(() => {
    setShowSuccess(false);
    setIsCustomizerOpen(true);
  }, []);

  // Back navigation with /shop fallback
  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--border-default)] border-t-[var(--accent-gold)] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-display text-[var(--text-primary)] mb-6">Product not found.</h2>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-[12px] uppercase tracking-widest border border-[var(--border-default)] text-white hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleCustomizationComplete = (customization) => {
    addToCart(product, 1, customization);
    setShowSuccess(true);
  };

  const heroVideoSrc = product.video_file_url || product.video_url;
  const heroImageSrc = product.image_url;
  const displayPrice = Number(product.price || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-white">
      {/* Customizer Panel */}
      <Customizer 
        key={product.id}
        product={product} 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)}
        onComplete={handleCustomizationComplete}
        defaults={customizerDefaults}
      />

      {/* ── HERO MEDIA (CONDITIONAL: video OR image) ── */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/7] overflow-hidden bg-black">
        {heroVideoSrc ? (
          <video
            src={heroVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroImageSrc}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <button
          type="button"
          onClick={goBack}
          className="absolute top-6 left-5 z-10 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-6 right-5 z-10 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-medium">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* ── PRODUCT INFO ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 -mt-8 relative z-10">

        {/* Title + Price Card */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-6 sm:p-8 shadow-lg mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#1D1D1F] mb-3">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-[var(--accent-gold)] mb-4">
            ${displayPrice}
          </p>
          {product.description && (
            <p className="text-base text-[#6E6E73] leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* PRIMARY CTA */}
          <button
            type="button"
            onClick={openCustomizer}
            className="w-full py-4 rounded-full text-sm font-bold tracking-[0.1em] uppercase transition-all bg-[var(--accent-gold)] text-white hover:brightness-110 shadow-lg active:scale-[0.98]"
          >
            Customize Experience
          </button>

          {/* Feature tags — only rendered if product has relevant metadata */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[11px] uppercase tracking-[0.12em] text-[#AEAEB2] font-medium">
            <span>Digital Experience</span>
            <span className="w-1 h-1 rounded-full bg-[#D1D1D6]" />
            <span>Instant Delivery</span>
            <span className="w-1 h-1 rounded-full bg-[#D1D1D6]" />
            <span>Personalized</span>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="bg-[var(--surface-white)] rounded-2xl p-5 shadow-lg mb-6 animate-fade-in border border-green-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-[#1D1D1F]">Added to your cart!</p>
                <p className="text-sm text-[#6E6E73] mt-1">Your personalized bloom is ready.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowSuccess(false); toggleCart(); }}
              className="w-full py-3.5 rounded-full text-sm font-bold tracking-[0.1em] uppercase bg-[#1D1D1F] text-white hover:bg-[#333] transition-all"
            >
              View Cart & Checkout
            </button>
            <Link
              to="/shop"
              className="block w-full py-3 mt-3 rounded-full text-sm font-medium tracking-[0.1em] uppercase text-center border border-[#E5E5EA] text-[#6E6E73] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Details Card */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent-gold)] font-bold mb-4">Details</h3>
          <div className="space-y-0">
            {[
              { label: 'Format', value: 'Digital Video Experience' },
              { label: 'Delivery', value: 'Instant Digital Download' },
              { label: 'Access', value: 'Lifetime — download anytime' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3.5 border-b border-[#F0F0F0] last:border-b-0">
                <span className="text-sm text-[#6E6E73]">{item.label}</span>
                <span className="text-sm font-medium text-[#1D1D1F]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-24">
          <h2 className="text-2xl font-display font-medium text-[var(--text-primary)] mb-8 tracking-tight">
            You may also like
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
            {relatedProducts.map(flower => (
              <div key={flower.id} className="min-w-[260px] snap-start sm:min-w-0">
                <ProductCard product={flower} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
