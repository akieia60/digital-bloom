import { useLanguage } from '../../contexts/LanguageContext';

/**
 * StatsBar — "2M+ Blooms Sent · 50+ Categories · 8 Languages · ..."
 * The horizontal trust bar from the mockup, sits just below the hero.
 */
const STATS = [
  { value: '2M+',    label: 'stat_blooms_sent'      },
  { value: '50+',    label: 'stat_categories'        },
  { value: '8',      label: 'stat_languages'         },
  { value: '60s',    label: 'stat_max_experience'    },
  { value: '4.9★',   label: 'stat_rating'            },
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
