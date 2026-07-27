import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import LivePreview from './LivePreview';
import { getPosterUrl, getSafeImageUrl, primeVideoPlayback } from '../lib/media';

const OVERLAY_ICON_MAP = {
  ribbon: '🎀',
  sparkle: '✨',
  goldDust: '✨',
  softGlow: '🕯️',
  rosePetals: '🌹',
  balloon: '🎈',
};

const OVERLAY_LABEL_KEYS = {
  ribbon: 'customize_extra_ribbon',
  sparkle: 'customize_extra_sparkle',
  goldDust: 'customize_extra_gold',
  softGlow: 'customize_extra_glow',
  rosePetals: 'customize_extra_petals',
  balloon: 'customize_extra_balloon',
};

const THEME_LABEL_KEYS = {
  original: 'customize_theme_original',
  warm: 'customize_theme_sunset',
  cool: 'customize_theme_breeze',
  elegant: 'customize_theme_gold',
  romantic: 'customize_theme_rose',
  custom: 'customize_theme_custom',
};

const SOUND_LABEL_KEYS = {
  'gentle-piano': 'customize_sound_piano',
  'soft-strings': 'customize_sound_strings',
  'ambient-bloom': 'customize_sound_bloom',
  'golden-harp': 'customize_sound_harp',
  'ocean-breeze': 'customize_sound_ocean',
  'jazz-lounge': 'customize_sound_jazz',
  'r-and-b-soul': 'customize_sound_rnb',
  'give-flowers': 'customize_sound_flowers',
};

const CartItem = ({ item }) => {
  const { t } = useLanguage();
  const { updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedRef = useRef(null);
  const itemKey = item.lineItemId || item.id;
  const videoUrl = item.video_file_url || item.video_url;
  const posterUrl = getPosterUrl(videoUrl, item.image_url || item.image);
  const imageUrl = getSafeImageUrl(item.image_url || item.image);
  const customizationMessage = typeof item.customization?.message === 'string'
    ? { short: item.customization.message, toName: '', fromName: '' }
    : (item.customization?.message || {});
  const activeOverlays = item.customization?.composition?.activeOverlays || [];
  const previewExtras = activeOverlays.reduce((extras, overlayId) => {
    extras[overlayId] = true;
    return extras;
  }, {});
  const previewTheme = item.customization?.colorTheme || item.customization?.theme || 'original';
  const previewPrimaryColor = item.customization?.primaryColor || item.customization?.composition?.primaryColor;
  const previewAccentColor = item.customization?.accentColor || item.customization?.composition?.accentColor;
  const fontLabel = item.customization?.fontChoice
    ? t(`customize_font_${item.customization.fontChoice === 'arialBold' ? 'arial' : item.customization.fontChoice}`)
    : null;
  const themeLabelKey = THEME_LABEL_KEYS[item.customization?.colorTheme || item.customization?.theme];
  const soundLabelKey = SOUND_LABEL_KEYS[item.customization?.selectedSound];

  const handleIncrement = () => updateQuantity(itemKey, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(itemKey, item.quantity - 1);
    else removeFromCart(itemKey);
  };

  useEffect(() => {
    if (!isExpanded || !expandedRef.current) return;

    window.requestAnimationFrame(() => {
      expandedRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    });
  }, [isExpanded]);

  return (
    <div className="py-5 sm:py-6 border-b border-white/15 last:border-0 animate-fade-in">
      {/* Main row — tap to expand */}
      <div
        className="flex items-start space-x-3 sm:space-x-5 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.name} details`}
      >
        {/* Visual Asset Preview */}
        <div className="db-watermark w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden glass border border-white/5 relative">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              poster={posterUrl || undefined}
              preload="metadata"
              muted
              autoPlay
              loop
              playsInline
              onLoadedMetadata={primeVideoPlayback}
            />
          ) : (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="db-watermark-overlay" aria-hidden="true">
            <div className="db-watermark-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="db-watermark-row">
                  <span>© Digital Bloom</span>
                  <span>© Digital Bloom</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-1">
            <span className="text-sm sm:text-[15px] font-medium text-white font-display tracking-tight leading-tight pr-2">
              {item.name}
            </span>
            <p className="text-sm font-light text-white/50 flex-shrink-0">${parseFloat(item.price).toFixed(2)}</p>
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            {item.customization ? (
              <span className="text-[9px] uppercase tracking-widest text-pure-gold font-bold">{t('cart_item_bespoke')}</span>
            ) : (
              <span className="text-[9px] uppercase tracking-widest text-white/20 font-light">{t('cart_item_gallery')}</span>
            )}

            {item.customization && (
              <Link
                to={`/product/${item.id}`}
                state={{ editCustomization: item.customization, editLineItemId: itemKey, editQuantity: item.quantity }}
                className="inline-flex items-center gap-1 rounded-full border border-pure-gold/30 bg-pure-gold/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-pure-gold hover:bg-pure-gold/20 transition-colors font-semibold"
                onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t('cart_item_edit')}
              </Link>
            )}
          </div>

          {item.customization && (
            <div className="mt-2 space-y-1">
              <p className="text-[11px] text-white/65 leading-relaxed line-clamp-2">
                {customizationMessage.short || t('cart_item_summary_pending')}
              </p>
              <div className="flex flex-wrap gap-2">
                {customizationMessage.toName && (
                  <span className="text-[9px] uppercase tracking-widest text-white/35">
                    {t('cart_item_to')} {customizationMessage.toName}
                  </span>
                )}
                {customizationMessage.fromName && (
                  <span className="text-[9px] uppercase tracking-widest text-white/35">
                    {t('cart_item_from')} {customizationMessage.fromName}
                  </span>
                )}
                {activeOverlays.length > 0 && (
                  <span className="text-[9px] uppercase tracking-widest text-white/35">
                    {t('cart_item_summary_effects')} {activeOverlays.length}
                  </span>
                )}
                {item.customization.selectedSound && (
                  <span className="text-[9px] uppercase tracking-widest text-white/35">
                    {t('cart_item_summary_sound')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Expand indicator */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/30 font-light">
              {isExpanded ? t('cart_item_tap_collapse') : t('cart_item_tap_details')}
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>

          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div
        ref={expandedRef}
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isExpanded ? 'max-h-[980px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-0 sm:ml-[100px] mt-4 sm:mt-0 space-y-4">
          {/* Larger Preview */}
          <div className="w-full max-w-[250px] sm:max-w-[280px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {item.customization ? (
              <LivePreview
                product={item}
                colorTheme={previewTheme}
                primaryColor={previewPrimaryColor}
                accentColor={previewAccentColor}
                extras={previewExtras}
                message={customizationMessage}
                engravingStyle={item.customization.engravingStyle || 'heirloom'}
                fontChoice={item.customization.fontChoice || 'playfair'}
                className="cart-item-preview"
              />
            ) : videoUrl ? (
              <div className="db-watermark relative aspect-[9/14]">
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  poster={posterUrl || undefined}
                  preload="metadata"
                  muted
                  autoPlay
                  loop
                  playsInline
                  onLoadedMetadata={primeVideoPlayback}
                />
                <div className="db-watermark-overlay" aria-hidden="true">
                  <div className="db-watermark-grid">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="db-watermark-row">
                        <span>© Digital Bloom</span>
                        <span>© Digital Bloom</span>
                        <span>© Digital Bloom</span>
                        <span>© Digital Bloom</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full aspect-[9/14] object-cover"
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
                        <span className="text-[9px] text-white/30">{t('cart_item_to')} {item.customization.message.toName}</span>
                      )}
                      {item.customization.message.fromName && (
                        <span className="text-[9px] text-white/30">{t('cart_item_from')} {item.customization.message.fromName}</span>
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
                    {themeLabelKey ? t(themeLabelKey) : (item.customization.colorTheme || item.customization.theme)}
                  </span>
                </div>
              )}

              {item.customization.engravingStyle && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_engraving')}</span>
                  <span className="text-xs text-white/50 capitalize">
                    {t(`customize_engraving_${item.customization.engravingStyle}`)}
                  </span>
                </div>
              )}

              {fontLabel && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_font')}</span>
                  <span className="text-xs text-white/50 capitalize">
                    {fontLabel}
                  </span>
                </div>
              )}

              {/* Sound */}
              {item.customization.selectedSound && (
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">{t('cart_item_sound')}</span>
                  <span className="text-xs text-white/50 capitalize">
                    {soundLabelKey ? t(soundLabelKey) : item.customization.selectedSound.replace(/-/g, ' ')}
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
                        {OVERLAY_ICON_MAP[overlay] || '✨'} {t(OVERLAY_LABEL_KEYS[overlay] || 'customize_extra_sparkle')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Customization — only show if bespoke */}
          {item.customization && (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/product/${item.id}`}
                state={{ editCustomization: item.customization, editLineItemId: itemKey, editQuantity: item.quantity }}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-pure-gold/30 bg-pure-gold/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-pure-gold hover:bg-pure-gold/20 transition-colors font-semibold"
                onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t('cart_item_edit')}
              </Link>

              <Link
                to={`/product/${item.id}`}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/55 hover:text-white hover:border-white/20 transition-colors font-semibold"
                onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }}
              >
                {t('cart_item_view')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quantity Controls — always visible */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 ml-0 sm:ml-[100px]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleDecrement(); }}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
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
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-pure-gold/40 hover:text-white text-white/30 transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); removeFromCart(itemKey); }}
          className="text-[10px] uppercase tracking-[0.18em] text-white/25 hover:text-red-400 transition-colors font-semibold"
        >
          {t('cart_item_remove')}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
