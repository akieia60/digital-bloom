import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import CartItem from './CartItem';
import { createCartCheckoutSession, redirectToCheckout, startCartCheckoutRedirect } from '../lib/stripe';
import { getCreditBalance, validateCreditCode, reserveCredit } from '../lib/creditStripe';
import '../styles/credits.css';

const ShoppingCart = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, isCartOpen, toggleCart, getCartTotal, clearCart, setIsCartOpen } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [creditCode, setCreditCode] = useState('');
  const [creditApplied, setCreditApplied] = useState(null);
  const [isApplyingCredit, setIsApplyingCredit] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [knownCredit, setKnownCredit] = useState(null);
  const [isCheckingKnownCredit, setIsCheckingKnownCredit] = useState(false);
  const total = getCartTotal();
  const totalCents = Math.round(total * 100);
  const remainingDue = creditApplied ? Math.max(0, totalCents - creditApplied.applied_cents) : totalCents;
  const appliedAmountCents = creditApplied?.applied_cents || 0;
  const formatCurrency = (cents) => `$${(cents / 100).toFixed(2)}`;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkoutError = params.get('checkout_error');
    const shouldOpenCart = params.get('cart') === 'open';

    if (!checkoutError) return;

    setError(checkoutError);
    if (shouldOpenCart) {
      setIsCartOpen(true);
    }

    params.delete('checkout_error');
    params.delete('cart');
    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
  }, [location.pathname, location.search, navigate, setIsCartOpen]);

  useEffect(() => {
    if (!isCartOpen || creditApplied || typeof window === 'undefined') return;

    const savedCode = window.localStorage.getItem('dbloom_credit_code');
    if (!savedCode) {
      setKnownCredit(null);
      return;
    }

    let isCancelled = false;
    setIsCheckingKnownCredit(true);

    getCreditBalance(savedCode)
      .then((balance) => {
        if (isCancelled) return;

        if (balance?.remaining_amount_cents > 0) {
          setKnownCredit({
            code: savedCode,
            remaining_amount_cents: balance.remaining_amount_cents,
          });
        } else {
          setKnownCredit(null);
          window.localStorage.removeItem('dbloom_credit_code');
        }
      })
      .catch(() => {
        if (isCancelled) return;
        setKnownCredit(null);
        window.localStorage.removeItem('dbloom_credit_code');
      })
      .finally(() => {
        if (!isCancelled) {
          setIsCheckingKnownCredit(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [creditApplied, isCartOpen]);

  const reserveAndApplyCredit = async (formattedCode, { skipValidation = false } = {}) => {
    if (!skipValidation) {
      const validation = await validateCreditCode(formattedCode);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid credit code');
      }
    }

    const reservation = await reserveCredit(formattedCode, totalCents);

    setCreditApplied({
      code: formattedCode,
      reservation_id: reservation.reservation_id,
      applied_cents: reservation.applied_cents,
      remaining_after_cents: reservation.remaining_after_cents,
    });
    setKnownCredit({
      code: formattedCode,
      remaining_amount_cents: reservation.remaining_after_cents,
    });
    setIsCreditOpen(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dbloom_credit_code', formattedCode);
    }
  };

  const handleApplyCredit = async () => {
    setError(null);

    const formatted = creditCode.toUpperCase().trim();
    if (!/^DBLOOM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formatted)) {
      setError(t('cart_error_credit_format'));
      return;
    }

    setIsApplyingCredit(true);

    try {
      await reserveAndApplyCredit(formatted);
    } catch (err) {
      setError(err.message || 'Failed to apply credit');
    } finally {
      setIsApplyingCredit(false);
    }
  };

  const handleApplyKnownCredit = async () => {
    if (!knownCredit?.code) return;

    setError(null);
    setIsApplyingCredit(true);

    try {
      await reserveAndApplyCredit(knownCredit.code, { skipValidation: true });
    } catch (err) {
      setError(err.message || 'Failed to apply credit');
    } finally {
      setIsApplyingCredit(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    const formattedItems = cartItems.map(item => ({
      product: item,
      quantity: item.quantity
    }));

    try {
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
      const message = err.message || 'Failed to proceed to checkout. Please try again.';
      if (typeof window !== 'undefined') {
        startCartCheckoutRedirect(formattedItems, creditApplied ? {
          reservation_id: creditApplied.reservation_id,
          remaining_due_cents: remainingDue
        } : null);
        return;
      }

      setError(message);
    }

    setIsProcessing(false);
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

              {!creditApplied && !knownCredit && !isCheckingKnownCredit && (
                <div className="cart-credits-nudge">
                  <span>Have Bloom Credits? They apply at checkout.</span>{' '}
                  <Link to="/credits" onClick={() => setIsCartOpen(false)}>
                    &rarr;
                  </Link>
                </div>
              )}

              <div className="cart-credits-wallet">
                {!creditApplied && !knownCredit && !isCheckingKnownCredit && (
                  <>
                    <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
                    <div className="cart-credits-wallet__heading-row">
                      <div>
                        <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                        <p className="cart-credits-wallet__copy">Buy credits and use them on any order</p>
                      </div>
                      <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
                    </div>
                    <Link
                      to="/credits"
                      onClick={() => setIsCartOpen(false)}
                      className="cart-credits-wallet__browse"
                    >
                      Browse Credits &rarr;
                    </Link>
                  </>
                )}

                {!creditApplied && isCheckingKnownCredit && (
                  <>
                    <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
                    <div className="cart-credits-wallet__heading-row">
                      <div>
                        <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                        <p className="cart-credits-wallet__copy">Checking your saved balance...</p>
                      </div>
                      <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
                    </div>
                  </>
                )}

                {!creditApplied && knownCredit?.remaining_amount_cents > 0 && (
                  <>
                    <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
                    <div className="cart-credits-wallet__heading-row">
                      <div>
                        <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                        <p className="cart-credits-wallet__balance">
                          Available balance: {formatCurrency(knownCredit.remaining_amount_cents)}
                        </p>
                      </div>
                      <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyKnownCredit}
                      disabled={isApplyingCredit}
                      className="cart-credits-wallet__apply"
                    >
                      {isApplyingCredit
                        ? t('cart_credit_applying')
                        : `Apply ${formatCurrency(Math.min(knownCredit.remaining_amount_cents, totalCents))} to this order`}
                    </button>
                  </>
                )}

                {creditApplied && (
                  <div className="cart-credits-wallet__applied">
                    <div className="cart-credits-wallet__status">
                      <span className="cart-credits-wallet__status-icon" aria-hidden="true">✓</span>
                      <div>
                        <div className="cart-credits-wallet__status-title">
                          {formatCurrency(creditApplied.applied_cents)} Bloom Credit applied
                        </div>
                        <div className="cart-credits-wallet__status-copy">
                          Remaining balance: {formatCurrency(creditApplied.remaining_after_cents)}
                        </div>
                      </div>
                    </div>
                    <div className="cart-credits-wallet__status-footer">
                      <span>New total: {formatCurrency(remainingDue)}</span>
                      <button
                        type="button"
                        className="cart-credits-wallet__remove"
                        onClick={() => {
                          setCreditApplied(null);
                          setCreditCode('');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {!creditApplied && (
                  <div className="cart-credits-wallet__entry">
                    <button
                      type="button"
                      onClick={() => setIsCreditOpen((open) => !open)}
                      className="cart-credits-wallet__entry-toggle"
                    >
                      {isCreditOpen ? 'Hide credit code' : 'Enter a credit code'}
                    </button>

                    {isCreditOpen && (
                      <div className="cart-credits-wallet__entry-panel">
                        <div className="credit-input-group cart-credit-input-group">
                          <input
                            type="text"
                            placeholder={t('cart_credit_placeholder')}
                            maxLength="17"
                            value={creditCode}
                            onChange={(e) => setCreditCode(e.target.value.toUpperCase())}
                          />
                          <button
                            onClick={handleApplyCredit}
                            disabled={isApplyingCredit || !creditCode}
                          >
                            {isApplyingCredit ? t('cart_credit_applying') : t('cart_credit_apply')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="cart-summary-bar">
                <div>
                  <p className="cart-summary-bar__label">Total</p>
                  <p className="cart-summary-bar__amount">
                    {formatCurrency(remainingDue)}
                  </p>
                  {creditApplied && (
                    <p className="cart-summary-bar__meta">
                      Original: {formatCurrency(totalCents)} - Credit: {formatCurrency(appliedAmountCents)}
                    </p>
                  )}
                </div>
                <div className="cart-summary-bar__secure">
                  <span aria-hidden="true">🔒</span>
                  <span>Secure checkout</span>
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
                      <span>{`${t('cart_checkout')} · ${formatCurrency(remainingDue)}`}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="cart-footer-actions">
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="cart-footer-actions__continue"
                  >
                    {t('product_continue')}
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsCartOpen(false)}
                    className="cart-footer-actions__home"
                  >
                    {t('nav_home')}
                  </Link>
                  <button
                    onClick={clearCart}
                    className="cart-footer-actions__clear"
                  >
                    Clear cart
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
