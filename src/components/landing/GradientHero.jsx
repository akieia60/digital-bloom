import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/gradient-hero.css';

// ── Holiday auto-detection (kept from original VideoHero) ────────────────────
function getUpcomingHoliday() {
  const now = new Date();
  const year = now.getFullYear();

  function nthWeekday(yr, mo, weekday, n) {
    const d = new Date(yr, mo - 1, 1);
    let count = 0;
    while (d.getMonth() === mo - 1) {
      if (d.getDay() === weekday) { count++; if (count === n) return new Date(d); }
      d.setDate(d.getDate() + 1);
    }
    return null;
  }

  const holidays = [
    { name: "holiday_new_year",        date: new Date(year, 0, 1) },
    { name: "holiday_valentine", date: new Date(year, 1, 14) },
    { name: "holiday_mothers_day",    date: nthWeekday(year, 5, 0, 2) },
    { name: "holiday_fathers_day",    date: nthWeekday(year, 6, 0, 3) },
    { name: "holiday_christmas",       date: new Date(year, 11, 25) },
  ].filter(h => h.date);

  const today = new Date(year, now.getMonth(), now.getDate());
  holidays.sort((a, b) => a.date - b.date);
  return holidays.find(h => {
    const diff = (h.date - today) / (1000 * 60 * 60 * 24);
    return diff >= -3 && diff <= 30;
  }) || null;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function GradientHero() {
  const [contentVisible, setContentVisible] = useState(false);
  const { t } = useLanguage();
  const holiday = useMemo(() => getUpcomingHoliday(), []);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = useCallback(() => {
    const hero = document.querySelector('.gradient-hero');
    if (hero?.nextElementSibling) {
      hero.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section className="gradient-hero">

        {/* ── Animated background ── */}
        <div className="gradient-hero__bg" aria-hidden="true">
          <div className="gradient-hero__glow gradient-hero__glow--1" />
          <div className="gradient-hero__glow gradient-hero__glow--2" />
          <div className="gradient-hero__glow gradient-hero__glow--3" />
          <div className="gradient-hero__grid" />
          {/* Aurora light sweep */}
          <div className="gradient-hero__aurora" />
          {/* Floating particles */}
          <div className="gradient-hero__particles">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="gradient-hero__particle" style={{
                left: `${5 + (i * 5.3) % 90}%`,
                animationDelay: `${(i * 1.1) % 8}s`,
                animationDuration: `${6 + (i % 5) * 1.5}s`,
                width: `${2 + (i % 3) * 1.5}px`,
                height: `${2 + (i % 3) * 1.5}px`,
                opacity: 0.15 + (i % 4) * 0.1,
              }} />
            ))}
          </div>
        </div>

        {/* ── Watermark ── */}
        <div className="gradient-hero__watermark" aria-hidden="true">Digital Bloom\u2122</div>

        {/* ── Main content ── */}
        <div
          className="gradient-hero__content"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Holiday banner */}
          {holiday && (
            <div className="gradient-hero__banner">
              <span className="gradient-hero__banner-title">{t(holiday.name)}</span>
            </div>
          )}

          {/* Pill badge */}
          <div className="gradient-hero__pill">
            <span className="gradient-hero__pill-dot" aria-hidden="true" />
            <span className="gradient-hero__pill-text">{t('hero_pill_badge')}</span>
          </div>

          {/* Headline — translated */}
          <h1 className="gradient-hero__title">
            {t('hero_new_title_1')}<br />
            <em>{t('hero_new_title_2')}</em>
          </h1>

          {/* Sub-tagline — translated */}
          <p className="gradient-hero__tagline">
            {t('hero_new_tagline')}
          </p>

          {/* CTA — translated */}
          <div className="gradient-hero__cta-wrap">
            <Link to="/shop" className="gradient-hero__btn">
              <span className="gradient-hero__btn-text">{t('hero_new_cta')}</span>
              <span className="gradient-hero__btn-shimmer" aria-hidden="true" />
            </Link>
          </div>

          {/* Pricing note */}
          <p className="gradient-hero__from">
            {t('hero_new_from')} <strong>$1.99</strong> &mdash; {t('hero_new_no_app')}
          </p>
        </div>

        {/* ── Scroll indicator ── */}
        <button
          type="button"
          className="gradient-hero__scroll-indicator"
          onClick={scrollToContent}
          aria-label="Scroll to content"
          style={{ opacity: contentVisible ? 0.7 : 0, transition: 'opacity 0.5s ease 0.5s' }}
        >
          <span className="gradient-hero__scroll-text">{t('hero_scroll')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

      </section>
      <div className="gradient-hero__scroll-fade" aria-hidden="true" />
    </>
  );
}
