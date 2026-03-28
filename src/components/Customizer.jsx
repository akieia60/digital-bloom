import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import LivePreview from './LivePreview';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/customizer.css';

// Visual gradient cards — shown on the style step
const COLOR_THEMES = [
  {
    id: 'original',
    nameKey: 'theme_original',
    emoji: '🌸',
    desc: 'Petals & romance',
    colors: ['#FF69B4', '#FFB6C1'],
    bg: 'linear-gradient(135deg,#12091a,#2d1228,#1a0d14)',
  },
  {
    id: 'warm',
    nameKey: 'theme_warm',
    emoji: '🌅',
    desc: 'Warm & glowing',
    colors: ['#FF6B6B', '#FFA07A'],
    bg: 'linear-gradient(135deg,#1a0e00,#2d1a00,#3a2200)',
  },
  {
    id: 'cool',
    nameKey: 'theme_cool',
    emoji: '🌊',
    desc: 'Calm & serene',
    colors: ['#4ECDC4', '#95E1D3'],
    bg: 'linear-gradient(135deg,#030e20,#062840,#041420)',
  },
  {
    id: 'elegant',
    nameKey: 'theme_elegant',
    emoji: '✨',
    desc: 'Luxe & golden',
    colors: ['#D4AF37', '#F4E4C1'],
    bg: 'linear-gradient(135deg,#100a00,#1e1200,#100a00)',
  },
  {
    id: 'romantic',
    nameKey: 'theme_romantic',
    emoji: '❤️',
    desc: 'Bold & dramatic',
    colors: ['#C41E3A', '#FF1744'],
    bg: 'linear-gradient(135deg,#14081a,#1e0820,#14081a)',
  },
];

const EXTRAS = [
  { id: 'ribbon',   icon: '🎀', nameKey: 'extra_ribbon' },
  { id: 'sparkle',  icon: '✨', nameKey: 'extra_sparkle' },
  { id: 'goldDust', icon: '🌟', nameKey: 'extra_gold_dust' },
];

const SOUND_TRACKS = [
  { id: 'gentle-piano',  nameKey: 'track_gentle_piano',  icon: '🎹', desc: 'Soft & emotional',  src: '/audio/gentle-piano.mp3' },
  { id: 'soft-strings',  nameKey: 'track_soft_strings',  icon: '🎻', desc: 'Rich & sweeping',   src: '/audio/soft-strings.mp3' },
  { id: 'ambient-bloom', nameKey: 'track_ambient_bloom', icon: '🌸', desc: 'Peaceful & natural', src: '/audio/ambient-bloom.mp3' },
  { id: 'give-flowers',  nameKey: 'track_give_flowers',  icon: '💐', desc: 'Sacred & uplifting', src: null, comingSoon: true },
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
  const audioRef        = useRef(null);
  const webAudioCtxRef  = useRef(null);

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

  const activeTheme = COLOR_THEMES.find(th => th.id === colorTheme) || COLOR_THEMES[0];

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
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
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
    } catch (err) { console.error('Web Audio:', err); setPlayingTrack(null); }
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
      } catch (err) { console.error('Theme save:', err); }
    })();
    const composition = buildCartComposition({ message, colorTheme, extras });
    stopAllAudio();
    onComplete({ productId: product.id, message, colorTheme, extras, selectedSound, totalPrice, composition });
    onClose();
  }, [isProductValid, product, message, colorTheme, extras, selectedSound, totalPrice, themeStyle, stopAllAudio, onComplete, onClose]);

  const goNext = () => setActiveStep(prev => Math.min(prev + 1, FLOW_STEPS.length));
  const goBack = () => setActiveStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  // Selected sound track info
  const activeSoundTrack = SOUND_TRACKS.find(tr => tr.id === selectedSound);

  return (
    <>
      <div className={`customizer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} role="presentation" />
      <div className={`customizer-sheet ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="customizer-sheet__drag-indicator" />

        {/* ── HEADER ── */}
        <div className="customizer-sheet__header">
          <h2 className="customizer-sheet__title">{t('cust_title')}</h2>
          <button type="button" className="customizer-sheet__close" onClick={onClose} aria-label={t('cust_close')}>✕</button>
        </div>

        {/* ── STEP PROGRESS DOTS ── */}
        <div className="cust-step-bar">
          {FLOW_STEPS.map(step => (
            <div
              key={step.id}
              className={`cust-step-dot ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'done' : ''}`}
              onClick={() => activeStep > step.id && setActiveStep(step.id)}
            >
              <span>{activeStep > step.id ? '✓' : step.id}</span>
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className={`customizer-sheet__body step-${activeStep}`}>

          {/* Live preview — hidden on style step so cards can breathe */}
          {activeStep !== 2 && (
            <div className="customizer-preview-shell">
              <LivePreview
                product={product}
                colorTheme={colorTheme}
                extras={extras}
                message={message}
                className="composition-preview--square"
              />
            </div>
          )}

          {/* ═══ STEP 1 — Message ═══ */}
          {activeStep === 1 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">1</span>
                <h3 className="customizer-section__title">{t('cust_step1_title')}</h3>
              </div>

              {/* Main message — textarea for heartfelt messages */}
              <div className="customizer-field">
                <textarea
                  id="cust-msg"
                  className="customizer-textarea"
                  placeholder={messagePlaceholder || 'Write something from the heart…'}
                  maxLength={300}
                  rows={4}
                  value={message.short}
                  onChange={e => handleMessageChange('short', e.target.value)}
                />
                <span className="customizer-hint">{message.short.length}/300</span>
              </div>

              {/* To / From */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="customizer-field">
                  <label className="customizer-label" htmlFor="cust-to">{t('cust_to')}</label>
                  <input id="cust-to" type="text" className="customizer-input"
                    placeholder={toPlaceholder || 'Recipient'}
                    value={message.toName}
                    onChange={e => handleMessageChange('toName', e.target.value)} />
                </div>
                <div className="customizer-field">
                  <label className="customizer-label" htmlFor="cust-from">{t('cust_from')}</label>
                  <input id="cust-from" type="text" className="customizer-input"
                    placeholder={t('cust_from_placeholder')}
                    value={message.fromName}
                    onChange={e => handleMessageChange('fromName', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 2 — Visual Style (full-screen cards, no preview) ═══ */}
          {activeStep === 2 && (
            <div className="style-card-scroll">
              <div className="style-card-header">
                <span className="style-card-eyebrow">STEP 2</span>
                <h3 className="style-card-title">{t('cust_step2_title')}</h3>
              </div>
              <div className="style-card-grid">
                {COLOR_THEMES.map(theme => (
                  <div
                    key={theme.id}
                    className={`style-card ${colorTheme === theme.id ? 'style-card--active' : ''}`}
                    style={{ background: theme.bg }}
                    onClick={() => setColorTheme(theme.id)}
                    role="radio"
                    aria-checked={colorTheme === theme.id}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setColorTheme(theme.id)}
                  >
                    <div className="style-card__emoji">{theme.emoji}</div>
                    <div className="style-card__name">{t(theme.nameKey)}</div>
                    <div className="style-card__desc">{theme.desc}</div>
                    {colorTheme === theme.id && (
                      <div className="style-card__check">✓ SELECTED</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 3 — Extras ═══ */}
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
                    aria-pressed={extras[extra.id]}>
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

          {/* ═══ STEP 4 — Sound (visual music cards) ═══ */}
          {activeStep === 4 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">4</span>
                <h3 className="customizer-section__title">{t('cust_step4_title')}</h3>
              </div>
              <div className="sound-card-grid">
                {SOUND_TRACKS.map(track => (
                  <button key={track.id} type="button"
                    className={`sound-card ${selectedSound === track.id ? 'sound-card--active' : ''} ${track.comingSoon ? 'sound-card--disabled' : ''}`}
                    onClick={() => !track.comingSoon && handleSoundPreview(track)}
                    disabled={track.comingSoon}
                    aria-label={t(track.nameKey)}>
                    <div className="sound-card__icon">{track.icon}</div>
                    <div className="sound-card__info">
                      <span className="sound-card__name">{t(track.nameKey)}</span>
                      <span className="sound-card__desc">{track.comingSoon ? t('cust_coming_soon') : track.desc}</span>
                    </div>
                    {!track.comingSoon && (
                      <span className="sound-card__play">
                        {playingTrack === track.id ? '⏸' : '▶'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 5 — Review (visual preview card) ═══ */}
          {activeStep === 5 && (
            <div className="customizer-section">
              <div className="customizer-section__header">
                <span className="customizer-section__number">5</span>
                <h3 className="customizer-section__title">{t('cust_step5_title')}</h3>
              </div>

              {/* Visual preview — shows what the recipient sees */}
              <div className="bloom-preview-card" style={{ background: activeTheme.bg }}>
                <div className="bloom-preview-card__glow" />
                <div className="bloom-preview-card__emoji">{activeTheme.emoji}</div>
                {message.toName && (
                  <div className="bloom-preview-card__to">
                    FOR {message.toName.toUpperCase()}
                  </div>
                )}
                <div className="bloom-preview-card__msg">
                  "{message.short || '…'}"
                </div>
                {message.fromName && (
                  <div className="bloom-preview-card__from">— {message.fromName}</div>
                )}
                {activeSoundTrack && !activeSoundTrack.comingSoon && (
                  <div className="bloom-preview-card__music">
                    {activeSoundTrack.icon} {t(activeSoundTrack.nameKey)}
                  </div>
                )}
              </div>

              {/* Text summary */}
              <div className="customizer-review-card">
                <p><strong>{t('cust_review_frame')}:</strong> {t(activeTheme.nameKey)}</p>
                <p><strong>{t('cust_review_effects')}:</strong> {EXTRAS.filter(e => extras[e.id]).map(e => t(e.nameKey)).join(', ') || t('cust_review_none')}</p>
                <p><strong>{t('cust_review_sound')}:</strong> {activeSoundTrack ? t(activeSoundTrack.nameKey) : t('cust_review_none')}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── UNIFIED BOTTOM BAR ── */}
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
              disabled={!isProductValid}>
              {t('cust_add_to_cart')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Customizer;
