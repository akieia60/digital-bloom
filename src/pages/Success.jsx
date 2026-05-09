import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../context/CartContext';
import '../styles/success.css';

const POLL_LIMIT = 30;
const POLL_INTERVAL_MS = 1500;

const PURCHASE_STATUS_LABELS = {
  pending: 'success_purchase_status_pending',
  processing: 'success_purchase_status_processing',
  completed: 'success_purchase_status_completed',
  delivered: 'success_purchase_status_completed',
  paid: 'success_purchase_status_paid',
  failed: 'success_purchase_status_failed',
};

const Success = () => {
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [hasSavedCart, setHasSavedCart] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError(t('success_missing_session'));
      setIsProcessing(false);
      return;
    }

    let cancelled = false;
    let pollCount = 0;
    let timeoutId = null;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${encodeURIComponent(sessionId)}&_t=${Date.now()}`, { cache: 'no-store' });

        if (response.status === 404) {
          if (pollCount < POLL_LIMIT) {
            pollCount += 1;
            timeoutId = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
            return;
          }

          throw new Error(t('success_not_found'));
        }

        if (!response.ok) {
          throw new Error(t('success_load_error'));
        }

        const data = await response.json();
        if (cancelled) return;

        setCheckout(data);
        setError(null);
        setIsProcessing(false);

        if (data.kind !== 'credit') {
          clearCart();
          setHasSavedCart(false);
        } else {
          try {
            const savedCart = JSON.parse(localStorage.getItem('flowerShopCart') || '[]');
            setHasSavedCart(Array.isArray(savedCart) && savedCart.length > 0);
          } catch {
            setHasSavedCart(false);
          }
        }

        if (data.checkout_status !== 'completed' && pollCount < POLL_LIMIT) {
          pollCount += 1;
          timeoutId = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || t('success_load_error'));
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
  }, [sessionId, t, refreshNonce, clearCart]);

  const purchases = useMemo(() => checkout?.purchases || [], [checkout]);
  const creditPurchase = checkout?.kind === 'credit' ? checkout?.credit : null;
  const isCreditPurchase = Boolean(creditPurchase);
  const totalAmount = Number(checkout?.totals?.amount || 0).toFixed(2);
  const displayId = (sessionId || 'N/A').substring(0, 18).toUpperCase();
  const bloomPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.bloom_slug),
    [purchases]
  );
  const readyDownloads = useMemo(
    () => purchases.filter((purchase) => purchase.download_url && (!purchase.download_expires_at || new Date(purchase.download_expires_at) > new Date())),
    [purchases]
  );
  const primaryGiftPath = (bloomPurchases.find((purchase) => purchase.delivery?.delivery_mode !== 'scheduled' || purchase.delivery?.email_status === 'sent')?.bloom_slug || bloomPurchases[0]?.bloom_slug)
    ? `/gift/${(bloomPurchases.find((purchase) => purchase.delivery?.delivery_mode !== 'scheduled' || purchase.delivery?.email_status === 'sent')?.bloom_slug || bloomPurchases[0]?.bloom_slug)}`
    : '/shop';
  const sendReadyPurchases = useMemo(
    () => bloomPurchases.filter((purchase) => {
      const hasAccess = purchase.download_url || (purchase.bloom_slug && String(purchase.status || '').toLowerCase() === 'completed');
      const notScheduledHold = purchase.delivery?.delivery_mode !== 'scheduled' || purchase.delivery?.email_status === 'sent';
      return hasAccess && notScheduledHold;
    }),
    [bloomPurchases]
  );
  const queuedBloomPurchases = useMemo(
    () => bloomPurchases.filter((purchase) => purchase.delivery?.delivery_mode === 'scheduled' && purchase.delivery?.email_status !== 'sent'),
    [bloomPurchases]
  );
  const deliveredBloomPurchases = useMemo(
    () => bloomPurchases.filter((purchase) => purchase.delivery?.email_status === 'sent'),
    [bloomPurchases]
  );
  const renderingPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.has_customization && !purchase.download_url && String(purchase.status || '').toLowerCase() !== 'completed'),
    [purchases]
  );
  const processingPurchases = useMemo(
    () => purchases.filter((purchase) => ['pending', 'processing', 'paid'].includes(String(purchase.status || '').toLowerCase())),
    [purchases]
  );
  const hasPendingWork = renderingPurchases.length > 0 || processingPurchases.length > 0 || checkout?.checkout_status !== 'completed';

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}${primaryGiftPath}`;
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

  const shareUrl = `${window.location.origin}${primaryGiftPath}`;

  // Build the pre-filled share message body. Routes through the device's
  // native Messages app (sms:) or WhatsApp — the BUYER's phone sends from
  // their own number, so no carrier registration / A2P 10DLC needed and
  // recipients see a trusted contact instead of a business shortcode.
  const primaryPurchase = bloomPurchases.find(
    (purchase) =>
      purchase.delivery?.delivery_mode !== 'scheduled' ||
      purchase.delivery?.email_status === 'sent',
  ) || bloomPurchases[0];
  const senderName =
    primaryPurchase?.composition_manifest?.delivery?.message?.fromName ||
    primaryPurchase?.composition_manifest?.delivery?.senderName ||
    primaryPurchase?.delivery?.senderName ||
    '';
  const shareBody = senderName
    ? `${senderName} sent you a Digital Bloom 💐 ${shareUrl}`
    : `You have a Digital Bloom 💐 ${shareUrl}`;
  // If the buyer entered the recipient's phone number in checkout (Text
  // delivery option), pre-fill the SMS recipient too so the buyer just taps
  // Send. Falls back to no-recipient (just body pre-fill) if no phone.
  const recipientPhone = String(
    primaryPurchase?.delivery?.recipient_phone ||
    primaryPurchase?.composition_manifest?.delivery?.recipientPhone ||
    ''
  ).replace(/[^\d+]/g, '');
  const smsHref = recipientPhone
    ? `sms:${recipientPhone}?&body=${encodeURIComponent(shareBody)}`
    : `sms:?&body=${encodeURIComponent(shareBody)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
  const getPurchaseStatusLabel = (status) => {
    const normalized = String(status || '').toLowerCase();
    const labelKey = PURCHASE_STATUS_LABELS[normalized];
    return labelKey ? t(labelKey) : status;
  };
  const creditNextPath = hasSavedCart ? '/checkout' : '/shop';
  const creditNextLabel = hasSavedCart ? t('success_credit_apply_saved_bloom') : t('success_credit_browse_blooms');

  useEffect(() => {
    if (typeof window === 'undefined' || !creditPurchase?.code) return;
    window.localStorage.setItem('dbloom_credit_code', creditPurchase.code);
  }, [creditPurchase?.code]);

  // Google Ads conversion (AW-18151509513) — fires once per session_id when
  // the checkout is confirmed paid. Production hostnames only so localhost +
  // Vercel preview deploys don't pollute the campaign data.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionId || !checkout || checkout.checkout_status !== 'completed') return;
    if (typeof window.gtag !== 'function') return;
    const host = window.location.hostname;
    if (host !== 'digitalbloom.store' && host !== 'www.digitalbloom.store') return;
    const dedupeKey = `gtag_purchase_${sessionId}`;
    try {
      if (window.sessionStorage.getItem(dedupeKey)) return;
      window.sessionStorage.setItem(dedupeKey, '1');
    } catch {
      /* sessionStorage blocked — still fire once per page load */
    }
    const value = Number(checkout?.totals?.amount || 0);
    const items = (checkout?.purchases || []).map((purchase) => ({
      item_id: purchase.bloom_slug || purchase.id || 'digital_bloom',
      item_name: purchase.bloom_slug || 'Digital Bloom',
      price: Number(purchase.amount || purchase.unit_amount || 0),
      quantity: 1,
    }));
    window.gtag('event', 'purchase', {
      transaction_id: sessionId,
      value,
      currency: 'USD',
      items,
    });
  }, [checkout, sessionId]);

  if (isProcessing) {
    return (
      <div className="success-page">
        <div className="success-loading">
          <div className="success-spinner" />
          <p className="success-loading-text">{t('success_processing')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-error-card">
          <h2 className="success-error-title">{t('success_error_title')}</h2>
          <p className="success-error-msg">{error}</p>
          <Link to="/" className="success-btn-outline">{t('success_return_home')}</Link>
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
          <h1 className="success-title">{isCreditPurchase ? t('success_credit_title') : t('success_title')}</h1>
          <p className="success-subtitle">
            {isCreditPurchase ? t('success_credit_subtitle') : t('success_subtitle')}
          </p>
        </div>

        {/* Order summary (Session / Items / Total / Status) is now
            email-only for bloom purchases. Ak + Gamble 2026-05-07:
            "the only thing that should come up is the bottom box —
            the protected bloom link. Everything else goes in the
            email or invoice." Credit purchases keep their dedicated
            credit-code card below; this one is gone for non-credit. */}
        {isCreditPurchase && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_order_summary')}</h3>
            <div className="success-row">
              <span className="success-row-label">{t('success_session')}</span>
              <span className="success-row-value success-row-mono">{displayId}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">{t('success_items')}</span>
              <span className="success-row-value">1</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">{t('success_total')}</span>
              <span className="success-row-value success-row-gold">${totalAmount}</span>
            </div>
            <div className="success-row success-row-last">
              <span className="success-row-label">{t('success_status')}</span>
              <span className="success-badge">
                {checkout?.checkout_status === 'completed' ? t('success_status_confirmed') : t('success_status_processing')}
              </span>
            </div>
          </div>
        )}

        {isCreditPurchase && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_credit_label')}</h3>
            <div className="success-row">
              <span className="success-row-label">{t('success_credit_code')}</span>
              <span className="success-row-value success-row-mono">{creditPurchase.code}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">{t('success_credit_balance')}</span>
              <span className="success-row-value success-row-gold">
                ${(Number(creditPurchase.remaining_amount_cents || 0) / 100).toFixed(2)}
              </span>
            </div>
            <div className="success-row success-row-last">
              <span className="success-row-label">{t('success_credit_ready')}</span>
              <Link to={creditNextPath} className="success-row-value success-row-gold">
                {hasSavedCart ? t('success_credit_go_checkout') : t('success_credit_browse_blooms')}
              </Link>
            </div>
            <p className="success-card-text" style={{ marginTop: '12px' }}>
              {hasSavedCart ? t('success_credit_note_saved_bloom') : t('success_credit_note')}
            </p>
            <p className="success-card-text success-card-text--tight success-card-text--muted">
              {hasSavedCart ? t('success_credit_saved_cart') : t('success_credit_saved_device')}
            </p>
            <div className="success-card-actions">
              <Link to={creditNextPath} className="success-btn-gold">
                {creditNextLabel}
              </Link>
              <Link
                to={`/credits/balance?code=${encodeURIComponent(creditPurchase.code)}`}
                className="success-btn-outline"
              >
                {t('success_credit_check_balance')}
              </Link>
            </div>
          </div>
        )}

        {hasPendingWork && (
          <div className="success-card success-card--highlight">
            <div className="success-processing-head">
              <div>
                <h3 className="success-card-label">{t('success_processing_title')}</h3>
                <p className="success-card-text success-card-text--tight">{t('success_processing_note')}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProcessing(true);
                  setRefreshNonce((current) => current + 1);
                }}
                className="success-btn-outline success-btn-outline--small"
              >
                {t('success_processing_refresh')}
              </button>
            </div>

            <ul className="success-status-list">
              <li>{t('success_step_checkout')}</li>
              <li>{checkout?.checkout_status === 'completed' ? t('success_step_records_done') : t('success_step_records_pending')}</li>
              <li>{purchases.some((purchase) => purchase.has_customization) ? t('success_step_bloom_ready') : t('success_step_files')}</li>
            </ul>

            <div className="success-card-actions success-card-actions--inline">
              {sendReadyPurchases.length > 0 && (
                /* Buyer lands on /manage (stamped view), NOT /gift/ which is
                   the recipient's clean view. Gamble 2026-05-05 PM: buyer
                   never sees a clean copy. */
                <Link to={`/bloom/${sendReadyPurchases[0].bloom_slug}/manage`} className="success-btn-gold success-btn-gold--compact">
                  {t('success_open_bloom')}
                </Link>
              )}
              <Link to="/shop" className="success-btn-outline success-btn-outline--small success-btn-outline--pill">
                {t('nav_send_bloom')}
              </Link>
              <Link to="/" className="success-btn-outline success-btn-outline--small success-btn-outline--pill">
                {t('success_return_homepage')}
              </Link>
            </div>
          </div>
        )}

        {/* Removed 2026-05-07: "Scheduled delivery" + "Delivery emails
            sent" cards. The Experiences card below already surfaces
            scheduled-status per purchase, and the email IS the
            receipt/invoice now — the page doesn't need to repeat it. */}

        {/* Removed 2026-05-07 (Ak + Gamble): the Experiences card and
            the Bloom Links card both duplicated the action that lives
            in the Send Protected Link box below. The buyer now sees
            ONE box on a clean success page — the protected link
            actions. Pending-render state is still handled by the
            Processing card above. The receipt + scheduled-send
            confirmation is in the buyer's email. */}

        {!isCreditPurchase && sendReadyPurchases.length > 0 && (
          <div className="success-card">
            <h3 className="success-card-label">{t('success_send_protected_link')}</h3>
            <div className="success-share-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={smsHref}
                className="success-share-btn"
                style={{ textAlign: 'center', textDecoration: 'none', background: '#34c759', color: '#fff', fontWeight: 600 }}
              >
                💬 {t('success_send_via_text')}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="success-share-btn"
                style={{ textAlign: 'center', textDecoration: 'none', background: '#25d366', color: '#fff', fontWeight: 600 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {t('success_send_via_whatsapp')}
              </a>
              <button type="button" onClick={copyLink} className="success-share-btn">
                {copied ? t('success_copied') : t('success_copy_link')}
              </button>
            </div>
            <p className="success-card-text" style={{ marginTop: '12px' }}>
              {t('success_protected_link_note')}
            </p>
          </div>
        )}

        <div className="success-actions">
          <Link to="/" className="success-btn-primary">{t('success_return_homepage')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
