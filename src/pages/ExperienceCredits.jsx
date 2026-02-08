import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createCreditCheckoutSession } from '../lib/creditStripe';
import '../styles/credits.css';

export default function ExperienceCredits() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isGift, setIsGift] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      // Validate gift details if gifting
      if (isGift) {
        if (!giftDetails.recipientEmail) {
          throw new Error('Recipient email is required for gifts');
        }
      }

      // Get purchaser email (you may want to get this from user context/auth)
      const purchaserEmail = prompt('Enter your email address:');
      if (!purchaserEmail) {
        throw new Error('Email is required');
      }

      // Create checkout session
      const { url } = await createCreditCheckoutSession({
        amountDollars: amount,
        purchaserEmail,
        recipientEmail: isGift ? giftDetails.recipientEmail : null,
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
        {/* Hero Section */}
        <div className="credits-hero">
          <h1 className="section-title">Experience Credits</h1>
          <p className="section-subtitle">
            Prepaid access to DigitalBloom digital multimedia experiences
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

        {/* Credit Amount Cards */}
        <div className="credits-grid">
          {creditAmounts.map((amount) => (
            <div
              key={amount.value}
              className={`credit-card ${selectedAmount === amount.value ? 'selected' : ''}`}
              onClick={() => setSelectedAmount(amount.value)}
            >
              {amount.popular && <span className="credit-badge">Popular</span>}
              <div className="credit-amount">{amount.label}</div>
              <button
                className="cta-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(amount.value);
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Buy Experience Credit'}
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
            <span className="toggle-label">Send as a gift</span>
          </label>

          {isGift && (
            <div className="gift-form">
              <h3 className="gift-form-title">Gift Details</h3>
              
              <div className="form-group">
                <label>Recipient Name</label>
                <input
                  type="text"
                  className="customizer-input"
                  placeholder="Who is this for?"
                  value={giftDetails.recipientName}
                  onChange={(e) => setGiftDetails({...giftDetails, recipientName: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Recipient Email</label>
                <input
                  type="email"
                  className="customizer-input"
                  placeholder="their@email.com"
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
                <label>Personal Note (Optional)</label>
                <textarea
                  className="customizer-textarea"
                  placeholder="Add a personal message..."
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
          <h2 className="section-title">How Experience Credits Work</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-number">01</div>
              <h3>Purchase</h3>
              <p>Select an amount and complete your purchase. You'll receive a unique credit code.</p>
            </div>
            <div className="info-card">
              <div className="info-number">02</div>
              <h3>Customize</h3>
              <p>Browse experiences and customize one to your preferences.</p>
            </div>
            <div className="info-card">
              <div className="info-number">03</div>
              <h3>Redeem</h3>
              <p>Enter your credit code at checkout to apply it toward publishing your experience.</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="credits-legal">
          <h3>Important Information</h3>
          <ul>
            <li>Redeemable only on DigitalBloom</li>
            <li>Not redeemable for cash</li>
            <li>Non-refundable</li>
            <li>Intended for DigitalBloom experience publishing only</li>
            <li>No expiration date</li>
          </ul>
        </div>

        {/* Check Balance CTA */}
        <div className="credits-balance-cta">
          <p>Already have a credit code?</p>
          <Link to="/credits/balance" className="cta-secondary">
            Check Your Balance
          </Link>
        </div>
      </div>
    </div>
  );
}
