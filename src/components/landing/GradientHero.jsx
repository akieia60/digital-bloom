import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/gradient-hero.css';

function getUpcomingHoliday() {
  const now = new Date();
  const year = now.getFullYear();

  function nthWeekday(yr, mo, weekday, n) {
    const d = new Date(yr, mo - 1, 1);
    let count = 0;
    while (d.getMonth() === mo - 1) {
      if (d.getDay() === weekday) {
        count += 1;
        if (count === n) return new Date(d);
      }
      d.setDate(d.getDate() + 1);
    }
    return null;
  }

  const holidays = [
    { name: 'holiday_new_year', date: new Date(year, 0, 1) },
    { name: 'holiday_valentine', date: new Date(year, 1, 14) },
    { name: 'holiday_mothers_day', date: nthWeekday(year, 5, 0, 2) },
    { name: 'holiday_fathers_day', date: nthWeekday(year, 6, 0, 3) },
    { name: 'holiday_christmas', date: new Date(year, 11, 25) },
  ].filter((holiday) => holiday.date);

  const today = new Date(year, now.getMonth(), now.getDate());
  holidays.sort((a, b) => a.date - b.date);

  return holidays.find((holiday) => {
    const diff = (holiday.date - today) / (1000 * 60 * 60 * 24);
    return diff >= -3 && diff <= 30;
  }) || null;
}

export default function GradientHero() {
  const [contentVisible, setContentVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicHinted, setMusicHinted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { t } = useLanguage();
  const holiday = useMemo(() => getUpcomingHoliday(), []);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 220);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasInteracted) return;
    const showT = setTimeout(() => setMusicHinted(true), 2200);
    const hideT = setTimeout(() => setMusicHinted(false), 8500);
    return () => { clearTimeout(showT); clearTimeout(hideT); };
  }, [hasInteracted]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const toggleMusic = useCallback(() => {
    setHasInteracted(true);
    setMusicHinted(false);
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.volume = 0.35;
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  }, [musicPlaying]);

  return (
    <>
      <section className="gradient-hero">
        {/* Background music — "Flowers" hook (28s loop), muted by default */}
        <audio ref={audioRef} src="/audio/flowers-hook-trimmed.m4a" loop preload="auto" />

        <div className="gradient-hero__bg" aria-hidden="true">
          <div className="gradient-hero__glow gradient-hero__glow--1" />
          <div className="gradient-hero__glow gradient-hero__glow--2" />
          <div className="gradient-hero__glow gradient-hero__glow--3" />
          <div className="gradient-hero__grid" />
          <div className="gradient-hero__aurora" />
          <div className="gradient-hero__particles">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="gradient-hero__particle"
                style={{
                  left: `${5 + (i * 5.3) % 90}%`,
                  animationDelay: `${(i * 1.1) % 8}s`,
                  animationDuration: `${6 + (i % 5) * 1.5}s`,
                  width: `${2 + (i % 3) * 1.5}px`,
                  height: `${2 + (i % 3) * 1.5}px`,
                  opacity: 0.15 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="gradient-hero__watermark" aria-hidden="true">Digital Bloom™</div>

        <div
          className="gradient-hero__layout"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="gradient-hero__content">
            <h1 className="gradient-hero__title">
              {t('hero_new_title_1')}<br />
              <em>{t('hero_new_title_2')}</em>
            </h1>

            <p className="gradient-hero__tagline">{t('hero_new_tagline')}</p>

            <p className="gradient-hero__from">
              {t('hero_new_from')} <strong>$1</strong> · {t('hero_from_suffix')}
            </p>

          </div>

          <div className="gradient-hero__media-column">
            <div className="gradient-hero__media-frame">
              {!videoFailed && (
                <video
                  ref={videoRef}
                  className="gradient-hero__media-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onCanPlay={() => setVideoReady(true)}
                  onError={() => setVideoFailed(true)}
                  style={{
                    opacity: videoReady ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                >
                  <source src="/videos/digital_bloom_hero_morph.mp4" type="video/mp4" />
                </video>
              )}

              <div className="gradient-hero__media-brandmark">Digital Bloom™</div>

              {/* Music toggle — on video card */}
              {musicHinted && (
                <div className="gradient-hero__music-hint" aria-hidden="true">
                  Tap for music 🎵
                </div>
              )}
              <button
                type="button"
                className={`gradient-hero__music-toggle ${musicPlaying ? 'gradient-hero__music-toggle--playing' : ''} ${!hasInteracted && !musicPlaying ? 'gradient-hero__music-toggle--attention' : ''}`}
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Mute music' : 'Play music'}
                style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }}
              >
                {musicPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                    <path d="M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

      </section>
      <div className="gradient-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
