import { useState } from 'react';
import { Link } from 'react-router-dom';

const SHARE_URL = 'https://digitalbloom.store';

const VARIANTS = [
  {
    id: 'family',
    label: 'Family',
    description: 'Aunties, cousins, group chats — people who already love you.',
    message: `Hey 🌸 I built this — my app, Digital Bloom. You can send anyone a beautiful flower video for $1. It's Mother's Day, so I'd really love your support. Try it → ${SHARE_URL}`,
  },
  {
    id: 'friend',
    label: 'Friend',
    description: 'For "look what I made" — friends, neighbors, social circles.',
    message: `I made an app — Digital Bloom 🌸. Cinematic flower videos you text to your people instead of a card or GIF, $1 each. Mother's Day, birthdays, all of it. Would love your support → ${SHARE_URL}`,
  },
  {
    id: 'work',
    label: 'Work / Acquaintance',
    description: 'Co-workers, professional contacts — clean, no "support me" tone.',
    message: `Quick share — I built Digital Bloom 🌸. Send anyone a video bouquet for $1, way more memorable than texting "happy birthday." Mother's Day, birthdays, all in there → ${SHARE_URL}`,
  },
];

const COLORS = {
  bg: '#050510',
  navy: '#0D1B36',
  gold: '#D4AF37',
  white: '#F5F5F7',
  muted: 'rgba(245, 245, 247, 0.55)',
  cardBorder: 'rgba(212, 175, 55, 0.22)',
  cardBg: 'rgba(212, 175, 55, 0.04)',
};

function buildSmsHref(message) {
  return `sms:&body=${encodeURIComponent(message)}`;
}

function buildMailtoHref(message) {
  const subject = encodeURIComponent('Something I built — Digital Bloom 🌸');
  return `mailto:?subject=${subject}&body=${encodeURIComponent(message)}`;
}

export default function Share() {
  const [copiedId, setCopiedId] = useState(null);

  async function handleCopy(variant) {
    try {
      await navigator.clipboard.writeText(variant.message);
      setCopiedId(variant.id);
      setTimeout(() => setCopiedId((current) => (current === variant.id ? null : current)), 2000);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = variant.message;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      document.body.removeChild(fallback);
      setCopiedId(variant.id);
      setTimeout(() => setCopiedId((current) => (current === variant.id ? null : current)), 2000);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 32px)',
        fontFamily: "'Outfit', sans-serif",
        color: COLORS.white,
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              marginBottom: '12px',
            }}
          >
            🌸 Share Digital Bloom
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              fontWeight: 600,
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            One tap to tell people what this is.
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              fontWeight: 300,
              color: COLORS.muted,
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Pick the message that matches the person, then tap Send. Opens
            your Messages app pre-filled — they get an invite to the site,
            not a bloom (so they know it's a heads-up, not a gift).
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {VARIANTS.map((variant) => (
            <article
              key={variant.id}
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 28px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: COLORS.white,
                  }}
                >
                  {variant.label}
                </h2>
                <span
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: COLORS.gold,
                  }}
                >
                  {variant.message.length} chars
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: COLORS.muted,
                  marginBottom: '16px',
                  lineHeight: 1.5,
                }}
              >
                {variant.description}
              </p>

              <div
                style={{
                  background: 'rgba(13, 27, 54, 0.6)',
                  border: '1px solid rgba(245, 245, 247, 0.06)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '16px',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: COLORS.white,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {variant.message}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                }}
              >
                <a
                  href={buildSmsHref(variant.message)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: COLORS.gold,
                    color: COLORS.navy,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '999px',
                  }}
                >
                  📱 Send Text
                </a>
                <a
                  href={buildMailtoHref(variant.message)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: 'transparent',
                    color: COLORS.gold,
                    border: `1.5px solid ${COLORS.gold}`,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '999px',
                  }}
                >
                  ✉️ Send Email
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(variant)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: 'transparent',
                    color: copiedId === variant.id ? COLORS.gold : COLORS.muted,
                    border: `1.5px solid ${copiedId === variant.id ? COLORS.gold : 'rgba(245, 245, 247, 0.2)'}`,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copiedId === variant.id ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '20px',
            border: `1px dashed ${COLORS.cardBorder}`,
            borderRadius: '16px',
            color: COLORS.muted,
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: COLORS.gold, letterSpacing: '0.08em' }}>
            Pro tip
          </strong>{' '}
          — Bookmark this page on your home screen (Safari → Share → Add to
          Home Screen) so it's one tap away whenever someone asks "what's
          this Digital Bloom thing?"
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              border: `1.5px solid rgba(212, 175, 55, 0.4)`,
              borderRadius: '999px',
              color: COLORS.gold,
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ← Back to Digital Bloom
          </Link>
        </div>
      </div>
    </div>
  );
}
