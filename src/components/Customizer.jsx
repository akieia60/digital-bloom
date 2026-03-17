import { useState, useEffect } from 'react';
import GiftingForm from './GiftingForm';
import { supabase } from '../lib/supabase';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'balloon', icon: '🎈', name: 'Balloons', price: 2.99 },
  { id: 'ribbon', icon: '🎀', name: 'Ribbon Wrap', price: 1.99 },
  { id: 'sparkle', icon: '✨', name: 'Sparkle Effect', price: 3.99 },
];

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {} }) => {
  const { messagePlaceholder, toPlaceholder, ...stateDefaults } = defaults;

  const [customization, setCustomization] = useState(() => ({
    customMessageShort: '',
    customMessageLong: '',
    colorTheme: 'original',
    isGift: false,
    recipientName: '',
    recipientEmail: '',
    deliveryDate: '',
    giftMessage: '',
    toName: '',
    fromName: '',
    deliveryMethod: '',
    deliveryTiming: '',
    recipientPhone: '',
    extras: { balloon: false, ribbon: false, sparkle: false },
    ...stateDefaults,
  }));

  const colorThemes = [
    { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
    { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
    { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
    { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] },
  ];

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('customizer-open');
    } else {
      document.body.classList.remove('customizer-open');
    }
    return () => document.body.classList.remove('customizer-open');
  }, [isOpen]);

  // Dynamic Theme Engine
  useEffect(() => {
    const root = document.documentElement;
    const themeSpecs = {
      original: { color: '#FF69B4', rgb: '255, 105, 180', radius: '30px', glow: '0.2' },
      warm:     { color: '#FF6B6B', rgb: '255, 107, 107', radius: '40px', glow: '0.25' },
      cool:     { color: '#4ECDC4', rgb: '78, 205, 196',  radius: '35px', glow: '0.2' },
      elegant:  { color: '#D4AF37', rgb: '212, 175, 55',  radius: '50px', glow: '0.35' },
      romantic: { color: '#C41E3A', rgb: '196, 30, 58',   radius: '45px', glow: '0.3' }
    };
    const spec = themeSpecs[customization.colorTheme] || themeSpecs.original;
    root.style.setProperty('--bloom-primary', spec.color);
    root.style.setProperty('--bloom-primary-rgb', spec.rgb);
    root.style.setProperty('--bloom-radius', spec.radius);
    root.style.setProperty('--bloom-glow', spec.glow);
  }, [customization.colorTheme]);

  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const toggleExtra = (extraId) => {
    setCustomization(prev => ({
      ...prev,
      extras: { ...prev.extras, [extraId]: !prev.extras[extraId] }
    }));
  };

  // Calculate total price
  const basePrice = parseFloat(product?.price || 0);
  const extrasTotal = EXTRAS.reduce((sum, extra) =>
    sum + (customization.extras[extra.id] ? extra.price : 0), 0
  );
  const totalPrice = basePrice + extrasTotal;

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const root = document.documentElement;
      const themeData = {
        user_id: user.id,
        theme_name: customization.colorTheme,
        primary_color: root.style.getPropertyValue('--bloom-primary').trim() || '#FF69B4',
        border_radius: root.style.getPropertyValue('--bloom-radius').trim() || '30px',
        bloom_glow: root.style.getPropertyValue('--bloom-glow').trim() || '0.2',
        bg_opacity: 0.9,
      };

      try {
        const { error } = await supabase
          .from('digital_bloom_themes')
          .insert([themeData]);
        if (error) console.error('Error saving theme:', error.message);
      } catch (err) {
        console.error('Network error saving theme:', err);
      }
    }

    onComplete({
      productId: product.id,
      ...customization,
      totalPrice,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`customizer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Bottom Sheet / Side Panel */}
      <div className={`customizer-sheet ${isOpen ? 'open' : ''}`}>
        {/* Drag Indicator (mobile) */}
        <div className="customizer-sheet__drag-indicator" />

        {/* Header */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">Customize Experience</h2>
          <button className="customizer-sheet__close" onClick={onClose} aria-label="Close">
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
              <label className="customizer-label">Short Message</label>
              <input
                type="text"
                className="customizer-input"
                placeholder={messagePlaceholder || 'e.g., Happy Birthday!'}
                maxLength="50"
                value={customization.customMessageShort}
                onChange={(e) => handleChange('customMessageShort', e.target.value)}
              />
              <span className="customizer-hint">
                {customization.customMessageShort.length}/50
              </span>
            </div>

            <div className="customizer-field">
              <label className="customizer-label">Personal Note</label>
              <textarea
                className="customizer-textarea"
                placeholder="Add a longer personal message..."
                maxLength="200"
                rows="3"
                value={customization.customMessageLong}
                onChange={(e) => handleChange('customMessageLong', e.target.value)}
              />
              <span className="customizer-hint">
                {customization.customMessageLong.length}/200
              </span>
            </div>

            <div className="customizer-field">
              <label className="customizer-label">To</label>
              <input
                type="text"
                className="customizer-input"
                placeholder={toPlaceholder || 'Recipient name'}
                value={customization.toName}
                onChange={(e) => handleChange('toName', e.target.value)}
              />
            </div>

            <div className="customizer-field">
              <label className="customizer-label">From</label>
              <input
                type="text"
                className="customizer-input"
                placeholder="Your name"
                value={customization.fromName}
                onChange={(e) => handleChange('fromName', e.target.value)}
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
              <div className="theme-grid">
                {colorThemes.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-swatch ${customization.colorTheme === theme.id ? 'active' : ''}`}
                    onClick={() => handleChange('colorTheme', theme.id)}
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
                <div key={extra.id} className="extra-toggle" onClick={() => toggleExtra(extra.id)}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon">{extra.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{extra.name}</span>
                      <span className="extra-toggle__price">+${extra.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={customization.extras[extra.id] || false}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    <span className="toggle-switch__slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 4: DELIVERY ── */}
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">4</span>
              <h3 className="customizer-section__title">Delivery</h3>
            </div>

            <div className="customizer-field">
              <label className="customizer-label">Delivery Method</label>
              <div className="delivery-methods">
                {['email', 'text'].map(method => (
                  <button
                    key={method}
                    className={`delivery-method ${customization.deliveryMethod === method ? 'active' : ''}`}
                    onClick={() => handleChange('deliveryMethod', method)}
                  >
                    {method === 'email' ? '📧 Email' : '💬 Text'}
                  </button>
                ))}
              </div>
            </div>

            {customization.deliveryMethod === 'text' && (
              <div className="customizer-field">
                <label className="customizer-label">Recipient Phone</label>
                <input
                  type="tel"
                  className="customizer-input"
                  placeholder="(555) 123-4567"
                  value={customization.recipientPhone}
                  onChange={(e) => handleChange('recipientPhone', e.target.value)}
                />
                <span className="customizer-hint" style={{ fontStyle: 'italic' }}>
                  We'll only use this number to deliver your bloom
                </span>
              </div>
            )}

            {customization.deliveryMethod === 'email' && (
              <div className="customizer-field">
                <label className="customizer-label">Recipient Email</label>
                <input
                  type="email"
                  className="customizer-input"
                  placeholder="recipient@email.com"
                  value={customization.recipientEmail}
                  onChange={(e) => handleChange('recipientEmail', e.target.value)}
                />
              </div>
            )}

            <div className="customizer-field">
              <label className="customizer-label">When to Send</label>
              <div className="delivery-timings">
                {[
                  { id: 'now', label: 'Now' },
                  { id: 'later', label: 'Later' },
                  { id: 'send-to-self-first', label: 'Me First' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    className={`delivery-timing ${customization.deliveryTiming === opt.id ? 'active' : ''}`}
                    onClick={() => handleChange('deliveryTiming', opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {customization.deliveryTiming === 'later' && (
              <div className="customizer-field">
                <label className="customizer-label">Delivery Date</label>
                <input
                  type="date"
                  className="customizer-input"
                  value={customization.deliveryDate}
                  onChange={(e) => handleChange('deliveryDate', e.target.value)}
                />
              </div>
            )}

            {/* Gifting Toggle */}
            <div className="customizer-field" style={{ marginTop: '8px' }}>
              <div className="extra-toggle" onClick={() => handleChange('isGift', !customization.isGift)}>
                <div className="extra-toggle__info">
                  <span className="extra-toggle__icon">🎁</span>
                  <span className="extra-toggle__name">Send as a gift</span>
                </div>
                <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={customization.isGift}
                    onChange={(e) => handleChange('isGift', e.target.checked)}
                  />
                  <span className="toggle-switch__slider" />
                </label>
              </div>
            </div>

            {customization.isGift && (
              <GiftingForm
                recipientName={customization.recipientName}
                recipientEmail={customization.recipientEmail}
                deliveryDate={customization.deliveryDate}
                giftMessage={customization.giftMessage}
                onChange={handleChange}
              />
            )}
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
          <button className="cta-add-btn" onClick={handleComplete}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Customizer;
