import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import { COLOR_PALETTES, ENGRAVING_STYLES, MESSAGE_FONT_OPTIONS, CANVAS_EFFECT_META, FRAME_STYLES, getThemeSpec } from '../lib/compositionEngine';
import { useLanguage } from '../contexts/LanguageContext';
import OCCASIONS from '../data/occasions';
import LivePreview from './LivePreview';
import '../styles/customizer.css';

// Premium canvas-rendered effects — replaces old emoji/CSS extras
const EFFECTS = [
  { id: 'luminaraDrift',      icon: '✦', label: 'Luminous Gold',  description: 'Glowing gold particles that drift upward like suspended dust' },
  { id: 'bokehBloom',         icon: '◉', label: 'Bokeh Bloom',    description: 'Soft out-of-focus light orbs, like a luxury film backdrop' },
  { id: 'lightVeil',          icon: '╱', label: 'Light Veil',     description: 'Slow-sweeping god rays washing gently across the scene' },
  { id: 'silkPetals',         icon: '◇', label: 'Silk Petals',    description: 'Translucent canvas-drawn petals drifting down' },
  { id: 'constellationDrift', icon: '⬡', label: 'Constellation',  description: 'Star points connecting into a fine jewelry motif' },
  { id: 'dewShimmer',         icon: '⬥', label: 'Dew Shimmer',    description: 'Light catching on invisible surfaces, fading in and out' },
];

const FRAME_OPTIONS = [
  { id: 'none',       label: 'None',           description: 'Clean, unframed' },
  { id: 'goldFloral', label: 'Gold Botanical', description: 'Delicate corner flourishes' },
  { id: 'velvetEdge', label: 'Velvet Edge',    description: 'Glowing border in your accent color' },
  { id: 'modernRule', label: 'Modern Rule',    description: 'Thin gold lines top and bottom' },
  { id: 'artDeco',    label: 'Art Deco',       description: 'Geometric corner brackets' },
  { id: 'filmBorder', label: 'Cinematic',      description: 'Letterbox editorial frame' },
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

// Customizer flow simplified 2026-05-07 (Gamble + Ak): dropped the
// "Video Frame" sub-section and the Live Effects step entirely.
// Frame styles didn't read on the final video, and Live Effects
// competed visually with the bloom that already has plenty of motion.
// Step 2 is now just engraving finish.
const FLOW_STEPS = [
  { id: 1, key: 'message', labelKey: 'customize_step_message', icon: '✉️' },
  { id: 2, key: 'frame',   labelKey: 'customize_step_frame',   icon: '🎨' },
  { id: 3, key: 'review',  labelKey: 'customize_step_review',  icon: '✓' },
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
    luminaraDrift: false,
    bokehBloom: false,
    lightVeil: false,
    silkPetals: false,
    constellationDrift: false,
    dewShimmer: false,
    ...(stateDefaults.extras || {}),
  });
  const [frameStyle, setFrameStyle] = useState(stateDefaults.frameStyle || 'none');
  const [selectedSound, setSelectedSound] = useState(stateDefaults.selectedSound || stateDefaults.sound || '');
  const [engravingStyle, setEngravingStyle] = useState(stateDefaults.engravingStyle || 'heirloom');
  const [fontChoice, setFontChoice] = useState(stateDefaults.fontChoice || 'playfair');
  const [messageTextColor, setMessageTextColor] = useState(stateDefaults.messageTextColor || '#FFFFFF');
  // Validation surface for the To/From mandatory check (Gamble 2026-04-26)
  const [validationError, setValidationError] = useState('');
  const [messageBold, setMessageBold] = useState(stateDefaults.messageBold || false);
  const [messageTextSize, setMessageTextSize] = useState(stateDefaults.messageTextSize || 'md');
  const [messageOffset, setMessageOffset] = useState(stateDefaults.messageOffset || { x: 0, y: 0 });
  const [ribbonColor, setRibbonColor] = useState(stateDefaults.ribbonColor || null);
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
      if (editData.ribbonColor || editData.composition?.ribbonColor) {
        setRibbonColor(editData.ribbonColor || editData.composition?.ribbonColor || null);
      }
      if (editData.composition?.activeOverlays || editData.extras) {
        const newExtras = { luminaraDrift: false, bokehBloom: false, lightVeil: false, silkPetals: false, constellationDrift: false, dewShimmer: false };
        const source = editData.extras || {};
        Object.keys(newExtras).forEach(k => { if (source[k]) newExtras[k] = true; });
        if (editData.composition?.activeOverlays) {
          editData.composition.activeOverlays.forEach(o => { if (o in newExtras) newExtras[o] = true; });
        }
        setExtras(newExtras);
      }
      if (editData.frameStyle || editData.composition?.frameStyle) {
        setFrameStyle(editData.frameStyle || editData.composition?.frameStyle || 'none');
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
    // To and From are mandatory — per Gamble's 2026-04-26 note, requiring both
    // makes every bloom uniquely customized to the buyer/recipient pair, which
    // disincentivizes anyone from screen-recording a generic bloom and reusing
    // it. Block submission and surface an inline error before proceeding.
    const toName = (message.toName || '').trim();
    const fromName = (message.fromName || '').trim();
    if (!toName || !fromName) {
      setValidationError('To and From are required — both fields make this bloom uniquely yours.');
      const firstEmpty = !toName ? document.getElementById('cust-to') : document.getElementById('cust-from');
      firstEmpty?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstEmpty?.focus();
      return;
    }
    setValidationError('');
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
      messageTextSize,
      messageOffset,
      frameStyle,
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
      messageTextSize,
      messageOffset,
      frameStyle,
      locale: lang,
      totalPrice,
      composition,
    });
    onClose();
  }, [isProductValid, product, message, colorTheme, primaryColor, accentColor, extras, selectedSound, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize, messageOffset, frameStyle, lang, totalPrice, themeStyle, stopAllAudio, onComplete, onClose]);

  const selectedExtras = useMemo(
    () => EFFECTS.filter((effect) => extras[effect.id]).map((effect) => effect.label),
    [extras]
  );

  const allPalettes = useMemo(
    () => Object.entries(COLOR_PALETTES)
      .filter(([id]) => id !== 'custom')
      .map(([id, spec]) => ({ id, ...spec })),
    []
  );

  const fontOptions = useMemo(
    () => Object.entries(MESSAGE_FONT_OPTIONS).map(([id, spec]) => ({ id, label: spec.label })),
    []
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
              messageTextSize={messageTextSize}
              frameStyle={frameStyle}
              messageOffset={messageOffset}
              onMessageOffsetChange={setMessageOffset}
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

            {/* CHOOSE A PHRASE — dropdown that appends to the message below.
                Per Gamble's 2026-04-26 review: phrase chips laid out in a grid
                ate too much screen space. The dropdown saves vertical room and
                still supports stacking phrases (each pick appends to the message). */}
            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-slogan-select">
                {OCCASIONS[category || product?.category]
                  ? `${OCCASIONS[category || product?.category].emoji || '🌸'} Choose a phrase`
                  : '🌸 Choose a phrase'}
              </label>
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
                <option value="">Pick a phrase to add to your message…</option>
                {sloganPresets.map((slogan, i) => (
                  <option key={i} value={slogan}>{slogan}</option>
                ))}
              </select>
              <span className="customizer-hint">Pick more than one to stack — or skip and write your own below.</span>
            </div>

            {/* YOUR MESSAGE — auto-grows as the customer types or appends phrases.
                Starts compact (2 rows) so the customer can see To/From + the rest
                of the form without scrolling, and grows to fit content. */}
            <div className="customizer-field">
              <label className="customizer-label" htmlFor="cust-msg">{t('customize_your_message')}</label>
              <textarea
                id="cust-msg"
                className="customizer-input customizer-input--message-grow"
                placeholder={messagePlaceholder || t('customize_message_placeholder')}
                maxLength="150"
                rows={2}
                value={message.short}
                onChange={(e) => handleMessageChange('short', e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = (e.target.scrollHeight) + 'px';
                }}
              />
              <div className="customizer-message-meta">
                <span className="customizer-hint">{message.short.length}/150 · drag on preview to position</span>
                {message.short.length > 0 && (
                  <button
                    type="button"
                    className="customizer-clear-link"
                    onClick={() => handleMessageChange('short', '')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* TO / FROM — both required per Gamble's 2026-04-26 note. Mandatory
                customization disincentives anyone trying to screen-record a
                generic bloom and reuse it elsewhere. */}
            <div className="customizer-tofrom-grid">
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-to">
                  {t('customize_to')} <span className="customizer-required" aria-hidden="true">*</span>
                </label>
                <input id="cust-to" type="text" required aria-required="true" className="customizer-input customizer-input--lg"
                  placeholder={toPlaceholder || t('customize_to_placeholder')}
                  value={message.toName}
                  onChange={(e) => handleMessageChange('toName', e.target.value)} />
              </div>
              <div className="customizer-field">
                <label className="customizer-label" htmlFor="cust-from">
                  {t('customize_from')} <span className="customizer-required" aria-hidden="true">*</span>
                </label>
                <input id="cust-from" type="text" required aria-required="true" className="customizer-input customizer-input--lg"
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

            {/* Text color swatches — customer picks the color of their
                message text. (Restored after a clarification from Gamble on
                2026-04-26: the color block we should remove is the Color Mood
                grid in the Frame step, NOT this one. Customers DO want to
                pick the color of their writing.) */}
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
                    padding: '10px 22px', borderRadius: '22px',
                    border: `2px solid ${!messageBold ? '#D4AF37' : 'rgba(13,27,54,0.35)'}`,
                    background: !messageBold ? 'rgba(212,175,55,0.12)' : '#F2F2F7',
                    color: !messageBold ? '#D4AF37' : '#1D1D1F',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    fontWeight: '400',
                    cursor: 'pointer', transition: 'all 0.18s',
                    minWidth: '90px',
                  }}
                >
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>A</span>
                  <span>{t('customize_style_normal')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageBold(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 22px', borderRadius: '22px',
                    border: `2px solid ${messageBold ? '#D4AF37' : 'rgba(13,27,54,0.35)'}`,
                    background: messageBold ? 'rgba(212,175,55,0.12)' : '#F2F2F7',
                    color: messageBold ? '#D4AF37' : '#1D1D1F',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: 'pointer', transition: 'all 0.18s',
                    minWidth: '90px',
                  }}
                >
                  <span style={{ fontWeight: '800', fontSize: '1.05rem', lineHeight: 1 }}>B</span>
                  <span>{t('customize_style_bold')}</span>
                </button>
              </div>
            </div>

            {/* Text size picker */}
            <div className="customizer-field">
              <label className="customizer-label">{t('customize_text_size_label')}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { id: 'sm', label: t('customize_size_small'),  preview: 'A', previewSize: '0.82rem' },
                  { id: 'md', label: t('customize_size_medium'), preview: 'A', previewSize: '1.05rem' },
                  { id: 'lg', label: t('customize_size_large'),  preview: 'A', previewSize: '1.35rem' },
                ].map(({ id, label, preview, previewSize }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMessageTextSize(id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px 18px', borderRadius: '22px',
                      border: `2px solid ${messageTextSize === id ? '#D4AF37' : 'rgba(13,27,54,0.35)'}`,
                      background: messageTextSize === id ? 'rgba(212,175,55,0.12)' : '#F2F2F7',
                      color: messageTextSize === id ? '#D4AF37' : '#1D1D1F',
                      fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
                      cursor: 'pointer', transition: 'all 0.18s',
                      minWidth: '76px',
                    }}
                  >
                    <span style={{ fontSize: previewSize, lineHeight: 1, fontFamily: 'Playfair Display, serif' }}>{preview}</span>
                    <span>{label}</span>
                  </button>
                ))}
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
                    fontWeight: messageBold ? '900' : MESSAGE_FONT_OPTIONS[fontChoice]?.previewWeight,
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
              <h3 className="customizer-section__title">{t('customize_step_frame')}</h3>
            </div>
            {/* Engraving finish — the only thing that survived the
                2026-05-07 customizer cull. Color Mood (removed 4/26),
                Video Frame (removed 5/7), and Live Effects (removed
                5/7) all earned their delete by adding decisions
                without changing what the customer sees on the final
                bloom. */}
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
            <div className="customizer-section customizer-section--review">
              <div className="customizer-section__header">
                <span className="customizer-section__number">3</span>
                <h3 className="customizer-section__title">{t('customize_review_title')}</h3>
              </div>
              <div className="customizer-review-card">
                <div className="review-row"><span className="review-label">{t('customize_review_to')}</span><span className="review-value">{message.toName || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_from')}</span><span className="review-value">{message.fromName || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_message')}</span><span className="review-value">{message.short || '—'}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_engraving')}</span><span className="review-value">{t(`customize_engraving_${engravingStyle}`)}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_font')}</span><span className="review-value">{fontOptions.find((option) => option.id === fontChoice)?.label || t('customize_font_playfair')}</span></div>
                <div className="review-row"><span className="review-label">{t('customize_review_protection')}</span><span className="review-value">{t('customize_review_protection_value')}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Validation error surface — shown when To/From are empty on submit */}
        {validationError && (
          <div className="customizer-validation-error" role="alert">
            <span aria-hidden="true">⚠️</span> {validationError}
          </div>
        )}

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
