import { useState } from 'react';
import GiftingForm from './GiftingForm';
import CustomizationPreview from './CustomizationPreview';
import '../styles/customizer.css';

export default function ExperienceCustomizer({ product, onComplete, onCancel }) {
  // Extend the customization object with new personalization fields.
  const [customization, setCustomization] = useState({
    customMessageShort: '',
    customMessageLong: '',
    colorTheme: 'original',
    occasion: '',
    isGift: false,
    recipientName: '',
    recipientEmail: '',
    deliveryDate: '',
    giftMessage: '',
    senderName: '',
    // New fields for personalization
    animationEffect: 'goldSparkles',
    selectedMusic: '',
    sloganType: 'premade',
    selectedSlogan: '',
    customSlogan: '',
    toName: '',
    fromName: '',
    textFont: 'cormorant',
    symbolType: 'rose',
    deliveryMethod: '',
    deliveryTiming: '',
    recipientPhone: '',
  });

  // Existing options for color themes and occasions.
  const colorThemes = [
    { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
    { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
    { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
    { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] },
  ];
  const occasions = [
    { id: 'celebration', name: 'Celebration', icon: '🎉' },
    { id: 'gratitude', name: 'Gratitude', icon: '🙏' },
    { id: 'remembrance', name: 'Remembrance', icon: '💭' },
    { id: 'encouragement', name: 'Encouragement', icon: '💪' },
    { id: 'love', name: 'Love', icon: '❤️' },
    { id: 'sympathy', name: 'Sympathy', icon: '🕊️' },
  ];

  // Animation effects — visual magic that plays over the bloom
  const animationEffects = [
    { id: 'goldSparkles',   label: '✨ Gold Sparkles',        desc: 'A shower of shimmering gold sparks' },
    { id: 'butterflies',    label: '🦋 Butterflies',          desc: 'Soft, floating butterflies drift across the bloom' },
    { id: 'goldenHearts',   label: '💛 Golden Hearts',        desc: 'Radiant hearts with a diamond shimmer' },
    { id: 'coloredHearts',  label: '💖 Rainbow Hearts',       desc: 'Multi-colored hearts floating upward' },
    { id: 'diamondGlitter', label: '💎 Diamond Glitter',      desc: 'Sparkling diamond-cut light effects' },
    { id: 'glitter',        label: '🌟 Glitter Shower',       desc: 'Fine glitter raining down over the bloom' },
    { id: 'stars',          label: '⭐ Star Burst',           desc: 'Twinkling stars cascading across the screen' },
    { id: 'rosePetals',     label: '🌸 Rose Petals',          desc: 'Delicate petals gently falling' },
    { id: 'confetti',       label: '🎊 Confetti',             desc: 'Festive bursts of colorful celebration' },
    { id: 'snowflakes',     label: '❄️ Snowflakes',           desc: 'Gentle snowflakes drifting down' },
  ];

  // Font / text style options for message text
  const fontOptions = [
    { id: 'cormorant',  label: 'Cormorant',  sample: 'Elegant & Italic',   style: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' } },
    { id: 'playfair',   label: 'Playfair',   sample: 'Classic & Refined',  style: { fontFamily: "'Playfair Display', Georgia, serif" } },
    { id: 'outfit',     label: 'Outfit',     sample: 'Clean & Modern',     style: { fontFamily: "'Outfit', sans-serif" } },
    { id: 'arial-bold', label: 'Arial Bold', sample: 'Bold & Clear',       style: { fontFamily: 'Arial, sans-serif', fontWeight: '700' } },
    { id: 'serif',      label: 'Classic Serif', sample: 'Timeless',        style: { fontFamily: 'Georgia, serif' } },
  ];
  // Music tracks — "Give Them Their Flowers" is the featured artist track
  const musicTracks = [
    {
      id: 'give-them-flowers',
      label: 'Give Them Their Flowers',
      artist: 'Featured Artist',
      mood: 'Emotional · Celebratory',
      featured: true,
    },
    {
      id: 'soft-piano',
      label: 'Soft Piano',
      artist: 'Royalty Free',
      mood: 'Peaceful · Reflective',
      featured: false,
    },
    {
      id: 'peaceful-strings',
      label: 'Peaceful Strings',
      artist: 'Royalty Free',
      mood: 'Warm · Gentle',
      featured: false,
    },
    {
      id: 'gentle-acoustic',
      label: 'Gentle Acoustic',
      artist: 'Royalty Free',
      mood: 'Uplifting · Tender',
      featured: false,
    },
  ];

  const premadeSlogans = [
    'I hope you have a great day',
    'You are always loved',
    'Even in your darkest days, you are loved',
    'Thank you for being you',
    'Wishing you peace, joy, and beauty today',
    'Congratulations, this moment is yours',
    'You make life brighter',
    'Thinking of you with love',
    'You are stronger than you know',
    'Grace surrounds you',
  ];
  const symbolOptions = ['rose', 'cross'];
  const deliveryMethods = ['email', 'text'];
  const deliveryTimings = ['now', 'later', 'send-to-self-first'];

  // Update fields generically.
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  // Notify parent with all customization details.
  const handleComplete = () => {
    onComplete({
      productId: product.id,
      ...customization,
    });
  };

  return (
    <div className="customizer-modal">
      <div className="customizer-container">
        <button className="customizer-close" onClick={onCancel}>
          ×
        </button>
        <div className="customizer-content">
          {/* Left Panel - Options */}
          <div className="customizer-options">
            <h2 className="customizer-title">
              Customize Your DigitalBloom Experience
            </h2>
            <p className="customizer-subtitle">
              Your experience will be published with these selections
            </p>

            {/* Custom Message */}
            <div className="customizer-section">
              <label className="customizer-label">Custom Message (Short)</label>
              <input
                type="text"
                className="customizer-input"
                placeholder="e.g., Happy Birthday!"
                maxLength="50"
                value={customization.customMessageShort}
                onChange={(e) => handleChange('customMessageShort', e.target.value)}
              />
              <span className="customizer-hint">
                {customization.customMessageShort.length}/50
              </span>
            </div>

            <div className="customizer-section">
              <label className="customizer-label">Personal Note (Optional)</label>
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

            {/* Color Theme */}
            <div className="customizer-section">
              <label className="customizer-label">Color Theme</label>
              <div className="theme-grid">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`theme-swatch ${
                      customization.colorTheme === theme.id ? 'active' : ''
                    }`}
                    onClick={() => handleChange('colorTheme', theme.id)}
                  >
                    <div className="theme-colors">
                      <span style={{ background: theme.colors[0] }}></span>
                      <span style={{ background: theme.colors[1] }}></span>
                    </div>
                    <span className="theme-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="customizer-section">
              <label className="customizer-label">Occasion</label>
              <div className="occasion-grid">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    className={`occasion-btn ${
                      customization.occasion === occ.id ? 'active' : ''
                    }`}
                    onClick={() => handleChange('occasion', occ.id)}
                  >
                    <span className="occasion-icon">{occ.icon}</span>
                    <span className="occasion-name">{occ.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Effect */}
            <div className="customizer-section">
              <label className="customizer-label">Animation Effect</label>
              <p style={{ fontSize: '0.78rem', color: '#6E6E73', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>
                Choose the magical effect that plays over your bloom
              </p>
              <div className="effect-grid">
                {animationEffects.map((effect) => (
                  <button
                    key={effect.id}
                    className={`effect-btn ${customization.animationEffect === effect.id ? 'active' : ''}`}
                    onClick={() => handleChange('animationEffect', effect.id)}
                    title={effect.desc}
                  >
                    <span className="effect-label">{effect.label}</span>
                    <span className="effect-desc">{effect.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Font Style */}
            <div className="customizer-section">
              <label className="customizer-label">Message Font Style</label>
              <p style={{ fontSize: '0.78rem', color: '#6E6E73', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>
                Choose how your message text looks
              </p>
              <div className="font-grid">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    className={`font-btn ${customization.textFont === font.id ? 'active' : ''}`}
                    onClick={() => handleChange('textFont', font.id)}
                  >
                    <span className="font-btn__name" style={font.style}>{font.label}</span>
                    <span className="font-btn__sample">{font.sample}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Music Selection */}
            <div className="customizer-section">
              <label className="customizer-label">Add Music</label>
              <p style={{ fontSize: '0.78rem', color: '#6E6E73', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>
                Choose a song to play during the bloom experience
              </p>
              <div className="music-grid">
                {/* No music option */}
                <button
                  className={`music-btn ${customization.selectedMusic === '' ? 'active' : ''}`}
                  onClick={() => handleChange('selectedMusic', '')}
                >
                  <span className="music-btn__icon">🔇</span>
                  <div className="music-btn__info">
                    <span className="music-btn__title">No Music</span>
                    <span className="music-btn__mood">Silent experience</span>
                  </div>
                </button>

                {musicTracks.map((track) => (
                  <button
                    key={track.id}
                    className={`music-btn ${customization.selectedMusic === track.id ? 'active' : ''} ${track.featured ? 'music-btn--featured' : ''}`}
                    onClick={() => handleChange('selectedMusic', track.id)}
                  >
                    <span className="music-btn__icon">{track.featured ? '🌟' : '🎵'}</span>
                    <div className="music-btn__info">
                      <span className="music-btn__title">
                        {track.label}
                        {track.featured && <span className="music-btn__tag">Featured</span>}
                      </span>
                      <span className="music-btn__artist">{track.artist}</span>
                      <span className="music-btn__mood">{track.mood}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slogan Section */}
            <div className="customizer-section">
              <label className="customizer-label">Slogan Type</label>
              <select
                className="customizer-input"
                value={customization.sloganType}
                onChange={(e) => handleChange('sloganType', e.target.value)}
              >
                <option value="premade">Choose premade</option>
                <option value="custom">Write your own</option>
              </select>
            </div>

            {customization.sloganType === 'premade' && (
              <div className="customizer-section">
                <label className="customizer-label">Slogan</label>
                <select
                  className="customizer-input"
                  value={customization.selectedSlogan}
                  onChange={(e) => handleChange('selectedSlogan', e.target.value)}
                >
                  <option value="">Select a slogan</option>
                  {premadeSlogans.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {customization.sloganType === 'custom' && (
              <div className="customizer-section">
                <label className="customizer-label">Custom Slogan</label>
                <textarea
                  className="customizer-textarea"
                  placeholder="Write your own message..."
                  maxLength="200"
                  rows="3"
                  value={customization.customSlogan}
                  onChange={(e) => handleChange('customSlogan', e.target.value)}
                />
                <span className="customizer-hint">
                  {customization.customSlogan.length}/200
                </span>
              </div>
            )}

            {/* To / From fields */}
            <div className="customizer-section">
              <label className="customizer-label">To</label>
              <input
                type="text"
                className="customizer-input"
                placeholder="Recipient name"
                value={customization.toName}
                onChange={(e) => handleChange('toName', e.target.value)}
              />
            </div>
            <div className="customizer-section">
              <label className="customizer-label">From</label>
              <input
                type="text"
                className="customizer-input"
                placeholder="Your name"
                value={customization.fromName}
                onChange={(e) => handleChange('fromName', e.target.value)}
              />
            </div>

            {/* Symbol Selector */}
            <div className="customizer-section">
              <label className="customizer-label">Symbol</label>
              <select
                className="customizer-input"
                value={customization.symbolType}
                onChange={(e) => handleChange('symbolType', e.target.value)}
              >
                {symbolOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Method */}
            <div className="customizer-section">
              <label className="customizer-label">Delivery Method</label>
              <select
                className="customizer-input"
                value={customization.deliveryMethod}
                onChange={(e) => handleChange('deliveryMethod', e.target.value)}
              >
                <option value="">Select method</option>
                {deliveryMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {customization.deliveryMethod === 'text' && (
              <div className="customizer-section">
                <label className="customizer-label">Recipient Phone</label>
                <input
                  type="text"
                  className="customizer-input"
                  placeholder="Recipient phone number"
                  value={customization.recipientPhone}
                  onChange={(e) => handleChange('recipientPhone', e.target.value)}
                />
              </div>
            )}
            {customization.deliveryMethod === 'email' && (
              <div className="customizer-section">
                <label className="customizer-label">Recipient Email</label>
                <input
                  type="email"
                  className="customizer-input"
                  placeholder="Recipient email"
                  value={customization.recipientEmail}
                  onChange={(e) => handleChange('recipientEmail', e.target.value)}
                />
              </div>
            )}

            {/* Delivery Timing */}
            <div className="customizer-section">
              <label className="customizer-label">Delivery Timing</label>
              <select
                className="customizer-input"
                value={customization.deliveryTiming}
                onChange={(e) => handleChange('deliveryTiming', e.target.value)}
              >
                <option value="">Select timing</option>
                {deliveryTimings.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'send-to-self-first'
                      ? 'Send to me first'
                      : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {customization.deliveryTiming === 'later' && (
              <div className="customizer-section">
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
            <div className="customizer-section">
              <label className="customizer-toggle">
                <input
                  type="checkbox"
                  checked={customization.isGift}
                  onChange={(e) => handleChange('isGift', e.target.checked)}
                />
                <span className="toggle-label">Send this experience as a gift</span>
              </label>
            </div>

            {/* Gifting Form */}
            {customization.isGift && (
              <GiftingForm
                recipientName={customization.recipientName}
                recipientEmail={customization.recipientEmail}
                deliveryDate={customization.deliveryDate}
                giftMessage={customization.giftMessage}
                senderName={customization.senderName}
                onChange={handleChange}
              />
            )}

            {/* Action Buttons */}
            <div className="customizer-actions">
              <button className="cta-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="cta-primary" onClick={handleComplete}>
                Add to Experience
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="customizer-preview">
            <CustomizationPreview
              product={product}
              customization={customization}
              colorThemes={colorThemes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
