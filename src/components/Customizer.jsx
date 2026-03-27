import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import LivePreview from './LivePreview';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'ribbon', icon: '🎀', name: 'Ribbon Wrap' },
  { id: 'sparkle', icon: '✨', name: 'Sparkle Effect' },
  { id: 'goldDust', icon: '🌟', name: 'Gold Dust' },
];

const SOUND_TRACKS = [
  { id: 'gentle-piano', name: 'Gentle Piano', icon: '🎹', src: '/audio/gentle-piano.mp3' },
  { id: 'soft-strings', name: 'Soft Strings', icon: '🎻', src: '/audio/soft-strings.mp3' },
  { id: 'ambient-bloom', name: 'Ambient Bloom', icon: '🌸', src: '/audio/ambient-bloom.mp3' },
  { id: 'give-flowers', name: 'Give Them Their Flowers', icon: '💐', src: null, comingSoon: true },
];

const COLOR_THEMES = [
  { id: 'original', name: 'Original', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'warm', name: 'Warm Sunset', colors: ['#FF6B6B', '#FFA07A'] },
  { id: 'cool', name: 'Cool Breeze', colors: ['#4ECDC4', '#95E1D3'] },
  { id: 'elegant', name: 'Elegant Gold', colors: ['#D4AF37', '#F4E4C1'] },
  { id: 'romantic', name: 'Romantic Rose', colors: ['#C41E3A', '#FF1744'] },
];

const FLOW_STEPS = [
  { id: 1, key: 'message', label: 'Message' },
  { id: 2, key: 'frame', label: 'Frame' },
  { id: 3, key: 'effect', label: 'Effect' },
  { id: 4, key: 'sound', label: 'Sound' },
  { id: 5, key: 'review', label: 'Review' },
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
  const [extras, setExtras] = useState({ ribbon: false, sparkle: false, goldDust: false });
  const [selectedSound, setSelectedSound] = useState(stateDefaults.sound || '');
  const [playingTrack, setPlayingTrack] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const audioRef = useRef(null);

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
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (webAudioCtxRef.current) {
        webAudioCtxRef.current.close();
        webAudioCtxRef.current = null;
      }
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

  // Web Audio API fallback — plays a pleasant chord when no MP3 file exists yet
  const webAudioCtxRef = useRef(null);
  const playWebAudioTone = useCallback((trackId) => {
    try {
      // Stop previous web audio
      if (webAudioCtxRef.current) {
        webAudioCtxRef.current.close();
        webAudioCtxRef.current = null;
      }
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      webAudioCtxRef.current = ctx;

      // Each track gets its own chord voicing and character
      const configs = {
        'gentle-piano':  { freqs: [261.63, 329.63, 392.00, 523.25], type: 'triangle', duration: 3.5 }, // C major chord
        'soft-strings':  { freqs: [196.00, 246.94, 293.66, 392.00], type: 'sine',     duration: 4.0 }, // G major
        'ambient-bloom': { freqs: [220.00, 277.18, 329.63, 440.00], type: 'sine',     duration: 4.5 }, // A major
      };
      const { freqs, type, duration } = configs[trackId] || configs['gentle-piano'];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.18;
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + i * 0.06;
        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.7, startTime + 0.15);
        oscGain.gain.setValueAtTime(0.7, startTime + duration - 0.8);
        oscGain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      setPlayingTrack(trackId);
      // Auto-clear state after tone ends
      const longestDuration = (duration + (freqs.length - 1) * 0.06) * 1000;
      setTimeout(() => {
        if (webAudioCtxRef.current === ctx) {
          ctx.close();
          webAudioCtxRef.current = null;
          setPlayingTrack(null);
        }
      }, longestDuration + 200);
    } catch (err) {
      console.error('Web Audio API unavailable:', err);
      setPlayingTrack(null);
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (webAudioCtxRef.current) {
      webAudioCtxRef.current.close();
      webAudioCtxRef.current = null;
    }
    setPlayingTrack(null);
  }, []);

  // Sound preview playback — tries real MP3 first, falls back to Web Audio API tone
  const handleSoundPreview = useCallback((track) => {
    // Tapping the playing track stops it
    if (playingTrack === track.id) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    setSelectedSound(track.id);

    if (!track.src) {
      // No file path — go straight to Web Audio tone
      playWebAudioTone(track.id);
      return;
    }

    // Try loading the real MP3 file
    const audio = new Audio(track.src);
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.play()
      .then(() => {
        // Real file loaded and playing
        setPlayingTrack(track.id);
        const autoStop = setTimeout(() => {
          if (audioRef.current === audio) {
            audio.pause();
            audioRef.current = null;
            setPlayingTrack(null);
          }
        }, 15000);
        audio.onended = () => {
          clearTimeout(autoStop);
          setPlayingTrack(null);
          audioRef.current = null;
        };
      })
      .catch(() => {
        // MP3 not found yet — fall back to Web Audio API tone
        audioRef.current = null;
        playWebAudioTone(track.id);
      });
  }, [playingTrack, stopAllAudio, playWebAudioTone]);

  // Pricing — extras are included (no extra cost per Gamble's spec)
  const basePrice = parseFloat(product?.price || 0);
  const totalPrice = basePrice;
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
    // Stop audio on complete
    stopAllAudio();
    onComplete({ productId: product.id, message, colorTheme, extras, selectedSound, totalPrice, composition });
    onClose();
  }, [isProductValid, product, message, colorTheme, extras, selectedSound, totalPrice, themeStyle, stopAllAudio, onComplete, onClose]);

  const goNext = () => setActiveStep((prev) => Math.min(prev + 1, FLOW_STEPS.length));
  const goBack = () => setActiveStep((prev) => Math.max(prev - 1, 1));

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

        {/* Body — step flow with persistent top preview */}
        <div className="customizer-sheet__body">

          <div className="customizer-preview-shell">
            <div className="customizer-preview-shell__label">Live Bloom Preview</div>
            <LivePreview
              product={product}
              colorTheme={colorTheme}
              extras={extras}
              message={message}
              className="composition-preview--square"
            />
          </div>

          {activeStep === 1 && (
            <>
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
                maxLength="150"
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
              />
              <span className="customizer-hint">{message.short.length}/150</span>
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
            </>
          )}

          {activeStep === 2 && (
            <>
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
            </>
          )}

          {activeStep === 3 && (
            <>
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
                  aria-label={extra.name}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon" aria-hidden="true">{extra.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{extra.name}</span>
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
            </>
          )}

          {activeStep === 4 && (
            <>
          <div className="customizer-section">
            <div className="customizer-section__header">
              <span className="customizer-section__number">4</span>
              <h3 className="customizer-section__title">Sound</h3>
            </div>
            <div className="extras-grid">
              {SOUND_TRACKS.map(track => (
                <button key={track.id} type="button"
                  className={`extra-toggle ${selectedSound === track.id ? 'extra-toggle--active' : ''} ${track.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !track.comingSoon && handleSoundPreview(track)}
                  disabled={track.comingSoon}
                  aria-label={track.comingSoon ? `${track.name} — coming soon` : `Preview ${track.name}`}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon" aria-hidden="true">{track.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{track.name}</span>
                      {track.comingSoon && (
                        <span className="extra-toggle__price" style={{ color: '#C9A14A' }}>Coming Soon</span>
                      )}
                    </div>
                  </div>
                  {!track.comingSoon && (
                    <span style={{ fontSize: '18px', color: playingTrack === track.id ? '#C9A14A' : '#AEAEB2', transition: 'color 0.2s' }}>
                      {playingTrack === track.id ? '⏸' : '▶'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
            </>
          )}

          {activeStep === 5 && (
            <div className="customizer-section customizer-section--review">
              <div className="customizer-section__header">
                <span className="customizer-section__number">5</span>
                <h3 className="customizer-section__title">Review Your Bloom</h3>
              </div>
              <div className="customizer-review-card">
                <p><strong>To:</strong> {message.toName || '—'}</p>
                <p><strong>From:</strong> {message.fromName || '—'}</p>
                <p><strong>Message:</strong> {message.short || '—'}</p>
                <p><strong>Frame:</strong> {COLOR_THEMES.find((theme) => theme.id === colorTheme)?.name || 'Original'}</p>
                <p><strong>Effects:</strong> {EXTRAS.filter((extra) => extras[extra.id]).map((extra) => extra.name).join(', ') || 'None selected'}</p>
                <p><strong>Sound:</strong> {SOUND_TRACKS.find((track) => track.id === selectedSound)?.name || 'None selected'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── UNIFIED BOTTOM BAR — Back / Next or Add to Cart ── */}
        <div className="customizer-sticky-cta">
          {activeStep > 1 ? (
            <button type="button" className="cta-back-btn" onClick={goBack}>← Back</button>
          ) : (
            <button type="button" className="cta-back-btn" onClick={onClose}>✕ Close</button>
          )}
          <div className="cta-pricing">
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          {activeStep < FLOW_STEPS.length ? (
            <button type="button" className="cta-add-btn" onClick={goNext}>
              Next →
            </button>
          ) : (
            <button type="button" className="cta-add-btn" onClick={handleComplete}
              disabled={!isProductValid} aria-label={`Add to cart for $${totalPrice.toFixed(2)}`}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Customizer;
