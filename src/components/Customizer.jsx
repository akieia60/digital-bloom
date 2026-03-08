import { useState, useEffect } from 'react';
import GiftingForm from './GiftingForm';
import CustomizationPreview from './CustomizationPreview';
import { supabase } from '../lib/supabase';
import '../styles/customizer.css';

const Customizer = ({ product, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [customization, setCustomization] = useState({
    to: '',
    from: '',
    shortMessage: '',
    personalNote: '',
    colorTheme: 'original',
    occasion: '',
    symbol: 'rose',
    balloonMessage: 'none',
    sloganType: 'none',
    customSlogan: '',
    isGift: false,
    recipientName: '',
    deliveryEmail: '',
    deliveryMethod: 'email',
    deliveryTiming: 'now',
    scheduledDate: '',
    deliveryPhone: '',
    giftMessage: '', // Assuming this is still used by GiftingForm
  });

  const colorThemes = [
    { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'], label: 'Original', color: '#FF69B4' },
    { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'], label: 'Warm Sunset', color: '#FF6B6B' },
    { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'], label: 'Cool Breeze', color: '#4ECDC4' },
    { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'], label: 'Elegant Gold', color: '#D4AF37' },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'], label: 'Romantic Rose', color: '#C41E3A' },
  ];

  const occasionOptions = [ // Renamed from 'occasions' to avoid conflict with new structure
    { id: 'celebration', label: 'Celebration', icon: '🎉' },
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'remembrance', label: 'Remembrance', icon: '💭' },
    { id: 'encouragement', label: 'Encouragement', icon: '💪' },
    { id: 'love', label: 'Love', icon: '❤️' },
    { id: 'sympathy', label: 'Sympathy', icon: '🕊️' },
  ];

  const symbolOptions = ['rose', 'cross'];
  const deliveryMethods = ['email', 'text']; // Added 'text' as an option

  // Dynamic Theme Engine Bridge
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

  const handleComplete = async () => {
    // 1. Check for logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    // 2. If authenticated, save the chosen dynamic theme to Supabase
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
        
        if (error) {
          console.error('Error saving theme to Supabase:', error.message);
        } else {
          console.log('Successfully saved theme to digital_bloom_themes!');
        }
      } catch (err) {
        console.error('Network error saving theme:', err);
      }
    }

    // 3. Add to cart & close
    onComplete({
      productId: product.id,
      ...customization,
    });
    onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="customizer-overlay">
      <div className="customizer-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close customizer">
          ×
        </button>
        
        <div className="customizer-content">
          <div className="customizer-options">
            <div className="customizer-header">
              <h2>Customize Experience</h2>
              <div className="step-indicator">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            <div className="options-scroll-area">
              
              {/* STEP 1: THE CARD */}
              {currentStep === 1 && (
                <div className="step-panel">
                  <h3>1. The Card</h3>
                  <div className="option-section">
                    <label>To</label>
                    <input 
                      type="text" 
                      placeholder="Recipient's Name"
                      value={customization.to}
                      onChange={(e) => handleChange('to', e.target.value)}
                    />
                  </div>
                  
                  <div className="option-section">
                    <label>From</label>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      value={customization.from}
                      onChange={(e) => handleChange('from', e.target.value)}
                    />
                  </div>

                  <div className="option-section">
                    <label>Custom Message (Short)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Happy Anniversary!"
                      value={customization.shortMessage}
                      onChange={(e) => handleChange('shortMessage', e.target.value)}
                    />
                  </div>
                  
                  <div className="option-section">
                    <label>Personal Note (Optional)</label>
                    <textarea 
                      placeholder="Write a longer message..."
                      value={customization.personalNote}
                      onChange={(e) => handleChange('personalNote', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: THE BOX */}
              {currentStep === 2 && (
                <div className="step-panel">
                  <h3>2. The Box</h3>
                  <div className="option-section">
                    <label>Color Theme</label>
                    <div className="color-swatches">
                      {colorThemes.map(theme => (
                        <button
                          key={theme.id}
                          className={`swatch-btn ${customization.colorTheme === theme.id ? 'active' : ''}`}
                          onClick={() => handleChange('colorTheme', theme.id)}
                          title={theme.label}
                        >
                          <span className="swatch-color" style={{ background: theme.color }}></span>
                          <span className="swatch-label">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-section">
                    <label>Occasion</label>
                    <select 
                      value={customization.occasion}
                      onChange={(e) => handleChange('occasion', e.target.value)}
                    >
                      {occasionOptions.map(occ => (
                        <option key={occ.id} value={occ.id}>{occ.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: THE FLOWERS */}
              {currentStep === 3 && (
                <div className="step-panel">
                  <h3>3. The Flowers</h3>
                  <div className="option-section">
                    <label>Symbol</label>
                    <select 
                      value={customization.symbol}
                      onChange={(e) => handleChange('symbol', e.target.value)}
                    >
                      {symbolOptions.map(sym => (
                        <option key={sym} value={sym}>{sym.charAt(0).toUpperCase() + sym.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: THE BALLOONS */}
              {currentStep === 4 && (
                <div className="step-panel">
                  <h3>4. The Balloons & Delivery</h3>
                  <div className="option-section">
                    <label>Balloon Message</label>
                    <select 
                      value={customization.balloonMessage}
                      onChange={(e) => handleChange('balloonMessage', e.target.value)}
                    >
                      <option value="none">No Message</option>
                      <option value="happy-birthday">Happy Birthday</option>
                      <option value="i-love-you">I Love You</option>
                      <option value="congratulations">Congratulations</option>
                      <option value="thank-you">Thank You</option>
                      <option value="youre-the-best">You're The Best</option>
                    </select>
                  </div>

                  <div className="option-section">
                    <label>Slogan (Banner/Display)</label>
                    <select 
                      value={customization.sloganType}
                      onChange={(e) => {
                        handleChange('sloganType', e.target.value);
                        if (e.target.value !== 'custom') {
                          handleChange('customSlogan', '');
                        }
                      }}
                    >
                      <option value="none">No Slogan</option>
                      <option value="custom">-- Write Custom Slogan --</option>
                      <optgroup label="Love">
                        <option value="Do you know how much I love you?">Do you know how much I love you?</option>
                        <option value="I love you unconditional">I love you unconditional</option>
                      </optgroup>
                      <optgroup label="Encouragement">
                        <option value="I know you can do it">I know you can do it</option>
                        <option value="You got this">You got this</option>
                      </optgroup>
                    </select>
                    
                    {customization.sloganType === 'custom' && (
                      <input 
                        type="text" 
                        placeholder="Type your custom slogan..."
                        value={customization.customSlogan}
                        onChange={(e) => handleChange('customSlogan', e.target.value)}
                        style={{ marginTop: '0.5rem' }}
                      />
                    )}
                  </div>

                  {/* Gifting Toggle */}
                  <div className="option-section" style={{ marginTop: '24px', borderTop: '1px solid #f2f2f2', paddingTop: '24px' }}>
                    <label className="customizer-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={customization.isGift}
                        onChange={(e) => handleChange('isGift', e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span className="toggle-label" style={{ fontWeight: 600, fontSize: '16px' }}>Send this experience as a gift</span>
                    </label>
                  </div>

                  {customization.isGift && (
                    <div className="option-section" style={{ background: '#f9f9fb', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
                      <div className="option-section">
                        <label>Recipient Name</label>
                        <input 
                          type="text" 
                          placeholder="Who is this for?"
                          value={customization.recipientName}
                          onChange={(e) => handleChange('recipientName', e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '16px' }}>
                        <div style={{ flex: 1, minWidth: '120px' }}>
                          <label>Delivery Method</label>
                          <select 
                            value={customization.deliveryMethod}
                            onChange={(e) => handleChange('deliveryMethod', e.target.value)}
                          >
                            {deliveryMethods.map(method => (
                              <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '120px' }}>
                          <label>Timing</label>
                          <select 
                            value={customization.deliveryTiming}
                            onChange={(e) => handleChange('deliveryTiming', e.target.value)}
                          >
                            <option value="now">Immediately</option>
                            <option value="later">Schedule for Later</option>
                            <option value="send-to-self-first">Send to me first</option>
                          </select>
                        </div>
                      </div>

                      {customization.deliveryTiming === 'later' && (
                        <div className="option-section">
                          <label>Delivery Date</label>
                          <input 
                            type="date" 
                            disabled
                            value={customization.scheduledDate}
                            onChange={(e) => handleChange('scheduledDate', e.target.value)}
                            title="Scheduling currently disabled in beta"
                          />
                        </div>
                      )}
                      
                      {customization.deliveryMethod === 'text' ? (
                        <div className="option-section">
                          <label>Recipient Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="(555) 555-5555"
                            value={customization.deliveryPhone}
                            onChange={(e) => handleChange('deliveryPhone', e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="option-section">
                          <label>Recipient Email</label>
                          <input 
                            type="email" 
                            placeholder="their@email.com"
                            value={customization.deliveryEmail}
                            onChange={(e) => handleChange('deliveryEmail', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="customizer-actions">
              <div className="wizard-controls">
                {currentStep > 1 ? (
                  <button className="btn-secondary" onClick={handleBack}>
                    &larr; Back
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button className="btn-primary" onClick={handleNext}>
                    Next Step &rarr;
                  </button>
                ) : (
                  <button className="btn-primary" onClick={handleComplete}>
                    Add to Experience
                  </button>
                )}
              </div>
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
