import { useState } from 'react';
import GiftingForm from './GiftingForm';
import CustomizationPreview from './CustomizationPreview';
import '../styles/customizer.css';

const Customizer = ({ product, isOpen, onClose, onComplete }) => {
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
    // Personalization fields
    balloonMessage: '',
    sloganType: 'premade',
    selectedSlogan: '',
    customSlogan: '',
    toName: '',
    fromName: '',
    symbolType: 'rose',
    deliveryMethod: '',
    deliveryTiming: '',
    recipientPhone: '',
  });

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

  const balloonOptions = [
    'Happy Birthday',
    'I Love You',
    'Congratulations',
    'Thank You',
    "You're the Best",
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

  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    onComplete({
      productId: product.id,
      ...customization,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="customizer-modal">
      <div className="customizer-container">
        <button className="customizer-close" onClick={onClose}>×</button>
        
        <div className="customizer-content">
          {/* Left Panel - Options */}
          <div className="customizer-options">
            <h2 className="customizer-title">Customize Your DigitalBloom Experience</h2>
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
                {colorThemes.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-swatch ${customization.colorTheme === theme.id ? 'active' : ''}`}
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
                {occasions.map(occ => (
                  <button
                    key={occ.id}
                    className={`occasion-btn ${customization.occasion === occ.id ? 'active' : ''}`}
                    onClick={() => handleChange('occasion', occ.id)}
                  >
                    <span className="occasion-icon">{occ.icon}</span>
                    <span className="occasion-name">{occ.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Balloon Message */}
            <div className="customizer-section">
              <label className="customizer-label">Balloon Message</label>
              <select
                className="customizer-input"
                value={customization.balloonMessage}
                onChange={(e) => handleChange('balloonMessage', e.target.value)}
              >
                <option value="">Select message</option>
                {balloonOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
                    <option key={s} value={s}>{s}</option>
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
                  <option key={method} value={method}>{method}</option>
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
                onChange={handleChange}
              />
            )}

            {/* Action Buttons */}
            <div className="customizer-actions">
              <button className="cta-secondary" onClick={onClose}>
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
};

export default Customizer;
