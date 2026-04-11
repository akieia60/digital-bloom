import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '../contexts/LanguageContext';

const Header = ({ onSearchChange, searchQuery, onOpenFaq }) => {
  const { getCartCount, toggleCart } = useCart();
  const { lang, changeLanguage, t } = useLanguage();
  const cartCount = getCartCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 bg-[var(--nav-bg-scrolled)] backdrop-blur-xl border-b border-[var(--nav-border-scrolled)]' : 'py-6 bg-[var(--nav-bg)]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center h-12 relative">
          
          {/* Left: Hamburger menu button — visible on ALL screen sizes */}
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              to="/"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white/82 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('nav_home')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10.5L12 3l9 7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.25 9.75V21h13.5V9.75" />
              </svg>
            </Link>
          </div>

          {/* Center: Brand */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700">
            <Link to="/" className="flex flex-col items-center group" onClick={() => setIsMobileMenuOpen(false)}>
              <span className={`font-medium font-display uppercase text-white transition-all duration-700 ease-in-out ${
                isScrolled
                  ? 'text-lg sm:text-xl tracking-[0.15em]'
                  : 'text-xl sm:text-2xl md:text-3xl tracking-[0.2em]'
              }`}>
                {t('header_brand')}
              </span>
              <span className={`text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)] font-light transition-all duration-700 ${
                isScrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}>
                {t('header_tagline')}
              </span>
            </Link>
          </div>

          {/* Right: Cart + SEND A BLOOM */}
          <div className="flex-1 flex justify-end items-center space-x-3 sm:space-x-5 ml-4">
            <button
              onClick={toggleCart}
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 group transition-colors hover:bg-white/10"
              aria-label="Shopping cart"
            >
              <svg
                className="h-[26px] w-[26px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[rgba(11,31,58,0.28)] bg-[var(--accent-gold)] text-[12px] font-extrabold text-[var(--bg-page)] shadow-[0_4px_12px_rgba(0,0,0,0.22)]">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              to="/shop"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[var(--accent-gold)] text-[var(--bg-page)] text-[11px] uppercase tracking-[0.15em] font-bold rounded-full hover:bg-[var(--accent-gold-hover)] transition-all shadow-lg"
            >
              {t('nav_send_bloom')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel — slides from RIGHT, lighter background */}
          <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm flex flex-col animate-slide-in-right shadow-2xl bg-[#090b10] z-[100] border-l border-[rgba(212,175,55,0.2)]">
            {/* Menu Header */}
              <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xl font-display uppercase tracking-wider" style={{ color: '#D4AF37' }}>Digital Bloom</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header_search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', placeholder: 'rgba(255,255,255,0.4)' }}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-4 overflow-y-auto space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl bg-white/8 px-4 py-5 text-lg text-white transition-colors"
              >
                {t('nav_home')}
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl bg-[rgba(212,175,55,0.12)] px-4 py-5 text-lg text-[var(--accent-gold)] transition-colors"
              >
                {t('nav_occasions')}
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl bg-white/8 px-4 py-5 text-lg text-white transition-colors"
              >
                {t('nav_shop')}
              </Link>
              <Link
                to="/credits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl bg-white/8 px-4 py-5 text-lg text-white transition-colors"
              >
                {t('nav_credits')}
              </Link>
              {/* Language Selector */}
              <div className="rounded-2xl bg-white/6 px-4 py-5">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">{t('header_select_language')}</div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { changeLanguage(l.code); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        lang === l.code
                          ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[rgba(212,175,55,0.1)]'
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}
                className="w-full rounded-2xl bg-white/8 px-4 py-5 flex items-center justify-between text-lg text-white transition-colors"
              >
                <span>{t('nav_cart')}</span>
                {cartCount > 0 && (
                  <span className="text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center" style={{ background: '#D4AF37', color: '#1a2744' }}>
                    {cartCount}
                  </span>
                )}
              </button>
              {onOpenFaq && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenFaq(); }}
                  className="w-full rounded-2xl bg-white/8 px-4 py-5 flex items-center justify-between text-lg text-white transition-colors"
                >
                  <span>{t('nav_faq') || 'FAQ'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </button>
              )}
            </nav>

            {/* Menu Footer */}
            <div className="p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#D4AF37' }}>{t('header_brand')}</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('header_tagline')}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
