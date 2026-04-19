import { useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCompositionLayers } from '../lib/compositionEngine';
import CanvasEffect from './CanvasEffect';
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
  frameStyle = 'none',
  occasion = null,
  messageOffset = null,
  onMessageOffsetChange = null,
  className = '',
}) {
  const { t } = useLanguage();
  const composition = useMemo(
    () => getCompositionLayers({ product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize, frameStyle }),
    [product, colorTheme, primaryColor, accentColor, extras, message, engravingStyle, fontChoice, messageTextColor, messageBold, messageTextSize, frameStyle]
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

  const { baseMedia, colorFilter, overlays, canvasEffects = [], frameStyle: composedFrameStyle, textLayer, protectionLayer } = composition;

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

      {/* Layer 2+: CSS/Video Overlays (balloon only) */}
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="composition-layer--overlay entering"
          style={{ zIndex: overlay.zIndex }}
        >
          {overlay.type === 'video' && overlay.src ? (
            <video
              src={overlay.src}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <CSSOverlay overlayId={overlay.id} themeVariant={overlay.themeVariant} occasion={occasion} />
          )}
        </div>
      ))}

      {/* Layer 3+: Premium Canvas Effects */}
      {canvasEffects.map((effect) => (
        <div
          key={effect.id}
          className="composition-layer--overlay"
          style={{ zIndex: effect.zIndex, position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <CanvasEffect
            effectId={effect.id}
            accentColor={colorFilter?.accentColor || accentColor}
            primaryColor={colorFilter?.primaryColor || primaryColor}
          />
        </div>
      ))}

      {/* Frame Layer — decorative borders/corners */}
      <FrameLayer frameStyle={composedFrameStyle} accentColor={colorFilter?.accentColor || accentColor} />

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

function CSSOverlay({ overlayId, themeVariant, occasion }) {
  if (overlayId !== 'balloon') return null;
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

const GOLD = 'rgba(212,175,55,0.72)';
const GOLD_LINE = 'rgba(212,175,55,0.6)';

function FrameLayer({ frameStyle, accentColor }) {
  if (!frameStyle || frameStyle === 'none') return null;

  const accentRgba = (opacity) => {
    if (!accentColor || !accentColor.startsWith('#') || accentColor.length !== 7) {
      return `rgba(212,175,55,${opacity})`;
    }
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const cornerStyle = (pos) => ({
    position: 'absolute',
    width: 28,
    height: 28,
    ...pos,
    borderTop: `1.5px solid ${GOLD}`,
    borderLeft: `1.5px solid ${GOLD}`,
  });

  switch (frameStyle) {
    case 'goldFloral':
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none' }}>
          {/* Corner L-brackets */}
          <div style={cornerStyle({ top: 10, left: 10, transform: 'rotate(0deg)' })} />
          <div style={cornerStyle({ top: 10, right: 10, transform: 'rotate(90deg)' })} />
          <div style={cornerStyle({ bottom: 10, right: 10, transform: 'rotate(180deg)' })} />
          <div style={cornerStyle({ bottom: 10, left: 10, transform: 'rotate(270deg)' })} />
          {/* Thin gold rule top */}
          <div style={{ position: 'absolute', top: 10, left: '22%', right: '22%', height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_LINE}, transparent)` }} />
          {/* Thin gold rule bottom */}
          <div style={{ position: 'absolute', bottom: 10, left: '22%', right: '22%', height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_LINE}, transparent)` }} />
        </div>
      );

    case 'velvetEdge':
      return (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none',
          borderRadius: 'inherit',
          border: `2px solid ${accentRgba(0.55)}`,
          boxShadow: `inset 0 0 28px ${accentRgba(0.1)}`,
        }} />
      );

    case 'modernRule':
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '7%', left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg, transparent, ${GOLD} 18%, ${GOLD} 82%, transparent)` }} />
          <div style={{ position: 'absolute', bottom: '7%', left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg, transparent, ${GOLD} 18%, ${GOLD} 82%, transparent)` }} />
        </div>
      );

    case 'artDeco': {
      const bracketSize = 30;
      const corners = [
        { top: 8, left: 8, rotate: 0 },
        { top: 8, right: 8, rotate: 90 },
        { bottom: 8, right: 8, rotate: 180 },
        { bottom: 8, left: 8, rotate: 270 },
      ];
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none' }}>
          {corners.map((c, i) => (
            <div key={i} style={{ position: 'absolute', width: bracketSize, height: bracketSize, ...c, transform: `rotate(${c.rotate}deg)` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: GOLD }} />
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1.5, background: GOLD }} />
              {/* Diamond at corner */}
              <div style={{ position: 'absolute', top: -3.5, left: -3.5, width: 8, height: 8, background: GOLD, transform: 'rotate(45deg)' }} />
            </div>
          ))}
        </div>
      );
    }

    case 'filmBorder':
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '9%', background: 'linear-gradient(180deg, rgba(0,0,0,0.82), rgba(0,0,0,0.55))', borderBottom: '1px solid rgba(212,175,55,0.28)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '9%', background: 'linear-gradient(0deg, rgba(0,0,0,0.82), rgba(0,0,0,0.55))', borderTop: '1px solid rgba(212,175,55,0.28)' }} />
        </div>
      );

    default:
      return null;
  }
}
