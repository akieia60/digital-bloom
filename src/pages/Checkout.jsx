import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { createCartCheckoutSession, redirectToCheckout, startCartCheckoutRedirect } from '../lib/stripe';
import { getCreditBalance, reserveCredit, validateCreditCode } from '../lib/creditStripe';
import '../styles/credits.css';

function formatCurrency(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function isValidEmail(value) {
  return /\S+@\S+\.\S+/.test(String(value || '').trim());
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [creditCode, setCreditCode] = useState('');
  const [creditApplied, setCreditApplied] = useState(null);
  const [isApplyingCredit, setIsApplyingCredit] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [knownCredit, setKnownCredit] = useState(null);
  const [isCheckingKnownCredit, setIsCheckingKnownCredit] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('dbloom_buyer_email') || '';
  });
  const [deliveryTarget, setDeliveryTarget] = useState('recipient');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  // 'email' is fully wired today; 'phone' captures the number into Stripe
  // metadata but SMS sending is gated until Twilio is provisioned (Ak).
  const [deliveryChannel, setDeliveryChannel] = useState('email');
  const [deliveryMode, setDeliveryMode] = useState('now');
  const [deliveryDate, setDeliveryDate] = useState('');

  const total = getCartTotal();
  const totalCents = Math.round(total * 100);
  const remainingDue = creditApplied ? Math.max(0, totalCents - creditApplied.applied_cents) : totalCents;
  const appliedAmountCents = creditApplied?.applied_cents || 0;
  const hasPersonalizedBloom = cartItems.some((item) => Boolean(item.customization));
  const buyerTimezone = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago'
    : 'America/Chicago';
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (buyerEmail) {
      window.localStorage.setItem('dbloom_buyer_email', buyerEmail);
    }
  }, [buyerEmail]);

  useEffect(() => {
    if (typeof window === 'undefined' || creditApplied) return;
    const savedCode = window.localStorage.getItem('dbloom_credit_code');
    if (!savedCode || knownCredit || isCheckingKnownCredit) return;
    setIsCheckingKnownCredit(true);
    getCreditBalance(savedCode)
      .then((balance) => {
        if (balance?.remaining_amount_cents > 0) {
          setKnownCredit({
            code: savedCode,
            remaining_amount_cents: balance.remaining_amount_cents,
          });
        } else {
          window.localStorage.removeItem('dbloom_credit_code');
        }
      })
      .catch(() => {
        window.localStorage.removeItem('dbloom_credit_code');
      })
      .finally(() => setIsCheckingKnownCredit(false));
  }, [creditApplied, isCheckingKnownCredit, knownCredit]);

  const reserveAndApplyCredit = async (formattedCode, { skipValidation = false } = {}) => {
    if (!skipValidation) {
      const validation = await validateCreditCode(formattedCode);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid credit code');
      }
    }

    const reservation = await reserveCredit(formattedCode, totalCents);

    setCreditApplied({
      code: formattedCode,
      reservation_id: reservation.reservation_id,
      applied_cents: reservation.applied_cents,
      remaining_after_cents: reservation.remaining_after_cents,
    });
    setKnownCredit({
      code: formattedCode,
      remaining_amount_cents: reservation.remaining_after_cents,
    });
    setIsCreditOpen(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dbloom_credit_code', formattedCode);
    }
  };

  const handleApplyCredit = async () => {
    setError(null);

    const formatted = creditCode.toUpperCase().trim();
    if (!/^DBLOOM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formatted)) {
      setError('Invalid credit code format. Expected: DBLOOM-XXXX-XXXX');
      return;
    }

    setIsApplyingCredit(true);

    try {
      await reserveAndApplyCredit(formatted);
    } catch (err) {
      setError(err.message || 'Failed to apply credit');
    } finally {
      setIsApplyingCredit(false);
    }
  };

  const handleApplyKnownCredit = async () => {
    if (!knownCredit?.code) return;

    setError(null);
    setIsApplyingCredit(true);

    try {
      await reserveAndApplyCredit(knownCredit.code, { skipValidation: true });
    } catch (err) {
      setError(err.message || 'Failed to apply credit');
    } finally {
      setIsApplyingCredit(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    const trimmedBuyerEmail = buyerEmail.trim();
    const trimmedRecipientEmail = recipientEmail.trim();
    const trimmedRecipientPhone = recipientPhone.replace(/[^\d+]/g, '');

    if (hasPersonalizedBloom) {
      if (!isValidEmail(trimmedBuyerEmail)) {
        setError('Please enter a valid email so we can deliver your bloom.');
        setIsProcessing(false);
        return;
      }

      if (deliveryTarget === 'recipient' && deliveryChannel === 'email' && !isValidEmail(trimmedRecipientEmail)) {
        setError('Please enter the recipient email for delivery.');
        setIsProcessing(false);
        return;
      }

      if (deliveryTarget === 'recipient' && deliveryChannel === 'phone' && trimmedRecipientPhone.length < 10) {
        setError('Please enter the recipient phone number for SMS delivery.');
        setIsProcessing(false);
        return;
      }

      if (deliveryMode === 'scheduled' && !deliveryDate) {
        setError('Please choose a delivery date for this bloom.');
        setIsProcessing(false);
        return;
      }

      if (deliveryMode === 'scheduled' && deliveryDate < todayString) {
        setError('Scheduled delivery must be today or later.');
        setIsProcessing(false);
        return;
      }
    }

    const formattedItems = cartItems.map((item) => ({
      product: item,
      quantity: item.quantity,
    }));
    const deliveryConfig = hasPersonalizedBloom
      ? {
          target: deliveryTarget,
          // For now, the email channel is the only one that auto-sends.
          // recipientEmail is always populated so the bloom-delivery email can
          // still ship to the buyer if Phone-channel SMS isn't wired yet.
          recipientEmail: deliveryTarget === 'recipient' && deliveryChannel === 'email'
            ? trimmedRecipientEmail
            : trimmedBuyerEmail,
          recipientPhone: deliveryTarget === 'recipient' && deliveryChannel === 'phone'
            ? trimmedRecipientPhone
            : '',
          deliveryChannel,
          purchaserEmail: trimmedBuyerEmail,
          deliveryMode,
          deliveryDate: deliveryMode === 'scheduled' ? deliveryDate : '',
          buyerTimezone,
        }
      : null;
    const customerInfo = trimmedBuyerEmail
      ? {
          email: trimmedBuyerEmail,
          delivery: deliveryConfig,
        }
      : {};

    try {
      if (creditApplied && remainingDue <= 0) {
        const result = await createCartCheckoutSession(formattedItems, {
          reservation_id: creditApplied.reservation_id,
          remaining_due_cents: 0,
        }, customerInfo);

        if (result.free_checkout) {
          window.location.href = result.url;
          return;
        }
        // Unexpected: server didn't confirm free checkout — fall through to standard flow
        // but don't make a second createCartCheckoutSession call
        throw new Error('Unexpected response from free checkout. Please try again.');
      }

      const result = await createCartCheckoutSession(
        formattedItems,
        creditApplied
          ? {
              reservation_id: creditApplied.reservation_id,
              remaining_due_cents: remainingDue,
            }
          : null,
        customerInfo
      );

      if (!result?.url) throw new Error('Failed to create checkout session');
      await redirectToCheckout(result.url);
    } catch (err) {
      console.error('Checkout error:', err);
      // Don't use the redirect fallback for free-checkout failures — it would
      // create a second checkout session with remainingDue=0.
      const isFreeCheckoutPath = creditApplied && remainingDue <= 0;
      if (typeof window !== 'undefined' && !isFreeCheckoutPath) {
        startCartCheckoutRedirect(
          formattedItems,
          creditApplied
            ? {
                reservation_id: creditApplied.reservation_id,
                remaining_due_cents: remainingDue,
              }
            : null,
          customerInfo
        );
        return;
      }
      setError(err.message || 'Failed to proceed to checkout. Please try again.');
    }

    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-display mb-4">Checkout</h1>
          <p className="text-white/50 mb-8">Your cart is empty right now. Add a bloom, then come back here when you’re ready.</p>
          <Link to="/shop" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 px-6 text-sm uppercase tracking-[0.16em] text-white/80">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-white">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/35">Secure Checkout</p>
            <h1 className="font-display text-3xl">Checkout</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/10 px-4 text-[11px] uppercase tracking-[0.18em] text-white/70"
          >
            Back to Shop
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <div
              key={item.lineItemId || `${item.id}-${index}`}
              className="rounded-[28px] border border-white/8 bg-white/[0.03] px-4 sm:px-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
            >
              <CartItem item={item} />
            </div>
          ))}
        </div>

        {hasPersonalizedBloom && (
          <div className="cart-credits-wallet mb-8">
            <div className="cart-credits-wallet__eyebrow">Bloom Delivery</div>
            <div className="cart-credits-wallet__heading-row">
              <div>
                <h3 className="cart-credits-wallet__title">Who should receive this bloom?</h3>
                <p className="cart-credits-wallet__copy">
                  Pick how the gift link reaches them — email is delivered automatically today, SMS is launching soon.
                </p>
              </div>
              <span className="cart-credits-wallet__icon" aria-hidden="true">📬</span>
            </div>

            <div className="cart-credit-entry-grid" style={{ gap: '14px', display: 'grid' }}>
              <label className="cart-credit-entry-label">
                Your email
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  placeholder="you@email.com"
                  className="cart-credit-entry-input"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>

              <div className="cart-credit-choice-row">
                <button
                  type="button"
                  onClick={() => setDeliveryTarget('recipient')}
                  className={`cart-credit-choice ${deliveryTarget === 'recipient' ? 'is-active' : ''}`}
                >
                  Send to recipient
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryTarget('self')}
                  className={`cart-credit-choice ${deliveryTarget === 'self' ? 'is-active' : ''}`}
                >
                  Send to me
                </button>
              </div>

              {deliveryTarget === 'recipient' && (
                <>
                  <div className="cart-credit-entry-label" style={{ marginBottom: '-4px' }}>
                    Delivery preference
                  </div>
                  <div className="cart-credit-choice-row" role="radiogroup" aria-label="Delivery preference">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={deliveryChannel === 'email'}
                      onClick={() => setDeliveryChannel('email')}
                      className={`cart-credit-choice ${deliveryChannel === 'email' ? 'is-active' : ''}`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={deliveryChannel === 'phone'}
                      onClick={() => setDeliveryChannel('phone')}
                      className={`cart-credit-choice ${deliveryChannel === 'phone' ? 'is-active' : ''}`}
                    >
                      Phone <span style={{ opacity: 0.7, fontSize: '0.75em', fontWeight: 500 }}>(SMS — coming soon)</span>
                    </button>
                  </div>

                  {deliveryChannel === 'email' ? (
                    <label className="cart-credit-entry-label">
                      Recipient email
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(event) => setRecipientEmail(event.target.value)}
                        placeholder="their@email.com"
                        className="cart-credit-entry-input"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </label>
                  ) : (
                    <label className="cart-credit-entry-label">
                      Recipient phone
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(event) => setRecipientPhone(event.target.value)}
                        placeholder="(555) 123-4567"
                        className="cart-credit-entry-input"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                      <span className="cart-credit-entry-hint">
                        We'll save the number now and text the gift link as soon as SMS goes live —
                        in the meantime your bloom email-delivers to you so the gift still lands today.
                      </span>
                    </label>
                  )}
                </>
              )}

              <div className="cart-credit-choice-row">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('now')}
                  className={`cart-credit-choice ${deliveryMode === 'now' ? 'is-active' : ''}`}
                >
                  Send immediately
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('scheduled')}
                  className={`cart-credit-choice ${deliveryMode === 'scheduled' ? 'is-active' : ''}`}
                >
                  Schedule for later
                </button>
              </div>

              {deliveryMode === 'scheduled' && (
                <label className="cart-credit-entry-label">
                  Delivery date
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    min={todayString}
                    className="cart-credit-entry-input"
                  />
                  <span className="cart-credit-entry-hint">
                    Scheduled blooms send in a morning delivery window using your timezone: {buyerTimezone}
                  </span>
                </label>
              )}
            </div>
          </div>
        )}

        <div className="cart-credits-wallet mb-8">
          {!creditApplied && !knownCredit && !isCheckingKnownCredit && (
            <>
              <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
              <div className="cart-credits-wallet__heading-row">
                <div>
                  <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                  <p className="cart-credits-wallet__copy">Buy credits and use them on any order</p>
                </div>
                <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
              </div>
              <Link to="/credits" className="cart-credits-wallet__browse">
                Browse Credits &rarr;
              </Link>
            </>
          )}

          {!creditApplied && isCheckingKnownCredit && (
            <>
              <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
              <div className="cart-credits-wallet__heading-row">
                <div>
                  <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                  <p className="cart-credits-wallet__copy">Checking your saved balance...</p>
                </div>
                <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
              </div>
            </>
          )}

          {!creditApplied && knownCredit?.remaining_amount_cents > 0 && (
            <>
              <div className="cart-credits-wallet__eyebrow">Bloom Credits</div>
              <div className="cart-credits-wallet__heading-row">
                <div>
                  <h3 className="cart-credits-wallet__title">Bloom Credits</h3>
                  <p className="cart-credits-wallet__balance">
                    Available balance: {formatCurrency(knownCredit.remaining_amount_cents)}
                  </p>
                </div>
                <span className="cart-credits-wallet__icon" aria-hidden="true">💳</span>
              </div>
              <button
                type="button"
                onClick={handleApplyKnownCredit}
                disabled={isApplyingCredit}
                className="cart-credits-wallet__apply"
              >
                {isApplyingCredit
                  ? 'Applying...'
                  : `Apply ${formatCurrency(Math.min(knownCredit.remaining_amount_cents, totalCents))} to this order`}
              </button>
            </>
          )}

          {creditApplied && (
            <div className="cart-credits-wallet__applied">
              <div className="cart-credits-wallet__status">
                <span className="cart-credits-wallet__status-icon" aria-hidden="true">✓</span>
                <div>
                  <div className="cart-credits-wallet__status-title">
                    {formatCurrency(creditApplied.applied_cents)} Bloom Credit applied
                  </div>
                  <div className="cart-credits-wallet__status-copy">
                    Remaining balance: {formatCurrency(creditApplied.remaining_after_cents)}
                  </div>
                </div>
              </div>
              <div className="cart-credits-wallet__status-footer">
                <span>New total: {formatCurrency(remainingDue)}</span>
                <button
                  type="button"
                  className="cart-credits-wallet__remove"
                  onClick={() => {
                    setCreditApplied(null);
                    setCreditCode('');
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {!creditApplied && (
            <div className="cart-credits-wallet__entry">
              <button
                type="button"
                onClick={() => setIsCreditOpen((open) => !open)}
                className="cart-credits-wallet__entry-toggle"
              >
                {isCreditOpen ? 'Hide credit code' : 'Enter a credit code'}
              </button>

              {isCreditOpen && (
                <div className="cart-credits-wallet__entry-panel">
                  <div className="credit-input-group cart-credit-input-group">
                    <input
                      type="text"
                      placeholder="DBLOOM-XXXX-XXXX"
                      maxLength="17"
                      value={creditCode}
                      onChange={(e) => setCreditCode(e.target.value.toUpperCase())}
                    />
                    <button onClick={handleApplyCredit} disabled={isApplyingCredit || !creditCode}>
                      {isApplyingCredit ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-light text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
          <div className="cart-summary-bar mb-6">
            <div>
              <p className="cart-summary-bar__label">Total</p>
              <p className="cart-summary-bar__amount">{formatCurrency(remainingDue)}</p>
              {creditApplied && (
                <p className="cart-summary-bar__meta">
                  Original: {formatCurrency(totalCents)} - Credit: {formatCurrency(appliedAmountCents)}
                </p>
              )}
            </div>
            <div className="cart-summary-bar__secure">
              <span aria-hidden="true">🔒</span>
              <span>Secure checkout</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className="w-full btn-primary py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl flex items-center justify-center gap-4"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <span>{`Check Out · ${formatCurrency(remainingDue)}`}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
