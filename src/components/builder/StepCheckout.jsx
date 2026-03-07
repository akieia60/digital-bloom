import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getTemplateById } from '../../data/bloomTemplates';
import { BLOOM_CATEGORIES } from '../../data/messages';

const BLOOM_PRICE = 19.99;

export default function StepCheckout({ state }) {
  const { addToCart, toggleCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const { category, styleId, message, personalize } = state;

  const template = getTemplateById(styleId);
  const categoryData = BLOOM_CATEGORIES.find((c) => c.id === category);
  const displayMessage = message?.preset || message?.custom || '';

  const handleAddToCart = () => {
    setLoading(true);

    // Build a cart-compatible product object.
    // The checkout API supports price_data fallback when no stripe_price_id is set.
    const bloomProduct = {
      id: `bloom-builder-${Date.now()}`,
      title: `Custom Digital Bloom — ${categoryData?.label || category}`,
      name: `Custom Digital Bloom — ${categoryData?.label || category}`,
      description: template?.name
        ? `${template.name} · ${state.tone}`
        : `${category} · ${state.tone}`,
      price: BLOOM_PRICE,
      // Stripe will use price_data fallback in create-checkout-session.js
      stripe_price_id: import.meta.env.VITE_BLOOM_BUILDER_PRICE_ID || null,
      image_url: null,
      customization: {
        category: state.category,
        tone: state.tone,
        styleId: state.styleId,
        styleName: template?.name || '',
        message: displayMessage,
        to: personalize?.to || '',
        from: personalize?.from || '',
        recipientEmail: personalize?.recipientEmail || '',
        deliveryDate: personalize?.deliveryDate || '',
        privateNote: personalize?.privateNote || '',
      },
    };

    // Persist builder order to localStorage so Success page can read it
    try {
      localStorage.setItem('bloom_builder_order', JSON.stringify(bloomProduct.customization));
    } catch {}

    addToCart(bloomProduct, 1, bloomProduct.customization);

    setTimeout(() => {
      setLoading(false);
      setAdded(true);
      toggleCart();
    }, 500);
  };

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 7 of 7</div>
      <h2 className="builder-step__title">Complete your bloom</h2>
      <p className="builder-step__subtitle">
        Your bloom is ready. Review and checkout — we'll deliver it after payment.
      </p>

      <div className="builder-checkout">
        {/* Left: order summary */}
        <div className="builder-checkout__summary">
          {template && (
            <div className="builder-checkout__preview-thumb">
              <video
                src={template.videoSrc}
                muted
                autoPlay
                loop
                playsInline
                style={{ background: template.posterColor }}
              />
            </div>
          )}
          <div className="builder-checkout__preview-details">
            <div className="builder-checkout__preview-title">
              {template?.name || 'Custom Digital Bloom'}
            </div>
            <div className="builder-checkout__preview-meta">
              {categoryData?.label} · {state.tone}
              {personalize?.to && ` · For ${personalize.to}`}
              {displayMessage && (
                <>
                  <br />
                  <em style={{ fontStyle: 'italic', color: '#6E6E73' }}>
                    &ldquo;{displayMessage.slice(0, 80)}{displayMessage.length > 80 ? '…' : ''}&rdquo;
                  </em>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: pricing and checkout */}
        <div>
          <div className="builder-checkout__price-card">
            <div className="builder-checkout__price-label">Your investment</div>
            <div className="builder-checkout__price-amount">${BLOOM_PRICE.toFixed(2)}</div>
            <div className="builder-checkout__price-note">One custom digital bloom, delivered instantly</div>

            <div className="builder-checkout__actions">
              {!added ? (
                <button
                  className="builder-checkout__btn-primary"
                  onClick={handleAddToCart}
                  disabled={loading}
                  type="button"
                >
                  {loading ? 'Adding to cart…' : 'Add to Cart & Checkout →'}
                </button>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>
                    ✓ Added to your cart
                  </div>
                  <p style={{ color: '#6E6E73', fontSize: 14 }}>
                    Open your cart to review and complete checkout.
                  </p>
                </div>
              )}

              <div className="builder-checkout__divider">
                <span>or</span>
              </div>

              <Link to="/credits" className="builder-checkout__btn-secondary">
                Apply Experience Credits
              </Link>
            </div>

            {/* Trust badges */}
            <div className="builder-checkout__badges">
              <div className="builder-checkout__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="builder-checkout__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>
                <span>Instant Delivery</span>
              </div>
              <div className="builder-checkout__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span>Made with care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
