import { useState, useEffect, useCallback } from 'react';

/**
 * WrappedGiftReveal — three-state reveal that wraps the bloom like a gift "pill".
 *
 * Per Gamble (2026-05-01): the outer capsule shows the Digital Bloom brand
 * first — like the wrapper of a luxury gift. Peeling it back reveals
 * "Gift From [Sender]" on a black inner card. One more tap plays the bloom.
 *
 *   'wrapped'  — Outer pill: Digital Bloom™ logo on top. Tap once.
 *   'branded'  — Pill peels back. "Gift From [Sender]" revealed underneath.
 *                Tap once OR auto-advance after 2.6s.
 *   'played'   — Reveal the actual bloom (renders children).
 *
 * Plays on EVERY view per Ak's decision (not first-open-only). Maximum
 * theatrics — every visit feels like opening a present.
 *
 * Calls onPlayed once when state transitions to 'played' so the parent can
 * start its message-reveal timer at the right moment.
 *
 * Respects prefers-reduced-motion: jumps to 'played' immediately if the user
 * has motion-reduction enabled.
 */
export default function WrappedGiftReveal({ senderName, children, onPlayed }) {
  const [phase, setPhase] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return 'played';
    }
    return 'wrapped';
  });

  useEffect(() => {
    if (phase === 'played' && onPlayed) onPlayed();
  }, [phase, onPlayed]);

  // Auto-advance from 'branded' → 'played' after 2.6s if the recipient
  // doesn't tap. Long enough to read "Gift From <Name>" without rushing.
  useEffect(() => {
    if (phase !== 'branded') return undefined;
    const t = setTimeout(() => setPhase('played'), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  const handleAdvance = useCallback(() => {
    setPhase((p) => (p === 'wrapped' ? 'branded' : p === 'branded' ? 'played' : p));
  }, []);

  if (phase === 'played') return children;

  const fromLabel = senderName ? `Gift From ${senderName}` : 'A Gift For You';

  return (
    <div
      className="wrapped-gift"
      role="button"
      tabIndex={0}
      aria-label={phase === 'wrapped' ? 'Tap to peel back the wrapper' : 'Tap to open your bloom'}
      onClick={handleAdvance}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvance();
        }
      }}
    >
      <div className={`wrapped-gift__pill wrapped-gift__pill--${phase}`}>
        {/* Outer wrapper — Digital Bloom branded "pill" — visible during 'wrapped' */}
        <div className="wrapped-gift__peel wrapped-gift__peel--outer" aria-hidden={phase !== 'wrapped'}>
          <div className="wrapped-gift__peel-content">
            <div className="wrapped-gift__brand">Digital Bloom™</div>
            <div className="wrapped-gift__tap-hint">Tap to peel</div>
          </div>
        </div>

        {/* Inner peel — "Gift From [Sender]" — visible during 'branded' */}
        <div className="wrapped-gift__peel wrapped-gift__peel--inner" aria-hidden={phase !== 'branded'}>
          <div className="wrapped-gift__peel-content">
            <div className="wrapped-gift__from-label">{fromLabel}</div>
            <div className="wrapped-gift__brand-tagline">Tap to open</div>
          </div>
        </div>
      </div>

      {/* Ambient particles for the wrapped + branded phases */}
      <div className="wrapped-gift__particles" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="wrapped-gift__particle"
            style={{
              left: `${(i * 7.4) % 100}%`,
              animationDelay: `${(i * 0.6) % 4}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
