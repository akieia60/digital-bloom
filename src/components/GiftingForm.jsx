export default function GiftingForm({ recipientName, recipientEmail, deliveryDate, giftMessage, onChange }) {
  return (
    <div className="gifting-form">
      <h3 className="gifting-title">Gift Delivery Details</h3>
      <p className="gifting-subtitle">
        This DigitalBloom experience will be delivered privately as a digital multimedia experience.
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

      <div className="form-group">
        <label className="customizer-label">Gift Message (Optional)</label>
        <textarea
          className="customizer-textarea"
          placeholder="Add a personal message to accompany your gift..."
          maxLength="150"
          rows="3"
          value={giftMessage}
          onChange={(e) => onChange('giftMessage', e.target.value)}
        />
        <span className="customizer-hint">{giftMessage.length}/150</span>
      </div>
    </div>
  );
}
