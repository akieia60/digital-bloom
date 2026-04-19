import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveBloomDelivery, DELIVERY_STATUS } from '../lib/deliveryResolver';
import LivePreview from '../components/LivePreview';
import '../styles/bloomDelivery.css';

/**
 * BloomDelivery — Recipient's bloom viewing experience
 *
 * Route: /bloom/:id  (also /gift/:id)
 *
 * Stripped-down, locked-down experience for the recipient:
 * 1. Cinematic hero with LivePreview composition
 * 2. Delayed message reveal (fade-in, serif, elegant)
 * 3. Watermark / branding layer
 * 4. Social media share buttons (the ONLY interactive elements)
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
  }, [state.status, state.delivery]);

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
    <div className="bloom-delivery">
      {/* ── Cinematic Bloom Hero ── */}
      <div className="bloom-delivery__hero">
        <div className="bloom-delivery__composition">
          {protectedVideoUrl ? (
            <div className="db-watermark db-watermark--hero bloom-delivery__protected-frame">
              <video
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
              {/* Server-rendered MP4 already has the Digital Bloom stamp, the
                  "From {name}" label, and the diagonal © watermark baked in by
                  renderBloom.js's createOverlayImage. We only add the CSS grid
                  as a lightweight extra protection layer; do NOT re-draw the
                  brand pill or sender — that causes visible duplication. */}
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
                <div className="db-watermark-corner">Digital Bloom™</div>
              </div>
            </div>
          ) : (
            <div className="db-watermark db-watermark--hero bloom-delivery__protected-frame">
              <LivePreview
                product={{
                  id: delivery.productId,
                  video_file_url: composition?.baseMedia?.src,
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
                occasion={delivery.category || null}
                className="bloom-delivery__preview"
              />
              {/* Diagonal repeating watermark grid — flashes every 18s so
                  any screen recording captures at least one prominent frame */}
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
                <div className="db-watermark-corner">Digital Bloom™</div>
              </div>
            </div>
          )}
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

      {/* ── Social Media Sharing (recipient's only interactive options) ── */}
      <SocialShareButtons bloomUrl={window.location.href} recipientName={message.toName} />

      {/* ── Brand Footer ── */}
      <BrandFooter />
    </div>
  );
}

/**
 * Social Share Buttons — the only interactive elements on the recipient's view.
 * Lets recipients post to social media (free marketing for Digital Bloom).
 */
function SocialShareButtons({ bloomUrl, recipientName }) {
  const shareText = recipientName
    ? `I just received a beautiful Digital Bloom for ${recipientName}!`
    : 'Check out this beautiful Digital Bloom I received!';
  const encodedUrl = encodeURIComponent(bloomUrl);
  const encodedText = encodeURIComponent(shareText);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Digital Bloom', text: shareText, url: bloomUrl });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <div className="bloom-delivery__social">
      <p className="bloom-delivery__social-label">Share on social media</p>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bloom-delivery__social-btn"
        aria-label="Share on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bloom-delivery__social-btn"
        aria-label="Share on Facebook"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bloom-delivery__social-btn"
        aria-label="Share on X"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>

      {/* Instagram (opens app) */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bloom-delivery__social-btn"
        aria-label="Open Instagram"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bloom-delivery__social-btn"
        aria-label="Open TikTok"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
      </a>

      {/* Native Share (mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          type="button"
          className="bloom-delivery__social-btn"
          onClick={handleNativeShare}
          aria-label="Share"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      )}
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
