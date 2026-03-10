import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function VideoHero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // ── PART 1: Cinematic Intro Sequence ──
  // Phases: blackHold → videoFade → titleIn → taglineIn → ctaIn → complete
  const [introPhase, setIntroPhase] = useState('blackHold');
  const introPlayed = useRef(false);

  useEffect(() => {
    if (introPlayed.current) return;
    introPlayed.current = true;

    // 1. Black hold: 0.6s — brief cinematic beat, then reveal
    const t1 = setTimeout(() => setIntroPhase('videoFade'), 600);

    // 2. Title appears after video is partially visible
    const t2 = setTimeout(() => setIntroPhase('titleIn'), 1800);

    // 3. Tagline fades up 0.4s after title
    const t3 = setTimeout(() => setIntroPhase('taglineIn'), 2200);

    // 4. CTA fades up 0.4s after tagline
    const t4 = setTimeout(() => setIntroPhase('ctaIn'), 2600);

    // 5. Scroll indicator and mark complete
    const t5 = setTimeout(() => setIntroPhase('complete'), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // ── Parallax scroll effect (preserved from original) ──
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Ensure video plays on iOS Safari ──
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — poster image will show as fallback
      });
    }
  }, []);

  // Scroll-based parallax values (original logic preserved)
  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
  const heroScale = 1 + scrollY * 0.0003;

  // Helper: determine if a phase has been reached
  const phaseReached = useCallback(
    (target) => {
      const order = ['blackHold', 'videoFade', 'titleIn', 'taglineIn', 'ctaIn', 'complete'];
      return order.indexOf(introPhase) >= order.indexOf(target);
    },
    [introPhase]
  );

  const scrollToContent = () => {
    const hero = heroRef.current;
    if (hero) {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <section ref={heroRef} className="video-hero">
        {/* PART 1: Black curtain — visible during blackHold phase */}
        <div
          className={`video-hero__curtain ${phaseReached('videoFade') ? 'video-hero__curtain--lifted' : ''}`}
        />

        {/* Video Background — PART 7: micro-parallax via CSS animation */}
        <div
          className="video-hero__bg"
          style={{
            transform: `scale(${heroScale})`,
            opacity: heroOpacity,
          }}
        >
          <div className="video-hero__video-wrap">
            <video
              ref={videoRef}
              className="video-hero__video"
              autoPlay
              muted
              loop
              playsInline
              poster="/videos/hero_bloom_poster.jpg"
              preload="auto"
            >
              <source src="/videos/digital_bloom_hero_morph.mp4" type="video/mp4" />
            </video>
          </div>
          {/* PART 2: Refined multi-stop overlay with warm tint */}
          <div className="video-hero__overlay" />
        </div>

        {/* Text Content — PART 3: text treatment via CSS */}
        <div
          className="video-hero__content"
          style={{ opacity: heroOpacity }}
        >
          {/* PART 6: Typography rebrand — font applied via CSS */}
          <h1
            className={`video-hero__title ${
              phaseReached('titleIn') ? 'video-hero__animate-in' : 'video-hero__hidden'
            }`}
          >
            DIGITAL BLOOM
          </h1>
          <p
            className={`video-hero__tagline ${
              phaseReached('taglineIn') ? 'video-hero__animate-in' : 'video-hero__hidden'
            }`}
          >
            Give Them Their Flowers While They&rsquo;re Here
          </p>
          {/* PART 4: CTA micro-interaction — shimmer via CSS */}
          <div
            className={`video-hero__cta-wrap ${
              phaseReached('ctaIn') ? 'video-hero__animate-in' : 'video-hero__hidden'
            }`}
          >
            <Link to="/shop" className="video-hero__btn">
              <span className="video-hero__btn-text">Choose Your Occasion</span>
              <span className="video-hero__btn-shimmer" />
              <span className="video-hero__btn-glow" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          className={`video-hero__scroll-indicator ${
            phaseReached('complete') ? 'video-hero__animate-in' : 'video-hero__hidden'
          }`}
          onClick={scrollToContent}
          aria-label="Scroll down"
          style={{ opacity: heroOpacity }}
        >
          <span className="video-hero__scroll-text">Scroll</span>
          <svg
            className="video-hero__chevron"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      {/* PART 5: Scroll Continuity — Night → Dawn gradient divider */}
      <div className="video-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
