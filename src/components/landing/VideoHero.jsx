import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Auto-detect the nearest upcoming (or current) holiday for the live banner
function getUpcomingHoliday() {
  const now = new Date();
  const year = now.getFullYear();

  // Helper: nth weekday of month (weekday: 0=Sun…6=Sat)
  function nthWeekday(yr, mo, weekday, n) {
    const d = new Date(yr, mo - 1, 1);
    let count = 0;
    while (d.getMonth() === mo - 1) {
      if (d.getDay() === weekday) {
        count++;
        if (count === n) return new Date(d);
      }
      d.setDate(d.getDate() + 1);
    }
    return null;
  }

  const holidays = [
    { name: "Happy New Year",          label: "New Year's Day",    date: new Date(year, 0, 1) },
    { name: "Happy Valentine's Day",   label: "Valentine's Day",   date: new Date(year, 1, 14) },
    { name: "Happy St. Patrick's Day", label: "St. Patrick's Day", date: new Date(year, 2, 17) },
    { name: "Happy Mother's Day",      label: "Mother's Day",      date: nthWeekday(year, 5, 0, 2) },
    { name: "Happy Father's Day",      label: "Father's Day",      date: nthWeekday(year, 6, 0, 3) },
    { name: "Happy 4th of July",       label: "Independence Day",  date: new Date(year, 6, 4) },
    { name: "Happy Halloween",         label: "Halloween",         date: new Date(year, 9, 31) },
    { name: "Happy Thanksgiving",      label: "Thanksgiving",      date: nthWeekday(year, 11, 4, 4) },
    { name: "Merry Christmas",         label: "Christmas",         date: new Date(year, 11, 25) },
    { name: "Happy New Year's Eve",    label: "New Year's Eve",    date: new Date(year, 11, 31) },
  ].filter(h => h.date);

  const today = new Date(year, now.getMonth(), now.getDate());
  holidays.sort((a, b) => a.date - b.date);

  // Show if within 3 days past OR within 45 days upcoming
  const active = holidays.find(h => {
    const diff = (h.date - today) / (1000 * 60 * 60 * 24);
    return diff >= -3 && diff <= 45;
  });

  return active || { name: "Give Them Their Flowers", label: "Special Occasion" };
}

export default function VideoHero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // ── Cinematic Intro Sequence ──
  const [introPhase, setIntroPhase] = useState('blackHold');
  const introPlayed = useRef(false);

  const holiday = useMemo(() => getUpcomingHoliday(), []);

  useEffect(() => {
    if (introPlayed.current) return;
    introPlayed.current = true;

    const t1 = setTimeout(() => setIntroPhase('videoFade'), 600);
    const t2 = setTimeout(() => setIntroPhase('titleIn'), 1800);
    const t3 = setTimeout(() => setIntroPhase('taglineIn'), 2200);
    const t4 = setTimeout(() => setIntroPhase('ctaIn'), 2600);
    const t5 = setTimeout(() => setIntroPhase('complete'), 3200);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
  const heroScale = 1 + scrollY * 0.0003;

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
      const next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section ref={heroRef} className="video-hero">
        {/* Cinematic curtain */}
        <div
          className={`video-hero__curtain ${phaseReached('videoFade') ? 'video-hero__curtain--lifted' : ''}`}
        />

        {/* Live Holiday Banner */}
        <div className="video-hero__banner">
          <span className="video-hero__banner-eyebrow">Celebrated Holiday / Special Occasion</span>
          <span className="video-hero__banner-title">{holiday.name}</span>
        </div>

        {/* Video Background */}
        <div
          className="video-hero__bg"
          style={{ transform: `scale(${heroScale})`, opacity: heroOpacity }}
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
          <div className="video-hero__overlay" />
        </div>

        {/* Text Content */}
        <div className="video-hero__content" style={{ opacity: heroOpacity }}>
          <h1
            className={`video-hero__title ${
              phaseReached('titleIn') ? 'video-hero__animate-in' : 'video-hero__hidden'
            }`}
          >
            Digital Bloom
          </h1>
          <p
            className={`video-hero__tagline ${
              phaseReached('taglineIn') ? 'video-hero__animate-in' : 'video-hero__hidden'
            }`}
          >
            Give Them Their Flowers While They&rsquo;re Here
          </p>
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

      {/* Scroll fade — dark to transparent */}
      <div className="video-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
