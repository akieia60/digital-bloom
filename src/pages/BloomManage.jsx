import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveBloomDelivery, DELIVERY_STATUS } from '../lib/deliveryResolver';
import { getApiBase } from '../lib/apiBase';
import LivePreview from '../components/LivePreview';
import '../styles/bloomDelivery.css';

/**
 * BloomManage — Buyer's bloom management page
 *
 * Route: /bloom/:id/manage
 *
 * The buyer lands here from their confirmation email.
 * They can preview the bloom, then send it to the recipient ONE time.
 * After sending, shows delivery confirmation.
 */
export default function BloomManage() {
  const { id: bloomSlug } = useParams();
  const { t } = useLanguage();
  const [state, setState] = useState({
    status: DELIVERY_STATUS.LOADING,
    delivery: null,
    composition: null,
    error: null,
  });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null); // { success, sentTo, sentAt } or { error }
  const [handedOff, setHandedOff] = useState(false); // buyer's Messages app was opened
  const pollRef = useRef(null);

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

  // Poll for processing blooms
  useEffect(() => {
    if (state.status !== DELIVERY_STATUS.PROCESSING) return;
    pollRef.current = setTimeout(async () => {
      const result = await resolveBloomDelivery(bloomSlug);
      setState(result);
    }, 6000);
    return () => clearTimeout(pollRef.current);
  }, [state.status, bloomSlug]);

  // Send bloom to recipient
  const handleSend = useCallback(async () => {
    if (sending) return;
    setSending(true);
    setSendResult(null);

    try {
      const apiUrl = getApiBase();
      const response = await fetch(`${apiUrl}/api/send-bloom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloom_slug: bloomSlug }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendResult({ success: true, sentTo: data.sentTo, sentAt: data.sentAt });
        // Refresh state to reflect updated emailStatus
        const refreshed = await resolveBloomDelivery(bloomSlug);
        setState(refreshed);
      } else {
        setSendResult({ error: data.message || data.error || 'Failed to send' });
      }
    } catch (err) {
      setSendResult({ error: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  }, [bloomSlug, sending]);

  // ── Text delivery: hand off to the buyer's own Messages app ──
  //
  // Digital Bloom can't send SMS itself right now (both Twilio numbers are
  // blocked at the carrier). This is better than a broken button, and
  // arguably better than a server send: the text arrives from a number the
  // recipient already recognises instead of an unknown short code.
  const handleOpenMessages = useCallback(() => {
    const { delivery } = state;
    const phone = String(delivery?.recipientPhone || '').replace(/[^\d+]/g, '');
    const giftUrl = `${window.location.origin}/gift/${encodeURIComponent(bloomSlug)}`;
    const senderName = String(delivery?.senderName || '').trim();
    const recipientName = String(delivery?.recipientName || '').trim();

    const intro = senderName
      ? `${senderName} sent you a Digital Bloom`
      : 'I sent you a Digital Bloom';
    const greeting = recipientName ? `${recipientName}, ` : '';
    const body = `${greeting}${intro} 💐 ${giftUrl}`;

    // `sms:NUMBER?&body=` is the form both iOS and Android accept.
    window.location.href = `sms:${phone}?&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  }, [state, bloomSlug]);

  const handleConfirmTextSent = useCallback(async () => {
    if (sending) return;
    setSending(true);
    setSendResult(null);

    try {
      const apiUrl = getApiBase();
      const response = await fetch(`${apiUrl}/api/mark-bloom-sent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloom_slug: bloomSlug }),
      });
      const data = await response.json();

      if (response.ok) {
        setSendResult({ success: true, sentTo: data.sentTo, sentAt: data.sentAt });
        const refreshed = await resolveBloomDelivery(bloomSlug);
        setState(refreshed);
      } else {
        setSendResult({ error: data.message || data.error || 'Failed to record delivery' });
      }
    } catch (err) {
      setSendResult({ error: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  }, [bloomSlug, sending]);

  // ── LOADING ──
  if (state.status === DELIVERY_STATUS.LOADING) {
    return (
      <div className="bloom-delivery bloom-delivery--loading">
        <div className="bloom-delivery__loader">
          <div className="bloom-delivery__spinner" />
          <p className="bloom-delivery__loader-text">Loading your bloom...</p>
        </div>
      </div>
    );
  }

  // ── PROCESSING ──
  if (state.status === DELIVERY_STATUS.PROCESSING) {
    return (
      <div className="bloom-delivery bloom-delivery--processing">
        <div className="bloom-delivery__status-card">
          <div className="bloom-delivery__status-icon">✨</div>
          <h1 className="bloom-delivery__status-title">Your bloom is being prepared</h1>
          <p className="bloom-delivery__status-message">
            We're putting the finishing touches on your Digital Bloom. This usually takes less than a minute.
          </p>
        </div>
        <ManageBrand />
      </div>
    );
  }

  // ── NOT FOUND / ERROR ──
  if (state.status === DELIVERY_STATUS.NOT_FOUND || state.status === DELIVERY_STATUS.ERROR) {
    return (
      <div className="bloom-delivery bloom-delivery--not-found">
        <div className="bloom-delivery__status-card">
          <h1 className="bloom-delivery__status-title">Bloom not found</h1>
          <p className="bloom-delivery__status-message">
            {state.error || 'We couldn\'t find this bloom. Check the link from your confirmation email.'}
          </p>
        </div>
        <ManageBrand />
      </div>
    );
  }

  // ── EXPIRED ──
  if (state.status === DELIVERY_STATUS.EXPIRED) {
    return (
      <div className="bloom-delivery bloom-delivery--not-found">
        <div className="bloom-delivery__status-card">
          <div className="bloom-delivery__status-icon">🌸</div>
          <h1 className="bloom-delivery__status-title">Bloom Expired</h1>
          <p className="bloom-delivery__status-message">
            {state.error || 'This bloom has reached its viewing limit or has expired.'}
          </p>
        </div>
        <ManageBrand />
      </div>
    );
  }

  // ── SCHEDULED ──
  if (state.status === DELIVERY_STATUS.SCHEDULED) {
    return (
      <div className="bloom-delivery bloom-delivery--processing">
        <div className="bloom-delivery__status-card">
          <div className="bloom-delivery__status-icon">📬</div>
          <h1 className="bloom-delivery__status-title">Bloom Scheduled</h1>
          <p className="bloom-delivery__status-message">
            This bloom is queued for delivery and will be sent automatically.
          </p>
        </div>
        <ManageBrand />
      </div>
    );
  }

  // ── READY — Buyer manage experience ──
  const { delivery, composition } = state;
  const message = delivery?.message || {};
  const recipientName = delivery?.recipientName || message.toName || 'your recipient';
  const recipientEmail = delivery?.recipientEmail || '';
  const recipientPhone = delivery?.recipientPhone || '';
  const isTextDelivery = delivery?.deliveryChannel === 'phone' && Boolean(recipientPhone);
  const alreadySent = delivery?.emailStatus === 'sent' && delivery?.emailSentAt;
  const justSent = sendResult?.success;
  const delivered = alreadySent || justSent;

  return (
    <div className="bloom-delivery">
      {/* ── Bloom Preview ── */}
      <div className="bloom-delivery__hero">
        <div className="bloom-delivery__composition">
          {/* Always-on protection stamp on the BUYER's preview (Gamble
              2026-05-05 PM): the buyer should never see a clean copy.
              Pre-send: "Purchase Finalized" — payment cleared, not yet
              delivered. Post-send: "Purchase Finalized & Sent" (Gamble's
              exact copy). The recipient view (BloomDelivery) never passes
              previewStamp so they get the clean gift experience. */}
          <div className="bloom-delivery__protected-frame">
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
              message={delivery.message}
              engravingStyle={delivery.engravingStyle}
              fontChoice={delivery.fontChoice}
              messageTextColor={delivery.messageTextColor}
              messageBold={delivery.messageBold}
              previewStamp={delivered ? 'Purchase Finalized & Sent' : 'Purchase Finalized'}
              className="bloom-delivery__preview"
            />
          </div>
        </div>

        {/* ── Message Preview ── */}
        {message.short && (
          <div className="bloom-delivery__message bloom-delivery__message--visible">
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

      {/* ── Manage Controls ── */}
      <div className="bloom-manage__controls">
        {delivered ? (
          /* ── Delivered State ── */
          <div className="bloom-manage__delivered">
            <div className="bloom-manage__delivered-icon">✓</div>
            <h2 className="bloom-manage__delivered-title">Bloom Delivered</h2>
            <p className="bloom-manage__delivered-detail">
              Sent to {recipientName}
              {isTextDelivery
                ? (recipientPhone ? ` (${recipientPhone})` : '')
                : (recipientEmail ? ` (${recipientEmail})` : '')}
            </p>
            {(sendResult?.sentAt || delivery?.emailSentAt) && (
              <p className="bloom-manage__delivered-time">
                {new Date(sendResult?.sentAt || delivery.emailSentAt).toLocaleString()}
              </p>
            )}
            {delivery?.recipientViewedAt && (
              <p className="bloom-manage__viewed">
                Opened by {recipientName} · {new Date(delivery.recipientViewedAt).toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          /* ── Send Controls ── */
          <>
            <div className="bloom-manage__recipient-card">
              <p className="bloom-manage__recipient-label">Delivering to</p>
              <p className="bloom-manage__recipient-name">{recipientName}</p>
              {isTextDelivery ? (
                <p className="bloom-manage__recipient-email">{recipientPhone}</p>
              ) : (
                recipientEmail && (
                  <p className="bloom-manage__recipient-email">{recipientEmail}</p>
                )
              )}
            </div>

            {isTextDelivery ? (
              <>
                <button
                  type="button"
                  className="bloom-manage__send-btn"
                  onClick={handleOpenMessages}
                  disabled={sending}
                >
                  {handedOff ? `Open Messages again` : `Text it to ${recipientName}`}
                </button>

                <p className="bloom-manage__send-note">
                  This opens your own Messages app with {recipientName}'s number and
                  the bloom link already filled in — so it arrives from your number,
                  not a number they don't recognize. Just hit send.
                </p>

                {handedOff && (
                  <>
                    <button
                      type="button"
                      className="bloom-manage__send-btn"
                      onClick={handleConfirmTextSent}
                      disabled={sending}
                    >
                      {sending ? 'Saving...' : 'I sent it ✓'}
                    </button>
                    <p className="bloom-manage__send-note">
                      Tap this once the text is on its way so we can mark the bloom delivered.
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="bloom-manage__send-btn"
                  onClick={handleSend}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : `Send to ${recipientName}`}
                </button>

                <p className="bloom-manage__send-note">
                  This will email the bloom directly to {recipientName}. You can only send it once.
                </p>
              </>
            )}

            {sendResult?.error && (
              <p className="bloom-manage__error">{sendResult.error}</p>
            )}
          </>
        )}
      </div>

      {/* ── Brand Footer ── */}
      <ManageBrand />
    </div>
  );
}

function ManageBrand() {
  return (
    <div className="bloom-delivery__brand">
      <p className="bloom-delivery__brand-name">Digital Bloom™</p>
      <p className="bloom-delivery__brand-tagline">Luxury motion art, delivered digitally</p>
    </div>
  );
}
