import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getTierByNumber } from '../config/pricingTiers';

/**
 * ProductCard — Digital Bloom
 * Price is always read from product.price (database value).
 * Tier badge is derived from product.tier via the pricingTiers config.
 * No prices are hardcoded here.
 */
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tierInfo = product.tier ? getTierByNumber(product.tier) : null;

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        {/* Cinematic Preview Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] glass border border-white/5 transition-all duration-1000 group-hover:border-pure-gold/40 group-hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
          <div className="w-full h-full transition-transform duration-1000 group-hover:scale-110">
            <VideoPlayer
              videoUrl={product.video_file_url || product.video_url}
              posterUrl={product.image_url}
              alt={product.name}
            />
          </div>

          {/* Subtle Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>

          {/* Hover-Reveal Bespoke Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="px-10 py-4 glass border border-white/20 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold text-white group-hover:bg-pure-gold group-hover:text-black group-hover:border-pure-gold transition-all duration-500 shadow-2xl">
              Personalize Art
            </div>
          </div>

          {/* Price Badge — reads from product.price (database), never hardcoded */}
          <div className="absolute top-8 right-8 px-5 py-2 glass border border-white/10 rounded-full transition-transform duration-700 group-hover:-translate-x-2">
            <span className="text-xs font-bold text-pure-gold tracking-wider">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {/* Tier Badge — shown if product has a tier */}
          {tierInfo && (
            <div className="absolute top-8 left-8 px-3 py-1 glass border border-white/10 rounded-full">
              <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold">
                Tier {tierInfo.tier}
              </span>
            </div>
          )}
        </div>

        {/* Narrative Info */}
        <div className="mt-8 px-4 text-center sm:text-left transition-all duration-700 group-hover:translate-x-1">
          <h3 className="text-xl font-medium font-display tracking-tight text-white group-hover:text-pure-gold transition-colors duration-500">
            {product.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3 font-medium flex items-center justify-center sm:justify-start">
            <span className="w-1 h-1 rounded-full bg-pure-gold/40 mr-3"></span>
            {tierInfo ? tierInfo.tagline : (product.category || 'Limited Masterpiece')}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
