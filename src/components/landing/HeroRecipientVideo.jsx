import { useEffect, useRef, useState, useCallback } from 'react';

// HeroRecipientVideo — auto-play hero clip above GradientHero.
// Brief from Michael 2026-05-18 (per Google Ads debrief): visitors must
// understand the product within 3 seconds. THE #1 fix for the 226-clicks-
// zero-sales problem is an above-the-fold recipient-experience clip.
//
// 2026-06-06: Real recipient reaction footage from Shara replaces the
// placeholder bloom. 38s, 720x1280 vertical, H.264 + AAC + faststart,
// served from Supabase site-assets. Tap the video (or the "Tap for sound"
// pill) to unmute — Shara's "oh my god that is so pretty" is the
// natural reaction we want visitors to hear.

const HERO_VIDEO_SRC = 'https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/site-assets/shara-bloom-reaction.mp4';
const HERO_POSTER_SRC = 'https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/site-assets/shara-bloom-poster.jpg';
const CAPTION = "A real first-time reaction.";

export default function HeroRecipientVideo() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  // Keep DOM `muted` synced with React state, then nudge play() so
  // iOS Safari actually starts the audio stream after a user gesture.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (!isMuted) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsMuted((m) => !m);
  }, []);

  return (
    <section
      aria-label="Recipient experience preview"
      style={{
        position: 'relative',
        background: '#050510',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        borderBottom: '1px solid rgba(212,175,55,0.18)',
      }}
    >
      <div
        onClick={toggleMute}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          aspectRatio: '9 / 16',
          background: '#000',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          cursor: 'pointer',
        }}
      >
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER_SRC}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
        {/* Soft bottom gradient for caption legibility */}
        {CAPTION && (
          <>
            <div style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              height: '38%',
              background: 'linear-gradient(to top, rgba(5,5,16,0.92) 0%, rgba(5,5,16,0.55) 50%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              left: '1rem', right: '1rem', bottom: '1rem',
              textAlign: 'center',
              color: '#FFFFFF',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(0.95rem, 3.5vw, 1.25rem)',
              fontStyle: 'italic',
              lineHeight: 1.35,
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              pointerEvents: 'none',
            }}>
              {CAPTION}
            </div>
          </>
        )}
        {/* Sound toggle — own button, so the badge is itself a tap target.
            iOS Safari often misroutes taps when a sibling overlay sits on
            top of a <video>; making this its own <button> guarantees the
            tap fires the unmute. */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Tap to hear her reaction' : 'Mute her voice'}
          aria-pressed={!isMuted}
          style={{
            position: 'absolute',
            top: '0.7rem',
            right: '0.7rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(13,27,54,0.85)',
            color: '#D4AF37',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '0.4rem 0.7rem',
            borderRadius: '999px',
            border: '1px solid rgba(212,175,55,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            zIndex: 3,
          }}
        >
          {isMuted ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              <span>Tap for sound</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>Mute</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
