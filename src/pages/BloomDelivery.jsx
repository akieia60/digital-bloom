import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveBloomDelivery, DELIVERY_STATUS } from '../lib/deliveryResolver';
import LivePreview from '../components/LivePreview';
import { useBloomCapture } from '../hooks/useBloomCapture';
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
  const compositionRef = useRef(null);

  // Must be at top level — cannot be called conditionally (Rules of Hooks)
  const { share, download, cancelDownload, capturing, progress, copied, canDownload } =
    useBloomCapture({ delivery: state.delivery, compositionRef });

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

  if (state.status === DELIVERY_STATUS.SCHEDULED) {
    const scheduledDate = state.delivery?.delivery?.display_date || 'a future date';
    const scheduledRecipient = state.delivery?.delivery?.recipient_email || 'the selected recipient';

    return (
      <div className="bloom-delivery bloom-delivery--processing">
        <div className="bloom-delivery__status-card">
          <div className="bloom-delivery__status-icon">📬</div>
          <h1 className="bloom-delivery__status-title">This bloom is scheduled</h1>
          <p className="bloom-delivery__status-message">
            This protected bloom is queued to email on {scheduledDate} to {scheduledRecipient}.
          </p>
          <Link to="/" className="bloom-delivery__home-btn">{t('delivery_return_home')}</Link>
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
        <div className="bloom-delivery__composition" ref={compositionRef}>
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
              messageTextColor={delivery.messageTextColor}
              messageBold={delivery.messageBold}
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

      {/* ── Action Buttons ── */}
      <div className="bloom-delivery__actions">

        {/* Share */}
        <button type="button" className="bloom-delivery__share-btn" onClick={share}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>{copied ? t('delivery_link_copied') : t('delivery_share')}</span>
        </button>

        {/* Download — hidden on Safari/iOS where MediaRecorder isn't supported */}
        {canDownload && !capturing && (
          <button type="button" className="bloom-delivery__download-btn" onClick={download}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{t('delivery_download')}</span>
          </button>
        )}

        {/* Progress bar while recording */}
        {capturing && (
          <div className="bloom-delivery__capture-progress">
            <div className="bloom-delivery__capture-bar">
              <div className="bloom-delivery__capture-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="bloom-delivery__capture-row">
              <span className="bloom-delivery__capture-label">{t('delivery_capturing')} {Math.round(progress)}%</span>
              <button type="button" className="bloom-delivery__capture-cancel" onClick={cancelDownload}>
                {t('delivery_cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Secondary Controls ── */}
      <div className="bloom-delivery__controls">
        <button type="button" className="bloom-delivery__control-btn" onClick={handleReplay} aria-label="Replay">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>{t('delivery_replay')}</span>
        </button>
      </div>

      <p className="bloom-delivery__protection-note">{t('delivery_watermark_note')}</p>

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
