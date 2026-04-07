import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCreditCheckoutSession } from '../lib/creditStripe';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/credits.css';

export default function ExperienceCredits() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isGift, setIsGift] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [giftDetails, setGiftDetails] = useState({
    recipientName: '',
    recipientEmail: '',
    deliveryDate: '',
    note: ''
  });

  const creditAmounts = [
    { value: 10, label: '$10' },
    { value: 25, label: '$25', popular: true },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
    { value: 150, label: '$150' },
    { value: 200, label: '$200' }
  ];

  const handlePurchase = async (amount) => {
    setError('');
    setLoading(true);

    try {
      const normalizedPurchaserEmail = purchaserEmail.trim();
      if (!normalizedPurchaserEmail) {
        setLoading(false);
        throw new Error('Your email is required to purchase Bloom Credits');
      }

      // Validate gift details if gifting
      if (isGift) {
        if (!giftDetails.recipientEmail) {
          setLoading(false);
          throw new Error('Recipient email is required for gifts');
        }
      }

      // Create checkout session
      const { url } = await createCreditCheckoutSession({
        amountDollars: amount,
        purchaserEmail: normalizedPurchaserEmail,
        recipientEmail: isGift ? giftDetails.recipientEmail : null,
        recipientName: isGift ? giftDetails.recipientName : null,
        deliveryDate: isGift ? giftDetails.deliveryDate : null,
        note: isGift ? giftDetails.note : null
      });

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  return (
    <div className="credits-page">
      <div className="landing-container">
        {/* Back Button */}
        <div className="credits-hero">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', transition: 'border-color 0.2s' }}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '500' }}>{t('common_back')}</span>
          </button>
          <h1 className="section-title">{t('credits_title')}</h1>
          <p className="section-subtitle">
            {t('credits_subtitle')}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #f44336',
            color: '#c62828',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="credits-purchase-panel">
          <div className="form-group">
            <label>{t('contact_label_email')}</label>
            <input
              type="email"
              className="customizer-input"
              placeholder={t('contact_placeholder_email')}
              value={purchaserEmail}
              onChange={(e) => setPurchaserEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
            <span className="customizer-hint">{t('credits_checkout_hint')}</span>
          </div>
        </div>

        {/* Credit Amount Cards */}
        <div className="credits-grid">
          {creditAmounts.map((amount) => (
            <div
              key={amount.value}
              className={`credit-card ${selectedAmount === amount.value ? 'selected' : ''}`}
              onClick={() => !loading && setSelectedAmount(amount.value)}
            >
              {amount.popular && <span className="credit-badge">{t('credits_popular')}</span>}
              <div className="credit-amount">{amount.label}</div>
              <button
                className="cta-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!loading) {
                    setSelectedAmount(amount.value);
                    handlePurchase(amount.value);
                  }
                }}
                disabled={loading || !purchaserEmail.trim()}
                style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading && selectedAmount === amount.value ? t('credits_processing') : `${t('credits_buy')} ${amount.label}`}
              </button>
            </div>
          ))}
        </div>

        {/* Gifting Option */}
        <div className="credits-gifting">
          <label className="credit-toggle">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
            />
            <span className="toggle-label">{t('credits_send_gift')}</span>
          </label>

          {isGift && (
            <div className="gift-form">
              <h3 className="gift-form-title">{t('credits_gift_title')}</h3>

              <div className="form-group">
                <label>{t('credits_gift_name')}</label>
                <input
                  type="text"
                  className="customizer-input"
                  placeholder={t('credits_gift_name_placeholder')}
                  value={giftDetails.recipientName}
                  onChange={(e) => setGiftDetails({...giftDetails, recipientName: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>{t('credits_gift_email')}</label>
                <input
                  type="email"
                  className="customizer-input"
                  placeholder={t('credits_gift_email_placeholder')}
                  value={giftDetails.recipientEmail}
                  onChange={(e) => setGiftDetails({...giftDetails, recipientEmail: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Delivery Date (Optional)</label>
                <input
                  type="date"
                  className="customizer-input"
                  value={giftDetails.deliveryDate}
                  onChange={(e) => setGiftDetails({...giftDetails, deliveryDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
                <span className="customizer-hint">Leave blank for immediate delivery</span>
              </div>

              <div className="form-group">
                <label>{t('credits_gift_message')}</label>
                <textarea
                  className="customizer-textarea"
                  placeholder={t('credits_gift_message_placeholder')}
                  maxLength="200"
                  rows="3"
                  value={giftDetails.note}
                  onChange={(e) => setGiftDetails({...giftDetails, note: e.target.value})}
                />
                <span className="customizer-hint">{giftDetails.note.length}/200</span>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="credits-info">
          <h2 className="section-title">{t('credits_how_title')}</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-number">01</div>
              <h3>{t('credits_how_step1_title')}</h3>
              <p>{t('credits_how_step1_desc')}</p>
            </div>
            <div className="info-card">
              <div className="info-number">02</div>
              <h3>{t('credits_how_step2_title')}</h3>
              <p>{t('credits_how_step2_desc')}</p>
            </div>
            <div className="info-card">
              <div className="info-number">03</div>
              <h3>{t('credits_how_step3_title')}</h3>
              <p>{t('credits_how_step3_desc')}</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="credits-legal">
          <h3>{t('credits_important')}</h3>
          <ul>
            <li>{t('credits_info_1')}</li>
            <li>{t('credits_info_2')}</li>
            <li>{t('credits_info_3')}</li>
            <li>{t('credits_info_4')}</li>
          </ul>
        </div>

        {/* Check Balance CTA */}
        <div className="credits-balance-cta">
          <p>{t('credits_have_code')}</p>
          <Link to="/credits/balance" className="cta-secondary">
            {t('credits_check_balance')}
          </Link>
        </div>
      </div>
    </div>
  );
}
