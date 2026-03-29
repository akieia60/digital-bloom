import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCreditBalance } from '../lib/creditStripe';
import { isValidCreditCodeFormat, formatCreditAmount } from '../utils/creditCode';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/credits.css';

export default function CreditBalance() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '500' }}>{t('balance_back')}</span>
          </button>
          <h1 className="section-title">{t('balance_title')}</h1>
          <p className="section-subtitle">
            {t('balance_subtitle')}
          </p>
        </div>

        {/* Balance Lookup Form */}
        <div className="balance-lookup">
          <div className="balance-form">
            <label className="customizer-label">{t('balance_label')}</label>
            <div className="balance-input-group">
              <input
                type="text"
                className="customizer-input"
                placeholder={t('balance_placeholder')}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength="17"
              />
              <button
                className="cta-primary"
                onClick={handleCheckBalance}
                disabled={loading || !code}
              >
                {loading ? t('balance_checking') : t('balance_check')}
              </button>
            </div>
            {error && <p className="balance-error">{error}</p>}
          </div>

          {/* Balance Display */}
          {balance && (
            <div className="balance-result">
              <div className="balance-card">
                <h2>{t('balance_remaining')}</h2>
                <div className="balance-amount">
                  {formatCreditAmount(balance.remaining_amount_cents)}
                </div>
                <div className="balance-details">
                  <div className="balance-detail">
                    <span className="detail-label">{t('balance_original')}</span>
                    <span className="detail-value">
                      {formatCreditAmount(balance.initial_amount_cents)}
                    </span>
                  </div>
                  <div className="balance-detail">
                    <span className="detail-label">{t('balance_status')}</span>
                    <span className={`detail-value status-${balance.status}`}>
                      {balance.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="balance-detail">
                    <span className="detail-label">{t('balance_created')}</span>
                    <span className="detail-value">
                      {new Date(balance.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage History */}
              {history.length > 0 && (
                <div className="balance-history">
                  <h3>{t('balance_history')}</h3>
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
          <h3>{t('balance_help_title')}</h3>
          <p>
            {t('balance_help_text')}
          </p>
        </div>
      </div>
    </div>
  );
}
