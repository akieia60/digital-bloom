import { useEffect, useRef, useState } from 'react';

// HeroRecipientVideo — auto-play hero clip above GradientHero.
// Brief from Michael 2026-05-18 (per Google Ads debrief): visitors must
// understand the product within 3 seconds. THE #1 fix for the 226-clicks-
// zero-sales problem is an above-the-fold recipient-experience clip.
//
// PLACEHOLDER STATE: until Ak films a real screen-recording of a phone
// opening a bloom, this component plays the most universal Mother's Day
// bloom ("For Every Mother") as a stand-in. Caption tells the visitor
// exactly what they're looking at.
//
// HOW TO SWAP IN THE REAL CLIP:
//   1. Save the real receiver-experience MP4 to public/videos/
//      e.g. public/videos/recipient-experience.mp4
//   2. Change HERO_VIDEO_SRC below to '/videos/recipient-experience.mp4'
//   3. Change CAPTION to match (or set null to remove caption)
//   4. Commit + push. Vercel auto-deploys.

const HERO_VIDEO_SRC = 'https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/mothers-day/68b0a309-fba4-4243-a34e-674aca7cffb5_watermarked.mp4';
const CAPTION = "Watch what they'll see when you send a bloom.";

// Visually flag this is a placeholder so Ak knows to swap when she films
const IS_PLACEHOLDER = true;

export default function HeroRecipientVideo() {
  const videoRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Most iOS browsers require muted + playsInline + a user gesture for
    // autoplay; the attributes below satisfy that. play() throws silently
    // if the gesture is missing — that's expected and OK.
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();
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
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '9 / 16',
        background: '#000',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      }}>
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onClick={() => {
            if (!hasInteracted && videoRef.current) {
              videoRef.current.muted = false;
              setHasInteracted(true);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            cursor: 'pointer',
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
        {/* Tap-to-unmute hint while still muted */}
        {!hasInteracted && (
          <div style={{
            position: 'absolute',
            top: '0.7rem', right: '0.7rem',
            background: 'rgba(13,27,54,0.85)',
            color: '#D4AF37',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '0.32rem 0.6rem',
            borderRadius: '999px',
            border: '1px solid rgba(212,175,55,0.6)',
            backdropFilter: 'blur(4px)',
          }}>
            TAP FOR SOUND
          </div>
        )}
      </div>
    </section>
  );
}
