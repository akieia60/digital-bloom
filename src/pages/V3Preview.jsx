import { useState } from 'react';

// CustomizerV3 + CheckoutV3 — faithful render of Gamble's 2026-05-15 hand sketches.
// Static prototype at /v3-preview for Ak's tap-to-approve review. Cart/Stripe wiring
// happens in a follow-up session once the layout is blessed. No data dependencies.

const NAVY = '#0D1B36';
const NAVY_DEEP = '#0A1428';
const NAVY_LINE = '#1B2D52';
const GOLD = '#D4AF37';
const GOLD_DIM = 'rgba(212, 175, 55, 0.7)';
const TEXT = '#FFFFFF';
const TEXT_MUTED = 'rgba(255, 255, 255, 0.55)';

// 36 color swatches — matches the wireframe grid (9 cols x 4 rows)
const COLOR_SWATCHES = [
  '#F4D03F', '#F5EFE0', '#FFFFFF', '#F5C088', '#E68A4A', '#E8B098', '#B83C3C', '#7C1E1E', '#5B0F0F',
  '#0F0F0F', '#7B8FE6', '#1F5AE0', '#8FB9E2', '#3B6B5C', '#0C7F4F', '#1B3D2A', '#5C7A2A', '#3B5C1F',
  '#C75A1A', '#7C4F2E', '#7C1E1E', '#9C8E5E', '#C9B070', '#D9CFAE', '#A8A8A8', '#5C6B6E', '#3B4E50',
  '#C7A6E6', '#9C2BE8', '#5B1B7C', '#C9A45A', '#3B3B3B', '#1F1F1F', '#0F0F0F', '#000000', '#0F0F0F',
];

const PHRASE_OPTIONS = [
  'Happy Birthday',
  'Happy Mother’s Day',
  'Happy Father’s Day',
  'Congratulations',
  'Thinking of You',
  'With Love',
  'Just Because',
  'Same Great You',
];

const FONT_OPTIONS = ['Bold Sans', 'Luxury Italic', 'Engraved', 'Hand written'];

const STYLE_PREVIEWS = {
  'Bold Sans':     { fontFamily: "'Outfit', -apple-system, sans-serif", fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.02em' },
  'Luxury Italic': { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: 'italic', letterSpacing: '0.04em' },
  'Engraved':      { fontFamily: "'Cinzel', Georgia, serif", fontWeight: 600, fontStyle: 'normal', letterSpacing: '0.12em', textTransform: 'uppercase' },
  'Hand written':  { fontFamily: "'Caveat', 'Brush Script MT', cursive", fontWeight: 600, fontStyle: 'normal', letterSpacing: '0.01em' },
};

export default function V3Preview() {
  // Shared state across both screens
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [phrase, setPhrase] = useState('Pick a phrase');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('#F4D03F');
  const [font, setFont] = useState('Bold Sans');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      background: NAVY,
      color: TEXT,
      fontFamily: "'Outfit', -apple-system, sans-serif",
      padding: '1.5rem 1rem 4rem',
      maxWidth: '460px',
      margin: '0 auto',
    }}>
      {/* Caption — explains this is the wireframe render */}
      <div style={{
        fontSize: '0.75rem',
        color: TEXT_MUTED,
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: '1.25rem',
      }}>
        Faithful render of Gamble&rsquo;s two hand sketches sent 2026-05-15.<br/>
        Brand styling navy + gold. Field layout, labels, and order match the original.
      </div>

      {/* ─── SCREEN 1 OF 2 — Personalize Bloom ─── */}
      <Card screenLabel="SCREEN 1 OF 2" title="Personalize Bloom">
        <Field label="To">
          <Input value={to} onChange={setTo} placeholder="" />
        </Field>

        <Field label="From">
          <Input value={from} onChange={setFrom} placeholder="" />
        </Field>

        {/* Pick a phrase dropdown */}
        <div style={{ marginTop: '0.4rem' }}>
          <Select
            value={phrase}
            onChange={setPhrase}
            options={['Pick a phrase', ...PHRASE_OPTIONS]}
          />
          <Helper>Phrases adapt to the selected category</Helper>
        </div>

        <Field label="Message" align="top">
          <Textarea value={message} onChange={setMessage} />
        </Field>

        {/* Message Color — 36 swatches in a 9-col grid */}
        <Section label="Message Color">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)',
            gap: '0.45rem',
            marginTop: '0.5rem',
          }}>
            {COLOR_SWATCHES.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setColor(c)}
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

          <div style={{
            marginTop: '0.9rem',
            padding: '0.7rem 0.9rem',
            background: NAVY_DEEP,
            border: `1px solid ${NAVY_LINE}`,
            borderRadius: '8px',
            fontSize: '0.82rem',
            lineHeight: 1.4,
          }}>
            <strong style={{ color: GOLD }}>Text Weight:</strong> Bold &amp; Medium only{' '}
            <span style={{ color: TEXT_MUTED }}>(automatic)</span>
          </div>
        </Section>

        <Section label="Message Font">
          <Select value={font} onChange={setFont} options={FONT_OPTIONS} />

          <div style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: TEXT_MUTED,
            letterSpacing: '0.18em',
            margin: '1rem 0 0.5rem',
          }}>
            CHOOSE ANY STYLE
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
          }}>
            {FONT_OPTIONS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFont(f)}
                style={{
                  padding: '0.85rem 0.5rem',
                  background: 'transparent',
                  color: font === f ? GOLD : TEXT,
                  border: `1px solid ${font === f ? GOLD : GOLD_DIM}`,
                  borderRadius: '6px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  ...STYLE_PREVIEWS[f],
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </Section>
      </Card>

      {/* ─── SCREEN 2 OF 2 — Checkout ─── */}
      <div style={{ marginTop: '2rem' }}>
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
            }}>$1.00</span>
          </div>

          <Field label="Sender">
            <Input value={sender} onChange={setSender} placeholder="" />
            <SmallHelper>Phone or Email</SmallHelper>
          </Field>

          <Field label="Receiver">
            <Input value={receiver} onChange={setReceiver} placeholder="" />
            <SmallHelper>Phone or Email</SmallHelper>
          </Field>

          {/* Bloom Credits banner */}
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
            <button type="button" style={{
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
            }}>BUY CREDITS</button>
          </div>

          {/* Pay button */}
          <button type="button" style={{
            display: 'block',
            width: '100%',
            margin: '1.6rem 0 0.4rem',
            padding: '1.05rem',
            background: GOLD,
            color: NAVY_DEEP,
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.05rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(212,175,55,0.22)',
          }}>
            PAY&nbsp;&nbsp;$1
          </button>
        </Card>
      </div>

      <div style={{
        marginTop: '2.5rem',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: TEXT_MUTED,
        lineHeight: 1.6,
      }}>
        Static prototype at /v3-preview. Cart and Stripe wiring is the next step
        once Ak + Gamble bless the layout.
      </div>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────

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
      gridTemplateColumns: '64px 1fr',
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
