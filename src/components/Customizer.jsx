import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import { COLOR_PALETTES, COLOR_SWATCHES, ENGRAVING_STYLES, MESSAGE_FONT_OPTIONS, getThemeSpec } from '../lib/compositionEngine';
import { useLanguage } from '../contexts/LanguageContext';
import OCCASIONS from '../data/occasions';
import LivePreview from './LivePreview';
import '../styles/customizer.css';

const EXTRAS = [
  { id: 'goldDust', icon: '✨', nameKey: 'customize_extra_gold', descriptionKey: 'customize_extra_gold_desc' },
  { id: 'sparkle', icon: '💎', nameKey: 'customize_extra_sparkle', descriptionKey: 'customize_extra_sparkle_desc' },
  { id: 'ribbon', icon: '🎀', nameKey: 'customize_extra_ribbon', descriptionKey: 'customize_extra_ribbon_desc' },
  { id: 'softGlow', icon: '🕯️', nameKey: 'customize_extra_glow', descriptionKey: 'customize_extra_glow_desc' },
  { id: 'rosePetals', icon: '🌹', nameKey: 'customize_extra_petals', descriptionKey: 'customize_extra_petals_desc' },
];

const SOUND_TRACKS = [
  { id: 'gentle-piano', nameKey: 'customize_sound_piano', icon: '🎹', src: '/audio/gentle-piano.mp3' },
  { id: 'soft-strings', nameKey: 'customize_sound_strings', icon: '🎻', src: '/audio/soft-strings.mp3', comingSoon: true },
  { id: 'ambient-bloom', nameKey: 'customize_sound_bloom', icon: '🌸', src: '/audio/ambient-bloom.mp3', comingSoon: true },
  { id: 'golden-harp', nameKey: 'customize_sound_harp', icon: '🪕', src: '/audio/golden-harp.mp3', comingSoon: true },
  { id: 'ocean-breeze', nameKey: 'customize_sound_ocean', icon: '🌊', src: '/audio/ocean-breeze.mp3', comingSoon: true },
  { id: 'jazz-lounge', nameKey: 'customize_sound_jazz', icon: '🎷', src: '/audio/jazz-lounge.mp3', comingSoon: true },
  { id: 'r-and-b-soul', nameKey: 'customize_sound_rnb', icon: '🎤', src: '/audio/r-and-b-soul.mp3', comingSoon: true },
  { id: 'give-flowers', nameKey: 'customize_sound_flowers', icon: '💐', src: null, comingSoon: true },
];

const FLOW_STEPS = [
  { id: 1, key: 'message', labelKey: 'customize_step_message', icon: '✉️' },
  { id: 2, key: 'frame', labelKey: 'customize_step_frame', icon: '🎨' },
  { id: 3, key: 'effect', labelKey: 'customize_step_effect', icon: '✨' },
  { id: 4, key: 'sound', labelKey: 'customize_step_sound', icon: '🎵' },
  { id: 5, key: 'review', labelKey: 'customize_step_review', icon: '✓' },
];

// Generic fallback starters used when no category is provided
const FALLBACK_STARTERS = [
  'Sending you love and flowers.',
  'You deserve to be celebrated.',
  'Thinking of you always.',
  'Here are your flowers — while you are here.',
];

const ENGRAVING_OPTIONS = Object.keys(ENGRAVING_STYLES).map((id) => ({
  id,
  labelKey: `customize_engraving_${id}`,
  descriptionKey: `customize_engraving_${id}_desc`,
}));

const Customizer = ({ product, isOpen, onClose, onComplete, defaults = {}, editData = null, category = null }) => {
  const { t, lang } = useLanguage();
  const { messagePlaceholder, toPlaceholder, ...stateDefaults } = defaults;

  // Category-aware slogan presets — pull from occasions.js, fall back to generic list
  const sloganPresets = useMemo(() => {
    const slug = category || product?.category;
    return OCCASIONS[slug]?.sloganPresets || FALLBACK_STARTERS;
  }, [category, product?.category]);
  const scrollPosRef = useRef(0);

  // Clean, minimal state
  const [message, setMessage] = useState({
    short: stateDefaults.short || '',
    toName: stateDefaults.toName || '',
    fromName: stateDefaults.fromName || '',
  });
  const [colorTheme, setColorTheme] = useState(stateDefaults.colorTheme || 'original');
  const initialPalette = useMemo(
    () => getThemeSpec(stateDefaults.colorTheme || 'original', {
      primaryColor: stateDefaults.primaryColor,
      accentColor: stateDefaults.accentColor,
    }),
    [stateDefaults.accentColor, stateDefaults.colorTheme, stateDefaults.primaryColor]
  );
  const [primaryColor, setPrimaryColor] = useState(initialPalette.primaryColor);
  const [accentColor, setAccentColor] = useState(initialPalette.accentColor);
  const [extras, setExtras] = useState({
    ribbon: false,
    sparkle: false,
    goldDust: false,
    softGlow: false,
    rosePetals: false,
    ...(stateDefaults.extras || {}),
  });
  const [selectedSound, setSelectedSound] = useState(stateDefaults.selectedSound || stateDefaults.sound || '');
  const [engravingStyle, setEngravingStyle] = useState(stateDefaults.engravingStyle || 'heirloom');
  const [fontChoice, setFontChoice] = useState(stateDefaults.fontChoice || 'playfair');
  const [messageTextColor, setMessageTextColor] = useState(stateDefaults.messageTextColor || '#FFFFFF');
  const [messageBold, setMessageBold] = useState(stateDefaults.messageBold || false);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  // Pre-fill from editData when editing an existing customization from cart
  useEffect(() => {
    if (editData && isOpen) {
      if (editData.message) {
        const msg = typeof editData.message === 'string'
          ? { short: editData.message, toName: '', fromName: '' }
          : { short: editData.message.short || '', toName: editData.message.toName || '', fromName: editData.message.fromName || '' };
        setMessage(msg);
      }
      if (editData.colorTheme || editData.theme) {
        const nextTheme = editData.colorTheme || editData.theme;
        const nextPalette = getThemeSpec(nextTheme, {
          primaryColor: editData.primaryColor || editData.composition?.primaryColor,
          accentColor: editData.accentColor || editData.composition?.accentColor,
        });
        setColorTheme(nextTheme);
        setPrimaryColor(nextPalette.primaryColor);
        setAccentColor(nextPalette.accentColor);
      }
      if (editData.primaryColor || editData.composition?.primaryColor) {
        setPrimaryColor(editData.primaryColor || editData.composition?.primaryColor || initialPalette.primaryColor);
      }
      if (editData.accentColor || editData.composition?.accentColor) {
        setAccentColor(editData.accentColor || editData.composition?.accentColor || initialPalette.accentColor);
      }
      if (editData.selectedSound || editData.sound || editData.composition?.selectedSound) {
        setSelectedSound(editData.selectedSound || editData.sound || editData.composition?.selectedSound || '');
      }
      if (editData.engravingStyle || editData.composition?.engravingStyle) {
        setEngravingStyle(editData.engravingStyle || editData.composition?.engravingStyle || 'heirloom');
      }
      if (editData.fontChoice || editData.composition?.fontChoice) {
        setFontChoice(editData.fontChoice || editData.composition?.fontChoice || 'playfair');
      }
      if (editData.messageTextColor || editData.composition?.messageTextColor) {
        setMessageTextColor(editData.messageTextColor || editData.composition?.messageTextColor || '#FFFFFF');
      }
      if (typeof editData.messageBold === 'boolean' || typeof editData.composition?.messageBold === 'boolean') {
        setMessageBold(editData.messageBold ?? editData.composition?.messageBold ?? false);
      }
      if (editData.composition?.activeOverlays) {
        const newExtras = { ribbon: false, sparkle: false, goldDust: false, softGlow: false, rosePetals: false, balloon: false };
        editData.composition.activeOverlays.forEach(o => { if (o in newExtras) newExtras[o] = true; });
        setExtras(newExtras);
      }
    }
  }, [editData, initialPalette.accentColor, initialPalette.primaryColor, isOpen]);
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
    return getThemeSpec(colorTheme, { primaryColor, accentColor });
  }, [accentColor, colorTheme, primaryColor]);

  const handleMessageChange = useCallback((field, value) => {
    setMessage(prev => ({ ...prev, [field]: value }));
  }, []);

  // Append a slogan preset to the existing message instead of replacing it
  const appendSlogan = useCallback((slogan) => {
    setMessage(prev => {
      const current = prev.short.trim();
      if (!current) return { ...prev, short: slogan };
      return { ...prev, short: current + ' ' + slogan };
    });
  }, []);

  const toggleExtra = useCallback((extraId) => {
    setExtras(prev => ({ ...prev, [extraId]: !prev[extraId] }));
  }, []);

  const applyPalette = useCallback((paletteId) => {
    const palette = getThemeSpec(paletteId);
    setColorTheme(paletteId);
    setPrimaryColor(palette.primaryColor);
    setAccentColor(palette.accentColor);
  }, []);

  const applyColorSwatch = useCallback((kind, hex) => {
    setColorTheme('custom');
    if (kind === 'primary') {
      setPrimaryColor(hex);
      return;
    }
    setAccentColor(hex);
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
        const { supabase } = await import('../lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('digital_bloom_themes').insert([{
            user_id: user.id,
            theme_name: colorTheme,
            primary_color: themeStyle.primaryColor,
            accent_color: themeStyle.accentColor,
          }]);
        }
      } catch (err) { console.error('Theme save (non-blocking):', err); }
    })();
    // Build composition manifest for fulfillment
    const composition = buildCartComposition({
      message,
      colorTheme,
      primaryColor,
      accentColor,
      extras,
      selectedSound,
      engravingStyle,
      fontChoice,
      messageTextColor,
      messageBold,
      locale: lang,
    });
    // Stop audio on complete
    stopAllAudio();
    onComplete({
      productId: product.id,
      message,
      colorTheme,
      primaryColor,
      accentColor,
      extras,
      selectedSound,
      engravingStyle,
      fontChoice,
      messageTextColor,
      messageBold,
      locale: lang,
      totalPrice,
      composition,
    });
    onClose();
  }, [isProductValid, product, message, colorTheme, primaryColor, accentColor, extras, selectedSound, engravingStyle, fontChoice, messageTextColor, messageBold, lang, totalPrice, themeStyle, stopAllAudio, onComplete, onClose]);

  const selectedExtras = useMemo(
    () => EXTRAS.filter((extra) => extras[extra.id]).map((extra) => t(extra.nameKey)),
    [extras, t]
  );

  const recommendedPalettes = useMemo(
    () => ['original', 'warm', 'cool', 'elegant', 'romantic'].map((id) => ({ id, ...COLOR_PALETTES[id] })),
    []
  );

  const fontOptions = useMemo(
    () => [
      { id: 'playfair', label: t('customize_font_playfair') },
      { id: 'outfit', label: t('customize_font_outfit') },
      { id: 'arialBold', label: t('customize_font_arial') },
      { id: 'greatVibes', label: t('customize_font_greatvibes') },
      { id: 'dancingScript', label: t('customize_font_dancing') },
    ],
    [t]
  );

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
              primaryColor={primaryColor}
              accentColor={accentColor}
              extras={extras}
              message={message}
              engravingStyle={engravingStyle}
              fontChoice={fontChoice}
              messageTextColor={messageTextColor}
              messageBold={messageBold}
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

            {/* Category-aware slogan selector — tap/select to ADD to message, not replace */}
            <div className="customizer-slogan-selector">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="customizer-label" htmlFor="cust-slogan-select" style={{ margin: 0 }}>
                  {OCCASIONS[category || product?.category]
                    ? `${OCCASIONS[category || product?.category].emoji || '🌸'} Add to message`
                    : 'Add to message'}
                </label>
                {message.short.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMessageChange('short', '')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      textDecoration: 'underline',
                      padding: '0',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <select
                id="cust-slogan-select"
                className="customizer-select"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    appendSlogan(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Pick a phrase to add…</option>
                {sloganPresets.map((slogan, i) => (
                  <option key={i} value={slogan}>{slogan}</option>
                ))}
              </select>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '4px 0 8px', letterSpacing: '0.02em' }}>
                Each selection adds to your message — mix and match
              </p>
              {/* Quick-tap chip row — first 4 presets */}
              <div className="customizer-starters">
                {sloganPresets.slice(0, 4).map((slogan, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`customizer-starter-chip ${message.short.includes(slogan) ? 'customizer-starter-chip--active' : ''}`}
                    onClick={() => appendSlogan(slogan)}
                  >
                    {slogan.length > 42 ? slogan.slice(0, 40) + '…' : slogan}
                  </button>
                ))}
              </div>
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

            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-font">{t('customize_font_label')}</label>
              <select
                id="cust-font"
                className="customizer-select"
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value)}
              >
                {fontOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <span className="customizer-hint">{t('customize_font_hint')}</span>
            </div>

            {/* Text color swatches */}
            <div className="customizer-field">
              <label className="customizer-label">{t('customize_text_color_label')}</label>
              <div className="customizer-color-swatches">
                {[
                  { hex: '#FFFFFF', label: t('customize_color_white') },
                  { hex: '#F5E6CC', label: t('customize_color_cream') },
                  { hex: '#D4AF37', label: t('customize_color_gold') },
                  { hex: '#F2A8B8', label: t('customize_color_blush') },
                  { hex: '#A8D0F0', label: t('customize_color_sky') },
                  { hex: '#A8D8B0', label: t('customize_color_sage') },
                  { hex: '#C8AEE8', label: t('customize_color_lavender') },
                  { hex: '#F4C4A0', label: t('customize_color_peach') },
                  { hex: '#1D1D1F', label: t('customize_color_charcoal') },
                  { hex: '#1B2A4A', label: t('customize_color_navy') },
                  { hex: '#4A5568', label: t('customize_color_slate') },
                  { hex: '#5C1A2A', label: t('customize_color_burgundy') },
                  { hex: '#1A3C2A', label: t('customize_color_forest') },
                  { hex: '#8B7355', label: t('customize_color_bronze') },
                ].map(({ hex, label }) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() => setMessageTextColor(hex)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: hex, border: '1.5px solid rgba(255,255,255,0.18)', cursor: 'pointer', flexShrink: 0,
                      boxShadow: messageTextColor === hex
                        ? `0 0 0 2px #0D1B36, 0 0 0 4px ${hex === '#1D1D1F' || hex === '#1B2A4A' || hex === '#1A3C2A' ? '#D4AF37' : hex}`
                        : '0 1px 4px rgba(0,0,0,0.3)',
                      transform: messageTextColor === hex ? 'scale(1.15)' : 'scale(1)',
                      transition: 'box-shadow 0.15s, transform 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bold toggle */}
            <div className="customizer-field">
              <label className="customizer-label">{t('customize_text_style_label')}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setMessageBold(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 22px', borderRadius: '22px', border: '1.5px solid',
                    borderColor: !messageBold ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                    background: !messageBold ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.08)',
                    color: !messageBold ? '#D4AF37' : 'rgba(255,255,255,0.8)',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    fontWeight: '400',
                    cursor: 'pointer', transition: 'all 0.18s',
                    minWidth: '90px',
                  }}
                >
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>A</span>
                  <span>Normal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageBold(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 22px', borderRadius: '22px', border: '1.5px solid',
                    borderColor: messageBold ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                    background: messageBold ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.08)',
                    color: messageBold ? '#D4AF37' : 'rgba(255,255,255,0.8)',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: 'pointer', transition: 'all 0.18s',
                    minWidth: '90px',
                  }}
                >
                  <span style={{ fontWeight: '800', fontSize: '1.05rem', lineHeight: 1 }}>B</span>
                  <span>Bold</span>
                </button>
              </div>
            </div>

            <div className="customizer-live-copy">
              <div className="customizer-live-copy__header">
                <span>{t('customize_live_card_label')}</span>
                <span>{fontOptions.find((option) => option.id === fontChoice)?.label || t('customize_font_playfair')}</span>
              </div>
              <div className={`customizer-live-copy__stage customizer-live-copy__stage--${engravingStyle}`}>
                <div
                  className="customizer-live-copy__to"
                  style={{
                    fontFamily: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFamily,
                    fontWeight: MESSAGE_FONT_OPTIONS[fontChoice]?.previewWeight,
                    fontStyle: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFontStyle,
                    letterSpacing: MESSAGE_FONT_OPTIONS[fontChoice]?.previewLetterSpacing,
                    textTransform: MESSAGE_FONT_OPTIONS[fontChoice]?.previewTransform === 'uppercase' ? 'uppercase' : 'uppercase',
                  }}
                >
                  {message.toName || t('customize_live_card_to')}
                </div>
                <div
                  className="customizer-live-copy__message"
                  style={{
                    fontFamily: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFamily,
                    fontWeight: messageBold ? '800' : MESSAGE_FONT_OPTIONS[fontChoice]?.previewWeight,
                    fontStyle: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFontStyle,
                    letterSpacing: MESSAGE_FONT_OPTIONS[fontChoice]?.previewLetterSpacing,
                    textTransform: MESSAGE_FONT_OPTIONS[fontChoice]?.previewTransform,
                    color: messageTextColor,
                  }}
                >
                  {message.short || t('customize_live_card_message')}
                </div>
                <div
                  className="customizer-live-copy__from"
                  style={{
                    fontFamily: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFamily,
                    fontWeight: MESSAGE_FONT_OPTIONS[fontChoice]?.previewWeight,
                    fontStyle: MESSAGE_FONT_OPTIONS[fontChoice]?.previewFontStyle,
                    letterSpacing: MESSAGE_FONT_OPTIONS[fontChoice]?.previewLetterSpacing,
                    textTransform: MESSAGE_FONT_OPTIONS[fontChoice]?.previewTransform === 'uppercase' ? 'uppercase' : 'uppercase',
                  }}
                >
                  {message.fromName || t('customize_live_card_from')}
                </div>
              </div>
              <p className="customizer-live-copy__note">{t('customize_live_card_note')}</p>
            </div>

            <div className="customizer-engraving-map">
              <div className="customizer-engraving-map__header">
                <span>{t('customize_engraving_map_title')}</span>
                <span>{t(`customize_engraving_${engravingStyle}`)}</span>
              </div>
              <div className="customizer-engraving-map__body">
                <div className="customizer-engraving-map__to">{t('customize_engraving_map_to')}</div>
                <div className="customizer-engraving-map__message">{t('customize_engraving_map_message')}</div>
                <div className="customizer-engraving-map__from">{t('customize_engraving_map_from')}</div>
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
            <div className="customizer-label customizer-label--caps">{t('customize_palette_recommended')}</div>
            <div className="theme-grid theme-grid--palette" role="radiogroup" aria-label="Recommended palettes">
              {recommendedPalettes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={colorTheme === theme.id}
                  className={`theme-swatch ${colorTheme === theme.id ? 'active' : ''}`}
                  onClick={() => applyPalette(theme.id)}
                >
                  <div className="theme-colors">
                    <span style={{ background: theme.primaryColor }} />
                    <span style={{ background: theme.accentColor }} />
                  </div>
                  <span className="theme-name">{t(theme.nameKey)}</span>
                </button>
              ))}
            </div>

            <div className="customizer-palette-card">
              <div className="customizer-palette-card__header">
                <span>{t('customize_color_primary')}</span>
                <span>{primaryColor}</span>
              </div>
              <div className="color-swatch-row">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={`primary-${swatch.id}`}
                    type="button"
                    className={`color-chip ${primaryColor === swatch.hex ? 'color-chip--active' : ''}`}
                    onClick={() => applyColorSwatch('primary', swatch.hex)}
                    aria-label={`${t('customize_color_primary')}: ${t(swatch.nameKey)}`}
                    title={t(swatch.nameKey)}
                    style={{ '--chip-color': swatch.hex }}
                  >
                    <span className="sr-only">{t(swatch.nameKey)}</span>
                  </button>
                ))}
              </div>
              <p className="customizer-palette-card__hint">{t('customize_color_primary_hint')}</p>
            </div>

            <div className="customizer-palette-card">
              <div className="customizer-palette-card__header">
                <span>{t('customize_color_accent')}</span>
                <span>{accentColor}</span>
              </div>
              <div className="color-swatch-row">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={`accent-${swatch.id}`}
                    type="button"
                    className={`color-chip ${accentColor === swatch.hex ? 'color-chip--active' : ''}`}
                    onClick={() => applyColorSwatch('accent', swatch.hex)}
                    aria-label={`${t('customize_color_accent')}: ${t(swatch.nameKey)}`}
                    title={t(swatch.nameKey)}
                    style={{ '--chip-color': swatch.hex }}
                  >
                    <span className="sr-only">{t(swatch.nameKey)}</span>
                  </button>
                ))}
              </div>
              <p className="customizer-palette-card__hint">{t('customize_color_accent_hint')}</p>
            </div>

            <div className="customizer-section__subgroup" style={{ marginTop: '18px' }}>
              <div className="customizer-label" style={{ marginBottom: '10px', display: 'block' }}>{t('customize_engraving_finish')}</div>
              <div className="extras-grid">
                {ENGRAVING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`extra-toggle ${engravingStyle === option.id ? 'extra-toggle--active' : ''}`}
                    onClick={() => setEngravingStyle(option.id)}
                    aria-pressed={engravingStyle === option.id}
                  >
                    <div className="extra-toggle__info" style={{ alignItems: 'flex-start' }}>
                      <div>
                        <span className="extra-toggle__name">{t(option.labelKey)}</span>
                        <div className="text-[11px] leading-[1.4] text-[#6E6E73] mt-1">{t(option.descriptionKey)}</div>
                      </div>
                    </div>
                    <span className="toggle-switch" aria-hidden="true">
                      <input type="checkbox" tabIndex={-1} checked={engravingStyle === option.id} readOnly />
                      <span className="toggle-switch__slider" />
                    </span>
                  </button>
                ))}
              </div>
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
                      <div className="extra-toggle__description">{t(extra.descriptionKey)}</div>
                    </div>
                  </div>
                  <span className="toggle-switch" aria-hidden="true">
                    <input type="checkbox" tabIndex={-1} checked={extras[extra.id]} readOnly />
                    <span className="toggle-switch__slider" />
                  </span>
                </button>
              ))}
            </div>
            <div className="customizer-sound-summary">
              <span className="customizer-sound-summary__label">{t('customize_review_effects')}</span>
              <span className="customizer-sound-summary__value">
                {selectedExtras.length > 0 ? selectedExtras.join(', ') : t('customize_extras_selected_none')}
              </span>
              <p className="customizer-sound-summary__note">{t('customize_extras_hint')}</p>
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
            <div className="customizer-sound-summary">
              <span className="customizer-sound-summary__label">{t('customize_sound_selected')}</span>
              <span className="customizer-sound-summary__value">
                {SOUND_TRACKS.find((track) => track.id === selectedSound)
                  ? t(SOUND_TRACKS.find((track) => track.id === selectedSound).nameKey)
                  : t('customize_sound_none')}
              </span>
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
                <div className="review-row"><span className="review-label">{t('customize_review_frame')}</span><span className="review-value">{t((COLOR_PALETTES[colorTheme] || COLOR_PALETTES.custom).nameKey)}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_palette')}</span><span className="review-value">{primaryColor} · {accentColor}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_engraving')}</span><span className="review-value">{t(`customize_engraving_${engravingStyle}`)}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_font')}</span><span className="review-value">{fontOptions.find((option) => option.id === fontChoice)?.label || t('customize_font_playfair')}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_effects')}</span><span className="review-value">{selectedExtras.join(', ') || t('customize_extras_selected_none')}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_sound')}</span><span className="review-value">{SOUND_TRACKS.find((track) => track.id === selectedSound) ? t(SOUND_TRACKS.find((track) => track.id === selectedSound).nameKey) : t('customize_sound_none')}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_protection')}</span><span className="review-value">{t('customize_review_protection_value')}</span></div>
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
