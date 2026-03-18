import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resolveBloomDelivery, DELIVERY_STATUS } from '../lib/deliveryResolver';
import LivePreview from '../components/LivePreview';
import '../styles/bloomDelivery.css';

/**
 * BloomDelivery — Premium bloom delivery experience page
 * 
 * Route: /bloom/:id
 * 
 * Renders the final bloom composition with:
 * 1. Cinematic hero with LivePreview composition
 * 2. Delayed message reveal (fade-in, serif, elegant)
 * 3. Watermark / branding layer
 * 4. Minimal controls (replay, share)
 * 5. Graceful fallback states
 */

export default function BloomDelivery() {
  const { id: bloomSlug } = useParams();
  const [state, setState] = useState({
    status: DELIVERY_STATUS.LOADING,
    delivery: null,
    composition: null,
    error: null,
  });
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);

  // Fetch delivery data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await resolveBloomDelivery(bloomSlug);
      if (!cancelled) setState(result);
    }
    load();
    return () => { cancelled = true; };
  }, [bloomSlug]);

  // Delayed message reveal — bloom loads first, then message fades in
  useEffect(() => {
    if (state.status === DELIVERY_STATUS.READY && state.delivery?.message?.short) {
      const timer = setTimeout(() => setMessageRevealed(true), 2200);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.delivery]);

  // Replay handler
  const handleReplay = useCallback(() => {
    setMessageRevealed(false);
    // Re-trigger message reveal
    setTimeout(() => setMessageRevealed(true), 2200);
    // Restart video if present
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Copy share link
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Digital Bloom™', text: 'Someone sent you a bloom ✨', url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  // ── LOADING STATE ──
  if (state.status === DELIVERY_STATUS.LOADING) {
    return (
      <div className="bloom-delivery bloom-delivery--loading">
        <div className="bloom-delivery__loader">
          <div className="bloom-delivery__spinner" />
          <p className="bloom-delivery__loader-text">Preparing your bloom...</p>
        </div>
        <BrandFooter />
      </div>
    );
  }

  // ── PROCESSING STATE ──
  if (state.status === DELIVERY_STATUS.PROCESSING) {
    return (
      <div className="bloom-delivery bloom-delivery--processing">
        <div className="bloom-delivery__status-card">
          <div className="bloom-delivery__status-icon">✨</div>
          <h1 className="bloom-delivery__status-title">We're Preparing Your Bloom</h1>
          <p className="bloom-delivery__status-message">
            Your custom bloom experience is being crafted with care.
            <br />Check back shortly.
          </p>
          {state.delivery?.productName && (
            <p className="bloom-delivery__status-product">{state.delivery.productName}</p>
          )}
        </div>
        <BrandFooter />
      </div>
    );
  }

  // ── NOT FOUND STATE ──
  if (state.status === DELIVERY_STATUS.NOT_FOUND) {
    return (
      <div className="bloom-delivery bloom-delivery--not-found">
        <div className="bloom-delivery__status-card">
          <h1 className="bloom-delivery__status-title">Bloom Not Found</h1>
          <p className="bloom-delivery__status-message">
            {state.error || 'This bloom could not be found.'}
          </p>
          <Link to="/" className="bloom-delivery__home-btn">Return Home</Link>
        </div>
        <BrandFooter />
      </div>
    );
  }

  // ── ERROR STATE ──
  if (state.status === DELIVERY_STATUS.ERROR) {
    return (
      <div className="bloom-delivery bloom-delivery--error">
        <div className="bloom-delivery__status-card">
          <h1 className="bloom-delivery__status-title">Something Went Wrong</h1>
          <p className="bloom-delivery__status-message">{state.error}</p>
          <button type="button" className="bloom-delivery__home-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <Link to="/" className="bloom-delivery__home-link">Return Home</Link>
        </div>
        <BrandFooter />
      </div>
    );
  }

  // ── READY STATE — Full bloom experience ──
  const { delivery, composition } = state;
  const message = delivery?.message || {};
  const hasMessage = Boolean(message.short);

  return (
    <div className="bloom-delivery">
      {/* ── Cinematic Bloom Hero ── */}
      <div className="bloom-delivery__hero">
        <div className="bloom-delivery__composition">
          <LivePreview
            product={{
              id: delivery.productId,
              video_file_url: composition?.baseMedia?.src,
              image_url: composition?.baseMedia?.poster,
            }}
            colorTheme={delivery.colorTheme}
            extras={delivery.extras}
            message={delivery.message}
            className="bloom-delivery__preview"
          />

          {/* ── Watermark / Brand Protection ── */}
          <div className="bloom-watermark">
            <span className="bloom-watermark__text">Digital Bloom™</span>
          </div>
        </div>

        {/* ── Message Reveal ── */}
        {hasMessage && (
          <div className={`bloom-delivery__message ${messageRevealed ? 'bloom-delivery__message--visible' : ''}`}>
            <p className="bloom-delivery__message-text">"{message.short}"</p>
            {(message.toName || message.fromName) && (
              <div className="bloom-delivery__message-names">
                {message.toName && <span className="bloom-delivery__message-to">To {message.toName}</span>}
                {message.toName && message.fromName && <span className="bloom-delivery__message-divider">·</span>}
                {message.fromName && <span className="bloom-delivery__message-from">From {message.fromName}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Minimal Controls ── */}
      <div className="bloom-delivery__controls">
        <button type="button" className="bloom-delivery__control-btn" onClick={handleReplay} aria-label="Replay">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Replay</span>
        </button>

        <button type="button" className="bloom-delivery__control-btn" onClick={handleShare} aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* ── Brand Footer ── */}
      <BrandFooter />
    </div>
  );
}

/**
 * Brand Footer — consistent Digital Bloom branding
 */
function BrandFooter() {
  return (
    <div className="bloom-delivery__brand">
      <p className="bloom-delivery__brand-name">Digital Bloom™</p>
      <p className="bloom-delivery__brand-tagline">Give Them Their Flowers While They're Here</p>
    </div>
  );
}
