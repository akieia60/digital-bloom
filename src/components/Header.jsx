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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 bg-white/80 backdrop-blur-xl border-b border-[#D2D2D7]/50' : 'py-6 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center h-12 relative">
          
          {/* Left: Hamburger Menu (Mobile) + Search (Desktop) */}
          <div className="flex-1 flex items-center">
            {/* Hamburger Button - Mobile Only */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-[#1D1D1F]/60 hover:text-[#1D1D1F] transition-colors"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Search */}
            <div className="hidden md:flex relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 focus:w-64 px-4 py-2 bg-[#F5F5F7] border-none rounded-lg text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-500 font-light"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E73]/40"
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
              <span className={`font-medium font-display uppercase text-[#1D1D1F] transition-all duration-700 ease-in-out ${
                isScrolled 
                  ? 'text-lg sm:text-xl tracking-[0.15em]' 
                  : 'text-xl sm:text-2xl md:text-3xl tracking-[0.2em]'
              }`}>
                Digital Bloom
              </span>
              <span className={`text-[9px] tracking-[0.3em] uppercase text-[#6E6E73] font-light transition-all duration-700 ${
                isScrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}>
                Luxury Motion Art
              </span>
            </Link>
          </div>

          {/* Right: Desktop Nav + Cart */}
          <div className="flex-1 flex justify-end items-center space-x-4 sm:space-x-8">
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/shop" className="text-[12px] uppercase tracking-[0.12em] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium">Shop</Link>
              <Link to="/credits" className="text-[12px] uppercase tracking-[0.12em] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium">Credits</Link>
            </nav>
            <button
              onClick={toggleCart}
              className="relative p-2 group"
              aria-label="Shopping cart"
            >
              <svg
                className="h-5 w-5 text-[#1D1D1F]/70 group-hover:text-[#1D1D1F] transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
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
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white border-r border-[#D2D2D7]/30 flex flex-col animate-slide-in shadow-2xl">
            {/* Menu Header */}
            <div className="p-6 border-b border-[#D2D2D7]/30">
              <div className="flex items-center justify-between">
                <span className="text-xl font-display uppercase text-[#1D1D1F] tracking-wider">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-6 border-b border-[#D2D2D7]/30">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-lg text-base text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-6 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base text-[#1D1D1F] hover:text-[#D4AF37] transition-colors py-4 border-b border-[#D2D2D7]/20"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base text-[#1D1D1F] hover:text-[#D4AF37] transition-colors py-4 border-b border-[#D2D2D7]/20"
              >
                Shop
              </Link>
              <Link
                to="/credits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base text-[#1D1D1F] hover:text-[#D4AF37] transition-colors py-4 border-b border-[#D2D2D7]/20"
              >
                Experience Credits
              </Link>
            </nav>

            {/* Menu Footer */}
            <div className="p-6 border-t border-[#D2D2D7]/30">
              <p className="text-xs text-[#6E6E73] uppercase tracking-wider">Digital Bloom</p>
              <p className="text-[10px] text-[#6E6E73]/60 mt-1">Luxury Motion Art</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
