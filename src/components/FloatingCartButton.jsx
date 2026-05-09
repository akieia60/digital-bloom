import { useCart } from '../context/CartContext';

// Always-visible cart pill so the cart is reachable from any route — Gamble
// 2026-05-05: "you can't get to the cart because it sits so high up... you have
// to go to the homepage in order to get to the cart." LandingNav only renders
// on `/`, so anywhere else the user had no path to the cart drawer. This pill
// lives at the bottom-right with safe-area-inset padding so it clears iOS home
// indicators and stays tappable on every page.
export default function FloatingCartButton() {
  const { getCartCount, toggleCart, isCartOpen } = useCart();
  const cartCount = getCartCount();

  if (cartCount === 0 || isCartOpen) return null;

  return (
    <button
      type="button"
      className="db-floating-cart"
      onClick={toggleCart}
      aria-label={`Open cart (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
      style={{
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 18px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 22px)',
        zIndex: 1500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 20px 14px 18px',
        minHeight: '56px',
        borderRadius: '999px',
        background: '#D4AF37',
        color: '#0D1B36',
        border: 'none',
        boxShadow: '0 14px 32px rgba(0, 0, 0, 0.42), 0 4px 12px rgba(0, 0, 0, 0.28)',
        fontFamily: "'Outfit', -apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>Cart</span>
      <span
        aria-hidden="true"
        style={{
          minWidth: '24px',
          height: '24px',
          padding: '0 7px',
          borderRadius: '999px',
          background: '#0D1B36',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {cartCount}
      </span>
    </button>
  );
}
