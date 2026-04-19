import { useMemo, useRef, useCallback } from 'react';
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

// Occasion-specific balloon text labels.
// Mother's Day: "Happy Mother's Day" + "I Love You" (NOT just "I Love You" — that's romance).
// Romance/Love/Valentine: "I Love You" only.
const OCCASION_BALLOON_LABELS = {
  'mothers-day':  ["Happy Mother's Day", "I Love You", "💐", "🌸", "💕"],
  'love':         ["I Love You", "❤️", "Always", "💕", "Forever"],
  'valentine':    ["I Love You", "💕", "Be Mine", "❤️", "💋"],
  'anniversary':  ["Happy Anniversary", "❤️", "Forever", "💕", "Always"],
  'birthday':     ["Happy Birthday", "Make A Wish", "🎉", "🎂", "🥳"],
  'celebration':  ["Congrats", "You Did It", "🎉", "✨", "🌟"],
  'graduation':   ["Congrats", "You Did It", "🎓", "🎉", "💫"],
  'fathers-day':  ["Happy Father's Day", "I Love You", "👑", "💙", "🌟"],
  'friendship':   ["You're Amazing", "💛", "BFF", "🌟", "Cheers"],
  'thank-you':    ["Thank You", "💛", "So Much", "🙏", "Grateful"],
};

function getBalloonLabels(occasion) {
  return OCCASION_BALLOON_LABELS[occasion] || ['🎈', '🎈', '🎈', '🎈', '🎈'];
}

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
  ribbonColor = null,
  occasion = null,
  messageOffset = null,
  onMessageOffsetChange = null,
  className = '',
}) {
  const { t } = useLanguage();
  const composition = useMemo(
    () => getCompositionLayers({ product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize }),
    [product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize]
  );

  const containerRef = useRef(null);
  const dragState = useRef(null);
  const isDraggable = typeof onMessageOffsetChange === 'function';

  const handlePointerDown = useCallback((e) => {
    if (!isDraggable || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseOffset: messageOffset || { x: 0, y: 0 },
      width: rect.width,
      height: rect.height,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [isDraggable, messageOffset]);

  const handlePointerMove = useCallback((e) => {
    if (!dragState.current) return;
    const { startX, startY, baseOffset, width, height } = dragState.current;
    const dxPct = ((e.clientX - startX) / width) * 100;
    const dyPct = ((e.clientY - startY) / height) * 100;
    const next = {
      x: Math.max(-40, Math.min(40, (baseOffset.x || 0) + dxPct)),
      y: Math.max(-40, Math.min(40, (baseOffset.y || 0) + dyPct)),
    };
    onMessageOffsetChange(next);
  }, [onMessageOffsetChange]);

  const handlePointerUp = useCallback((e) => {
    dragState.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }, []);

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
      ref={containerRef}
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
            <CSSOverlay overlayId={overlay.id} themeVariant={overlay.themeVariant} ribbonColor={ribbonColor} occasion={occasion} />
          )}
        </div>
      ))}

      {/* Layer N: Text Overlay */}
      {textLayer && (
        <div
          className={`composition-layer--text composition-layer--text-${textLayer.variant || 'heirloom'}${isDraggable ? ' composition-layer--text-draggable' : ''}`}
          style={{
            ...textLayer.positionStyle,
            transform: messageOffset
              ? `${textLayer.positionStyle?.transform || ''} translate(${messageOffset.x}%, ${messageOffset.y}%)`
              : textLayer.positionStyle?.transform,
            touchAction: isDraggable ? 'none' : undefined,
            cursor: isDraggable ? (dragState.current ? 'grabbing' : 'grab') : undefined,
          }}
          onPointerDown={isDraggable ? handlePointerDown : undefined}
          onPointerMove={isDraggable ? handlePointerMove : undefined}
          onPointerUp={isDraggable ? handlePointerUp : undefined}
          onPointerCancel={isDraggable ? handlePointerUp : undefined}
        >
          <div className="composition-text__message" style={textLayer.textStyle}>{textLayer.text}</div>
          {isDraggable && textLayer.text && (
            <div className="composition-text__drag-hint">Drag to move</div>
          )}
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

      {/* Subtle vignette for depth — z-index 42 keeps it below brand chip (46) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 42, pointerEvents: 'none',
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
function CSSOverlay({ overlayId, themeVariant, ribbonColor, occasion }) {
  switch (overlayId) {
    case 'balloon': {
      const labels = getBalloonLabels(occasion);
      return (
        <div className={`overlay-balloon overlay-balloon--${themeVariant}`}>
          {labels.map((label, i) => {
            const isText = typeof label === 'string' && /[a-zA-Z]/.test(label);
            return (
              <span key={i} className="overlay-balloon__item">
                🎈
                {isText && <span className="overlay-balloon__caption">{label}</span>}
              </span>
            );
          })}
        </div>
      );
    }

    case 'ribbon':
      return (
        <div
          className={`overlay-ribbon overlay-ribbon--${themeVariant}`}
          style={ribbonColor ? { '--ribbon-color': ribbonColor } : undefined}
        >
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
