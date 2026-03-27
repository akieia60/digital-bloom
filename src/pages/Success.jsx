import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus, saveBloomDelivery, supabase } from '../lib/supabase';
import { generateBloomSlug } from '../lib/deliveryResolver';
import '../styles/success.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bloomSlug, setBloomSlug] = useState(null);
  const [renderStatus, setRenderStatus] = useState('idle');

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
        if (updatedPurchase) {
          setPurchase(updatedPurchase);

          // Generate bloom delivery slug and save composition data
          const slug = updatedPurchase.bloom_slug || generateBloomSlug();
          let compositionManifest = updatedPurchase.composition_manifest || null;

          // Try to recover composition data from localStorage cart
          if (!compositionManifest) {
            try {
              const savedCart = localStorage.getItem('digitalbloom_cart');
              if (savedCart) {
                const cartItems = JSON.parse(savedCart);
                // Find cart item matching this purchase's product
                const matchingItem = cartItems.find(item =>
                  item.id === updatedPurchase.product_id || item.product_id === updatedPurchase.product_id
                );
                if (matchingItem?.customization) {
                  compositionManifest = {
                    customization: matchingItem.customization,
                    composition: matchingItem.composition || null,
                  };
                }
              }
            } catch (e) {
              console.warn('Could not recover composition from cart:', e);
            }
          }

          // Save bloom delivery to purchase record
          if (!updatedPurchase.bloom_slug) {
            await saveBloomDelivery(updatedPurchase.id, slug, compositionManifest);
          }
          setBloomSlug(slug);

          if (compositionManifest?.customization) {
            try {
              setRenderStatus('processing');
              const { data: authData } = await supabase.auth.getSession();
              const token = authData?.session?.access_token;
              const response = await fetch('/api/render-bloom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ purchaseId: updatedPurchase.id }),
              });

              if (!response.ok) {
                throw new Error('render_failed');
              }

              setRenderStatus('ready');
            } catch (renderError) {
              console.error('Bloom render trigger failed:', renderError);
              setRenderStatus('failed');
            }
          }
        }
      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to process your purchase. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [sessionId]);

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}/shop`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / insecure contexts
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

  const displayPrice = Number(purchase?.total_price || 0).toFixed(2);
  const displayId = (purchase?.id || 'N/A').substring(0, 8).toUpperCase();

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
            Your experience has been created and is being prepared for delivery.
          </p>
        </div>

        {/* ── ORDER SUMMARY ── */}
        {purchase && (
          <div className="success-card">
            <h3 className="success-card-label">Order Summary</h3>
            <div className="success-row">
              <span className="success-row-label">Order ID</span>
              <span className="success-row-value success-row-mono">{displayId}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">Total</span>
              <span className="success-row-value success-row-gold">${displayPrice}</span>
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
                <li>{renderStatus === 'processing' ? '🎬 Personalizing your protected delivery file now' : '⏳ Experience processing (est. 2–4 hours)'}</li>
                <li>{renderStatus === 'ready' ? '✅ Personalized delivery file generated' : renderStatus === 'failed' ? '⚠️ Personalized file render needs retry' : '📧 You\'ll be notified when it\'s ready'}</li>
              </ul>
            </div>
          )}
        </div>

        {/* ── VIEW YOUR BLOOM ── */}
        {bloomSlug && (
          <div className="success-card">
            <h3 className="success-card-label">Your Bloom</h3>
            <p className="success-card-text">
              Your personalized bloom experience is ready to view and share.
            </p>
            <Link to={`/bloom/${bloomSlug}`} className="success-btn-gold">
              ✨ View Your Bloom
            </Link>
            <p className="success-note">
              Share this link with your recipient so they can experience their bloom.
            </p>
          </div>
        )}

        {/* ── SHARE ── */}
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
