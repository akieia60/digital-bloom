import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const ProductCard = ({ product, compact = false }) => {
  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-[var(--surface-soft,#F7F7F7)] border border-[#E5E5EA] transition-all duration-500 group-hover:shadow-xl group-hover:border-[var(--spec-gold,#C9A14A)]/30 ${compact ? 'rounded-xl aspect-square' : 'rounded-2xl aspect-[3/4]'}`}>
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
            <VideoPlayer
              videoUrl={product.video_file_url || product.video_url}
              posterUrl={product.image_url}
              alt={product.name}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-500" />

          {/* CTA on hover */}
          {!compact && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
              <div className="px-7 py-3 bg-[var(--spec-gold,#C9A14A)] rounded-full text-[12px] uppercase tracking-[0.12em] font-bold text-white shadow-lg">
                Customize
              </div>
            </div>
          )}
        </div>

        {/* Product Info — White card surface */}
        <div className={`bg-[var(--surface-white,#FFFFFF)] rounded-xl border border-[#F0F0F0] ${compact ? 'p-3 mt-2' : 'p-4 mt-3'}`}>
          <h3 className={`font-semibold text-[#1D1D1F] group-hover:text-[var(--spec-gold,#C9A14A)] transition-colors duration-300 tracking-tight truncate ${compact ? 'text-xs' : 'text-[15px]'}`}>
            {product.name}
          </h3>
          {!compact && (
            <>
              <p className="text-[13px] text-[#6E6E73] mt-1.5 line-clamp-1 font-light">
                {product.description || product.category || 'Digital Experience'}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
                <span className="text-base font-bold text-[var(--spec-gold,#C9A14A)]">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className="text-[11px] uppercase tracking-[0.1em] text-[#AEAEB2] font-semibold">
                  Customize →
                </span>
              </div>
            </>
          )}
          {compact && (
            <span className="text-xs font-bold text-[var(--spec-gold,#C9A14A)] mt-1 block">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
