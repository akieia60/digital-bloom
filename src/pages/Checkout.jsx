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

  const total = getCartTotal();
  const totalCents = Math.round(total * 100);
  const remainingDue = creditApplied ? Math.max(0, totalCents - creditApplied.applied_cents) : totalCents;
  const appliedAmountCents = creditApplied?.applied_cents || 0;

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
    const formattedItems = cartItems.map((item) => ({
      product: item,
      quantity: item.quantity,
    }));

    try {
      if (creditApplied && remainingDue <= 0) {
        const result = await createCartCheckoutSession(formattedItems, {
          reservation_id: creditApplied.reservation_id,
          remaining_due_cents: 0,
        });

        if (result.free_checkout) {
          window.location.href = result.url;
          return;
        }
      }

      const result = await createCartCheckoutSession(
        formattedItems,
        creditApplied
          ? {
              reservation_id: creditApplied.reservation_id,
              remaining_due_cents: remainingDue,
            }
          : null
      );

      if (!result?.url) throw new Error('Failed to create checkout session');
      await redirectToCheckout(result.url);
    } catch (err) {
      console.error('Checkout error:', err);
      if (typeof window !== 'undefined') {
        startCartCheckoutRedirect(
          formattedItems,
          creditApplied
            ? {
                reservation_id: creditApplied.reservation_id,
                remaining_due_cents: remainingDue,
              }
            : null
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
