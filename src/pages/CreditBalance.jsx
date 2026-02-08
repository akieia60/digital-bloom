import { useState } from 'react';
import { getCreditBalance } from '../lib/creditStripe';
import { isValidCreditCodeFormat, formatCreditAmount } from '../utils/creditCode';
import '../styles/credits.css';

export default function CreditBalance() {
  const [code, setCode] = useState('');
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckBalance = async () => {
    setError('');
    setBalance(null);
    setHistory([]);

    // Validate format
    if (!isValidCreditCodeFormat(code.toUpperCase())) {
      setError('Invalid credit code format. Expected format: DBLOOM-XXXX-XXXX');
      return;
    }

    setLoading(true);

    try {
      const data = await getCreditBalance(code.toUpperCase());
      setBalance(data);
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || 'Failed to check balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credits-page">
      <div className="landing-container">
        <div className="credits-hero">
          <h1 className="section-title">Check Your Balance</h1>
          <p className="section-subtitle">
            Enter your credit code to view your remaining balance and usage history
          </p>
        </div>

        {/* Balance Lookup Form */}
        <div className="balance-lookup">
          <div className="balance-form">
            <label className="customizer-label">Credit Code</label>
            <div className="balance-input-group">
              <input
                type="text"
                className="customizer-input"
                placeholder="DBLOOM-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength="17"
              />
              <button
                className="cta-primary"
                onClick={handleCheckBalance}
                disabled={loading || !code}
              >
                {loading ? 'Checking...' : 'Check Balance'}
              </button>
            </div>
            {error && <p className="balance-error">{error}</p>}
          </div>

          {/* Balance Display */}
          {balance && (
            <div className="balance-result">
              <div className="balance-card">
                <h2>Remaining Balance</h2>
                <div className="balance-amount">
                  {formatCreditAmount(balance.remaining_amount_cents)}
                </div>
                <div className="balance-details">
                  <div className="balance-detail">
                    <span className="detail-label">Original Amount:</span>
                    <span className="detail-value">
                      {formatCreditAmount(balance.initial_amount_cents)}
                    </span>
                  </div>
                  <div className="balance-detail">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-${balance.status}`}>
                      {balance.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="balance-detail">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {new Date(balance.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage History */}
              {history.length > 0 && (
                <div className="balance-history">
                  <h3>Usage History</h3>
                  <div className="history-list">
                    {history.map((entry) => (
                      <div key={entry.id} className="history-item">
                        <div className="history-info">
                          <span className="history-reason">{entry.reason}</span>
                          <span className="history-date">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`history-amount ${entry.delta_cents > 0 ? 'positive' : 'negative'}`}>
                          {entry.delta_cents > 0 ? '+' : ''}
                          {formatCreditAmount(Math.abs(entry.delta_cents))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="balance-help">
          <h3>Need Help?</h3>
          <p>
            If you have questions about your Experience Credit or need assistance,
            please contact us at support@digitalbloom.com
          </p>
        </div>
      </div>
    </div>
  );
}
