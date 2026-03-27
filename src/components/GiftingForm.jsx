import { useLanguage } from '../contexts/LanguageContext';

const MAX_MESSAGE = 150;

export default function GiftingForm({ recipientName, recipientEmail, deliveryDate, giftMessage, senderName, onChange }) {
  const { t } = useLanguage();
  const charsLeft = MAX_MESSAGE - (giftMessage?.length || 0);
  const charsUsed = giftMessage?.length || 0;

  return (
    <div className="gifting-form">
      <h3 className="gifting-title">{t('gift_title')}</h3>
      <p className="gifting-subtitle">{t('gift_subtitle')}</p>

      <div className="form-group">
        <label className="customizer-label">{t('gift_recipient_name')}</label>
        <input
          type="text"
          className="customizer-input"
          placeholder={t('gift_recipient_name_placeholder')}
          value={recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="customizer-label">{t('gift_recipient_email')}</label>
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
        <label className="customizer-label">{t('gift_sender_name')}</label>
        <input
          type="text"
          className="customizer-input"
          placeholder={t('gift_sender_name_placeholder')}
          value={senderName || ''}
          onChange={(e) => onChange('senderName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="customizer-label">{t('gift_delivery_date')}</label>
        <input
          type="date"
          className="customizer-input"
          value={deliveryDate}
          onChange={(e) => onChange('deliveryDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        <span className="customizer-hint">{t('gift_delivery_date_hint')}</span>
      </div>

      {/* Message field with preview */}
      <div className="form-group">
        <label className="customizer-label">{t('gift_sign_card')}</label>
        <p style={{ fontSize: '0.78rem', color: '#6E6E73', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>
          {t('gift_sign_hint')}
        </p>

        {/* Live gift card preview */}
        <div className="gifting-message-preview">
          {/* Decorative top divider */}
          <div className="gifting-preview-divider" />

          {/* TO: top left */}
          <div className="gifting-preview-to">
            <span className="gifting-preview-label">To:</span>
            <span className="gifting-preview-name">
              {recipientName || t('gift_recipient_fallback')}
            </span>
          </div>

          {/* Message text in the center */}
          <p className="gifting-preview-text">
            {giftMessage
              ? giftMessage
              : <span className="gifting-preview-placeholder">{t('gift_placeholder_message')}</span>
            }
          </p>

          {/* FROM: bottom right */}
          <div className="gifting-preview-from">
            <span className="gifting-preview-label">{t('gift_preview_from')}</span>
            <span className="gifting-preview-name">
              {senderName || t('gift_sender_fallback')}
            </span>
          </div>

          {/* Decorative bottom accent */}
          <div className="gifting-preview-footer">
            <span>Digital Bloom™</span>
          </div>
        </div>

        <textarea
          className="customizer-textarea"
          placeholder={t('gift_message_placeholder')}
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
              {charsLeft} {t('gift_chars_remaining')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
