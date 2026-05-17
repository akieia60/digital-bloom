import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// Relationship-first nav row — Hallmark/Shoebox model.
// Ak directive 2026-05-17: 'For Mom / For Dad / For Sister / For Friend...
// the Hallmark aisle.' Buyers walk in with a person in mind, not a feeling.
// Each tile deep-links into /shop?relationship=<slug> so the existing Shop
// page can filter by relationship using its sentiment metadata.
//
// This sits ABOVE the occasion-first CategoryGrid; both are kept so the
// transition is additive (Gamble greenlit 2026-05-17 via Wispr Flow).

const RELATIONSHIPS = [
  { slug: 'mom',        label: 'For Mom',     emoji: '💐', taglineKey: 'rel_mom_tagline',     fallback: 'Say what she means to you.' },
  { slug: 'dad',        label: 'For Dad',     emoji: '👑', taglineKey: 'rel_dad_tagline',     fallback: 'Hero. Lighthouse. Yours.' },
  { slug: 'sister',     label: 'For Sister',  emoji: '💗', taglineKey: 'rel_sister_tagline',  fallback: 'The one who always gets it.' },
  { slug: 'friend',     label: 'For Friend',  emoji: '🌟', taglineKey: 'rel_friend_tagline',  fallback: 'Same great you, every day.' },
  { slug: 'hard-time',  label: 'Going Through a Hard Time', emoji: '🤍', taglineKey: 'rel_hard_tagline', fallback: 'You never have to handle it alone.' },
  { slug: 'wedding',    label: 'On Their Wedding',  emoji: '💒', taglineKey: 'rel_wedding_tagline', fallback: 'Today and forever.' },
  { slug: 'new-baby',   label: 'New Baby',    emoji: '🍼', taglineKey: 'rel_baby_tagline',    fallback: 'A new bloom in the family.' },
  { slug: 'words',      label: "When Words Aren't Enough", emoji: '✨', taglineKey: 'rel_words_tagline', fallback: 'Send what you couldn\'t quite say.' },
];

export default function RelationshipNav() {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="relationship-nav-title"
      style={{
        background: 'linear-gradient(180deg, #0c1f3f 0%, #0a1a35 100%)',
        padding: '3rem 1rem 2.5rem',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '0.6rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#D4AF37',
          fontStyle: 'italic',
        }}>
          Shop by who they are
        </div>
        <h2
          id="relationship-nav-title"
          style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '0 0 0.4rem',
            lineHeight: 1.2,
          }}
        >
          Send what you couldn&rsquo;t quite say.
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.55)',
          fontSize: '0.95rem',
          maxWidth: '520px',
          margin: '0 auto 2.2rem',
          lineHeight: 1.5,
        }}>
          Pick who it&rsquo;s for &mdash; the right words come next.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.85rem',
        }}>
          {RELATIONSHIPS.map((rel) => {
            const tagline = t(rel.taglineKey);
            const taglineFinal = (tagline && tagline !== rel.taglineKey) ? tagline : rel.fallback;
            return (
              <Link
                key={rel.slug}
                to={`/shop?relationship=${rel.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1.3rem 0.8rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'transform 0.18s, border-color 0.18s, background 0.18s',
                  minHeight: '140px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '0.45rem', lineHeight: 1 }}>
                  {rel.emoji}
                </span>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '0.3rem',
                }}>
                  {rel.label}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.55)',
                  fontStyle: 'italic',
                  lineHeight: 1.35,
                }}>
                  {taglineFinal}
                </span>
              </Link>
            );
          })}
        </div>

        <div style={{
          marginTop: '1.8rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          Or shop by occasion below &darr;
        </div>
      </div>
    </section>
  );
}
