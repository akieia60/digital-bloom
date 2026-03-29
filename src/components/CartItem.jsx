import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const CartItem = ({ item }) => {
  const { t } = useLanguage();
  const { updateQuantity, removeFromCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  };

  return (
    <div className="py-6 border-b border-white/5 last:border-0 animate-fade-in">
      {/* Main row — tap to expand */}
      <div
        className="flex items-start space-x-5 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.name} details`}
      >
        {/* Visual Asset Preview */}
        <div className="w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden glass border border-white/5 relative">
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
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium text-white font-display tracking-tight truncate pr-3">
              {item.name}
            </span>
            <p className="text-sm font-light text-white/50 flex-shrink-0">${parseFloat(item.price).toFixed(2)}</p>
          </div>

          {/* Bespoke tag */}
          {item.customization ? (
            <span className="text-[9px] uppercase tracking-widest text-pure-gold font-bold">{t('cart_item_bespoke')}</span>
          ) : (
            <span className="text-[9px] uppercase tracking-widest text-white/20 font-light">{t('cart_item_gallery')}</span>
          )}

          {/* Expand indicator */}
          <div className="flex items-center mt-2">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-light">
              {isExpanded ? t('cart_item_tap_collapse') : t('cart_item_tap_details')}
            </span>
            <svg
              className={`w-3 h-3 ml-1 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-[100px] space-y-4">
          {/* Larger Preview */}
          <div className="w-full aspect-video max-w-xs rounded-2xl overflow-hidden border border-white/10">
            {item.video_file_url || item.video_url ? (
              <video
                src={item.video_file_url || item.video_url}
                className="w-full h-full object-cover"
                poster={item.image_url || item.image}
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
          </div>

          {/* Customization Details */}
          {item.customization && (
            <div className="space-y-3 bg-white/[0.03] rounded-xl p-4 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-pure-gold font-bold mb-2">{t('cart_item_selections')}</p>

              {/* Message */}
              {item.customization.message && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_message')}</span>
                  <p className="text-xs text-white/60 font-light italic">
                    "{typeof item.customization.message === 'string'
                      ? item.customization.message
                      : item.customization.message.short || 'No message'}"
                  </p>
                  {typeof item.customization.message === 'object' && (
                    <div className="flex gap-4 mt-1">
                      {item.customization.message.toName && (
                        <span className="text-[9px] text-white/30">To: {item.customization.message.toName}</span>
                      )}
                      {item.customization.message.fromName && (
                        <span className="text-[9px] text-white/30">From: {item.customization.message.fromName}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Color Theme */}
              {(item.customization.colorTheme || item.customization.theme) && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_style')}</span>
                  <span className="text-xs text-white/50 capitalize">
                    {item.customization.colorTheme || item.customization.theme}
                  </span>
                </div>
              )}

              {/* Sound */}
              {item.customization.selectedSound && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_sound')}</span>
                  <span className="text-xs text-white/50 capitalize">
                    {item.customization.selectedSound.replace(/-/g, ' ')}
                  </span>
                </div>
              )}

              {/* Extras */}
              {item.customization.composition?.activeOverlays?.length > 0 && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_extras')}</span>
                  <div className="flex flex-wrap gap-2">
                    {item.customization.composition.activeOverlays.map(overlay => (
                      <span key={overlay} className="text-[10px] uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full text-white/40 border border-white/5">
                        {overlay === 'balloon' ? '🎈' : overlay === 'ribbon' ? '🎀' : overlay === 'sparkle' ? '✨' : ''} {overlay}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Customization — only show if bespoke */}
          {item.customization && (
            <Link
              to={`/product/${item.id}`}
              state={{ editCustomization: item.customization }}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-pure-gold hover:text-white transition-colors font-semibold mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              {t('cart_item_edit')}
            </Link>
          )}

          {/* View Full Product link */}
          <Link
            to={`/product/${item.id}`}
            className="inline-block text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            {t('cart_item_view')}
          </Link>
        </div>
      </div>

      {/* Quantity Controls — always visible */}
      <div className="flex items-center justify-between mt-4 ml-[100px]">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleDecrement(); }}
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
            onClick={(e) => { e.stopPropagation(); handleIncrement(); }}
            className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
          className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors font-semibold"
        >
          {t('cart_item_remove')}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
