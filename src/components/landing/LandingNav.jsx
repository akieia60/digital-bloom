import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '../../contexts/LanguageContext';
import BloomLogoMark from '../BloomLogoMark';

export default function LandingNav({ onOpenFaq }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const { lang, changeLanguage, t } = useLanguage();
  const cartCount = getCartCount();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === lang) || AVAILABLE_LANGUAGES[0];

  return (
    <nav className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}>
      <div className="landing-nav__inner">
        {/* Hamburger Button — mobile left side */}
        <button
          className="landing-nav__hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`landing-nav__hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>

        {/* Logo */}
        <Link to="/" className="landing-nav__logo">
          <BloomLogoMark size={38} showText={true} animate={true} />
        </Link>

        {/* Desktop Links */}
        <div className="landing-nav__links">
          <Link to="/shop" className="landing-nav__link landing-nav__link--accent">{t('nav_occasions')}</Link>
          <Link to="/shop" className="landing-nav__link">{t('nav_shop')}</Link>
          <Link to="/shop?create=true" className="landing-nav__link">{t('nav_create')}</Link>
          <Link to="/credits" className="landing-nav__link">{t('nav_pricing')}</Link>
        </div>

        {/* Right side: Language Switcher + Send a Bloom CTA */}
        <div className="landing-nav__right">
          {/* Language Switcher — always visible */}
          <div className="lang-switcher" ref={langRef}>
            <button
              className="lang-switcher__btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Change language"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{currentLang.short}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isLangOpen && (
              <div className="lang-switcher__dropdown">
                {AVAILABLE_LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`lang-switcher__option ${lang === l.code ? 'lang-switcher__option--active' : ''}`}
                    onClick={() => { changeLanguage(l.code); setIsLangOpen(false); }}
                  >
                    <span className="lang-switcher__option-label">{l.label}</span>
                    {lang === l.code && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart icon — visible when items in cart */}
          {cartCount > 0 && (
            <button
              onClick={toggleCart}
              className="landing-nav__cart-btn"
              aria-label="Shopping cart"
            >
              <svg style={{ width: '22px', height: '22px', color: 'rgba(255,255,255,0.95)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span style={{ position: 'absolute', top: '2px', right: '2px', background: '#D4AF37', color: '#050510', fontSize: '10px', fontWeight: '800', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            </button>
          )}

          {/* Send a Bloom CTA */}
          <Link to="/shop" className="landing-nav__cta">
            {t('nav_send_bloom')}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="landing-nav__mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="landing-nav__mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="landing-nav__mobile-header">
              <span className="landing-nav__mobile-brand">{t('nav_brand')}</span>
              <button className="landing-nav__mobile-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="landing-nav__mobile-links">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">{t('nav_home')}</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link landing-nav__mobile-link--accent">{t('nav_occasions')}</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">{t('nav_shop')}</Link>
              <Link to="/credits" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">{t('nav_credits')}</Link>
              <Link to="/credits/balance" onClick={() => setIsMobileMenuOpen(false)} className="landing-nav__mobile-link">{t('nav_balance')}</Link>
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}
                className="landing-nav__mobile-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: 'inherit', color: 'inherit', padding: '0' }}
              >
                <span>{t('nav_cart')}</span>
                {cartCount > 0 && (
                  <span style={{ background: '#D4AF37', color: '#050510', fontSize: '11px', fontWeight: 'bold', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </span>
                )}
              </button>
              {onOpenFaq && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenFaq(); }}
                  className="landing-nav__mobile-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: 'inherit', color: 'inherit', padding: '0' }}
                >
                  <span>{t('nav_faq') || 'FAQ'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </button>
              )}
            </div>
            <div className="landing-nav__mobile-footer">
              <p>{t('nav_brand')}</p>
              <p className="landing-nav__mobile-sub">{t('nav_brand_tagline')}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
