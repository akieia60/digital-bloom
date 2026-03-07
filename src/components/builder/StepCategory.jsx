import { BLOOM_CATEGORIES } from '../../data/messages';

export default function StepCategory({ value, onChange }) {
  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 1 of 7</div>
      <h2 className="builder-step__title">What's the occasion?</h2>
      <p className="builder-step__subtitle">
        Choose the category that best captures what you want to express.
      </p>

      <div className="builder-choice-grid">
        {BLOOM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`builder-choice-card ${value === cat.id ? 'builder-choice-card--selected' : ''}`}
            onClick={() => onChange(cat.id)}
            type="button"
          >
            <div
              className="builder-choice-card__accent"
              style={{ background: cat.color }}
            />
            <div className="builder-choice-card__check">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="builder-choice-card__icon">{cat.icon}</span>
            <div className="builder-choice-card__label">{cat.label}</div>
            <div className="builder-choice-card__desc">{cat.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
