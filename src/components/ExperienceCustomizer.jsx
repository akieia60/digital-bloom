import { useState } from 'react';
import GiftingForm from './GiftingForm';
import CustomizationPreview from './CustomizationPreview';
import '../styles/customizer.css';

export default function ExperienceCustomizer({ product, onComplete, onCancel }) {
  const [customization, setCustomization] = useState({
    customMessageShort: '',
    customMessageLong: '',
    colorTheme: 'original',
    occasion: '',
    isGift: false,
    recipientName: '',
    recipientEmail: '',
    deliveryDate: '',
    giftMessage: ''
  });

  const colorThemes = [
    { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
    { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
    { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
    { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] }
  ];

  const occasions = [
    { id: 'celebration', name: 'Celebration', icon: '🎉' },
    { id: 'gratitude', name: 'Gratitude', icon: '🙏' },
    { id: 'remembrance', name: 'Remembrance', icon: '💭' },
    { id: 'encouragement', name: 'Encouragement', icon: '💪' },
    { id: 'love', name: 'Love', icon: '❤️' },
    { id: 'sympathy', name: 'Sympathy', icon: '🕊️' }
  ];

  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    onComplete({
      productId: product.id,
      ...customization
    });
  };

  return (
    <div className="customizer-modal">
      <div className="customizer-container">
        <button className="customizer-close" onClick={onCancel}>×</button>
        
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
              <span className="customizer-hint">{customization.customMessageShort.length}/50</span>
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
              <span className="customizer-hint">{customization.customMessageLong.length}/200</span>
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
