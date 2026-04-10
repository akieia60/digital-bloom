import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const [state, setState] = useState({
    status: DELIVERY_STATUS.LOADING,
    delivery: null,
    composition: null,
    error: null,
  });
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [previewReplayKey, setPreviewReplayKey] = useState(0);
  const [processingTick, setProcessingTick] = useState(0);
  const revealTimerRef = useRef(null);

  // Fetch delivery data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await resolveBloomDelivery(bloomSlug);
      if (!cancelled) setState(result);
    }
    load();
    return () => { cancelled = true; };
  }, [bloomSlug, processingTick]);

  // Delayed message reveal — bloom loads first, then message fades in
  useEffect(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (state.status === DELIVERY_STATUS.READY && state.delivery?.message?.short) {
      revealTimerRef.current = setTimeout(() => setMessageRevealed(true), 2200);
    }

    return () => {
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [state.status, state.delivery, previewReplayKey]);

  // Processing bloom pages quietly re-check in the background.
  useEffect(() => {
    if (state.status !== DELIVERY_STATUS.PROCESSING) return undefined;

    const timer = window.setTimeout(() => {
      setProcessingTick((current) => current + 1);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [state.status]);

  // Replay handler
  const handleReplay = useCallback(() => {
    setMessageRevealed(false);
    setPreviewReplayKey((current) => current + 1);
  }, []);

  // ── LOADING STATE ──
  if (state.status === DELIVERY_STATUS.LOADING) {
    return (
      <div className="bloom-delivery bloom-delivery--loading">
        <div className="bloom-delivery__loader">
          <div className="bloom-delivery__spinner" />
          <p className="bloom-delivery__loader-text">{t('delivery_loading')}</p>
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
          <h1 className="bloom-delivery__status-title">{t('delivery_processing_title')}</h1>
          <p className="bloom-delivery__status-message">
            {t('delivery_processing_message')}
          </p>
          {state.delivery?.productName && (
            <p className="bloom-delivery__status-product">{state.delivery.productName}</p>
          )}
          <button
            type="button"
            className="bloom-delivery__home-btn"
            onClick={() => setProcessingTick((current) => current + 1)}
          >
            {t('delivery_refresh_status')}
          </button>
        </div>
        <BrandFooter />
      </div>
    );
  }

  if (state.status === DELIVERY_STATUS.EXPIRED) {
    return (
      <div className="bloom-delivery bloom-delivery--not-found">
        <div className="bloom-delivery__status-card">
          <h1 className="bloom-delivery__status-title">{t('delivery_expired_title')}</h1>
          <p className="bloom-delivery__status-message">
            {state.error || t('delivery_expired_message')}
          </p>
          <Link to="/" className="bloom-delivery__home-btn">{t('delivery_return_home')}</Link>
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
          <h1 className="bloom-delivery__status-title">{t('delivery_not_found_title')}</h1>
          <p className="bloom-delivery__status-message">
            {state.error || t('delivery_not_found_message')}
          </p>
          <Link to="/" className="bloom-delivery__home-btn">{t('delivery_return_home')}</Link>
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
          <h1 className="bloom-delivery__status-title">{t('delivery_error_title')}</h1>
          <p className="bloom-delivery__status-message">{state.error}</p>
          <button type="button" className="bloom-delivery__home-btn" onClick={() => window.location.reload()}>
            {t('delivery_try_again')}
          </button>
          <Link to="/" className="bloom-delivery__home-link">{t('delivery_return_home')}</Link>
        </div>
        <BrandFooter />
      </div>
    );
  }

  // ── READY STATE — Full bloom experience ──
  const { delivery, composition } = state;
  const message = delivery?.message || {};
  const hasMessage = Boolean(message.short);
  const protectedVideoUrl = delivery?.downloadUrl && delivery?.downloadExpiresAt
    ? (new Date(delivery.downloadExpiresAt).getTime() > Date.now() ? delivery.downloadUrl : null)
    : null;

  return (
    <div className="bloom-delivery">
      {/* ── Cinematic Bloom Hero ── */}
      <div className="bloom-delivery__hero">
        <div className="bloom-delivery__composition">
          {protectedVideoUrl ? (
            <div className="db-watermark db-watermark--hero bloom-delivery__protected-frame">
              <video
                key={previewReplayKey}
                className="bloom-delivery__rendered-video"
                src={protectedVideoUrl}
                poster={composition?.baseMedia?.poster}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                preload="auto"
              />
              <div className="db-watermark-overlay" aria-hidden="true">
                <div className="db-watermark-grid">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="db-watermark-row">
                      <span>© Digital Bloom</span>
                      <span>© Digital Bloom</span>
                      <span>© Digital Bloom</span>
                      <span>© Digital Bloom</span>
                    </div>
                  ))}
                </div>
                <div className="db-watermark-corner">© Digital Bloom</div>
              </div>
            </div>
          ) : (
            <LivePreview
              key={previewReplayKey}
              product={{
                id: delivery.productId,
                video_file_url: composition?.baseMedia?.src,
                image_url: composition?.baseMedia?.poster,
              }}
              colorTheme={delivery.colorTheme}
              primaryColor={delivery.primaryColor}
              accentColor={delivery.accentColor}
              extras={delivery.extras}
              message={delivery.message}
              engravingStyle={delivery.engravingStyle}
              fontChoice={delivery.fontChoice}
              className="bloom-delivery__preview"
            />
          )}
        </div>

        {/* ── Message Reveal ── */}
        {hasMessage && (
          <div className={`bloom-delivery__message ${messageRevealed ? 'bloom-delivery__message--visible' : ''}`}>
            <p className="bloom-delivery__message-text">"{message.short}"</p>
            {(message.toName || message.fromName) && (
              <div className="bloom-delivery__message-names">
                {message.toName && <span className="bloom-delivery__message-to">{t('customize_to')} {message.toName}</span>}
                {message.toName && message.fromName && <span className="bloom-delivery__message-divider">·</span>}
                {message.fromName && <span className="bloom-delivery__message-from">{t('customize_from')} {message.fromName}</span>}
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
          <span>{t('delivery_replay')}</span>
        </button>
      </div>

      <p className="bloom-delivery__protection-note">{t('delivery_protection_note')}</p>

      {/* ── Brand Footer ── */}
      <BrandFooter />
    </div>
  );
}

/**
 * Brand Footer — consistent Digital Bloom branding
 */
function BrandFooter() {
  const { t } = useLanguage();

  return (
    <div className="bloom-delivery__brand">
      <p className="bloom-delivery__brand-name">Digital Bloom™</p>
      <p className="bloom-delivery__brand-tagline">{t('delivery_brand_tagline')}</p>
    </div>
  );
}
