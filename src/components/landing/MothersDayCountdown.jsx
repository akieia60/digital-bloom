import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/mothers-day-countdown.css';

// Show until the deadline passes; auto-removes itself the next day.
// Update MOTHERS_DAY each year (or pull from a calendar table later).
const MOTHERS_DAY = new Date('2026-05-10T23:59:59-04:00');
const HIDE_AFTER  = new Date('2026-05-11T06:00:00-04:00');

// Calendar-day diff in America/New_York so the banner says "today" all day
// on Mother's Day (not "tomorrow" until midnight). Previous Math.ceil math
// kept showing "tomorrow" until 11:59 PM on 5/10 because ~7 hours of remaining
// ms still rounded up to a full day. David caught it at ~5pm.
function daysUntil(target) {
  const tz = 'America/New_York';
  const ymd = (d) => d.toLocaleDateString('en-CA', { timeZone: tz });
  const targetYmd = ymd(target);
  const nowYmd = ymd(new Date());
  if (nowYmd >= targetYmd) return 0;
  const t1 = new Date(`${targetYmd}T00:00:00Z`).getTime();
  const t0 = new Date(`${nowYmd}T00:00:00Z`).getTime();
  return Math.round((t1 - t0) / (1000 * 60 * 60 * 24));
}

export default function MothersDayCountdown() {
  const { t } = useLanguage();
  const [days, setDays] = useState(() => daysUntil(MOTHERS_DAY));
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('md_banner_dismissed_2026') === '1'; }
    catch { return false; }
  });

  // Refresh once per minute so the count updates as midnight rolls over.
  useEffect(() => {
    const t = setInterval(() => setDays(daysUntil(MOTHERS_DAY)), 60_000);
    return () => clearInterval(t);
  }, []);

  // Hide post-event so the page isn't stale.
  if (new Date() > HIDE_AFTER) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('md_banner_dismissed_2026', '1'); } catch {}
  };

  let headline;
  if (days === 0) {
    headline = `💐 ${t('md_countdown_today')}`;
  } else if (days === 1) {
    headline = `💐 ${t('md_countdown_tomorrow')}`;
  } else {
    headline = `💐 ${t('md_countdown_days').replace('{days}', days)}`;
  }

  return (
    <div className="md-countdown-banner" role="region" aria-label={t('md_countdown_aria')}>
      <div className="md-countdown-banner__inner">
        <Link to="/shop/mothers-day" className="md-countdown-banner__cta">
          <span className="md-countdown-banner__headline">{headline}</span>
          <span className="md-countdown-banner__arrow" aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          className="md-countdown-banner__dismiss"
          onClick={handleDismiss}
          aria-label={t('md_countdown_dismiss')}
        >
          ×
        </button>
      </div>
    </div>
  );
}
