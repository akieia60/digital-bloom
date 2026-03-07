import { useRef, useEffect } from 'react';
import { getTemplateById } from '../../data/bloomTemplates';
import { BLOOM_CATEGORIES, BLOOM_TONES } from '../../data/messages';

export default function StepPreview({ state }) {
  const { category, tone, styleId, message, personalize } = state;
  const videoRef = useRef(null);

  const template = getTemplateById(styleId);
  const categoryData = BLOOM_CATEGORIES.find((c) => c.id === category);
  const toneData = BLOOM_TONES.find((t) => t.id === tone);

  const displayMessage = message?.preset || message?.custom || '';
  const toName = personalize?.to || '';
  const fromName = personalize?.from || '';

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, [styleId]);

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 6 of 7</div>
      <h2 className="builder-step__title">Your bloom, previewed</h2>
      <p className="builder-step__subtitle">
        This is how your recipient will experience it. Make it perfect before checkout.
      </p>

      <div className="builder-preview">
        {/* Left: live preview frame */}
        <div className="builder-preview__video-frame">
          <div className="builder-preview__corner builder-preview__corner--tl" />
          <div className="builder-preview__corner builder-preview__corner--tr" />
          <div className="builder-preview__corner builder-preview__corner--bl" />
          <div className="builder-preview__corner builder-preview__corner--br" />

          {template ? (
            <video
              ref={videoRef}
              className="builder-preview__video"
              src={template.videoSrc}
              muted
              loop
              playsInline
              style={{ background: template.posterColor }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#1D1D1F' }} />
          )}

          <div className="builder-preview__overlay">
            {toName && (
              <div className="builder-preview__to">For {toName}</div>
            )}
            {displayMessage && (
              <div className="builder-preview__message">
                &ldquo;{displayMessage}&rdquo;
              </div>
            )}
            {fromName && (
              <div className="builder-preview__from">— {fromName}</div>
            )}
          </div>
        </div>

        {/* Right: selection summary */}
        <div className="builder-preview__details">
          <div className="builder-preview__summary-title">Your Selection</div>

          <div className="builder-preview__row">
            <div className="builder-preview__row-label">Occasion</div>
            <div className="builder-preview__row-value">
              {categoryData?.icon} {categoryData?.label || category}
            </div>
          </div>

          <div className="builder-preview__row">
            <div className="builder-preview__row-label">Tone</div>
            <div className="builder-preview__row-value">
              {toneData?.label || tone}
            </div>
          </div>

          <div className="builder-preview__row">
            <div className="builder-preview__row-label">Bloom Style</div>
            <div className="builder-preview__row-value">
              {template?.name || styleId}
            </div>
          </div>

          <div className="builder-preview__row">
            <div className="builder-preview__row-label">Message</div>
            <div className="builder-preview__row-value builder-preview__row-value--italic">
              {displayMessage ? `"${displayMessage}"` : <em style={{ color: '#86868B' }}>No message added</em>}
            </div>
          </div>

          {toName && (
            <div className="builder-preview__row">
              <div className="builder-preview__row-label">To</div>
              <div className="builder-preview__row-value">{toName}</div>
            </div>
          )}

          {fromName && (
            <div className="builder-preview__row">
              <div className="builder-preview__row-label">From</div>
              <div className="builder-preview__row-value">{fromName}</div>
            </div>
          )}

          {personalize?.deliveryDate && (
            <div className="builder-preview__row">
              <div className="builder-preview__row-label">Delivery Date</div>
              <div className="builder-preview__row-value">
                {new Date(personalize.deliveryDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          )}

          {personalize?.recipientEmail && (
            <div className="builder-preview__row">
              <div className="builder-preview__row-label">Deliver To</div>
              <div className="builder-preview__row-value">{personalize.recipientEmail}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
