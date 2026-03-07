const STEPS = [
  { label: 'Category' },
  { label: 'Tone' },
  { label: 'Style' },
  { label: 'Message' },
  { label: 'Personalize' },
  { label: 'Preview' },
  { label: 'Checkout' },
];

export default function BuilderProgress({ currentStep }) {
  return (
    <div className="builder-progress">
      <div className="builder-progress__steps">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={idx}
              className={`builder-progress__step ${isDone ? 'builder-progress__step--done' : ''} ${isActive ? 'builder-progress__step--active' : ''}`}
            >
              <div className="builder-progress__dot">
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`builder-progress__line ${isDone ? 'builder-progress__line--done' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="builder-progress__labels">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div
              key={idx}
              className={`builder-progress__label ${isDone ? 'builder-progress__label--done' : ''} ${isActive ? 'builder-progress__label--active' : ''}`}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
