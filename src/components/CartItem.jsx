import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  };

  return (
    <div className="flex items-start space-x-6 py-8 border-b border-white/5 last:border-0 group animate-fade-in">
      {/* Visual Asset Preview */}
      <Link to={`/product/${item.id}`} className="w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden glass border border-white/5 relative block">
        {item.video_file_url || item.video_url ? (
          <video
            src={item.video_file_url || item.video_url}
            className="w-full h-full object-cover"
            poster={item.image_url || item.image}
            preload="auto"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </Link>

      {/* Item Narrative */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${item.id}`} className="text-sm font-medium text-white font-display tracking-tight truncate pr-4 hover:text-[var(--accent-gold)] transition-colors">
            {item.name}
          </Link>
          <p className="text-sm font-light text-white/50">${parseFloat(item.price).toFixed(2)}</p>
        </div>

        {/* Bespoke Details (if any) */}
        {item.customization ? (
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-2">
               <span className="text-[9px] uppercase tracking-widest text-pure-gold font-bold">Bespoke</span>
            </div>
            {/* Handle both string (legacy) and object (new) message formats */}
            {item.customization.message && (
              <p className="text-[11px] text-white/40 font-light italic line-clamp-2">
                "{typeof item.customization.message === 'string'
                  ? item.customization.message
                  : item.customization.message.short || ''}"
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Show To/From if present (new format) */}
              {(item.customization.message?.toName || item.customization.message?.fromName) && (
                <span className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {item.customization.message.toName && `To: ${item.customization.message.toName}`}
                  {item.customization.message.toName && item.customization.message.fromName && ' · '}
                  {item.customization.message.fromName && `From: ${item.customization.message.fromName}`}
                </span>
              )}
              {/* Show colorTheme (new) or legacy music/theme */}
              {(item.customization.colorTheme || item.customization.theme || item.customization.music) && (
                <span className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {item.customization.colorTheme || item.customization.theme || item.customization.music}
                </span>
              )}
              {/* Show active overlays from composition manifest */}
              {item.customization.composition?.activeOverlays?.map(overlay => (
                <span key={overlay} className="text-[8px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">
                  {overlay === 'balloon' ? '🎈' : overlay === 'ribbon' ? '🎀' : overlay === 'sparkle' ? '✨' : ''} {overlay}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6 font-light">Gallery Piece</p>
        )}

        {/* Minimal Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <span className="text-xs font-medium text-white/60 w-4 text-center">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
