import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/success.css';

const POLL_LIMIT = 20;
const POLL_INTERVAL_MS = 3000;

const PURCHASE_STATUS_LABELS = {
  pending: 'success_purchase_status_pending',
  processing: 'success_purchase_status_processing',
  completed: 'success_purchase_status_completed',
  delivered: 'success_purchase_status_completed',
  paid: 'success_purchase_status_paid',
  failed: 'success_purchase_status_failed',
};

const Success = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError(t('success_missing_session'));
      setIsProcessing(false);
      return;
    }

    let cancelled = false;
    let pollCount = 0;
    let timeoutId = null;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${encodeURIComponent(sessionId)}`);

        if (response.status === 404) {
          if (pollCount < POLL_LIMIT) {
            pollCount += 1;
            timeoutId = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
            return;
          }

          throw new Error(t('success_not_found'));
        }

        if (!response.ok) {
          throw new Error(t('success_load_error'));
        }

        const data = await response.json();
        if (cancelled) return;

        setCheckout(data);
        setError(null);
        setIsProcessing(false);
        localStorage.removeItem('flowerShopCart');

        if (data.checkout_status !== 'completed' && pollCount < POLL_LIMIT) {
          pollCount += 1;
          timeoutId = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || t('success_load_error'));
        setIsProcessing(false);
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [sessionId, t, refreshNonce]);

  const purchases = useMemo(() => checkout?.purchases || [], [checkout]);
  const creditPurchase = checkout?.kind === 'credit' ? checkout?.credit : null;
  const isCreditPurchase = Boolean(creditPurchase);
  const totalAmount = Number(checkout?.totals?.amount || 0).toFixed(2);
  const displayId = (sessionId || 'N/A').substring(0, 18).toUpperCase();
  const bloomPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.bloom_slug),
    [purchases]
  );
  const readyDownloads = useMemo(
    () => purchases.filter((purchase) => purchase.download_url && purchase.download_expires_at && new Date(purchase.download_expires_at) > new Date()),
    [purchases]
  );
  const primaryGiftPath = bloomPurchases[0]?.bloom_slug ? `/gift/${bloomPurchases[0].bloom_slug}` : '/shop';
  const processingPurchases = useMemo(
    () => purchases.filter((purchase) => ['pending', 'processing', 'paid'].includes(String(purchase.status || '').toLowerCase())),
    [purchases]
  );
  const hasPendingWork = readyDownloads.length === 0 && (processingPurchases.length > 0 || checkout?.checkout_status !== 'completed');

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}${primaryGiftPath}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = `${window.location.origin}${primaryGiftPath}`;
  const shareText = encodeURIComponent('A Digital Bloom gift is waiting for you ✨');
  const getPurchaseStatusLabel = (status) => {
    const normalized = String(status || '').toLowerCase();
    const labelKey = PURCHASE_STATUS_LABELS[normalized];
    return labelKey ? t(labelKey) : status;
  };

  if (isProcessing) {
    return (
      <div className="success-page">
        <div className="success-loading">
          <div className="success-spinner" />
          <p className="success-loading-text">{t('success_processing')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-error-card">
          <h2 className="success-error-title">{t('success_error_title')}</h2>
          <p className="success-error-msg">{error}</p>
          <Link to="/" className="success-btn-outline">{t('success_return_home')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-check">
            <svg width="32" height="32" fill="none" stroke="#C9A14A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="success-title">{isCreditPurchase ? t('success_credit_title') : t('success_title')}</h1>
          <p className="success-subtitle">
            {isCreditPurchase ? t('success_credit_subtitle') : t('success_subtitle')}
          </p>
        </div>

        <div className="success-card">
          <h3 className="success-card-label">{t('success_order_summary')}</h3>
          <div className="success-row">
            <span className="success-row-label">{t('success_session')}</span>
            <span className="success-row-value success-row-mono">{displayId}</span>
          </div>
          <div className="success-row">
            <span className="success-row-label">{t('success_items')}</span>
            <span className="success-row-value">{isCreditPurchase ? 1 : purchases.length}</span>
          </div>
          <div className="success-row">
            <span className="success-row-label">{t('success_total')}</span>
            <span className="success-row-value success-row-gold">${totalAmount}</span>
          </div>
          <div className="success-row success-row-last">
            <span className="success-row-label">{t('success_status')}</span>
            <span className="success-badge">
              {checkout?.checkout_status === 'completed' ? t('success_status_confirmed') : t('success_status_processing')}
            </span>
          </div>
        </div>

        {isCreditPurchase && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_credit_label')}</h3>
            <div className="success-row">
              <span className="success-row-label">{t('success_credit_code')}</span>
              <span className="success-row-value success-row-mono">{creditPurchase.code}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">{t('success_credit_balance')}</span>
              <span className="success-row-value success-row-gold">
                ${(Number(creditPurchase.remaining_amount_cents || 0) / 100).toFixed(2)}
              </span>
            </div>
            <div className="success-row success-row-last">
              <span className="success-row-label">{t('success_credit_ready')}</span>
              <Link to={`/credits/balance?code=${encodeURIComponent(creditPurchase.code)}`} className="success-row-value success-row-gold">
                {t('success_credit_check_balance')}
              </Link>
            </div>
            <p className="success-card-text" style={{ marginTop: '12px' }}>
              {t('success_credit_note')}
            </p>
          </div>
        )}

        {hasPendingWork && (
          <div className="success-card success-card--highlight">
            <div className="success-processing-head">
              <div>
                <h3 className="success-card-label">{t('success_processing_title')}</h3>
                <p className="success-card-text success-card-text--tight">{t('success_processing_note')}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProcessing(true);
                  setRefreshNonce((current) => current + 1);
                }}
                className="success-btn-outline success-btn-outline--small"
              >
                {t('success_processing_refresh')}
              </button>
            </div>

            <ul className="success-status-list">
              <li>{t('success_step_checkout')}</li>
              <li>{checkout?.checkout_status === 'completed' ? t('success_step_records_done') : t('success_step_records_pending')}</li>
              <li>{purchases.some((purchase) => purchase.has_customization) ? t('success_step_rendering') : t('success_step_files')}</li>
            </ul>
          </div>
        )}

        {!isCreditPurchase && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_experiences')}</h3>
            {purchases.map((purchase) => {
              const isReady = purchase.download_url && purchase.download_expires_at && new Date(purchase.download_expires_at) > new Date();
              return (
                <div key={purchase.id} className="success-row success-row-last" style={{ display: 'block', marginBottom: '16px' }}>
                  <div className="success-row" style={{ paddingTop: 0 }}>
                    <span className="success-row-label">{purchase.products?.name || t('success_default_product')}</span>
                    <span className="success-row-value">{getPurchaseStatusLabel(purchase.status)}</span>
                  </div>
                  {isReady ? (
                    <a href={purchase.download_url} download className="success-btn-gold" style={{ marginTop: '12px' }}>
                      {t('success_download')}
                    </a>
                  ) : (
                    <p className="success-card-text" style={{ marginTop: '12px' }}>
                      {purchase.has_customization
                        ? t('success_personalized_pending')
                        : t('success_standard_pending')}
                    </p>
                  )}
                  {purchase.bloom_slug && (
                    <p className="success-note" style={{ marginTop: '10px' }}>
                      {t('success_view_link')} <Link to={`/gift/${purchase.bloom_slug}`}>{t('success_open_bloom')}</Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isCreditPurchase && bloomPurchases.length > 0 && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_bloom_links')}</h3>
            {bloomPurchases.map((purchase) => (
              <div key={purchase.id} className="success-row">
                <span className="success-row-label">{purchase.products?.name || t('success_bloom')}</span>
                <Link to={`/gift/${purchase.bloom_slug}`} className="success-row-value success-row-gold">
                  {t('success_view_bloom')}
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="success-card">
          <h3 className="success-card-label">{t('success_share_title')}</h3>
          <div className="success-share-row">
            <button type="button" onClick={copyLink} className="success-share-btn">
              {copied ? t('success_copied') : t('success_copy_link')}
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              X
            </button>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/" className="success-btn-primary">{t('success_return_homepage')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
