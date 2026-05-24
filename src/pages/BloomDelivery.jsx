import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveBloomDelivery, DELIVERY_STATUS } from '../lib/deliveryResolver';
import LivePreview from '../components/LivePreview';
import WrappedGiftReveal from '../components/delivery/WrappedGiftReveal';
import '../styles/bloomDelivery.css';
import '../styles/wrapped-gift.css';

/**
 * BloomDelivery — Recipient's bloom viewing experience
 *
 * Route: /bloom/:id  (also /gift/:id)
 *
 * Stripped-down, locked-down experience for the recipient:
 * 1. Cinematic hero with LivePreview composition
 * 2. Delayed message reveal (fade-in, serif, elegant)
 * 3. Watermark / branding layer
 * 4. 'Send your own bloom' CTA (replaces social share buttons to prevent forwarding)
 * 5. No navigation, no home button, no download, no replay
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
  const [processingTick, setProcessingTick] = useState(0);
  const [bloomUnwrapped, setBloomUnwrapped] = useState(false);
  const revealTimerRef = useRef(null);

  const handleUnwrapped = useCallback(() => setBloomUnwrapped(true), []);

  // Fetch delivery data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await resolveBloomDelivery(bloomSlug, 'gift');
      if (!cancelled) setState(result);
    }
    load();
    return () => { cancelled = true; };
  }, [bloomSlug, processingTick]);

  // Delayed message reveal — bloom unwraps first, then 2.2s after the
  // recipient finishes the wrapped-gift reveal, the message fades in.
  useEffect(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (
      state.status === DELIVERY_STATUS.READY &&
      state.delivery?.message?.short &&
      bloomUnwrapped
    ) {
      revealTimerRef.current = setTimeout(() => setMessageRevealed(true), 2200);
    }

    return () => {
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [state.status, state.delivery, bloomUnwrapped]);

  // Processing bloom pages quietly re-check in the background.
  useEffect(() => {
    if (state.status !== DELIVERY_STATUS.PROCESSING) return undefined;

    const timer = window.setTimeout(() => {
      setProcessingTick((current) => current + 1);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [state.status]);

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
  // Merge message with top-level senderName fallback so "From" always renders
  const message = {
    ...(delivery?.message || {}),
    fromName: delivery?.message?.fromName || delivery?.senderName || '',
  };
  const hasMessage = Boolean(message.short);

  // Expiration is already enforced by resolveBloomDelivery (returns EXPIRED
  // status before we get here), so presence of downloadUrl is sufficient.
  const protectedVideoUrl = delivery?.downloadUrl || null;

  return (
    <WrappedGiftReveal senderName={message.fromName} onPlayed={handleUnwrapped}>
    <div className="bloom-delivery">
      {/* ── Cinematic Bloom Hero ── */}
      <div className="bloom-delivery__hero">
        <div className="bloom-delivery__composition">
          <div className="db-watermark db-watermark--hero bloom-delivery__protected-frame">
            {/* Always use LivePreview so canvas effects, frames, text, color
                palette, and trademark all render consistently. If the server
                baked a protected MP4, feed it in as the base video source. */}
            <LivePreview
              product={{
                id: delivery.productId,
                video_file_url: protectedVideoUrl || composition?.baseMedia?.src,
                image_url: composition?.baseMedia?.poster,
              }}
              colorTheme={delivery.colorTheme}
              primaryColor={delivery.primaryColor}
              accentColor={delivery.accentColor}
              extras={delivery.extras}
              message={message}
              engravingStyle={delivery.engravingStyle}
              fontChoice={delivery.fontChoice}
              messageTextColor={delivery.messageTextColor}
              messageBold={delivery.messageBold}
              messageTextSize={delivery.messageTextSize || 'md'}
              frameStyle={delivery.frameStyle || 'none'}
              messageOffset={delivery.messageOffset || null}
              occasion={delivery.category || null}
              className="bloom-delivery__preview"
            />
            {/* Watermark protection now lives entirely in the rendered MP4
                (baked in by the publish/process-bloom pipeline). The DOM
                overlay that used to flash a "© Digital Bloom" grid + a
                corner "Digital Bloom™" pill on top of the video has been
                removed — the recipient paid for this experience and was
                seeing redundant brand chrome on top of their gift. The
                in-video watermarks stay; the legible footer attribution
                stays. */}
          </div>
        </div>

        {/* ── Bloom Identity — category + name ── */}
        {(delivery?.category || delivery?.productName) && (
          <div className="bloom-delivery__identity">
            {delivery?.category && (
              <span className="bloom-delivery__identity-category">
                {String(delivery.category).replace(/-/g, ' ')}
              </span>
            )}
            {delivery?.productName && (
              <h1 className="bloom-delivery__identity-name">{delivery.productName}</h1>
            )}
          </div>
        )}

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

      {/* ── Send Your Own CTA (replaces social share buttons to prevent forwarding) ── */}
      <div className="bloom-delivery__cta">
        <p className="bloom-delivery__cta-text">Loved this bloom? Send your own.</p>
        <a href="/shop" className="bloom-delivery__cta-btn">Send a Bloom →</a>
      </div>

      {/* ── Brand Footer ── */}
      <BrandFooter />
    </div>
    </WrappedGiftReveal>
  );
}

/* SocialShareButtons component removed — sharing the gift URL was the primary
   forwarding vector. Replaced with a “Send your own bloom” CTA above. */

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
