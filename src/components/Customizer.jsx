import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import LivePreview from './LivePreview';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'ribbon',   icon: '🎀', nameKey: 'extra_ribbon' },
  { id: 'sparkle',  icon: '✨', nameKey: 'extra_sparkle' },
  { id: 'goldDust', icon: '🌟', nameKey: 'extra_gold_dust' },
];

const SOUND_TRACKS = [
  { id: 'gentle-piano',  nameKey: 'track_gentle_piano',  icon: '🎹', src: '/audio/gentle-piano.mp3' },
  { id: 'soft-strings',  nameKey: 'track_soft_strings',  icon: '🎻', src: '/audio/soft-strings.mp3' },
  { id: 'ambient-bloom', nameKey: 'track_ambient_bloom', icon: '🌸', src: '/audio/ambient-bloom.mp3' },
  { id: 'give-flowers',  nameKey: 'track_give_flowers',  icon: '💐', src: null, comingSoon: true },
];

const COLOR_THEMES = [
  { id: 'original', nameKey: 'theme_original', colors: ['#FF69B4', '#FFB6C1'] },
  { id: 'warm',     nameKey: 'theme_warm',     colors: ['#FF6B6B', '#FFA07A'] },
  { id: 'cool',     nameKey: 'theme_cool',     colors: ['#4ECDC4', '#95E1D3'] },
  { id: 'elegant',  nameKey: 'theme_elegant',  colors: ['#D4AF37', '#F4E4C1'] },
  { id: 'romantic', nameKey: 'theme_romantic', colors: ['#C41E3A', '#FF1744'] },
];

const FLOW_STEPS = [
  { id: 1, key: 'message', labelKey: 'cust_step1_title' },
  { id: 2, key: 'frame',   labelKey: 'cust_step2_title' },
  { id: 3, key: 'effect',  labelKey: 'cust_step3_title' },
  { id: 4, key: 'sound',   labelKey: 'cust_step4_title' },
  { id: 5, key: 'review',  labelKey: 'cust_step5_title' },
];

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {} }) => {
  const { t } = useLanguage();
  const { messagePlaceholder, toPlaceholder, ...stateDefaults } = defaults;
  const scrollPosRef = useRef(0);

  const [message, setMessage] = useState({
    short:    stateDefaults.short    || '',
    toName:   stateDefaults.toName   || '',
    fromName: stateDefaults.fromName || '',
  });
  const [colorTheme,    setColorTheme]    = useState(stateDefaults.colorTheme || 'original');
  const [extras,        setExtras]        = useState({ ribbon: false, sparkle: false, goldDust: false });
  const [selectedSound, setSelectedSound] = useState(stateDefaults.sound || '');
  const [playingTrack,  setPlayingTrack]  = useState(null);
  const [activeStep,    setActiveStep]    = useState(1);
  const audioRef       = useRef(null);
  const webAudioCtxRef = useRef(null);

  // Safari-safe scroll lock
  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.top      = `-${scrollPosRef.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width    = '100%';
      document.body.classList.add('customizer-open');
    } else {
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, scrollPosRef.current);
    }
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (webAudioCtxRef.current) { webAudioCtxRef.current.close(); webAudioCtxRef.current = null; }
      document.body.classList.remove('customizer-open');
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
    };
  }, [isOpen]);

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

  const playWebAudioTone = useCallback((trackId) => {
    try {
      if (webAudioCtxRef.current) { webAudioCtxRef.current.close(); webAudioCtxRef.current = null; }
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      webAudioCtxRef.current = ctx;
      const configs = {
        'gentle-piano':  { freqs: [261.63, 329.63, 392.00, 523.25], type: 'triangle', duration: 3.5 },
        'soft-strings':  { freqs: [196.00, 246.94, 293.66, 392.00], type: 'sine',     duration: 4.0 },
        'ambient-bloom': { freqs: [220.00, 277.18, 329.63, 440.00], type: 'sine',     duration: 4.5 },
      };
      const { freqs, type, duration } = configs[trackId] || configs['gentle-piano'];
      freqs.forEach((freq, i) => {
        const osc       = ctx.createOscillator();
        const oscGain   = ctx.createGain();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.18;
        osc.connect(oscGain); oscGain.connect(masterGain); masterGain.connect(ctx.destination);
        osc.type = type; osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.06;
        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.7, startTime + 0.15);
        oscGain.gain.setValueAtTime(0.7, startTime + duration - 0.8);
        oscGain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime); osc.stop(startTime + duration);
      });
      setPlayingTrack(trackId);
      const longestDuration = (duration + (freqs.length - 1) * 0.06) * 1000;
      setTimeout(() => {
        if (webAudioCtxRef.current === ctx) { ctx.close(); webAudioCtxRef.current = null; setPlayingTrack(null); }
      }, longestDuration + 200);
    } catch (err) { console.error('Web Audio API unavailable:', err); setPlayingTrack(null); }
  }, []);

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (webAudioCtxRef.current) { webAudioCtxRef.current.close(); webAudioCtxRef.current = null; }
    setPlayingTrack(null);
  }, []);

  const handleSoundPreview = useCallback((track) => {
    if (playingTrack === track.id) { stopAllAudio(); return; }
    stopAllAudio();
    setSelectedSound(track.id);
    if (!track.src) { playWebAudioTone(track.id); return; }
    const audio = new Audio(track.src);
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.play()
      .then(() => {
        setPlayingTrack(track.id);
        const autoStop = setTimeout(() => {
          if (audioRef.current === audio) { audio.pause(); audioRef.current = null; setPlayingTrack(null); }
        }, 15000);
        audio.onended = () => { clearTimeout(autoStop); setPlayingTrack(null); audioRef.current = null; };
      })
      .catch(() => { audioRef.current = null; playWebAudioTone(track.id); });
  }, [playingTrack, stopAllAudio, playWebAudioTone]);

  const basePrice     = parseFloat(product?.price || 0);
  const totalPrice    = basePrice;
  const isProductValid = Boolean(product?.id && basePrice > 0);

  const handleComplete = useCallback(() => {
    if (!isProductValid) return;
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
    const composition = buildCartComposition({ message, colorTheme, extras });
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
      <div className={`customizer-sheet ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label={t('cust_title')}>
        <div className="customizer-sheet__drag-indicator" />

        {/* Header */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">{t('cust_title')}</h2>
          <button type="button" className="customizer-sheet__close" onClick={onClose} aria-label={t('cust_close')}>✕</button>
        </div>

        {/* Body */}
        <div className="customizer-sheet__body">
          <div className="customizer-preview-shell">
            <div className="customizer-preview-shell__label">{t('cust_preview_label')}</div>
            <LivePreview
              product={product}
              colorTheme={colorTheme}
              extras={extras}
              message={message}
              className="composition-preview--square"
            />
          </div>

          {/* Step 1 — Message */}
          {activeStep === 1 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">1</span>
                <h3 className="customizer-section__title">{t('cust_step1_title')}</h3>
              </div>
              <div className="customizer-field">
                <input
                  id="cust-msg" type="text" className="customizer-input"
                  placeholder={messagePlaceholder || 'e.g., Happy Birthday!'}
                  maxLength="150"
                  value={message.short}
                  onChange={(e) => handleMessageChange('short', e.target.value)}
                />
                <span className="customizer-hint">{message.short.length}/150</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="customizer-field">
                  <label className="customizer-label" htmlFor="cust-to">{t('cust_to')}</label>
                  <input id="cust-to" type="text" className="customizer-input"
                    placeholder={toPlaceholder || 'Recipient'}
                    value={message.toName}
                    onChange={(e) => handleMessageChange('toName', e.target.value)} />
                </div>
                <div className="customizer-field">
                  <label className="customizer-label" htmlFor="cust-from">{t('cust_from')}</label>
                  <input id="cust-from" type="text" className="customizer-input"
                    placeholder={t('cust_from_placeholder')}
                    value={message.fromName}
                    onChange={(e) => handleMessageChange('fromName', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Style */}
          {activeStep === 2 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">2</span>
                <h3 className="customizer-section__title">{t('cust_step2_title')}</h3>
              </div>
              <div className="theme-grid" role="radiogroup" aria-label={t('cust_step2_title')}>
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
          )}

          {/* Step 3 — Extras */}
          {activeStep === 3 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">3</span>
                <h3 className="customizer-section__title">{t('cust_step3_title')}</h3>
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
                      <span className="extra-toggle__name">{t(extra.nameKey)}</span>
                    </div>
                    <span className="toggle-switch" aria-hidden="true">
                      <input type="checkbox" tabIndex={-1} checked={extras[extra.id]} readOnly />
                      <span className="toggle-switch__slider" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Sound */}
          {activeStep === 4 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">4</span>
                <h3 className="customizer-section__title">{t('cust_step4_title')}</h3>
              </div>
              <div className="extras-grid">
                {SOUND_TRACKS.map(track => (
                  <button key={track.id} type="button"
                    className={`extra-toggle ${selectedSound === track.id ? 'extra-toggle--active' : ''} ${track.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !track.comingSoon && handleSoundPreview(track)}
                    disabled={track.comingSoon}
                    aria-label={track.comingSoon ? `${t(track.nameKey)} — ${t('cust_coming_soon')}` : t(track.nameKey)}>
                    <div className="extra-toggle__info">
                      <span className="extra-toggle__icon" aria-hidden="true">{track.icon}</span>
                      <div>
                        <span className="extra-toggle__name">{t(track.nameKey)}</span>
                        {track.comingSoon && (
                          <span className="extra-toggle__price" style={{ color: '#C9A14A' }}>{t('cust_coming_soon')}</span>
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
          )}

          {/* Step 5 — Review */}
          {activeStep === 5 && (
            <div className="customizer-section customizer-section--review">
              <div className="customizer-section__header">
                <span className="customizer-section__number">5</span>
                <h3 className="customizer-section__title">{t('cust_step5_title')}</h3>
              </div>
              <div className="customizer-review-card">
                <p><strong>{t('cust_review_to')}:</strong> {message.toName || '—'}</p>
                <p><strong>{t('cust_review_from')}:</strong> {message.fromName || '—'}</p>
                <p><strong>{t('cust_review_msg')}:</strong> {message.short || '—'}</p>
                <p><strong>{t('cust_review_frame')}:</strong> {t(COLOR_THEMES.find(th => th.id === colorTheme)?.nameKey || 'theme_original')}</p>
                <p><strong>{t('cust_review_effects')}:</strong> {EXTRAS.filter(e => extras[e.id]).map(e => t(e.nameKey)).join(', ') || t('cust_review_none')}</p>
                <p><strong>{t('cust_review_sound')}:</strong> {t(SOUND_TRACKS.find(tr => tr.id === selectedSound)?.nameKey || '') || t('cust_review_none')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Unified bottom bar */}
        <div className="customizer-sticky-cta">
          {activeStep > 1 ? (
            <button type="button" className="cta-back-btn" onClick={goBack}>{t('cust_back')}</button>
          ) : (
            <button type="button" className="cta-back-btn" onClick={onClose}>✕ {t('cust_close')}</button>
          )}
          <div className="cta-pricing">
            <div className="cta-pricing__amount">${totalPrice.toFixed(2)}</div>
          </div>
          {activeStep < FLOW_STEPS.length ? (
            <button type="button" className="cta-add-btn" onClick={goNext}>
              {t('cust_next')}
            </button>
          ) : (
            <button type="button" className="cta-add-btn" onClick={handleComplete}
              disabled={!isProductValid} aria-label={`${t('cust_add_to_cart')} $${totalPrice.toFixed(2)}`}>
              {t('cust_add_to_cart')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Customizer;
