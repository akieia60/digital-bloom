import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getTierByNumber } from '../config/pricingTiers';

const ProductCard = ({ product, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tierInfo = product.tier ? getTierByNumber(product.tier) : null;

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        {/* Video Container — Apple-style rounded with subtle shadow */}
        <div className={`relative aspect-[3/4] overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-all duration-700 group-hover:shadow-xl group-hover:shadow-[var(--accent-gold-border)] group-hover:border-[var(--accent-gold-border-hover)] ${compact ? 'rounded-xl' : 'rounded-3xl'}`}>
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
            <VideoPlayer
              videoUrl={product.video_file_url || product.video_url}
              posterUrl={product.image_url}
              alt={product.name}
            />
          </div>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

          {/* Hover button */}
          {!compact && (
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <div className="px-8 py-3 bg-[var(--accent-gold)]/90 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-[0.2em] font-medium text-[var(--bg-page)] shadow-lg transition-all duration-300 group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--bg-page)]">
                View Experience
              </div>
            </div>
          )}

          {/* Price Badge */}
          <div className={`absolute bg-black/70 backdrop-blur-sm rounded-full border border-[var(--border-default)] ${compact ? 'bottom-2 right-2 px-2 py-0.5' : 'top-6 right-6 px-4 py-1.5'}`}>
            <span className={`font-semibold text-[var(--accent-gold)] tracking-wide ${compact ? 'text-[10px]' : 'text-xs'}`}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {/* Tier Badge — hidden in compact mode to avoid clutter */}
          {tierInfo && !compact && (
            <div className="absolute top-6 left-6 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-[var(--border-default)]">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Tier {tierInfo.tier}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`px-1 text-center sm:text-left transition-all duration-500 ${compact ? 'mt-2' : 'mt-5'}`}>
          <h3 className={`font-medium text-white group-hover:text-[var(--accent-gold)] transition-colors duration-300 tracking-tight truncate ${compact ? 'text-xs' : 'text-base'}`}>
            {product.name}
          </h3>
          {!compact && (
            <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mt-2 font-medium">
              {tierInfo ? tierInfo.tagline : (product.category || 'Digital Experience')}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
