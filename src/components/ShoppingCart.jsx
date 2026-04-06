import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import CartItem from './CartItem';
import { createCartCheckoutSession, redirectToCheckout } from '../lib/stripe';
import { validateCreditCode, reserveCredit } from '../lib/creditStripe';

const ShoppingCart = () => {
  const { t } = useLanguage();
  const { cartItems, isCartOpen, toggleCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [creditCode, setCreditCode] = useState('');
  const [creditApplied, setCreditApplied] = useState(null);
  const [isApplyingCredit, setIsApplyingCredit] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const total = getCartTotal();
  const totalCents = Math.round(total * 100);
  const remainingDue = creditApplied ? Math.max(0, totalCents - creditApplied.applied_cents) : totalCents;

  const handleApplyCredit = async () => {
    setError(null);

    const formatted = creditCode.toUpperCase().trim();
    if (!/^DBLOOM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formatted)) {
      setError(t('cart_error_credit_format'));
      return;
    }

    setIsApplyingCredit(true);

    try {
      // Validate credit code first
      const validation = await validateCreditCode(formatted);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid credit code');
      }

      // Reserve credit
      const reservation = await reserveCredit(formatted, totalCents);

      setCreditApplied({
        code: formatted,
        reservation_id: reservation.reservation_id,
        applied_cents: reservation.applied_cents,
        remaining_after_cents: reservation.remaining_after_cents
      });
    } catch (err) {
      setError(err.message || 'Failed to apply credit');
    } finally {
      setIsApplyingCredit(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const formattedItems = cartItems.map(item => ({
        product: item,
        quantity: item.quantity
      }));

      // If credit is applied and covers full amount, skip Stripe
      if (creditApplied && remainingDue <= 0) {
        const result = await createCartCheckoutSession(formattedItems, {
          reservation_id: creditApplied.reservation_id,
          remaining_due_cents: 0
        });
        
        if (result.free_checkout) {
          window.location.href = result.url;
          return;
        }
      }

      // Otherwise create Stripe session with credit metadata
      const result = await createCartCheckoutSession(formattedItems, creditApplied ? {
        reservation_id: creditApplied.reservation_id,
        remaining_due_cents: remainingDue
      } : null);
      
      if (!result || !result.url) throw new Error('Failed to create checkout session');
      await redirectToCheckout(result.url);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to proceed to checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Dynamic Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity duration-700 animate-fade-in"
        onClick={toggleCart}
      />

      {/* Luxury Drawer - Full screen on mobile, sidebar on desktop */}
      <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-full md:max-w-md bg-obsidian shadow-2xl z-[101] transform transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] md:border-l border-white/5 flex flex-col animate-slide-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 border-b border-white/5">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium font-display tracking-tight text-white mb-1">{t('cart_title')}</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-light">
              {cartItems.length} {cartItems.length === 1 ? t('cart_piece') : t('cart_pieces')} Collected
            </p>
          </div>
          <button
            onClick={toggleCart}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/5 flex items-center justify-center hover:border-pure-gold/40 transition-all text-white/40 hover:text-white"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium font-display text-white mb-4">{t('cart_empty_title')}</h3>
            <p className="text-white/30 text-sm font-light leading-relaxed mb-10 max-w-[200px] mx-auto">
              {t('cart_empty_message')}
            </p>
            <button
              onClick={toggleCart}
              className="btn-secondary px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-semibold"
            >
              {t('cart_empty_cta')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.lineItemId || `${item.id}-${index}`}
                  className="rounded-[28px] border border-white/8 bg-white/[0.03] px-4 sm:px-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-8 glass border-t border-white/5 space-y-6 sm:space-y-8 bg-black/40">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-light">
                  {error}
                </div>
              )}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                    {creditApplied ? t('cart_remaining_due') : t('cart_total_value')}
                  </p>
                  <p className="text-3xl font-light tracking-tight text-white font-display">
                    ${(remainingDue / 100).toFixed(2)}
                  </p>
                  {creditApplied && (
                    <p className="text-xs text-white/40 mt-2">
                      Original: ${total.toFixed(2)} - Credit: ${(creditApplied.applied_cents / 100).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase tracking-widest text-pure-gold/60">{t('cart_concierge')}</p>
                   <p className="text-[10px] text-white/20 mt-1">{t('cart_stripe_secure')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full btn-primary py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl flex items-center justify-center gap-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span>{t('cart_initializing')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('cart_checkout')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => setIsCreditOpen((open) => !open)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-pure-gold/75 font-semibold">
                        {t('cart_credit_section')}
                      </p>
                      <p className="mt-2 text-xs text-white/45">
                        {creditApplied ? t('cart_credit_applied') : t('cart_credit_hint')}
                      </p>
                    </div>
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      {creditApplied ? t('cart_credit_applied') : (isCreditOpen ? t('cart_item_tap_collapse') : t('cart_credit_apply'))}
                    </span>
                  </button>

                  {(isCreditOpen || creditApplied) && (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      {!creditApplied ? (
                        <>
                          <div className="credit-input-group flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <input
                              type="text"
                              placeholder={t('cart_credit_placeholder')}
                              maxLength="17"
                              value={creditCode}
                              onChange={(e) => setCreditCode(e.target.value.toUpperCase())}
                              className="flex-1 px-4 py-3 sm:py-3 text-base sm:text-sm border border-white/10 rounded-lg bg-white/5 text-white font-mono focus:outline-none focus:border-pure-gold transition-all"
                              style={{ minHeight: '44px' }}
                            />
                            <button
                              onClick={handleApplyCredit}
                              disabled={isApplyingCredit || !creditCode}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              style={{ minHeight: '44px', minWidth: '100px' }}
                            >
                              {isApplyingCredit ? t('cart_credit_applying') : t('cart_credit_apply')}
                            </button>
                          </div>
                          <p className="mt-3 text-[11px] text-white/35">
                            {t('cart_stripe_secure')}
                          </p>
                        </>
                      ) : (
                        <div className="credit-applied">
                          <div className="credit-applied-title">{t('cart_credit_applied')}</div>
                          <div className="credit-applied-details">
                            <div>{t('cart_credit_code_label')} {creditApplied.code}</div>
                            <div>{t('cart_credit_applied_label')} ${(creditApplied.applied_cents / 100).toFixed(2)}</div>
                            <div>{t('cart_credit_remaining_label')} ${(creditApplied.remaining_after_cents / 100).toFixed(2)}</div>
                          </div>
                          <button
                            onClick={() => {
                              setCreditApplied(null);
                              setCreditCode('');
                              setIsCreditOpen(false);
                            }}
                            style={{
                              marginTop: '12px',
                              padding: '8px 16px',
                              background: 'transparent',
                              color: 'rgba(255,255,255,0.6)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {t('cart_credit_remove')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                   <button
                    onClick={clearCart}
                    className="flex-1 text-white/20 hover:text-red-400 py-3 text-[9px] uppercase tracking-widest font-semibold transition-colors"
                  >
                    {t('cart_clear')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
