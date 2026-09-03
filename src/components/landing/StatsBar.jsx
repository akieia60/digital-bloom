import { useLanguage } from '../../contexts/LanguageContext';

/**
 * StatsBar — the horizontal trust bar below the hero.
 *
 * Every value here must be one we can defend if a customer, a Google Ads
 * reviewer, or the FTC asks. The previous version claimed "2M+ blooms sent"
 * and a "4.9★" rating against 232 real orders and no rating system at all;
 * both were removed on 2026-09-03. Unsupported performance and rating claims
 * are grounds for ad-account rejection, and invented reviews carry civil
 * penalties — so if a number here can't be sourced, it does not ship.
 *
 * Sources: 351 = active products in Supabase; 21 = distinct categories in
 * use; 10 = locale files in src/locales/. Re-check before changing.
 */
const STATS = [
  { value: '351',  label: 'stat_blooms_sent' },
  { value: '21',   label: 'stat_categories'  },
  { value: '10',   label: 'stat_languages'   },
];

export default function StatsBar() {
  const { t } = useLanguage();

  return (
    <div className="stats-bar">
      <div className="stats-bar__inner">
        {STATS.map((s, i) => (
          <div key={i} className="stats-bar__item">
            <span className="stats-bar__value">{s.value}</span>
            <span className="stats-bar__label">{t(s.label)}</span>
            {i < STATS.length - 1 && (
              <span className="stats-bar__divider" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
