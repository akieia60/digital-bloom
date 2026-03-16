import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}
    >
      <div className="landing-nav__inner">
        {/* Logo */}
        <Link to="/" className="landing-nav__logo">
          Digital Bloom
        </Link>

        {/* Desktop Links */}
        <div className="landing-nav__links">
          <Link to="/shop" className="landing-nav__link landing-nav__link--accent">Occasions</Link>
          <Link to="/shop" className="landing-nav__link">Shop</Link>
          <Link to="/credits" className="landing-nav__link">Credits</Link>
        </div>

        {/* Cart Icon */}
        <button
          onClick={toggleCart}
          className="landing-nav__cart-btn"
          aria-label="Shopping cart"
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: '8px' }}
        >
          <svg style={{ width: '22px', height: '22px', color: 'rgba(255,255,255,0.7)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '2px', right: '0', background: '#D4AF37', color: '#050510', fontSize: '9px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Hamburger Button */}
        <button
          className="landing-nav__hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="landing-nav__mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="landing-nav__mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="landing-nav__mobile-header">
              <span className="landing-nav__mobile-brand">Digital Bloom</span>
              <button
                className="landing-nav__mobile-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="landing-nav__mobile-links">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link landing-nav__mobile-link--accent">Occasions</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Shop</Link>
              <Link to="/credits" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Credits</Link>
              <Link to="/credits/balance" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Balance</Link>
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}
                className="landing-nav__mobile-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: 'inherit', color: 'inherit', padding: '0' }}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span style={{ background: '#D4AF37', color: '#050510', fontSize: '11px', fontWeight: 'bold', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            <div className="landing-nav__mobile-footer">
              <p>Digital Bloom</p>
              <p className="landing-nav__mobile-sub">Cinematic Digital Experiences</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
