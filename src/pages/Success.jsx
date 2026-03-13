import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus } from '../lib/supabase';

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
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Publishing Your Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Something Went Wrong</h2>
          <p style={styles.errorMessage}>{error}</p>
          <Link to="/" style={styles.returnBtn}>Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Success Header */}
        <div style={styles.header}>
          <div style={styles.checkCircle}>
            <svg width="32" height="32" fill="none" stroke="#D4AF37" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={styles.title}>Your Bloom Is On Its Way!</h1>
          <p style={styles.subtitle}>
            Your experience has been published and is being prepared for delivery.
          </p>
        </div>

        {/* Order Summary */}
        {purchase && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Summary</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Order ID</span>
              <span style={styles.detailValue}>{purchase.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total</span>
              <span style={styles.detailValueGold}>${purchase.total_price.toFixed(2)}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status</span>
              <span style={styles.statusBadge}>Confirmed ✓</span>
            </div>
          </div>
        )}

        {/* Download / Delivery */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Experience</h3>
          {purchase?.download_url ? (
            new Date(purchase.download_expires_at) > new Date() ? (
              <div>
                <p style={styles.cardText}>Your customized bloom is ready! Download it now or share directly.</p>
                <a
                  href={purchase.download_url}
                  download
                  style={styles.downloadBtn}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Experience
                </a>
                <p style={styles.securityNote}>
                  Your download link is valid for 48 hours.
                </p>
              </div>
            ) : (
              <p style={styles.expiredNote}>Your download link has expired (48h). Please contact support.</p>
            )
          ) : (
            <div>
              <p style={styles.cardText}>We're preparing your experience now.</p>
              <ul style={styles.statusList}>
                <li style={styles.statusItem}>✓ Confirmation sent to your email</li>
                <li style={styles.statusItem}>⏳ Experience publishing (est. 2–4 hours)</li>
                <li style={styles.statusItem}>📧 You'll be notified when it's ready</li>
              </ul>
            </div>
          )}
        </div>

        {/* Share */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Share Your Bloom</h3>
          <div style={styles.shareRow}>
            <button onClick={copyLink} style={styles.shareBtn}>
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank', 'width=600,height=400')}
              style={styles.shareBtn}
            >
              Facebook
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just sent a luxury digital bloom ✨ #DigitalBloom')}&url=${encodeURIComponent(window.location.origin)}`, '_blank', 'width=600,height=400')}
              style={styles.shareBtn}
            >
              X
            </button>
            <button onClick={copyLink} style={styles.shareBtn} title="Copy link for Instagram">
              Instagram
            </button>
            <button onClick={copyLink} style={styles.shareBtn} title="Copy link for TikTok">
              TikTok
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/" style={styles.returnHomeBtn}>Return to Homepage</Link>
          <button onClick={() => window.print()} style={styles.printBtn}>
            Save Receipt
          </button>
        </div>

        {/* Brand Footer */}
        <div style={styles.brandFooter}>
          <p style={styles.brandName}>Digital Bloom™</p>
          <p style={styles.brandSub}>Digital Gifting Experience</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Inline Styles ─── */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  container: {
    maxWidth: '560px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  // Loading
  loadingContainer: {
    textAlign: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '2px solid rgba(212, 175, 55, 0.2)',
    borderTop: '2px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px',
  },
  loadingText: {
    fontSize: '13px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  // Error
  errorCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '16px',
    padding: '40px 32px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorTitle: {
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '12px',
  },
  errorMessage: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginBottom: '24px',
  },
  // Header
  header: {
    textAlign: 'center',
    padding: '20px 0',
  },
  checkCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: '500',
    lineHeight: '1.3',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto',
  },
  // Cards
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(212, 175, 55, 0.8)',
    marginBottom: '20px',
  },
  cardText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  detailLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
  },
  detailValue: {
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  detailValueGold: {
    fontSize: '20px',
    fontWeight: '400',
    color: '#D4AF37',
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#D4AF37',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '20px',
    padding: '4px 12px',
  },
  // Download
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    background: '#D4AF37',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  securityNote: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: '12px',
    fontStyle: 'italic',
  },
  expiredNote: {
    fontSize: '14px',
    color: '#ef4444',
    textAlign: 'center',
  },
  // Status list
  statusList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  statusItem: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.5',
  },
  // Share
  shareRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  shareBtn: {
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  // Actions
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  returnHomeBtn: {
    display: 'block',
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  returnBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '13px',
    textDecoration: 'none',
  },
  printBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '8px',
  },
  // Brand
  brandFooter: {
    textAlign: 'center',
    padding: '24px 0',
  },
  brandName: {
    fontSize: '11px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.2)',
    marginBottom: '4px',
  },
  brandSub: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.1)',
  },
};

export default Success;
