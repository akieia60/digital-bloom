import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ onSearchChange, searchQuery }) => {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-700 ${isScrolled ? 'py-4 glass border-b border-white/10' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center h-16 relative">
          
          {/* Left: Minimal Search */}
          <div className="flex-1 hidden md:flex items-center">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Bespoke Art..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 focus:w-64 px-0 py-2 bg-transparent border-b border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pure-gold transition-all duration-500 font-light"
              />
              <svg
                className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-pure-gold transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Center: Hero Logo Branding */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000">
            <Link to="/" className="flex flex-col items-center group">
              <span className={`font-medium font-display uppercase gradient-text transition-all duration-1000 ease-in-out ${
                isScrolled 
                  ? 'text-xl sm:text-2xl tracking-[0.2em]' 
                  : 'text-3xl sm:text-4xl tracking-[0.4em]'
              }`}>
                Digital Bloom
              </span>
              <span className={`text-[9px] tracking-[0.5em] uppercase text-white/40 font-light transition-all duration-1000 ${
                isScrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}>
                Luxury Motion Art™
              </span>
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex justify-end items-center space-x-8">
            <nav className="hidden lg:flex items-center space-x-10">
              <Link to="/" className="text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors">Bespoke</Link>
              <Link to="/gallery" className="text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors">Collections</Link>
            </nav>
            <button
              onClick={toggleCart}
              className="relative p-2 group"
              aria-label="Shopping cart"
            >
              <svg
                className="h-6 w-6 text-white/80 group-hover:text-pure-gold transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pure-gold text-black text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
