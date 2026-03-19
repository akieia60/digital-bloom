import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ onSearchChange, searchQuery }) => {
  const { getCartCount, toggleCart } = useCart();
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
          
          {/* Left: Desktop Search only */}
          <div className="flex-1 flex items-center">
            {/* Desktop Search */}
            <div className="hidden md:flex relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 focus:w-64 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold-border-hover)] transition-all duration-500 font-light"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Center: Brand */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700">
            <Link to="/" className="flex flex-col items-center group" onClick={() => setIsMobileMenuOpen(false)}>
              <span className={`font-medium font-display uppercase text-[var(--text-primary)] transition-all duration-700 ease-in-out ${
                isScrolled 
                  ? 'text-lg sm:text-xl tracking-[0.15em]' 
                  : 'text-xl sm:text-2xl md:text-3xl tracking-[0.2em]'
              }`}>
                Digital Bloom
              </span>
              <span className={`text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)] font-light transition-all duration-700 ${
                isScrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}>
                Luxury Motion Art
              </span>
            </Link>
          </div>

          {/* Right: Desktop Nav + Cart + Hamburger */}
          <div className="flex-1 flex justify-end items-center space-x-4 sm:space-x-8">
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/shop" className="text-[12px] uppercase tracking-[0.12em] text-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-colors font-medium">Occasions</Link>
              <Link to="/shop" className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium">Shop</Link>
              <Link to="/credits" className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium">Credits</Link>
            </nav>
            <button
              onClick={toggleCart}
              className="relative p-2 group"
              aria-label="Shopping cart"
            >
              <svg
                className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--accent-gold)] text-[var(--bg-page)] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Hamburger Button - Mobile Only (RIGHT side) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel — slides from RIGHT, lighter background */}
          <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm flex flex-col animate-slide-in-right shadow-2xl" style={{ background: '#1a2744', borderLeft: '1px solid rgba(212,175,55,0.2)' }}>
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
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', placeholder: 'rgba(255,255,255,0.4)' }}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-6 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg transition-colors py-5"
                style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg transition-colors py-5"
                style={{ color: '#D4AF37', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                Occasions
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg transition-colors py-5"
                style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                Shop
              </Link>
              <Link
                to="/credits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg transition-colors py-5"
                style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                Experience Credits
              </Link>
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}
                className="w-full flex items-center justify-between text-lg transition-colors py-5"
                style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center" style={{ background: '#D4AF37', color: '#1a2744' }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Menu Footer */}
            <div className="p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#D4AF37' }}>Digital Bloom</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Cinematic Digital Experiences</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
