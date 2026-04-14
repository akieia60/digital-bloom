import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCompositionLayers } from '../lib/compositionEngine';
import '../styles/overlays.css';

/**
 * LivePreview — Dynamic composition preview
 * 
 * Renders a stacked layer composition based on customization state.
 * Each layer is conditionally rendered and positioned absolutely.
 * 
 * When real overlay assets (WebM/APNG) are available, the CSS placeholder
 * layers will automatically be replaced — the compositionEngine returns
 * { type: 'video' } for real assets and { type: 'css' } for placeholders.
 */

const BALLOON_EMOJIS = ['🎈', '🎈', '🎈', '🎈', '🎈'];

export default function LivePreview({
  product,
  colorTheme,
  primaryColor,
  accentColor,
  extras,
  message,
  engravingStyle = 'heirloom',
  fontChoice = 'playfair',
  messageTextColor = '#FFFFFF',
  messageBold = false,
  messageTextSize = 'md',
  className = '',
}) {
  const { t } = useLanguage();
  const composition = useMemo(
    () => getCompositionLayers({ product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize }),
    [product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize]
  );

  if (!composition?.baseMedia?.src && !composition?.baseMedia?.poster) {
    return (
      <div className={`composition-preview ${className}`}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0a0a0a)' }} />
      </div>
    );
  }

  const { baseMedia, colorFilter, overlays, textLayer, protectionLayer } = composition;

  return (
    <div
      className={`db-watermark composition-preview ${className}`}
      style={{
        '--db-primary': colorFilter?.primaryColor || '#C53A5C',
        '--db-accent': colorFilter?.accentColor || '#EED7B8',
        '--db-message-panel': colorFilter?.messagePanelColor || 'rgba(7, 17, 31, 0.35)',
        '--db-rail': colorFilter?.railColor || 'rgba(5, 16, 29, 0.82)',
        '--db-edge-glow': colorFilter?.edgeGlowColor || 'rgba(238, 215, 184, 0.24)',
        '--db-brand': colorFilter?.brandColor || '#EED7B8',
      }}
    >
      {/* Layer 0: Base Media */}
      <div className="composition-layer--base">
        {baseMedia.type === 'video' ? (
          <video
            src={baseMedia.src}
            poster={baseMedia.poster}
            autoPlay muted loop playsInline
            preload="auto"
            onError={(e) => {
              // Fallback to poster image if video fails
              e.target.style.display = 'none';
              const img = e.target.nextElementSibling;
              if (img) img.style.display = 'block';
            }}
          />
        ) : null}
        {/* Fallback image (hidden if video plays) */}
        {baseMedia.poster && (
          <img
            src={baseMedia.poster}
            alt="Preview"
            style={{ display: baseMedia.type === 'video' ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* Layer 1: Color Filter */}
      {colorFilter.overlayColor && (
        <div
          className="composition-layer--color"
          style={{
            background: colorFilter.overlayColor,
            mixBlendMode: colorFilter.blendMode,
          }}
        />
      )}

      {/* Layer 2+: Dynamic Overlays */}
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="composition-layer--overlay entering"
          style={{ zIndex: overlay.zIndex }}
        >
          {overlay.type === 'video' && overlay.src ? (
            // Real asset overlay (future)
            <video
              src={overlay.src}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // CSS placeholder overlay
            <CSSOverlay overlayId={overlay.id} themeVariant={overlay.themeVariant} />
          )}
        </div>
      ))}

      {/* Layer N: Text Overlay */}
      {textLayer && (
        <div
          className={`composition-layer--text composition-layer--text-${textLayer.variant || 'heirloom'}`}
          style={textLayer.positionStyle}
        >
          <div className="composition-text__message" style={textLayer.textStyle}>{textLayer.text}</div>
        </div>
      )}

      {/* Brand protection overlays */}
      {protectionLayer?.showBrandRail && (
        <div
          className={`composition-brand-rail composition-brand-rail--${protectionLayer.engravingStyle || 'heirloom'}`}
          style={{ background: protectionLayer.railColor }}
        />
      )}

      {protectionLayer?.recipientName && (
        <div
          className="composition-protection composition-protection--recipient"
          style={{ ...protectionLayer.recipientPositionStyle, ...protectionLayer.recipientTextStyle }}
        >
          {t('customize_to')} {protectionLayer.recipientName}
        </div>
      )}

      <div
        className={`composition-brand-lockup composition-brand-lockup--${protectionLayer?.engravingStyle || 'heirloom'}`}
        style={protectionLayer?.brandPositionStyle}
      >
        <div
          className="composition-brand-chip"
          style={{ color: protectionLayer?.brandColor || 'var(--db-brand)' }}
        >
          <span className="composition-brand-chip__text">{protectionLayer?.brandText || 'Digital Bloom'}</span>
          <span className="composition-brand-chip__tm">{protectionLayer?.tmText || 'TM'}</span>
        </div>

        {protectionLayer?.senderName && (
          <div
            className="composition-brand-lockup__sender"
            style={protectionLayer?.senderTextStyle}
          >
            {t('customize_from')} {protectionLayer.senderName}
          </div>
        )}
      </div>

      {/* Subtle vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)',
      }} />
    </div>
  );
}

/**
 * CSS-only overlay placeholders.
 * These render animated CSS effects. When real assets are loaded,
 * the parent renders a <video> instead of this component.
 */
function CSSOverlay({ overlayId, themeVariant }) {
  switch (overlayId) {
    case 'balloon':
      return (
        <div className={`overlay-balloon overlay-balloon--${themeVariant}`}>
          {BALLOON_EMOJIS.map((emoji, i) => (
            <span key={i} className="overlay-balloon__item">{emoji}</span>
          ))}
        </div>
      );

    case 'ribbon':
      return (
        <div className={`overlay-ribbon overlay-ribbon--${themeVariant}`}>
          <div className="overlay-ribbon__border" />
        </div>
      );

    case 'sparkle':
      return (
        <div className="overlay-sparkle">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="overlay-sparkle__particle" />
          ))}
        </div>
      );

    case 'goldDust':
      return (
        <div className="overlay-gold-dust">
          {Array.from({ length: 15 }, (_, i) => (
            <span key={i} className="overlay-gold-dust__particle" />
          ))}
        </div>
      );

    case 'softGlow':
      return (
        <div className="overlay-soft-glow">
          <div className="overlay-soft-glow__halo" />
          <div className="overlay-soft-glow__flare" />
        </div>
      );

    case 'rosePetals':
      return (
        <div className="overlay-rose-petals">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="overlay-rose-petals__petal">🌸</span>
          ))}
        </div>
      );

    default:
      return null;
  }
}
