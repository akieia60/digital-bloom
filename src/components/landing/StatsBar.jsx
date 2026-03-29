/**
 * StatsBar — "2M+ Blooms Sent · 50+ Categories · 8 Languages · ..."
 * The horizontal trust bar from the mockup, sits just below the hero.
 */
const STATS = [
  { value: '2M+',    label: 'Blooms Sent'      },
  { value: '50+',    label: 'Categories'        },
  { value: '8',      label: 'Languages'         },
  { value: '60s',    label: 'Max Experience'    },
  { value: '4.9★',   label: 'Rating'            },
];

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-bar__inner">
        {STATS.map((s, i) => (
          <div key={i} className="stats-bar__item">
            <span className="stats-bar__value">{s.value}</span>
            <span className="stats-bar__label">{s.label}</span>
            {i < STATS.length - 1 && (
              <span className="stats-bar__divider" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
