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

  const openCustomizer = useCallback(() => {
    setShowSuccess(false);
    setIsCustomizerOpen(true);
  }, []);

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
    <div className="min-h-screen bg-[var(--surface-soft,#F7F7F7)] text-[var(--text-primary)]">
      {/* Customizer Panel */}
      <Customizer
        key={product.id}
        product={product}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onComplete={handleCustomizationComplete}
        defaults={customizerDefaults}
      />

      {/* ── HERO MEDIA ── */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/7] overflow-hidden bg-black">
        {heroVideoSrc ? (
          <video
            src={heroVideoSrc}
            autoPlay muted loop playsInline preload="auto"
            poster={heroImageSrc}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : heroImageSrc ? (
          <img src={heroImageSrc} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back */}
        <button type="button" onClick={goBack}
          className="absolute top-6 left-5 z-10 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          aria-label="Go back">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category */}
        {product.category && (
          <div className="absolute top-6 right-5 z-10 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-medium">{product.category}</span>
          </div>
        )}
      </div>

      {/* ── PRODUCT INFO — More breathing room ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 -mt-8 relative z-10 pb-24">

        {/* Title + Price Card — generous padding */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-7 sm:p-10 shadow-lg mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#1D1D1F] mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-semibold text-[var(--accent-gold)] mb-5">
            ${displayPrice}
          </p>
          {product.description && (
            <p className="text-base text-[#6E6E73] leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* PRIMARY CTA — more padding/presence */}
          <button
            type="button"
            onClick={openCustomizer}
            className="w-full py-4.5 rounded-full text-[15px] font-bold tracking-[0.08em] uppercase transition-all bg-[var(--accent-gold)] text-white hover:brightness-110 shadow-lg active:scale-[0.98]"
            style={{ padding: '18px 0' }}
          >
            Customize Experience
          </button>

          {/* Feature labels — clearer and readable */}
          <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
            {['Digital Experience', 'Instant Delivery', 'Personalized'].map((label, i) => (
              <span key={i} className="text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── SUCCESS TOAST — Premium brand-aligned ── */}
        {showSuccess && (
          <div className="bg-[var(--surface-white)] rounded-2xl p-7 shadow-lg mb-8 animate-fade-in border border-[var(--accent-gold-border)]">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[rgba(201,161,74,0.1)] border border-[rgba(201,161,74,0.25)] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-display font-semibold text-[#1D1D1F]">Added to Your Cart</p>
                <p className="text-sm text-[#6E6E73] mt-1">Your personalized bloom is ready.</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => { setShowSuccess(false); toggleCart(); }}
                className="w-full py-4 rounded-full text-[14px] font-bold tracking-[0.08em] uppercase bg-[var(--accent-gold)] text-white hover:brightness-110 transition-all"
              >
                View Cart & Checkout
              </button>
              <Link
                to="/shop"
                className="block w-full py-3.5 rounded-full text-[13px] font-medium tracking-[0.08em] uppercase text-center border border-[#E5E5EA] text-[#6E6E73] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* ── Details Card — clear separation ── */}
        <div className="bg-[var(--surface-white)] rounded-2xl p-7 sm:p-10 shadow-lg mb-8">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent-gold)] font-bold mb-5">Details</h3>
          {[
            { label: 'Format', value: 'Digital Video Experience' },
            { label: 'Delivery', value: 'Instant Digital Download' },
            { label: 'Access', value: 'Lifetime — download anytime' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-[#F0F0F0] last:border-b-0">
              <span className="text-[14px] text-[#6E6E73]">{item.label}</span>
              <span className="text-[14px] font-medium text-[#1D1D1F]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
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
