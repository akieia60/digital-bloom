const MAX_MESSAGE = 150;

export default function GiftingForm({ recipientName, recipientEmail, deliveryDate, giftMessage, senderName, onChange }) {
  const charsLeft = MAX_MESSAGE - (giftMessage?.length || 0);
  const charsUsed = giftMessage?.length || 0;

  return (
    <div className="gifting-form">
      <h3 className="gifting-title">Gift Delivery Details</h3>
      <p className="gifting-subtitle">
        This Digital Bloom™ experience will be delivered privately as a cinematic digital gift.
      </p>

      <div className="form-group">
        <label className="customizer-label">Recipient Name</label>
        <input
          type="text"
          className="customizer-input"
          placeholder="Who is this for?"
          value={recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="customizer-label">Recipient Email</label>
        <input
          type="email"
          className="customizer-input"
          placeholder="their@email.com"
          value={recipientEmail}
          onChange={(e) => onChange('recipientEmail', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="customizer-label">Your Name (From)</label>
        <input
          type="text"
          className="customizer-input"
          placeholder="Your name"
          value={senderName || ''}
          onChange={(e) => onChange('senderName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="customizer-label">Delivery Date (Optional)</label>
        <input
          type="date"
          className="customizer-input"
          value={deliveryDate}
          onChange={(e) => onChange('deliveryDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        <span className="customizer-hint">Leave blank for immediate delivery</span>
      </div>

      {/* Message field with preview */}
      <div className="form-group">
        <label className="customizer-label">Personal Message (Optional)</label>

        {/* Live message preview card */}
        <div className="gifting-message-preview">
          {/* TO: top left */}
          <div className="gifting-preview-to">
            <span className="gifting-preview-label">To:</span>
            <span className="gifting-preview-name">
              {recipientName || 'Recipient'}
            </span>
          </div>

          {/* Message text in the center */}
          <p className="gifting-preview-text">
            {giftMessage
              ? giftMessage
              : <span className="gifting-preview-placeholder">Your message will appear here…</span>
            }
          </p>

          {/* FROM: bottom right */}
          <div className="gifting-preview-from">
            <span className="gifting-preview-label">From:</span>
            <span className="gifting-preview-name">
              {senderName || 'You'}
            </span>
          </div>
        </div>

        <textarea
          className="customizer-textarea"
          placeholder="Write a personal message to accompany your bloom…"
          maxLength={MAX_MESSAGE}
          rows="3"
          value={giftMessage}
          onChange={(e) => onChange('giftMessage', e.target.value)}
        />

        {/* Character count */}
        <div className="gifting-char-count">
          <span className={charsLeft <= 20 ? 'gifting-char-count--low' : ''}>
            {charsUsed}/{MAX_MESSAGE} characters
          </span>
          {charsLeft <= 20 && (
            <span className="gifting-char-count--warning">
              {charsLeft} remaining
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
