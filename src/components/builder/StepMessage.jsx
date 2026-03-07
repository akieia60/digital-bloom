import { useState } from 'react';
import { getMessages } from '../../data/messages';

export default function StepMessage({ value, onChange, categoryId, toneId }) {
  const [mode, setMode] = useState(value?.custom ? 'custom' : 'bank');
  const [customText, setCustomText] = useState(value?.custom || '');
  const [selectedPreset, setSelectedPreset] = useState(value?.preset || '');

  const messages = getMessages(categoryId, toneId);
  const MAX_CUSTOM = 220;

  const handlePresetSelect = (msg) => {
    setSelectedPreset(msg);
    onChange({ preset: msg, custom: '' });
  };

  const handleCustomChange = (e) => {
    const text = e.target.value.slice(0, MAX_CUSTOM);
    setCustomText(text);
    onChange({ preset: '', custom: text });
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'bank') {
      onChange({ preset: selectedPreset, custom: '' });
    } else {
      onChange({ preset: '', custom: customText });
    }
  };

  return (
    <div className="builder-step">
      <div className="builder-step__eyebrow">Step 4 of 7</div>
      <h2 className="builder-step__title">Choose your message</h2>
      <p className="builder-step__subtitle">
        Select a curated message or write your own. This appears on your bloom.
      </p>

      <div className="builder-message">
        {/* Tab switcher */}
        <div className="builder-message__tabs">
          <button
            className={`builder-message__tab ${mode === 'bank' ? 'builder-message__tab--active' : ''}`}
            onClick={() => handleModeSwitch('bank')}
            type="button"
          >
            Curated Messages
          </button>
          <button
            className={`builder-message__tab ${mode === 'custom' ? 'builder-message__tab--active' : ''}`}
            onClick={() => handleModeSwitch('custom')}
            type="button"
          >
            Write Your Own
          </button>
        </div>

        {mode === 'bank' && (
          <div className="builder-message__bank">
            {messages.length === 0 ? (
              <p style={{ color: '#6E6E73', fontStyle: 'italic', padding: '16px 0' }}>
                No curated messages available for this combination — try writing your own.
              </p>
            ) : (
              messages.map((msg, idx) => (
                <button
                  key={idx}
                  className={`builder-message__option ${selectedPreset === msg ? 'builder-message__option--selected' : ''}`}
                  onClick={() => handlePresetSelect(msg)}
                  type="button"
                >
                  &ldquo;{msg}&rdquo;
                  <span className="builder-message__option-check">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {mode === 'custom' && (
          <div className="builder-message__custom">
            <textarea
              className="builder-message__custom-textarea"
              placeholder="Write something beautiful..."
              value={customText}
              onChange={handleCustomChange}
              maxLength={MAX_CUSTOM}
              rows={5}
            />
            <div className="builder-message__custom-hint">
              <span>Your words, exactly as you mean them</span>
              <span>{customText.length}/{MAX_CUSTOM}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
