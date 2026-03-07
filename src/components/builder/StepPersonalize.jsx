export default function StepPersonalize({ value, onChange }) {
  const handleChange = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 5 of 7</div>
      <h2 className="builder-step__title">Personalize your bloom</h2>
      <p className="builder-step__subtitle">
        Add the details that make it yours — and theirs.
      </p>

      <div className="builder-personalize">
        {/* To / From */}
        <div className="builder-field-row">
          <div className="builder-field-group">
            <label className="builder-label" htmlFor="bloom-to">To</label>
            <input
              id="bloom-to"
              type="text"
              className="builder-input"
              placeholder="Their name"
              value={value?.to || ''}
              onChange={(e) => handleChange('to', e.target.value)}
              maxLength={60}
            />
          </div>
          <div className="builder-field-group">
            <label className="builder-label" htmlFor="bloom-from">From</label>
            <input
              id="bloom-from"
              type="text"
              className="builder-input"
              placeholder="Your name"
              value={value?.from || ''}
              onChange={(e) => handleChange('from', e.target.value)}
              maxLength={60}
            />
          </div>
        </div>

        {/* Recipient Email */}
        <div className="builder-field-group">
          <label className="builder-label" htmlFor="bloom-email">Recipient email</label>
          <input
            id="bloom-email"
            type="email"
            className="builder-input"
            placeholder="their@email.com"
            value={value?.recipientEmail || ''}
            onChange={(e) => handleChange('recipientEmail', e.target.value)}
          />
          <div className="builder-field-hint">We'll deliver the bloom here after checkout</div>
        </div>

        {/* Delivery Date */}
        <div className="builder-field-group">
          <label className="builder-label" htmlFor="bloom-date">Delivery date (optional)</label>
          <input
            id="bloom-date"
            type="date"
            className="builder-input"
            value={value?.deliveryDate || ''}
            onChange={(e) => handleChange('deliveryDate', e.target.value)}
            min={today}
          />
          <div className="builder-field-hint">Leave blank for immediate delivery after purchase</div>
        </div>

        {/* Private Note */}
        <div className="builder-field-group">
          <label className="builder-label" htmlFor="bloom-note">Private note (optional)</label>
          <textarea
            id="bloom-note"
            className="builder-textarea"
            placeholder="Add a private note for the recipient — only they will see this..."
            value={value?.privateNote || ''}
            onChange={(e) => handleChange('privateNote', e.target.value)}
            maxLength={300}
            rows={3}
          />
          <div className="builder-field-hint">{(value?.privateNote || '').length}/300</div>
        </div>
      </div>
    </div>
  );
}
