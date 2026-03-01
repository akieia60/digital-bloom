import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link to="/shop" className="landing-nav__link">Shop</Link>
          <Link to="/credits" className="landing-nav__link">Credits</Link>
          <Link to="/vault" className="landing-nav__link">Vault</Link>
        </div>

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
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Shop</Link>
              <Link to="/credits" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Credits</Link>
              <Link to="/credits/balance" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Balance</Link>
              <Link to="/vault" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">Prompt Vault</Link>
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
