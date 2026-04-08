import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import CartItem from './CartItem';
import '../styles/credits.css';

const ShoppingCart = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, isCartOpen, toggleCart, getCartTotal, clearCart, setIsCartOpen } = useCart();
  const [error, setError] = useState(null);
  const total = getCartTotal();
  const totalCents = Math.round(total * 100);
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

              <div className="cart-summary-bar">
                <div>
                  <p className="cart-summary-bar__label">Total</p>
                  <p className="cart-summary-bar__amount">
                    {formatCurrency(totalCents)}
                  </p>
                </div>
                <div className="cart-summary-bar__secure">
                  <span aria-hidden="true">🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  disabled={cartItems.length === 0}
                  className="mx-auto flex min-h-[46px] items-center justify-center gap-3 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] px-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-gold)] transition-all hover:bg-[rgba(212,175,55,0.14)]"
                >
                  <span>{`${t('cart_checkout')} · ${formatCurrency(totalCents)}`}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <div className="cart-footer-actions cart-footer-actions--minimal">
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="cart-footer-actions__continue"
                  >
                    {t('product_continue')}
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
