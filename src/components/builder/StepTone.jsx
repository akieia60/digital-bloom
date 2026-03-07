import { getAvailableTones, BLOOM_CATEGORIES } from '../../data/messages';

const TONE_ICONS = {
  heartfelt: '💛',
  elegant: '✦',
  romantic: '🌹',
  playful: '✨',
  uplifting: '☀️',
  deep: '🌊',
};

export default function StepTone({ value, onChange, categoryId }) {
  const tones = getAvailableTones(categoryId);
  const category = BLOOM_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 2 of 7</div>
      <h2 className="builder-step__title">Choose your tone</h2>
      <p className="builder-step__subtitle">
        How do you want your {category?.label.toLowerCase() || 'bloom'} to feel?
        The tone shapes the message and the bloom style we recommend.
      </p>

      <div className="builder-choice-grid">
        {tones.map((tone) => (
          <button
            key={tone.id}
            className={`builder-choice-card ${value === tone.id ? 'builder-choice-card--selected' : ''}`}
            onClick={() => onChange(tone.id)}
            type="button"
          >
            <div
              className="builder-choice-card__accent"
              style={{ background: value === tone.id ? '#D4AF37' : '#E8E8ED' }}
            />
            <div className="builder-choice-card__check">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="builder-choice-card__icon">{TONE_ICONS[tone.id] || '◆'}</span>
            <div className="builder-choice-card__label">{tone.label}</div>
            <div className="builder-choice-card__desc">{tone.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
