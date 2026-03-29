import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import { useLanguage } from '../contexts/LanguageContext';
import LivePreview from './LivePreview';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'ribbon', icon: '🎀', nameKey: 'customize_extra_ribbon' },
  { id: 'sparkle', icon: '✨', nameKey: 'customize_extra_sparkle' },
  { id: 'goldDust', icon: '🌟', nameKey: 'customize_extra_gold' },
];

const SOUND_TRACKS = [
  { id: 'gentle-piano', nameKey: 'customize_sound_piano', icon: '🎹', src: '/audio/gentle-piano.mp3' },
  { id: 'soft-strings', nameKey: 'customize_sound_strings', icon: '🎻', src: '/audio/soft-strings.mp3' },
  { id: 'ambient-bloom', nameKey: 'customize_sound_bloom', icon: '🌸', src: '/audio/ambient-bloom.mp3' },
  { id: 'golden-harp', nameKey: 'customize_sound_harp', icon: '🪕', src: '/audio/golden-harp.mp3' },
  { id: 'ocean-breeze', nameKey: 'customize_sound_ocean', icon: '🌊', src: '/audio/ocean-breeze.mp3' },
  { id: 'jazz-lounge', nameKey: 'customize_sound_jazz', icon: '🎷', src: '/audio/jazz-lounge.mp3' },
  { id: 'r-and-b-soul', nameKey: 'customize_sound_rnb', icon: '🎤', src: '/audio/r-and-b-soul.mp3' },
  { id: 'give-flowers', nameKey: 'customize_sound_flowers', icon: '💐', src: null, comingSoon: true },
];

const COLOR_THEMES = [
  { id: 'original', nameKey: 'customize_theme_original', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'warm', nameKey: 'customize_theme_sunset', colors: ['#FF6B6B', '#FFA07A'] },
  { id: 'cool', nameKey: 'customize_theme_breeze', colors: ['#4ECDC4', '#95E1D3'] },
  { id: 'elegant', nameKey: 'customize_theme_gold', colors: ['#D4AF37', '#F4E4C1'] },
  { id: 'romantic', nameKey: 'customize_theme_rose', colors: ['#C41E3A', '#FF1744'] },
];

const FLOW_STEPS = [
  { id: 1, key: 'message', labelKey: 'customize_step_message', icon: '✉️' },
  { id: 2, key: 'frame', labelKey: 'customize_step_frame', icon: '🎨' },
  { id: 3, key: 'effect', labelKey: 'customize_step_effect', icon: '✨' },
  { id: 4, key: 'sound', labelKey: 'customize_step_sound', icon: '🎵' },
  { id: 5, key: 'review', labelKey: 'customize_step_review', icon: '✓' },
];

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {} }) => {
  const { t } = useLanguage();
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
        'gentle-piano':  { freqs: [261.63, 329.63, 392.00, 523.25], type: 'triangle', duration: 3.5 },
        'soft-strings':  { freqs: [196.00, 246.94, 293.66, 392.00], type: 'sine',     duration: 4.0 },
        'ambient-bloom': { freqs: [220.00, 277.18, 329.63, 440.00], type: 'sine',     duration: 4.5 },
        'golden-harp':   { freqs: [293.66, 369.99, 440.00, 587.33], type: 'triangle', duration: 4.0 },
        'ocean-breeze':  { freqs: [174.61, 220.00, 261.63, 349.23], type: 'sine',     duration: 5.0 },
        'jazz-lounge':   { freqs: [233.08, 293.66, 349.23, 466.16], type: 'triangle', duration: 3.5 },
        'r-and-b-soul':  { freqs: [207.65, 261.63, 311.13, 415.30], type: 'sine',     duration: 4.0 },
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
          <h2 className="customizer-sheet__title">{t('customize_title')}</h2>
          <button type="button" className="customizer-sheet__close" onClick={onClose} aria-label={t('customize_close')}>✕</button>
        </div>

        {/* Step Progress Bar */}
        <div className="customizer-step-bar">
          {FLOW_STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              className={`customizer-step-bar__item ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'done' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="customizer-step-bar__dot">
                {activeStep > step.id ? '✓' : step.icon}
              </span>
              <span className="customizer-step-bar__label">{t(step.labelKey)}</span>
            </button>
          ))}
          {/* Progress line */}
          <div className="customizer-step-bar__track">
            <div className="customizer-step-bar__fill" style={{ width: `${((activeStep - 1) / (FLOW_STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Body — step flow with persistent top preview */}
        <div className="customizer-sheet__body">

          <div className="customizer-preview-shell">
            <div className="customizer-preview-shell__label">{t('customize_preview')}</div>
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
              <h3 className="customizer-section__title">{t('customize_your_message')}</h3>
            </div>

            <div className="customizer-field">
              <input
                id="cust-msg"
                type="text"
                className="customizer-input"
                placeholder={messagePlaceholder || t('customize_message_placeholder')}
                maxLength="150"
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
              />
              <span className="customizer-hint">{message.short.length}/150</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-to">{t('customize_to')}</label>
                <input id="cust-to" type="text" className="customizer-input"
                  placeholder={toPlaceholder || t('customize_to_placeholder')}
                  value={message.toName}
                  onChange={(e) => handleMessageChange('toName', e.target.value)} />
              </div>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-from">{t('customize_from')}</label>
                <input id="cust-from" type="text" className="customizer-input"
                  placeholder={t('customize_from_placeholder')}
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
              <h3 className="customizer-section__title">{t('customize_style')}</h3>
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
                  <span className="theme-name">{t(theme.nameKey)}</span>
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
              <h3 className="customizer-section__title">{t('customize_extras')}</h3>
            </div>
            <div className="extras-grid">
              {EXTRAS.map(extra => (
                <button key={extra.id} type="button"
                  className={`extra-toggle ${extras[extra.id] ? 'extra-toggle--active' : ''}`}
                  onClick={() => toggleExtra(extra.id)}
                  aria-pressed={extras[extra.id]}
                  aria-label={t(extra.nameKey)}>
                  <div className="extra-toggle__info">
                    <span className="extra-toggle__icon" aria-hidden="true">{extra.icon}</span>
                    <div>
                      <span className="extra-toggle__name">{t(extra.nameKey)}</span>
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
          <div className="customizer-section customizer-section--sound">
            <div className="customizer-section__header">
              <span className="customizer-section__number">4</span>
              <h3 className="customizer-section__title">{t('customize_sound')}</h3>
            </div>
            <div className="sound-grid">
              {SOUND_TRACKS.map(track => (
                <button key={track.id} type="button"
                  className={`sound-card ${selectedSound === track.id ? 'sound-card--active' : ''} ${track.comingSoon ? 'sound-card--disabled' : ''}`}
                  onClick={() => !track.comingSoon && handleSoundPreview(track)}
                  disabled={track.comingSoon}
                  aria-label={track.comingSoon ? `${t(track.nameKey)} — ${t('customize_coming_soon')}` : `Preview ${t(track.nameKey)}`}>
                  <span className="sound-card__icon">{track.icon}</span>
                  <span className="sound-card__name">{t(track.nameKey)}</span>
                  {track.comingSoon ? (
                    <span className="sound-card__badge">{t('customize_coming_soon')}</span>
                  ) : (
                    <span className="sound-card__play">
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
                <h3 className="customizer-section__title">{t('customize_review_title')}</h3>
              </div>
              <div className="customizer-review-card">
                <div className="review-row"><span className="review-label">{t('customize_review_to')}</span><span className="review-value">{message.toName || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_from')}</span><span className="review-value">{message.fromName || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_message')}</span><span className="review-value">{message.short || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_frame')}</span><span className="review-value">{t(COLOR_THEMES.find((theme) => theme.id === colorTheme)?.nameKey) || t('customize_theme_original')}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_effects')}</span><span className="review-value">{EXTRAS.filter((extra) => extras[extra.id]).map((extra) => t(extra.nameKey)).join(', ') || 'None selected'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_sound')}</span><span className="review-value">{SOUND_TRACKS.find((track) => track.id === selectedSound) ? t(SOUND_TRACKS.find((track) => track.id === selectedSound).nameKey) : 'None selected'}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* ── UNIFIED BOTTOM BAR — Back / Next or Add to Cart ── */}
        <div className="customizer-sticky-cta">
          {activeStep > 1 ? (
            <button type="button" className="cta-back-btn" onClick={goBack}>{t('customize_btn_back')}</button>
          ) : (
            <button type="button" className="cta-back-btn" onClick={onClose}>{t('customize_btn_close')}</button>
          )}
          <div className="cta-pricing">
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          {activeStep < FLOW_STEPS.length ? (
            <button type="button" className="cta-add-btn" onClick={goNext}>
              {t('customize_btn_next')}
            </button>
          ) : (
            <button type="button" className="cta-add-btn" onClick={handleComplete}
              disabled={!isProductValid} aria-label={`Add to cart for $${totalPrice.toFixed(2)}`}>
              {t('customize_btn_add_cart')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Customizer;
