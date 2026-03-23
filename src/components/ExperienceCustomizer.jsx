import { useState } from 'react';
import GiftingForm from './GiftingForm';
import CustomizationPreview from './CustomizationPreview';
import '../styles/customizer.css';

// ─── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Message',  icon: '✍️',  title: 'Personalize It',    sub: 'Who is this for and what do you want to say?' },
  { id: 2, label: 'Style',    icon: '✨',  title: 'Choose Your Style', sub: 'Pick the look and feel of your bloom' },
  { id: 3, label: 'Music',    icon: '🎵',  title: 'Add Music',         sub: 'Set the mood with the perfect song' },
  { id: 4, label: 'Delivery', icon: '📬',  title: 'Send It',           sub: 'How and when should this arrive?' },
];

export default function ExperienceCustomizer({ product, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [customization, setCustomization] = useState({
    customMessageShort: '',
    colorTheme: 'original',
    occasion: '',
    isGift: false,
    recipientName: '',
    recipientEmail: '',
    deliveryDate: '',
    giftMessage: '',
    senderName: '',
    animationEffect: 'goldSparkles',
    selectedMusic: '',
    sloganType: 'premade',
    selectedSlogan: '',
    customSlogan: '',
    toName: '',
    fromName: '',
    textFont: 'cormorant',
    deliveryMethod: 'email',
    deliveryTiming: 'now',
    recipientPhone: '',
  });

  const handle = (field, value) => setCustomization(prev => ({ ...prev, [field]: value }));

  // ─── Data ──────────────────────────────────────────────────────────────────
  const colorThemes = [
    { id: 'original',  name: 'Original',       colors: ['#FF69B4', '#FFB6C1'] },
    { id: 'warm',      name: 'Warm Sunset',     colors: ['#FF6B6B', '#FFA07A'] },
    { id: 'cool',      name: 'Cool Breeze',     colors: ['#4ECDC4', '#95E1D3'] },
    { id: 'elegant',   name: 'Elegant Gold',    colors: ['#D4AF37', '#F4E4C1'] },
    { id: 'romantic',  name: 'Romantic Rose',   colors: ['#C41E3A', '#FF1744'] },
  ];

  const animationEffects = [
    { id: 'goldSparkles',   label: '✨ Gold Sparkles',   desc: 'Shimmering gold sparks' },
    { id: 'butterflies',    label: '🦋 Butterflies',     desc: 'Floating butterflies' },
    { id: 'goldenHearts',   label: '💛 Golden Hearts',   desc: 'Hearts with diamond shimmer' },
    { id: 'coloredHearts',  label: '💖 Rainbow Hearts',  desc: 'Multi-colored hearts' },
    { id: 'diamondGlitter', label: '💎 Diamond Glitter', desc: 'Sparkling diamond lights' },
    { id: 'glitter',        label: '🌟 Glitter',         desc: 'Fine glitter shower' },
    { id: 'stars',          label: '⭐ Stars',            desc: 'Twinkling star burst' },
    { id: 'rosePetals',     label: '🌸 Rose Petals',     desc: 'Petals gently falling' },
    { id: 'confetti',       label: '🎊 Confetti',        desc: 'Festive celebration' },
    { id: 'snowflakes',     label: '❄️ Snowflakes',      desc: 'Gentle snowflakes' },
  ];

  const fontOptions = [
    { id: 'cormorant',   label: 'Cormorant',     style: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' } },
    { id: 'playfair',    label: 'Playfair',       style: { fontFamily: "'Playfair Display', Georgia, serif" } },
    { id: 'outfit',      label: 'Outfit',         style: { fontFamily: "'Outfit', sans-serif" } },
    { id: 'arial-bold',  label: 'Arial Bold',     style: { fontFamily: 'Arial, sans-serif', fontWeight: '700' } },
    { id: 'serif',       label: 'Classic Serif',  style: { fontFamily: 'Georgia, serif' } },
  ];

  const musicTracks = [
    { id: '',                  label: 'No Music',              artist: '',               mood: 'Silent experience',   icon: '🔇', featured: false },
    { id: 'give-them-flowers', label: 'Give Them Their Flowers', artist: 'Featured Artist', mood: 'Emotional · Celebratory', icon: '🌟', featured: true },
    { id: 'soft-piano',        label: 'Soft Piano',            artist: 'Royalty Free',   mood: 'Peaceful · Reflective', icon: '🎵', featured: false },
    { id: 'peaceful-strings',  label: 'Peaceful Strings',      artist: 'Royalty Free',   mood: 'Warm · Gentle',       icon: '🎵', featured: false },
    { id: 'gentle-acoustic',   label: 'Gentle Acoustic',       artist: 'Royalty Free',   mood: 'Uplifting · Tender',  icon: '🎵', featured: false },
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

  const currentStepInfo = STEPS.find(s => s.id === step);

  return (
    <div className="customizer-modal">
      <div className="customizer-container">
        <button className="customizer-close" onClick={onCancel} aria-label="Close">×</button>

        <div className="customizer-content">

          {/* ── LEFT: Step form ─────────────────────────────────────────── */}
          <div className="customizer-options">

            {/* Step progress bar */}
            <div className="wizard-progress">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  className={`wizard-step-dot ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
                  onClick={() => setStep(s.id)}
                  aria-label={`Step ${s.id}: ${s.label}`}
                >
                  <span className="wizard-step-dot__icon">{step > s.id ? '✓' : s.icon}</span>
                  <span className="wizard-step-dot__label">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Step heading */}
            <div className="wizard-heading">
              <h2 className="customizer-title">{currentStepInfo.title}</h2>
              <p className="customizer-subtitle">{currentStepInfo.sub}</p>
            </div>

            {/* ── STEP 1: Message ───────────────────────────────────────── */}
            {step === 1 && (
              <div className="wizard-step-content">

                {/* To / From — shown first, most important */}
                <div className="customizer-section">
                  <label className="customizer-label">To & From</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      className="customizer-input"
                      placeholder="To (recipient)"
                      value={customization.toName}
                      onChange={e => handle('toName', e.target.value)}
                    />
                    <input
                      type="text"
                      className="customizer-input"
                      placeholder="From (your name)"
                      value={customization.fromName}
                      onChange={e => handle('fromName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Short display message */}
                <div className="customizer-section">
                  <label className="customizer-label">Message on Screen</label>
                  <input
                    type="text"
                    className="customizer-input"
                    placeholder='e.g., "Happy Birthday, Mom!"'
                    maxLength="50"
                    value={customization.customMessageShort}
                    onChange={e => handle('customMessageShort', e.target.value)}
                  />
                  <span className="customizer-hint">{customization.customMessageShort.length}/50 — this text appears over the bloom</span>
                </div>

                {/* Slogan / personal note */}
                <div className="customizer-section">
                  <label className="customizer-label">Personal Note</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      className={`wizard-toggle-btn ${customization.sloganType === 'premade' ? 'active' : ''}`}
                      onClick={() => handle('sloganType', 'premade')}
                    >Choose a message</button>
                    <button
                      className={`wizard-toggle-btn ${customization.sloganType === 'custom' ? 'active' : ''}`}
                      onClick={() => handle('sloganType', 'custom')}
                    >Write my own</button>
                  </div>

                  {customization.sloganType === 'premade' ? (
                    <select
                      className="customizer-input"
                      value={customization.selectedSlogan}
                      onChange={e => handle('selectedSlogan', e.target.value)}
                    >
                      <option value="">Select a message…</option>
                      {premadeSlogans.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <textarea
                      className="customizer-textarea"
                      placeholder="Write something meaningful…"
                      maxLength="200"
                      rows="3"
                      value={customization.customSlogan}
                      onChange={e => handle('customSlogan', e.target.value)}
                    />
                  )}
                </div>

              </div>
            )}

            {/* ── STEP 2: Style ─────────────────────────────────────────── */}
            {step === 2 && (
              <div className="wizard-step-content">

                {/* Animation Effect */}
                <div className="customizer-section">
                  <label className="customizer-label">Animation Effect</label>
                  <div className="effect-grid">
                    {animationEffects.map(effect => (
                      <button
                        key={effect.id}
                        className={`effect-btn ${customization.animationEffect === effect.id ? 'active' : ''}`}
                        onClick={() => handle('animationEffect', effect.id)}
                      >
                        <span className="effect-label">{effect.label}</span>
                        <span className="effect-desc">{effect.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div className="customizer-section">
                  <label className="customizer-label">Message Font</label>
                  <div className="font-grid">
                    {fontOptions.map(font => (
                      <button
                        key={font.id}
                        className={`font-btn ${customization.textFont === font.id ? 'active' : ''}`}
                        onClick={() => handle('textFont', font.id)}
                      >
                        <span className="font-btn__name" style={font.style}>{font.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Tint */}
                <div className="customizer-section">
                  <label className="customizer-label">Color Mood</label>
                  <div className="theme-grid">
                    {colorThemes.map(theme => (
                      <button
                        key={theme.id}
                        className={`theme-swatch ${customization.colorTheme === theme.id ? 'active' : ''}`}
                        onClick={() => handle('colorTheme', theme.id)}
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
            )}

            {/* ── STEP 3: Music ─────────────────────────────────────────── */}
            {step === 3 && (
              <div className="wizard-step-content">
                <div className="customizer-section">
                  <label className="customizer-label">Choose a Song</label>
                  <div className="music-grid">
                    {musicTracks.map(track => (
                      <button
                        key={track.id}
                        className={`music-btn ${customization.selectedMusic === track.id ? 'active' : ''} ${track.featured ? 'music-btn--featured' : ''}`}
                        onClick={() => handle('selectedMusic', track.id)}
                      >
                        <span className="music-btn__icon">{track.icon}</span>
                        <div className="music-btn__info">
                          <span className="music-btn__title">
                            {track.label}
                            {track.featured && <span className="music-btn__tag">Featured</span>}
                          </span>
                          {track.artist && <span className="music-btn__artist">{track.artist}</span>}
                          <span className="music-btn__mood">{track.mood}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Delivery ──────────────────────────────────────── */}
            {step === 4 && (
              <div className="wizard-step-content">

                {/* Delivery Method */}
                <div className="customizer-section">
                  <label className="customizer-label">Send By</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['email', 'text'].map(method => (
                      <button
                        key={method}
                        className={`delivery-method ${customization.deliveryMethod === method ? 'active' : ''}`}
                        onClick={() => handle('deliveryMethod', method)}
                      >
                        {method === 'email' ? '📧 Email' : '💬 Text'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient contact */}
                {customization.deliveryMethod === 'email' && (
                  <div className="customizer-section">
                    <label className="customizer-label">Recipient Email</label>
                    <input
                      type="email"
                      className="customizer-input"
                      placeholder="their@email.com"
                      value={customization.recipientEmail}
                      onChange={e => handle('recipientEmail', e.target.value)}
                    />
                  </div>
                )}
                {customization.deliveryMethod === 'text' && (
                  <div className="customizer-section">
                    <label className="customizer-label">Recipient Phone</label>
                    <input
                      type="tel"
                      className="customizer-input"
                      placeholder="(555) 000-0000"
                      value={customization.recipientPhone}
                      onChange={e => handle('recipientPhone', e.target.value)}
                    />
                  </div>
                )}

                {/* Timing */}
                <div className="customizer-section">
                  <label className="customizer-label">When to Send</label>
                  <div className="delivery-timings">
                    {[
                      { id: 'now',               label: 'Send Now' },
                      { id: 'later',             label: 'Schedule' },
                      { id: 'send-to-self-first', label: 'Send to Me First' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        className={`delivery-timing ${customization.deliveryTiming === opt.id ? 'active' : ''}`}
                        onClick={() => handle('deliveryTiming', opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {customization.deliveryTiming === 'later' && (
                  <div className="customizer-section">
                    <label className="customizer-label">Delivery Date</label>
                    <input
                      type="date"
                      className="customizer-input"
                      value={customization.deliveryDate}
                      onChange={e => handle('deliveryDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                {/* Gift option */}
                <div className="customizer-section">
                  <label className="customizer-toggle">
                    <input
                      type="checkbox"
                      checked={customization.isGift}
                      onChange={e => handle('isGift', e.target.checked)}
                    />
                    <span className="toggle-label">Include a gift card message</span>
                  </label>
                </div>

                {customization.isGift && (
                  <GiftingForm
                    recipientName={customization.recipientName}
                    recipientEmail={customization.recipientEmail}
                    deliveryDate={customization.deliveryDate}
                    giftMessage={customization.giftMessage}
                    senderName={customization.senderName}
                    onChange={handle}
                  />
                )}

              </div>
            )}

            {/* ── Navigation buttons ────────────────────────────────────── */}
            <div className="wizard-nav">
              {step > 1 ? (
                <button className="cta-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
              ) : (
                <button className="cta-secondary" onClick={onCancel}>Cancel</button>
              )}

              {step < STEPS.length ? (
                <button className="cta-primary" onClick={() => setStep(s => s + 1)}>
                  Next: {STEPS[step].label} →
                </button>
              ) : (
                <button
                  className="cta-primary"
                  onClick={() => onComplete({ productId: product.id, ...customization })}
                >
                  🛒 Add to Cart & Checkout
                </button>
              )}
            </div>

          </div>

          {/* ── RIGHT: Live Preview ─────────────────────────────────────── */}
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
