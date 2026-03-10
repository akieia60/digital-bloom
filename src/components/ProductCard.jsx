import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getTierByNumber } from '../config/pricingTiers';

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
        {/* Video Container — Apple-style rounded with subtle shadow */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white/[0.04] border border-white/[0.06] transition-all duration-700 group-hover:shadow-xl group-hover:shadow-[#D4AF37]/10 group-hover:border-[#D4AF37]/30">
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
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="px-8 py-3 bg-[#D4AF37]/90 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-[0.2em] font-medium text-[#0A0A0A] shadow-lg transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#0A0A0A]">
              View Experience
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs font-semibold text-[#D4AF37] tracking-wide">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {/* Tier Badge */}
          {tierInfo && (
            <div className="absolute top-6 left-6 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold">
                Tier {tierInfo.tier}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-5 px-1 text-center sm:text-left transition-all duration-500">
          <h3 className="text-base font-medium text-white group-hover:text-[#D4AF37] transition-colors duration-300 tracking-tight">
            {product.name}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 mt-2 font-medium">
            {tierInfo ? tierInfo.tagline : (product.category || 'Digital Experience')}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
