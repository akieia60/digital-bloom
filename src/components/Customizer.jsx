import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import LivePreview from './LivePreview';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'balloon', icon: '🎈', name: 'Balloons', price: 2.99 },
  { id: 'ribbon', icon: '🎀', name: 'Ribbon Wrap', price: 1.99 },
  { id: 'sparkle', icon: '✨', name: 'Sparkle Effect', price: 3.99 },
];

const COLOR_THEMES = [
  { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
  { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
  { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
  { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] },
];

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {} }) => {
  const { messagePlaceholder, toPlaceholder, ...stateDefaults } = defaults;
  const scrollPosRef = useRef(0);

  // Clean, minimal state
  const [message, setMessage] = useState({
    short: stateDefaults.short || '',
    toName: stateDefaults.toName || '',
    fromName: stateDefaults.fromName || '',
  });
  const [colorTheme, setColorTheme] = useState(stateDefaults.colorTheme || 'original');
  const [extras, setExtras] = useState({ balloon: false, ribbon: false, sparkle: false });

  // Safari-safe scroll lock
  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.classList.add('customizer-open');
    } else {
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosRef.current);
    }
    return () => {
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Scoped theme
  const themeStyle = useMemo(() => {
    const specs = {
      original: { color: '#FF69B4' },
      warm:     { color: '#FF6B6B' },
      cool:     { color: '#4ECDC4' },
      elegant:  { color: '#D4AF37' },
      romantic: { color: '#C41E3A' },
    };
    return specs[colorTheme] || specs.original;
  }, [colorTheme]);

  const handleMessageChange = useCallback((field, value) => {
    setMessage(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleExtra = useCallback((extraId) => {
    setExtras(prev => ({ ...prev, [extraId]: !prev[extraId] }));
  }, []);

  // Pricing
  const basePrice = parseFloat(product?.price || 0);
  const extrasTotal = EXTRAS.reduce((sum, e) => sum + (extras[e.id] ? e.price : 0), 0);
  const totalPrice = basePrice + extrasTotal;
  const isProductValid = Boolean(product?.id && basePrice > 0);

  // Non-blocking Add to Cart
  const handleComplete = useCallback(() => {
    if (!isProductValid) return;
    // Fire-and-forget theme save
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('digital_bloom_themes').insert([{
            user_id: user.id, theme_name: colorTheme, primary_color: themeStyle.color,
          }]);
        }
      } catch (err) { console.error('Theme save (non-blocking):', err); }
    })();
    // Build composition manifest for fulfillment
    const composition = buildCartComposition({ message, colorTheme, extras });
    onComplete({ productId: product.id, message, colorTheme, extras, totalPrice, composition });
    onClose();
  }, [isProductValid, product, message, colorTheme, extras, totalPrice, themeStyle, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={`customizer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} role="presentation" />

      <div className={`customizer-sheet ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Customize your experience">
        <div className="customizer-sheet__drag-indicator" />

        {/* Header */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">Customize</h2>
          <button type="button" className="customizer-sheet__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body — streamlined: Message → Style → Extras */}
        <div className="customizer-sheet__body">

          {/* ── MESSAGE (simplified — just short msg + to/from) ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">1</span>
              <h3 className="customizer-section__title">Your Message</h3>
            </div>

            <div className="customizer-field">
              <input
                id="cust-msg"
                type="text"
                className="customizer-input"
                placeholder={messagePlaceholder || 'e.g., Happy Birthday!'}
                maxLength="80"
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
              />
              <span className="customizer-hint">{message.short.length}/80</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-to">To</label>
                <input id="cust-to" type="text" className="customizer-input"
                  placeholder={toPlaceholder || 'Recipient'}
                  value={message.toName}
                  onChange={(e) => handleMessageChange('toName', e.target.value)} />
              </div>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-from">From</label>
                <input id="cust-from" type="text" className="customizer-input"
                  placeholder="Your name"
                  value={message.fromName}
                  onChange={(e) => handleMessageChange('fromName', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── STYLE ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">2</span>
              <h3 className="customizer-section__title">Style</h3>
            </div>
            <div className="theme-grid" role="radiogroup" aria-label="Color theme">
              {COLOR_THEMES.map(theme => (
                <button key={theme.id} type="button" role="radio" aria-checked={colorTheme === theme.id}
                  className={`theme-swatch ${colorTheme === theme.id ? 'active' : ''}`}
                  onClick={() => setColorTheme(theme.id)}>
                  <div className="theme-colors">
                    <span style={{ background: theme.colors[0] }} />
                    <span style={{ background: theme.colors[1] }} />
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── EXTRAS ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">3</span>
              <h3 className="customizer-section__title">Extras</h3>
            </div>
            <div className="extras-grid">
              {EXTRAS.map(extra => (
                <button key={extra.id} type="button"
                  className={`extra-toggle ${extras[extra.id] ? 'extra-toggle--active' : ''}`}
                  onClick={() => toggleExtra(extra.id)}
                  aria-pressed={extras[extra.id]}
                  aria-label={`${extra.name} — $${extra.price.toFixed(2)}`}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon" aria-hidden="true">{extra.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{extra.name}</span>
                      <span className="extra-toggle__price">+${extra.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="toggle-switch" aria-hidden="true">
                    <input type="checkbox" tabIndex={-1} checked={extras[extra.id]} readOnly />
                    <span className="toggle-switch__slider" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── LIVE PREVIEW ── */}
          {(extras.balloon || extras.ribbon || extras.sparkle || message.short) && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <h3 className="customizer-section__title">Preview</h3>
              </div>
              <div style={{ maxWidth: 280, margin: '0 auto' }}>
                <LivePreview
                  product={product}
                  colorTheme={colorTheme}
                  extras={extras}
                  message={message}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── STICKY CTA ── */}
        <div className="customizer-sticky-cta">
          <div className="cta-preview">
            <LivePreview
              product={product}
              colorTheme={colorTheme}
              extras={extras}
              message={message}
              className="composition-preview--square"
            />
          </div>
          <div className="cta-pricing">
            <div className="cta-pricing__label">Total</div>
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          <button type="button" className="cta-add-btn" onClick={handleComplete}
            disabled={!isProductValid} aria-label={`Add to cart for $${totalPrice.toFixed(2)}`}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Customizer;
