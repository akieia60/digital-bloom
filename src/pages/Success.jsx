import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus } from '../lib/supabase';
import '../styles/success.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPurchase = async () => {
      if (!sessionId) {
        setError('Session token unavailable.');
        setIsProcessing(false);
        return;
      }

      try {
        const updatedPurchase = await updatePurchaseStatus(sessionId, 'completed', {
          stripe_session_id: sessionId
        });
        if (updatedPurchase) setPurchase(updatedPurchase);
      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to process your purchase.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [sessionId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isProcessing) {
    return (
      <div className="success-page">
        <div className="success-loading">
          <div className="success-spinner" />
          <p className="success-loading-text">Publishing Your Experience...</p>
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

        {/* ── SUCCESS HEADER ── */}
        <div className="success-header">
          <div className="success-check">
            <svg width="32" height="32" fill="none" stroke="#C9A14A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="success-title">Your Bloom Is On Its Way!</h1>
          <p className="success-subtitle">
            Your experience has been published and is being prepared for delivery.
          </p>
        </div>

        {/* ── ORDER SUMMARY ── */}
        {purchase && (
          <div className="success-card">
            <h3 className="success-card-label">Order Summary</h3>
            <div className="success-row">
              <span className="success-row-label">Order ID</span>
              <span className="success-row-value success-row-mono">{purchase.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">Total</span>
              <span className="success-row-value success-row-gold">${purchase.total_price.toFixed(2)}</span>
            </div>
            <div className="success-row success-row-last">
              <span className="success-row-label">Status</span>
              <span className="success-badge">Confirmed ✓</span>
            </div>
          </div>
        )}

        {/* ── YOUR EXPERIENCE ── */}
        <div className="success-card">
          <h3 className="success-card-label">Your Experience</h3>
          {purchase?.download_url ? (
            new Date(purchase.download_expires_at) > new Date() ? (
              <div>
                <p className="success-card-text">Your customized bloom is ready! Download it now or share directly.</p>
                <a href={purchase.download_url} download className="success-btn-gold">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Experience
                </a>
                <p className="success-note">Your download link is valid for 48 hours.</p>
              </div>
            ) : (
              <p className="success-expired">Your download link has expired (48h). Please contact support.</p>
            )
          ) : (
            <div>
              <p className="success-card-text">We're preparing your experience now.</p>
              <ul className="success-status-list">
                <li>✓ Confirmation sent to your email</li>
                <li>⏳ Experience publishing (est. 2–4 hours)</li>
                <li>📧 You'll be notified when it's ready</li>
              </ul>
            </div>
          )}
        </div>

        {/* ── SHARE ── */}
        <div className="success-card">
          <h3 className="success-card-label">Share Your Bloom</h3>
          <div className="success-share-row">
            <button onClick={copyLink} className="success-share-btn">
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              Facebook
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just sent a luxury digital bloom ✨ #DigitalBloom')}&url=${encodeURIComponent(window.location.origin)}`, '_blank', 'width=600,height=400')}
              className="success-share-btn"
            >
              X
            </button>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="success-actions">
          <Link to="/" className="success-btn-primary">Return to Homepage</Link>
        </div>

        {/* ── BRAND FOOTER ── */}
        <div className="success-brand">
          <p className="success-brand-name">Digital Bloom™</p>
          <p className="success-brand-sub">Digital Gifting Experience</p>
        </div>
      </div>
    </div>
  );
};

export default Success;
