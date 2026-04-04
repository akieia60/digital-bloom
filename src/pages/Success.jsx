import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/success.css';

const POLL_LIMIT = 20;
const POLL_INTERVAL_MS = 3000;

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('Session token unavailable.');
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

          throw new Error('We could not find your order yet. Please refresh in a moment.');
        }

        if (!response.ok) {
          throw new Error('Failed to load your checkout status.');
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
        setError(err.message || 'Failed to process your purchase. Please contact support.');
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
  }, [sessionId]);

  const purchases = useMemo(() => checkout?.purchases || [], [checkout]);
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

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}/shop`;
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

  const shareUrl = `${window.location.origin}/shop`;
  const shareText = encodeURIComponent('I just sent a luxury digital bloom ✨ Check it out! #DigitalBloom');

  if (isProcessing) {
    return (
      <div className="success-page">
        <div className="success-loading">
          <div className="success-spinner" />
          <p className="success-loading-text">Preparing Your Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-error-card">
          <h2 className="success-error-title">Something Went Wrong</h2>
          <p className="success-error-msg">{error}</p>
          <Link to="/" className="success-btn-outline">Return Home</Link>
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
          <h1 className="success-title">Your Bloom Is On Its Way!</h1>
          <p className="success-subtitle">
            Your checkout is confirmed and we&apos;re preparing each experience for delivery.
          </p>
        </div>

        <div className="success-card">
          <h3 className="success-card-label">Order Summary</h3>
          <div className="success-row">
            <span className="success-row-label">Session</span>
            <span className="success-row-value success-row-mono">{displayId}</span>
          </div>
          <div className="success-row">
            <span className="success-row-label">Items</span>
            <span className="success-row-value">{purchases.length}</span>
          </div>
          <div className="success-row">
            <span className="success-row-label">Total</span>
            <span className="success-row-value success-row-gold">${totalAmount}</span>
          </div>
          <div className="success-row success-row-last">
            <span className="success-row-label">Status</span>
            <span className="success-badge">
              {checkout?.checkout_status === 'completed' ? 'Confirmed ✓' : 'Processing…'}
            </span>
          </div>
        </div>

        <div className="success-card">
          <h3 className="success-card-label">Your Experiences</h3>
          {purchases.map((purchase) => {
            const isReady = purchase.download_url && purchase.download_expires_at && new Date(purchase.download_expires_at) > new Date();
            return (
              <div key={purchase.id} className="success-row success-row-last" style={{ display: 'block', marginBottom: '16px' }}>
                <div className="success-row" style={{ paddingTop: 0 }}>
                  <span className="success-row-label">{purchase.products?.name || 'Digital Bloom'}</span>
                  <span className="success-row-value">{purchase.status}</span>
                </div>
                {isReady ? (
                  <a href={purchase.download_url} download className="success-btn-gold" style={{ marginTop: '12px' }}>
                    Download Experience
                  </a>
                ) : (
                  <p className="success-card-text" style={{ marginTop: '12px' }}>
                    {purchase.has_customization
                      ? 'Personalized delivery is being prepared.'
                      : 'Your digital file is still being finalized.'}
                  </p>
                )}
                {purchase.bloom_slug && (
                  <p className="success-note" style={{ marginTop: '10px' }}>
                    View link: <Link to={`/bloom/${purchase.bloom_slug}`}>Open your bloom</Link>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {bloomPurchases.length > 0 && (
          <div className="success-card">
            <h3 className="success-card-label">Bloom Links</h3>
            {bloomPurchases.map((purchase) => (
              <div key={purchase.id} className="success-row">
                <span className="success-row-label">{purchase.products?.name || 'Bloom'}</span>
                <Link to={`/bloom/${purchase.bloom_slug}`} className="success-row-value success-row-gold">
                  View Bloom
                </Link>
              </div>
            ))}
          </div>
        )}

        {readyDownloads.length === 0 && (
          <div className="success-card">
            <h3 className="success-card-label">Processing Status</h3>
            <ul className="success-status-list">
              <li>✓ Checkout confirmed</li>
              <li>{checkout?.checkout_status === 'completed' ? '✓ Order records finalized' : '⏳ Finalizing your order records'}</li>
              <li>{purchases.some((purchase) => purchase.has_customization) ? '🎬 Personalized delivery files are rendering' : '📦 Standard digital files are being prepared'}</li>
            </ul>
          </div>
        )}

        <div className="success-card">
          <h3 className="success-card-label">Share Digital Bloom</h3>
          <div className="success-share-row">
            <button type="button" onClick={copyLink} className="success-share-btn">
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
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
          <Link to="/" className="success-btn-primary">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
