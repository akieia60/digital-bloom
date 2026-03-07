import { useRef } from 'react';
import { getFilteredTemplates } from '../../data/bloomTemplates';

export default function StepStyle({ value, onChange, categoryId, toneId }) {
  const templates = getFilteredTemplates(categoryId, toneId);
  const videoRefs = useRef({});

  const handleMouseEnter = (id) => {
    const video = videoRefs.current[id];
    if (video) video.play().catch(() => {});
  };

  const handleMouseLeave = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 3 of 7</div>
      <h2 className="builder-step__title">Choose your bloom style</h2>
      <p className="builder-step__subtitle">
        Hover to preview each bloom. Select the one that feels right for your moment.
      </p>

      <div className="builder-style-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`builder-style-card ${value === template.id ? 'builder-style-card--selected' : ''}`}
            onClick={() => onChange(template.id)}
            onMouseEnter={() => handleMouseEnter(template.id)}
            onMouseLeave={() => handleMouseLeave(template.id)}
            type="button"
          >
            {template.premium && (
              <div className="builder-style-card__premium">Premium</div>
            )}
            <div className="builder-style-card__check">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="builder-style-card__video-wrap">
              <video
                ref={(el) => (videoRefs.current[template.id] = el)}
                className="builder-style-card__video"
                src={template.videoSrc}
                muted
                loop
                playsInline
                preload="none"
                poster=""
                style={{ background: template.posterColor }}
              />
              <div className="builder-style-card__overlay">
                <div className="builder-style-card__name">{template.name}</div>
                <div className="builder-style-card__tagline">{template.tagline}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
