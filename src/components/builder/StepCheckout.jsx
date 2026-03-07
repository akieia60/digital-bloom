import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { stripePromise, createCartCheckoutSession, redirectToCheckout } from '../../lib/stripe';

const CATEGORY_LABELS = {
  birthday: 'Birthday',
  iloveyou: 'I Love You',
  thankyou: 'Thank You',
  congratulations: 'Congratulations',
  anniversary: 'Anniversary',
  encouragement: 'Encouragement',
  sympathy: 'Sympathy',
};

export default function StepCheckout({ bloom, activeMessage, onAddToCart, checkoutDone }) {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { template, to, from, deliveryDate } = bloom;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Immediately after purchase';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleCheckout = async () => {
    if (!template) return;
    setLoading(true);
    setError(null);

    try {
      // Build a temporary cart item representing this builder bloom
      const cartItem = {
        product: {
          id: `builder-${template.id}`,
          name: `${CATEGORY_LABELS[bloom.category] || bloom.category} Bloom — ${template.name}`,
          price: template.price,
          stripe_price_id: template.stripe_price_id || null,
          tier: template.tier,
          video_url: template.videoUrl,
          bloom_meta: {
            category: bloom.category,
            tone: bloom.tone,
            templateId: template.id,
            message: activeMessage,
            to: bloom.to,
            from: bloom.from,
            deliveryDate: bloom.deliveryDate,
            recipientEmail,
          }
        },
        quantity: 1,
      };

      const result = await createCartCheckoutSession(
        [cartItem],
        null,
        { email }
      );

      if (result?.url) {
        redirectToCheckout(result.url);
      } else if (result?.sessionId) {
        // Fallback: open Stripe checkout via sessionId using already-loaded Stripe instance
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: result.sessionId });
        }
      } else {
        // Graceful fallback: add to cart and navigate to shop
        onAddToCart();
        navigate('/success');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkoutDone) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-medium text-[#1D1D1F] mb-3">Bloom Added</h2>
        <p className="text-[#6E6E73] text-sm leading-relaxed mb-8">
          Your bloom is in your cart. Complete your purchase to send it.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-[#1D1D1F] text-white rounded-full text-sm font-medium hover:bg-[#D4AF37] hover:text-[#1D1D1F] transition-all duration-300"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 07</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Send your bloom
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          One final step. Your bloom will be delivered digitally — beautifully.
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-[#F5F5F7] rounded-2xl p-5">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] font-medium mb-4">Order Summary</h3>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1D1D1F]">{template?.name}</p>
              <p className="text-xs text-[#6E6E73] mt-1">
                For {to} · from {from}
              </p>
              {deliveryDate && (
                <p className="text-xs text-[#6E6E73] mt-0.5">Delivery: {formatDate(deliveryDate)}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-medium text-[#1D1D1F]">${template?.price?.toFixed(2)}</p>
              <p className="text-[10px] text-[#A0A0A8] uppercase tracking-widest mt-0.5">one time</p>
            </div>
          </div>
        </div>

        {/* Your email */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            Your Email <span className="text-[#FF3B7F]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] transition-colors duration-200 bg-white"
          />
          <p className="text-xs text-[#A0A0A8] mt-1.5">For your receipt and order confirmation</p>
        </div>

        {/* Recipient email (optional) */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            Recipient Email
            <span className="ml-2 text-[9px] normal-case text-[#A0A0A8] tracking-normal">Optional — to deliver the bloom directly to them</span>
          </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder={`${to || 'their'}@email.com`}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] transition-colors duration-200 bg-white"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={handleCheckout}
          disabled={!email.trim() || loading}
          className={`w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 ${
            email.trim() && !loading
              ? 'bg-[#1D1D1F] text-white hover:bg-[#D4AF37] hover:text-[#1D1D1F]'
              : 'bg-[#D2D2D7] text-[#6E6E73] cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing…
            </span>
          ) : (
            `Proceed to Checkout — $${template?.price?.toFixed(2)}`
          )}
        </button>

        {/* Security note */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-[#A0A0A8]">
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure payment via Stripe
          </span>
          <span>·</span>
          <span>Instant digital delivery</span>
          <span>·</span>
          <span>No subscription</span>
        </div>
      </div>
    </div>
  );
}
