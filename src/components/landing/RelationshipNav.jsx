import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProducts } from '../../hooks/useProducts';

// Relationship-first nav row — Hallmark/Shoebox model.
// Ak directive 2026-05-17: 'For Mom / For Dad / For Sister / For Friend...
// the Hallmark aisle.' Buyers walk in with a person in mind, not a feeling.
// Each tile shows a REAL bloom video preview (not generic emojis) pulled
// from the mapped category, so the homepage demonstrates the actual product
// the moment you land.
//
// Mapping: each relationship deep-links into /shop/<categorySlug> so the
// existing Shop page handles the filter. Preview video = first live product
// in that category.

const RELATIONSHIPS = [
  { label: 'For Mom',                  categorySlug: 'mothers-day',  tagline: "Say what she means to you." },
  { label: 'For Dad',                  categorySlug: 'fathers-day',  tagline: "Hero. Lighthouse. Yours." },
  { label: 'For Sister',               categorySlug: 'birthday',     tagline: "The one who always gets it." },
  { label: 'For Friend',               categorySlug: 'friendship',   tagline: "Same great you, every day." },
  { label: 'Going Through a Hard Time', categorySlug: 'sympathy',    tagline: "You never handle it alone." },
  { label: 'On Their Wedding',         categorySlug: 'wedding',      tagline: "Today and forever." },
  { label: 'New Baby',                 categorySlug: 'celebration',  tagline: "A new bloom in the family." },
  { label: "When Words Aren't Enough", categorySlug: 'encouragement', tagline: "Send what you couldn't quite say." },
];

export default function RelationshipNav() {
  const { t } = useLanguage();
  const { products } = useProducts();

  // Map each relationship to its first available video in the target category.
  // If no product yet in that slug, the tile gracefully falls back to a poster
  // image or the next-best category video.
  const tiles = useMemo(() => {
    const firstVideoBySlug = {};
    const firstPosterBySlug = {};
    for (const p of products) {
      if (p.video_url && !firstVideoBySlug[p.category]) firstVideoBySlug[p.category] = p.video_url;
      if (p.thumbnail_url && !firstPosterBySlug[p.category]) firstPosterBySlug[p.category] = p.thumbnail_url;
    }
    return RELATIONSHIPS.map((rel) => ({
      ...rel,
      previewVideo: firstVideoBySlug[rel.categorySlug] || null,
      previewPoster: firstPosterBySlug[rel.categorySlug] || null,
    }));
  }, [products]);

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
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
        }}>
          {tiles.map((rel) => (
            <Link
              key={rel.categorySlug}
              to={`/shop/${rel.categorySlug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '14px',
                color: '#FFFFFF',
                textDecoration: 'none',
                overflow: 'hidden',
                transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Real bloom video preview — silent autoplay loop */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '9 / 16',
                background: '#000',
                overflow: 'hidden',
              }}>
                {rel.previewVideo ? (
                  <video
                    src={rel.previewVideo}
                    poster={rel.previewPoster || undefined}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a2c4d 0%, #0d1b36 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(212,175,55,0.45)',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    padding: '1rem',
                  }}>
                    Coming soon
                  </div>
                )}
                {/* Subtle gold corner glint */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(13,27,54,0.85) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Label + tagline */}
              <div style={{ padding: '0.85rem 0.9rem 1rem' }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  marginBottom: '0.3rem',
                  letterSpacing: '0.01em',
                }}>
                  {rel.label}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.55)',
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                }}>
                  {rel.tagline}
                </div>
              </div>
            </Link>
          ))}
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
