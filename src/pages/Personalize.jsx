import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createCartCheckoutSession, redirectToCheckout, startCartCheckoutRedirect } from '../lib/stripe';
import { buildCartComposition } from '../lib/fulfillmentMapper';
import OCCASIONS from '../data/occasions';
import LivePreview from '../components/LivePreview';

// Personalize page — wired version of Gamble's 2026-05-15 wireframe.
// Two screens (Personalize Bloom → Checkout) live on one route,
// scrolling between them. PAY drives the existing Stripe pipeline.
//
// Route: /personalize/:productId  (or /personalize for static demo)
// Approved layout: 2026-05-17 by Ak + Gamble via /v3-preview.

const NAVY = '#0D1B36';
const NAVY_DEEP = '#0A1428';
const NAVY_LINE = '#1B2D52';
const GOLD = '#D4AF37';
const GOLD_DIM = 'rgba(212, 175, 55, 0.7)';
const TEXT = '#FFFFFF';
const TEXT_MUTED = 'rgba(255, 255, 255, 0.55)';

const COLOR_SWATCHES = [
  '#F4D03F', '#F5EFE0', '#FFFFFF', '#F5C088', '#E68A4A', '#E8B098', '#B83C3C', '#7C1E1E', '#5B0F0F',
  '#0F0F0F', '#7B8FE6', '#1F5AE0', '#8FB9E2', '#3B6B5C', '#0C7F4F', '#1B3D2A', '#5C7A2A', '#3B5C1F',
  '#C75A1A', '#7C4F2E', '#7C1E1E', '#9C8E5E', '#C9B070', '#D9CFAE', '#A8A8A8', '#5C6B6E', '#3B4E50',
  '#C7A6E6', '#9C2BE8', '#5B1B7C', '#C9A45A', '#3B3B3B', '#1F1F1F', '#0F0F0F', '#000000', '#0F0F0F',
];

// 4 font choices from Gamble's wireframe. Mapped to MESSAGE_FONT_OPTIONS keys
// so the existing fulfillment pipeline reads them correctly.
const FONT_CHOICES = [
  { label: 'Bold Sans',     fontKey: 'modernSans',  family: "'Outfit', -apple-system, sans-serif",      weight: 700, style: 'normal', spacing: '0.02em', transform: 'none' },
  { label: 'Luxury Italic', fontKey: 'cormorant',   family: "'Cormorant Garamond', Georgia, serif",     weight: 500, style: 'italic', spacing: '0.04em', transform: 'none' },
  { label: 'Engraved',      fontKey: 'cinzel',      family: "'Cinzel', Georgia, serif",                 weight: 600, style: 'normal', spacing: '0.12em', transform: 'uppercase' },
  { label: 'Hand written',  fontKey: 'caveat',      family: "'Caveat', 'Brush Script MT', cursive",     weight: 600, style: 'normal', spacing: '0.01em', transform: 'none' },
];

const FALLBACK_PHRASES = [
  'Happy Birthday',
  'Happy Mother’s Day',
  'Happy Father’s Day',
  'Congratulations',
  'Thinking of You',
  'With Love',
];

function isValidEmail(v) { return /\S+@\S+\.\S+/.test(String(v || '').trim()); }
function isValidPhone(v) { return /\d{7,}/.test(String(v || '').replace(/\D/g, '')); }

export default function Personalize() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { product, loading } = useProduct(productId);

  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [phrase, setPhrase] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('#F4D03F');
  const [fontIdx, setFontIdx] = useState(0);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(1);  // 1 = Personalize, 2 = Checkout
  const [showColorPicker, setShowColorPicker] = useState(false);

  const goToCheckout = useCallback(() => {
    setError('');
    const toTrim = to.trim();
    const fromTrim = from.trim();
    if (!toTrim || !fromTrim) {
      setError('Please fill in To and From before continuing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentScreen(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [to, from]);

  const goBackToPersonalize = useCallback(() => {
    setError('');
    setCurrentScreen(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Category-driven phrase list
  const phraseOptions = useMemo(() => {
    const slug = product?.category;
    const occasion = slug ? OCCASIONS[slug] : null;
    return occasion?.sloganPresets?.length ? occasion.sloganPresets : FALLBACK_PHRASES;
  }, [product?.category]);

  // Auto-fill message when a phrase is picked (only if message is empty)
  const handlePhraseChange = useCallback((value) => {
    setPhrase(value);
    if (value && value !== 'Pick a phrase' && !message.trim()) {
      setMessage(value);
    }
  }, [message]);

  const priceCents = useMemo(() => {
    const p = parseFloat(product?.price || 1);
    return Math.round(p * 100);
  }, [product?.price]);

  const handlePay = useCallback(async () => {
    setError('');
    const toTrim = to.trim();
    const fromTrim = from.trim();
    if (!toTrim || !fromTrim) {
      setError('To and From are required.');
      return;
    }
    if (!product) {
      setError('Pick a bloom first — visit /shop to choose one, then return.');
      return;
    }
    if (!receiver.trim() || (!isValidEmail(receiver) && !isValidPhone(receiver))) {
      setError("Receiver needs a valid phone or email so we can deliver the bloom.");
      return;
    }

    const selectedFont = FONT_CHOICES[fontIdx];

    const composition = buildCartComposition({
      message: { short: message.trim() || phrase, toName: toTrim, fromName: fromTrim },
      colorTheme: 'custom',
      primaryColor: color,
      accentColor: color,
      extras: {},
      selectedSound: null,
      engravingStyle: 'classic',
      fontChoice: selectedFont.fontKey,
      messageTextColor: color,
      messageBold: true,
      messageTextSize: 'medium',
      messageOffset: { x: 0, y: 0 },
      frameStyle: 'none',
      locale: lang,
    });

    const customization = {
      productId: product.id,
      message: { short: message.trim() || phrase, toName: toTrim, fromName: fromTrim },
      colorTheme: 'custom',
      primaryColor: color,
      accentColor: color,
      fontChoice: selectedFont.fontKey,
      messageTextColor: color,
      messageBold: true,
      composition,
      locale: lang,
    };

    addToCart(product, 1, customization);

    setIsProcessing(true);
    const formattedItems = [{ product: { ...product, quantity: 1, customization }, quantity: 1 }];
    const trimmedSender = sender.trim();
    const recipientEmail = isValidEmail(receiver) ? receiver.trim()
                          : (isValidEmail(trimmedSender) ? trimmedSender : '');
    const recipientPhone = isValidPhone(receiver) ? receiver.trim().replace(/\D/g, '') : '';
    const customerInfo = trimmedSender
      ? {
          email: isValidEmail(trimmedSender) ? trimmedSender : '',
          delivery: {
            target: 'recipient',
            recipientEmail,
            recipientPhone,
            deliveryChannel: recipientPhone ? 'phone' : 'email',
            purchaserEmail: isValidEmail(trimmedSender) ? trimmedSender : '',
            deliveryMode: 'now',
            deliveryDate: '',
            buyerTimezone: typeof Intl !== 'undefined'
              ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '')
              : '',
          },
        }
      : {};

    try {
      const result = await createCartCheckoutSession(formattedItems, null, customerInfo);
      if (!result?.url) throw new Error('No checkout URL');
      await redirectToCheckout(result.url);
    } catch (err) {
      console.error('Stripe checkout error:', err);
      if (typeof window !== 'undefined') {
        startCartCheckoutRedirect(formattedItems, null, customerInfo);
      } else {
        setIsProcessing(false);
        setError('Could not start checkout. Please try again.');
      }
    }
  }, [to, from, receiver, sender, product, fontIdx, color, message, phrase, lang, addToCart]);

  // Demo banner if there's no product loaded
  const isDemoMode = !productId || (!loading && !product);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: NAVY,
      color: TEXT,
      fontFamily: "'Outfit', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ─── TOP 40vh — whole bloom scaled to fit, never scrolls ─── */}
      <div style={{
        height: '40vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: NAVY_DEEP,
        borderBottom: `1px solid ${GOLD_DIM}`,
        position: 'relative',
        padding: '0.5rem',
      }}>
        {product ? (
          <div style={{
            height: '100%',
            aspectRatio: '9 / 16',
            maxWidth: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            border: `1px solid ${GOLD_DIM}`,
            background: '#000',
            boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
          }}>
            <LivePreview
              product={product}
              colorTheme="custom"
              primaryColor={color}
              accentColor={color}
              extras={{}}
              message={{ short: message.trim() || phrase, toName: to, fromName: from }}
              engravingStyle="classic"
              fontChoice={FONT_CHOICES[fontIdx].fontKey}
              messageTextColor={color}
              messageBold={true}
              messageTextSize="md"
              frameStyle="none"
              occasion={product.category}
            />
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: TEXT_MUTED,
            fontSize: '0.85rem',
            lineHeight: 1.6,
            padding: '1rem',
          }}>
            {loading ? 'Loading bloom…' : (
              <>
                Static demo mode — no product loaded.<br/>
                Visit <code>/personalize/&lt;product-id&gt;</code> from any bloom in <Link to="/shop" style={{ color: GOLD }}>/shop</Link>.
              </>
            )}
          </div>
        )}

        {/* Step indicator */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.7rem',
          padding: '0.25rem 0.55rem',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          background: 'rgba(13,27,54,0.85)',
          color: GOLD,
          borderRadius: '999px',
          border: `1px solid ${GOLD_DIM}`,
        }}>
          STEP {currentScreen} / 2
        </div>
      </div>

      {/* ─── BOTTOM 60vh — scrollable form area ─── */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '1rem',
      }}>
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        {!isDemoMode && product && (
          <div style={{
            fontSize: '0.72rem',
            color: TEXT_MUTED,
            textAlign: 'center',
            marginBottom: '0.9rem',
          }}>
            {loading ? 'Loading bloom…' : `Personalizing: ${product.title || product.name || 'Bloom'}`}
          </div>
        )}

      {/* ─── Screen 1 — Personalize Bloom ─── */}
      {currentScreen === 1 && (
      <>
      <Card screenLabel="SCREEN 1 OF 2" title="Personalize Bloom">
        <Field label="To"><Input value={to} onChange={setTo} placeholder="Recipient name" /></Field>
        <Field label="From"><Input value={from} onChange={setFrom} placeholder="Your name" /></Field>

        <div style={{ marginTop: '0.4rem' }}>
          <Select
            value={phrase}
            onChange={handlePhraseChange}
            options={['Pick a phrase', ...phraseOptions]}
          />
          <Helper>Phrases adapt to the selected category</Helper>
        </div>

        <Field label="Message" align="top">
          <Textarea value={message} onChange={setMessage} />
        </Field>

        <Section label="Message Font">
          <Select
            value={FONT_CHOICES[fontIdx].label}
            onChange={(v) => {
              const idx = FONT_CHOICES.findIndex((f) => f.label === v);
              if (idx >= 0) setFontIdx(idx);
            }}
            options={FONT_CHOICES.map((f) => f.label)}
          />
          {/* Live preview of the chosen font on a sample word */}
          <div style={{
            marginTop: '0.55rem',
            padding: '0.6rem 0.9rem',
            border: `1px solid ${NAVY_LINE}`,
            borderRadius: '8px',
            textAlign: 'center',
            background: NAVY_DEEP,
            fontFamily: FONT_CHOICES[fontIdx].family,
            fontWeight: FONT_CHOICES[fontIdx].weight,
            fontStyle: FONT_CHOICES[fontIdx].style,
            letterSpacing: FONT_CHOICES[fontIdx].spacing,
            textTransform: FONT_CHOICES[fontIdx].transform,
            color: color,
            fontSize: '1.1rem',
          }}>
            Sample
          </div>
        </Section>

        <Section label="Message Color">
          <button
            type="button"
            onClick={() => setShowColorPicker(v => !v)}
            aria-expanded={showColorPicker}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              background: 'transparent',
              color: TEXT,
              border: `1px solid ${GOLD_DIM}`,
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.7rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{
                width: '1.4rem',
                height: '1.4rem',
                borderRadius: '50%',
                background: color,
                border: `1px solid ${NAVY_LINE}`,
                flexShrink: 0,
              }} />
              <span>{showColorPicker ? 'Tap a swatch to choose' : 'Tap to change color'}</span>
            </span>
            <span style={{ color: GOLD, fontSize: '1.1rem', lineHeight: 1 }}>
              {showColorPicker ? '▲' : '▼'}
            </span>
          </button>

          {showColorPicker && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.7rem',
              background: NAVY_DEEP,
              border: `1px solid ${NAVY_LINE}`,
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '0.45rem',
            }}>
              {COLOR_SWATCHES.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setColor(c); setShowColorPicker(false); }}
                  aria-label={`Color ${c}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? `2px solid ${GOLD}` : `1px solid ${NAVY_LINE}`,
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: color === c ? `0 0 0 2px rgba(212,175,55,0.25)` : 'none',
                  }}
                />
              ))}
            </div>
          )}

          <div style={{
            marginTop: '0.7rem',
            padding: '0.6rem 0.85rem',
            background: NAVY_DEEP,
            border: `1px solid ${NAVY_LINE}`,
            borderRadius: '8px',
            fontSize: '0.78rem',
            lineHeight: 1.4,
          }}>
            <strong style={{ color: GOLD }}>Text Weight:</strong> Bold &amp; Medium only{' '}
            <span style={{ color: TEXT_MUTED }}>(automatic)</span>
          </div>
        </Section>
      </Card>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.7rem 0.9rem',
          background: 'rgba(184, 60, 60, 0.18)',
          border: '1px solid rgba(184, 60, 60, 0.7)',
          borderRadius: '8px',
          color: '#FFC8C8',
          fontSize: '0.85rem',
        }}>{error}</div>
      )}

      <button
        type="button"
        onClick={goToCheckout}
        disabled={isDemoMode}
        style={{
          display: 'block',
          width: '100%',
          margin: '1.4rem 0 0.4rem',
          padding: '1.05rem',
          background: isDemoMode ? 'rgba(212,175,55,0.4)' : GOLD,
          color: NAVY_DEEP,
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.05rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: isDemoMode ? 'not-allowed' : 'pointer',
          boxShadow: '0 6px 18px rgba(212,175,55,0.22)',
        }}
      >
        CONTINUE TO CHECKOUT →
      </button>
      </>
      )}

      {/* ─── Screen 2 — Checkout ─── */}
      {currentScreen === 2 && (
      <div>
        <button
          type="button"
          onClick={goBackToPersonalize}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            margin: '0 0 1rem',
            padding: '0.45rem 0.9rem',
            background: 'transparent',
            color: GOLD,
            border: `1px solid ${GOLD_DIM}`,
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          ← Back to Personalize
        </button>
        <Card screenLabel="SCREEN 2 OF 2" title="Checkout">
          <div style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            fontStyle: 'italic',
            color: TEXT_MUTED,
            padding: '0.4rem 0 1rem',
            borderBottom: `1px dashed ${NAVY_LINE}`,
            marginBottom: '1.2rem',
          }}>
            After clicking Checkout, everything else is one window.
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            margin: '0.6rem 0 1.3rem',
          }}>
            <span style={{ fontSize: '0.85rem' }}>Price</span>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              color: GOLD,
            }}>${(priceCents / 100).toFixed(2)}</span>
          </div>

          <Field label="Sender">
            <Input value={sender} onChange={setSender} placeholder="Phone or Email" />
            <SmallHelper>Phone or Email</SmallHelper>
          </Field>

          <Field label="Receiver">
            <Input value={receiver} onChange={setReceiver} placeholder="Phone or Email" />
            <SmallHelper>Phone or Email</SmallHelper>
          </Field>

          <div style={{
            marginTop: '1.4rem',
            padding: '0.9rem',
            background: NAVY_DEEP,
            border: `1px dashed ${GOLD_DIM}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: GOLD,
                marginBottom: '0.3rem',
              }}>BLOOM CREDITS</div>
              <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, lineHeight: 1.4 }}>
                Buy credits in bulk and save on every future bloom. Send more for less.
              </div>
            </div>
            <Link to="/credits" style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              background: 'transparent',
              color: GOLD,
              border: `1px solid ${GOLD}`,
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}>BUY CREDITS</Link>
          </div>

          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.7rem 0.9rem',
              background: 'rgba(184, 60, 60, 0.18)',
              border: '1px solid rgba(184, 60, 60, 0.7)',
              borderRadius: '8px',
              color: '#FFC8C8',
              fontSize: '0.85rem',
            }}>{error}</div>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing || isDemoMode}
            style={{
              display: 'block',
              width: '100%',
              margin: '1.6rem 0 0.4rem',
              padding: '1.05rem',
              background: isProcessing || isDemoMode ? 'rgba(212,175,55,0.4)' : GOLD,
              color: NAVY_DEEP,
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              cursor: isProcessing || isDemoMode ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(212,175,55,0.22)',
            }}
          >
            {isProcessing
              ? 'PROCESSING…'
              : isDemoMode
                ? 'PAY  (demo — pick a bloom first)'
                : `PAY  $${(priceCents / 100).toFixed(2)}`}
          </button>
        </Card>
      </div>
      )}

      <div style={{
        marginTop: '2.5rem',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: TEXT_MUTED,
        lineHeight: 1.6,
      }}>
        Approved layout 2026-05-17 (Ak + Gamble). Wired to real cart + Stripe.
      </div>
        </div>{/* /maxWidth wrapper */}
      </div>{/* /BOTTOM scrollable area */}
    </div>
  );
}

// ─── Shared subcomponents (mirror V3Preview for visual parity) ─────

function Card({ screenLabel, title, children }) {
  return (
    <div style={{
      background: NAVY_DEEP,
      border: `1px solid ${GOLD_DIM}`,
      borderRadius: '14px',
      padding: '1.2rem 1.1rem 1.4rem',
    }}>
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: '0.18em',
        color: GOLD,
        textAlign: 'center',
        marginBottom: '0.7rem',
        fontWeight: 700,
      }}>{screenLabel}</div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.2rem',
      }}>
        <div style={{
          padding: '0.7rem 1.8rem',
          border: `1px solid ${GOLD}`,
          borderRadius: '999px',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: TEXT,
        }}>{title}</div>
      </div>

      {children}
    </div>
  );
}

function Field({ label, align = 'center', children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '72px 1fr',
      alignItems: align === 'top' ? 'start' : 'center',
      gap: '0.7rem',
      marginBottom: '0.85rem',
    }}>
      <div style={{
        fontSize: '0.9rem',
        fontWeight: 600,
        color: TEXT,
        paddingTop: align === 'top' ? '0.7rem' : 0,
      }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginTop: '1.2rem' }}>
      <div style={{
        fontSize: '0.92rem',
        fontWeight: 700,
        color: TEXT,
        marginBottom: '0.45rem',
      }}>{label}</div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.7rem 0.9rem',
        background: 'transparent',
        color: TEXT,
        border: `1px solid ${GOLD_DIM}`,
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Textarea({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      style={{
        width: '100%',
        padding: '0.7rem 0.9rem',
        background: 'transparent',
        color: TEXT,
        border: `1px solid ${GOLD_DIM}`,
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '0.7rem 0.9rem',
        background: 'transparent',
        color: TEXT,
        border: `1px solid ${GOLD_DIM}`,
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.9rem center',
        paddingRight: '2.2rem',
        boxSizing: 'border-box',
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: NAVY_DEEP, color: TEXT }}>{opt}</option>
      ))}
    </select>
  );
}

function Helper({ children }) {
  return (
    <div style={{
      fontSize: '0.72rem',
      color: TEXT_MUTED,
      fontStyle: 'italic',
      marginTop: '0.4rem',
    }}>{children}</div>
  );
}

function SmallHelper({ children }) {
  return (
    <div style={{
      fontSize: '0.72rem',
      color: TEXT_MUTED,
      marginTop: '0.3rem',
      paddingLeft: '0.2rem',
    }}>{children}</div>
  );
}
