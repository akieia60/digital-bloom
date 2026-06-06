import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Auto-detect the nearest upcoming (or current) holiday for a subtle banner
function getUpcomingHoliday() {
  const now = new Date();
  const year = now.getFullYear();

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
    { name: "Happy Mother's Day",      label: "Mother's Day",      date: nthWeekday(year, 5, 0, 2) },
    { name: "Happy Father's Day",      label: "Father's Day",      date: nthWeekday(year, 6, 0, 3) },
    { name: "Merry Christmas",         label: "Christmas",         date: new Date(year, 11, 25) },
  ].filter(h => h.date);

  const today = new Date(year, now.getMonth(), now.getDate());
  holidays.sort((a, b) => a.date - b.date);

  const active = holidays.find(h => {
    const diff = (h.date - today) / (1000 * 60 * 60 * 24);
    return diff >= -3 && diff <= 30;
  });

  return active || null;
}

export default function VideoHero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const holiday = useMemo(() => getUpcomingHoliday(), []);

  // Simplified intro — content visible quickly, no long cinematic wait
  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Play video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const scrollToContent = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      const next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section ref={heroRef} className="video-hero">
        {/* Video Background — with graceful fallback */}
        <div className="video-hero__bg">
          <div className="video-hero__video-wrap">
            {!videoFailed && (
              <video
                ref={videoRef}
                className="video-hero__video"
                autoPlay
                muted
                loop
                playsInline
                poster="/shara-bloom-poster.jpg"
                preload="auto"
                onCanPlay={() => setVideoLoaded(true)}
                onError={() => setVideoFailed(true)}
              >
                <source src="/shara-bloom-reaction.mp4" type="video/mp4" />
              </video>
            )}
            {/* Fallback: poster image if video fails */}
            {(videoFailed || !videoLoaded) && (
              <img
                src="/shara-bloom-poster.jpg"
                alt="Digital Bloom"
                className="video-hero__fallback-img"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: videoLoaded ? -1 : 0,
                }}
              />
            )}
          </div>
          <div className="video-hero__overlay" />
          {/* Persistent watermark — always visible in screenshots & recordings */}
          <div className="video-hero__watermark" aria-hidden="true">
            Digital Bloom™
          </div>
        </div>

        {/* Text Content — visible immediately on mobile */}
        <div
          className="video-hero__content"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Holiday banner — subtle, secondary */}
          {holiday && (
            <div className="video-hero__banner" style={{ marginBottom: '16px' }}>
              <span className="video-hero__banner-title">{holiday.name}</span>
            </div>
          )}

          <h1 className="video-hero__title">
            Digital Bloom<sup style={{ fontSize: '0.45em', verticalAlign: 'super', marginLeft: '3px', opacity: 0.75 }}>™</sup>
          </h1>
          <p className="video-hero__tagline">
            Give Them Their Flowers While They&rsquo;re Here
          </p>
          <div className="video-hero__cta-wrap">
            <Link to="/shop" className="video-hero__btn">
              <span className="video-hero__btn-text">Start Your Bloom</span>
              <span className="video-hero__btn-shimmer" />
              <span className="video-hero__btn-glow" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          type="button"
          className="video-hero__scroll-indicator"
          onClick={scrollToContent}
          aria-label="Scroll down"
          style={{
            opacity: contentVisible ? 0.7 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}
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

      {/* Scroll fade */}
      <div className="video-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
