import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ onSearchChange, searchQuery }) => {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="glass sticky top-0 z-50 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 relative">
          {/* Left: Search (Desktop) */}
          <div className="flex-1 hidden md:block">
            <div className="relative max-w-xs group">
              <input
                type="text"
                placeholder="Search luxury flowers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 pr-4 rounded-full bg-white/5 border border-gold/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all hover:bg-white/10"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/60 group-focus-within:text-gold transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Center: Logo & Brand */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center">
            <Link to="/" className="flex items-center space-x-4 group pr-6"> {/* Added padding-right to offset the icon on the left for visual centering */}
              <img
                src="/logo-large.png"
                alt="Digital Bloom Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] transition-all duration-300 group-hover:scale-110"
              />
              <span className="text-xl sm:text-2xl font-bold font-cormorant gradient-text tracking-[0.2em] uppercase whitespace-nowrap">
                Digital Bloom™
              </span>
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleCart}
              className="relative p-3 rounded-full hover:bg-gold/10 transition-all group"
              aria-label="Shopping cart"
            >
              <svg
                className="h-7 w-7 text-gold group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-red to-rose-pink text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search luxury flowers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full bg-white/5 border border-gold/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gold/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
