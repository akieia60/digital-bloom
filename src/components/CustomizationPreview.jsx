import { useEffect, useRef } from 'react';

// ─── Particle effect configurations ───────────────────────────────────────────
// Each effect defines what characters/emojis to use and how they move
const EFFECT_CONFIG = {
  goldSparkles:   { chars: ['✦', '✧', '★', '✴'], colors: ['#D4AF37', '#F0D060', '#FFE566', '#C9A14A'], anim: 'float-up',     rate: 450 },
  butterflies:    { chars: ['🦋'],                 colors: null,                                          anim: 'float-across', rate: 900 },
  goldenHearts:   { chars: ['💛', '💝', '✨'],      colors: null,                                          anim: 'float-up',     rate: 500 },
  coloredHearts:  { chars: ['❤️','🧡','💛','💚','💙','💜','🩷'], colors: null,                            anim: 'float-up',     rate: 480 },
  diamondGlitter: { chars: ['💎', '✦', '✧'],       colors: ['#A8D8EA', '#C5D8F5', '#E8F4FD'],             anim: 'spin-fall',    rate: 500 },
  glitter:        { chars: ['✨', '✦', '·', '✴'],  colors: ['#FFD700', '#FFC0CB', '#DDA0DD', '#FFB6C1'], anim: 'fall',         rate: 380 },
  stars:          { chars: ['⭐', '✦', '★', '✬'], colors: ['#FFD700', '#FFF0A0'],                        anim: 'float-up',     rate: 500 },
  rosePetals:     { chars: ['🌸', '🌺', '🌼'],     colors: null,                                          anim: 'fall-drift',   rate: 700 },
  confetti:       { chars: ['🎊', '✨', '🌟', '🎉'], colors: null,                                         anim: 'fall',         rate: 420 },
  snowflakes:     { chars: ['❄️', '❅', '❆'],       colors: ['#E0F7FF', '#C5DEF5', '#FFFFFF'],             anim: 'fall',         rate: 650 },
};

// Font style map — mirrors what's in ExperienceCustomizer
const FONT_STYLES = {
  cormorant:  { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 600 },
  playfair:   { fontFamily: "'Playfair Display', Georgia, serif",   fontWeight: 500 },
  outfit:     { fontFamily: "'Outfit', sans-serif",                  fontWeight: 400 },
  'arial-bold': { fontFamily: 'Arial, sans-serif',                   fontWeight: 700 },
  serif:      { fontFamily: 'Georgia, serif',                        fontWeight: 400 },
};

// Music display names
const MUSIC_LABELS = {
  'give-them-flowers': '🎵 Give Them Their Flowers',
  'peaceful-strings':  '🎵 Peaceful Strings',
  'soft-piano':        '🎵 Soft Piano',
  'gentle-acoustic':   '🎵 Gentle Acoustic',
  '':                  null,
};

function random(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function CustomizationPreview({ product, customization, colorThemes }) {
  const selectedTheme = colorThemes.find(t => t.id === customization.colorTheme);
  const particleRef  = useRef(null);
  const intervalRef  = useRef(null);

  // ─── Live particle effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!particleRef.current) return;

    // Clear old particles instantly when switching effects
    particleRef.current.innerHTML = '';

    const config = EFFECT_CONFIG[customization.animationEffect];
    if (!config) return;

    const spawnParticle = () => {
      if (!particleRef.current) return;

      const char     = pick(config.chars);
      const color    = config.colors ? pick(config.colors) : null;
      const size     = random(13, 22);
      const duration = random(1.8, 3.6);

      const el = document.createElement('span');
      el.textContent = char;

      // Position depends on animation direction
      let posStyle = '';
      if (config.anim === 'float-up') {
        posStyle = `left:${random(5, 88)}%; bottom:${random(5, 20)}%;`;
      } else if (config.anim === 'fall' || config.anim === 'spin-fall' || config.anim === 'fall-drift') {
        posStyle = `left:${random(3, 90)}%; top:-8%;`;
      } else if (config.anim === 'float-across') {
        posStyle = `left:-8%; top:${random(15, 75)}%;`;
      }

      el.style.cssText = `
        position:absolute;
        font-size:${size}px;
        ${posStyle}
        ${color ? `color:${color};` : ''}
        pointer-events:none;
        user-select:none;
        animation:preview-${config.anim} ${duration}s ease-out forwards;
        z-index:10;
        line-height:1;
      `;

      particleRef.current.appendChild(el);
      // Auto-remove after animation completes
      setTimeout(() => { el.parentNode && el.parentNode.removeChild(el); }, duration * 1000 + 200);
    };

    // Burst on load, then drip continuously
    for (let i = 0; i < 5; i++) setTimeout(spawnParticle, i * 120);
    intervalRef.current = setInterval(spawnParticle, config.rate);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [customization.animationEffect]);

  const fontStyle    = FONT_STYLES[customization.textFont] || FONT_STYLES.cormorant;
  const effectConfig = EFFECT_CONFIG[customization.animationEffect];
  const musicLabel   = MUSIC_LABELS[customization.selectedMusic] || null;

  // Build a readable slogan for display
  const displaySlogan = customization.sloganType === 'custom'
    ? customization.customSlogan
    : customization.selectedSlogan;

  return (
    <div className="preview-container">
      <h3 className="preview-title">Live Preview</h3>

      <div className="preview-frame">

        {/* ── Video + Effects ─────────────────────────────────────────────── */}
        <div className="preview-video-wrapper">

          {/* The bloom video */}
          <video
            src={product.video_url}
            autoPlay
            loop
            muted
            playsInline
            className="preview-video"
            style={{
              filter: customization.colorTheme !== 'original'
                ? `hue-rotate(${getHueRotation(customization.colorTheme)}deg) saturate(1.2)`
                : 'none',
            }}
          />

          {/* Color theme overlay */}
          {selectedTheme && customization.colorTheme !== 'original' && (
            <div
              className="preview-overlay"
              style={{ background: `linear-gradient(135deg, ${selectedTheme.colors[0]}22, ${selectedTheme.colors[1]}22)` }}
            />
          )}

          {/* 🎆 LIVE PARTICLE LAYER — this is where the magic happens */}
          <div
            ref={particleRef}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 }}
          />

          {/* Custom message with selected font */}
          {customization.customMessageShort && (
            <div className="preview-message">
              <p className="preview-message-text" style={fontStyle}>
                {customization.customMessageShort}
              </p>
            </div>
          )}

          {/* Digital Bloom™ watermark — always visible */}
          <div className="preview-watermark">Digital Bloom™</div>

          {/* Effect label badge */}
          {effectConfig && (
            <div className="preview-effect-badge">
              {effectConfig.chars[0]}&nbsp;
              {customization.animationEffect.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          )}

          {/* Music badge — shows if music is selected */}
          {musicLabel && (
            <div className="preview-music-badge">{musicLabel}</div>
          )}
        </div>

        {/* ── Summary Details ──────────────────────────────────────────────── */}
        <div className="preview-summary">

          {customization.toName && (
            <div className="preview-detail">
              <span className="preview-label">To:</span>
              <span className="preview-value">{customization.toName}</span>
            </div>
          )}
          {customization.fromName && (
            <div className="preview-detail">
              <span className="preview-label">From:</span>
              <span className="preview-value">{customization.fromName}</span>
            </div>
          )}
          {customization.occasion && (
            <div className="preview-detail">
              <span className="preview-label">Occasion:</span>
              <span className="preview-value">{customization.occasion}</span>
            </div>
          )}
          {customization.colorTheme && customization.colorTheme !== 'original' && (
            <div className="preview-detail">
              <span className="preview-label">Theme:</span>
              <span className="preview-value">{selectedTheme?.name}</span>
            </div>
          )}
          {displaySlogan && (
            <div className="preview-detail">
              <span className="preview-label">Message:</span>
              <span className="preview-value">{displaySlogan}</span>
            </div>
          )}
          {customization.deliveryMethod && (
            <div className="preview-detail">
              <span className="preview-label">Delivery:</span>
              <span className="preview-value">
                {customization.deliveryMethod === 'email' ? 'Email' : 'Text'}
              </span>
            </div>
          )}
          {customization.deliveryTiming === 'later' && customization.deliveryDate && (
            <div className="preview-detail">
              <span className="preview-label">Send on:</span>
              <span className="preview-value">{customization.deliveryDate}</span>
            </div>
          )}
          {customization.isGift && customization.recipientName && (
            <div className="preview-detail">
              <span className="preview-label">Gift for:</span>
              <span className="preview-value">{customization.recipientName}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function getHueRotation(theme) {
  return { warm: 15, cool: 180, elegant: 45, romantic: -10, original: 0 }[theme] || 0;
}
