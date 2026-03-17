import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
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
  const themePreviewRef = useRef(null);

  // ── Clean field modeling ──
  const [message, setMessage] = useState({
    short: '',
    long: '',
    toName: '',
    fromName: '',
    ...stateDefaults,
  });

  const [colorTheme, setColorTheme] = useState(stateDefaults.colorTheme || 'original');
  const [extras, setExtras] = useState({ balloon: false, ribbon: false, sparkle: false });

  // ── Safari-safe scroll lock ──
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

  // ── Scoped theme preview (NO global mutation) ──
  const themeStyle = useMemo(() => {
    const specs = {
      original: { color: '#FF69B4', rgb: '255, 105, 180' },
      warm:     { color: '#FF6B6B', rgb: '255, 107, 107' },
      cool:     { color: '#4ECDC4', rgb: '78, 205, 196' },
      elegant:  { color: '#D4AF37', rgb: '212, 175, 55' },
      romantic: { color: '#C41E3A', rgb: '196, 30, 58' },
    };
    return specs[colorTheme] || specs.original;
  }, [colorTheme]);

  // ── Callbacks ──
  const handleMessageChange = useCallback((field, value) => {
    setMessage(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleExtra = useCallback((extraId) => {
    setExtras(prev => ({ ...prev, [extraId]: !prev[extraId] }));
  }, []);

  // ── Pricing ──
  const basePrice = parseFloat(product?.price || 0);
  const extrasTotal = EXTRAS.reduce((sum, extra) =>
    sum + (extras[extra.id] ? extra.price : 0), 0
  );
  const totalPrice = basePrice + extrasTotal;

  // ── Guard: is product data complete? ──
  const isProductValid = Boolean(product?.id && basePrice > 0);

  // ── Add to Cart (non-blocking Supabase) ──
  const handleComplete = useCallback(() => {
    if (!isProductValid) return;

    // Fire-and-forget theme persistence — does NOT block the cart action
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('digital_bloom_themes').insert([{
            user_id: user.id,
            theme_name: colorTheme,
            primary_color: themeStyle.color,
            border_radius: '30px',
            bloom_glow: '0.2',
            bg_opacity: 0.9,
          }]);
        }
      } catch (err) {
        console.error('Theme persistence error (non-blocking):', err);
      }
    })();

    // Immediately add to cart — no await
    onComplete({
      productId: product.id,
      message,
      colorTheme,
      extras,
      totalPrice,
    });
    onClose();
  }, [isProductValid, product, message, colorTheme, extras, totalPrice, themeStyle, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`customizer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        role="presentation"
      />

      {/* Bottom Sheet / Side Panel */}
      <div
        className={`customizer-sheet ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Customize your experience"
      >
        {/* Drag Indicator (mobile) */}
        <div className="customizer-sheet__drag-indicator" />

        {/* Header */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">Customize Experience</h2>
          <button
            type="button"
            className="customizer-sheet__close"
            onClick={onClose}
            aria-label="Close customizer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="customizer-sheet__body">

          {/* ── SECTION 1: MESSAGE ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">1</span>
              <h3 className="customizer-section__title">Your Message</h3>
            </div>

            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-msg-short">Short Message</label>
              <input
                id="cust-msg-short"
                type="text"
                className="customizer-input"
                placeholder={messagePlaceholder || 'e.g., Happy Birthday!'}
                maxLength="50"
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
              />
              <span className="customizer-hint">{message.short.length}/50</span>
            </div>

            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-msg-long">Personal Note</label>
              <textarea
                id="cust-msg-long"
                className="customizer-textarea"
                placeholder="Add a longer personal message..."
                maxLength="200"
                rows="3"
                value={message.long}
                onChange={(e) => handleMessageChange('long', e.target.value)}
              />
              <span className="customizer-hint">{message.long.length}/200</span>
            </div>

            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-to">To</label>
              <input
                id="cust-to"
                type="text"
                className="customizer-input"
                placeholder={toPlaceholder || 'Recipient name'}
                value={message.toName}
                onChange={(e) => handleMessageChange('toName', e.target.value)}
              />
            </div>

            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-from">From</label>
              <input
                id="cust-from"
                type="text"
                className="customizer-input"
                placeholder="Your name"
                value={message.fromName}
                onChange={(e) => handleMessageChange('fromName', e.target.value)}
              />
            </div>
          </div>

          {/* ── SECTION 2: STYLE ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">2</span>
              <h3 className="customizer-section__title">Style</h3>
            </div>

            <div className="customizer-field">
              <label className="customizer-label">Color Theme</label>
              <div className="theme-grid" role="radiogroup" aria-label="Color theme">
                {COLOR_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={colorTheme === theme.id}
                    className={`theme-swatch ${colorTheme === theme.id ? 'active' : ''}`}
                    onClick={() => setColorTheme(theme.id)}
                  >
                    <div className="theme-colors">
                      <span style={{ background: theme.colors[0] }} />
                      <span style={{ background: theme.colors[1] }} />
                    </div>
                    <span className="theme-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: EXTRAS ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">3</span>
              <h3 className="customizer-section__title">Extras</h3>
            </div>

            <div className="extras-grid">
              {EXTRAS.map(extra => (
                <button
                  key={extra.id}
                  type="button"
                  className={`extra-toggle ${extras[extra.id] ? 'extra-toggle--active' : ''}`}
                  onClick={() => toggleExtra(extra.id)}
                  aria-pressed={extras[extra.id]}
                  aria-label={`${extra.name} — $${extra.price.toFixed(2)}`}
                >
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
        </div>

        {/* ── STICKY CTA BAR ── */}
        <div className="customizer-sticky-cta">
          <div className="cta-preview">
            {product?.image_url && (
              <img src={product.image_url} alt={product?.name || 'Preview'} />
            )}
          </div>
          <div className="cta-pricing">
            <div className="cta-pricing__label">Total</div>
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          <button
            type="button"
            className="cta-add-btn"
            onClick={handleComplete}
            disabled={!isProductValid}
            aria-label={`Add to cart for $${totalPrice.toFixed(2)}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Customizer;
