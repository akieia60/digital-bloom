import { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import OCCASIONS from '../../data/occasions';
import '../../styles/gradient-hero.css';

const HERO_PILL_CATEGORIES = [
  'mothers-day', 'birthday', 'love', 'anniversary', 'celebration',
  'thank-you', 'graduation', 'fathers-day', 'friendship', 'encouragement',
  'grief', 'baby', 'milestones', 'promotions', 'luxury', 'holidays',
];

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
  const videoRef = useRef(null);
  const { t } = useLanguage();
  const holiday = useMemo(() => getUpcomingHoliday(), []);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 220);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <section className="gradient-hero">
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
            {holiday && (
              <div className="gradient-hero__banner">
                <span className="gradient-hero__banner-title">{t(holiday.name)}</span>
              </div>
            )}

            <div className="gradient-hero__pill">
              <span className="gradient-hero__pill-dot" aria-hidden="true" />
              <span className="gradient-hero__pill-text">{t('hero_pill_badge')}</span>
            </div>

            <h1 className="gradient-hero__title">
              {t('hero_new_title_1')}<br />
              <em>{t('hero_new_title_2')}</em>
            </h1>

            <p className="gradient-hero__tagline">{t('hero_new_tagline')}</p>

            <p className="gradient-hero__from">
              {t('hero_new_from')} <strong>$1.99</strong> · {t('hero_from_suffix')}
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
                  poster="/videos/hero_bloom_poster.jpg"
                  preload="auto"
                  onCanPlay={() => setVideoReady(true)}
                  onError={() => setVideoFailed(true)}
                >
                  <source src="/videos/digital_bloom_hero_morph.mp4" type="video/mp4" />
                </video>
              )}

              {(!videoReady || videoFailed) && (
                <img
                  src="/videos/hero_bloom_poster.jpg"
                  alt="Digital Bloom hero"
                  className="gradient-hero__media-fallback"
                />
              )}

              <div className="gradient-hero__media-brandmark">Digital Bloom™</div>
            </div>
          </div>
        </div>

        {/* Category pill strip — horizontal scroll, full-bleed */}
        <div style={{ position: 'relative', marginTop: '1.5rem' }}>
          {/* Right fade — visual hint that more pills scroll off-screen */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '60px', zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to right, transparent, #0c1f3f)',
          }} />
          <div style={{
            overflowX: 'auto', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            paddingBottom: '1.5rem', paddingTop: '0.5rem',
          }}>
            <div style={{
              display: 'flex', gap: '10px',
              paddingLeft: '1.25rem', paddingRight: '4rem',
              width: 'max-content',
            }}>
              {HERO_PILL_CATEGORIES.map((slug) => {
                const occasion = OCCASIONS[slug];
                if (!occasion) return null;
                return (
                  <Link
                    key={slug}
                    to={`/shop/${slug}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '999px',
                      border: `1px solid ${occasion.accent}55`,
                      background: `${occasion.accent}12`,
                      color: '#ffffff', fontSize: '13px', fontWeight: 500,
                      letterSpacing: '0.02em', textDecoration: 'none',
                      whiteSpace: 'nowrap', flexShrink: 0,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = occasion.accent;
                      e.currentTarget.style.background = `${occasion.accent}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${occasion.accent}55`;
                      e.currentTarget.style.background = `${occasion.accent}12`;
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{occasion.emoji}</span>
                    <span>{occasion.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </section>
      <div className="gradient-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
