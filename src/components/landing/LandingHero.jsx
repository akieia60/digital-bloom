import { Link } from 'react-router-dom';
import OCCASIONS from '../../data/occasions';

// Priority categories shown as quick-tap pills in the hero strip
const HERO_CATEGORIES = [
  'mothers-day',
  'birthday',
  'love',
  'anniversary',
  'celebration',
  'thank-you',
  'graduation',
  'fathers-day',
  'friendship',
  'encouragement',
  'grief',
  'baby',
  'milestones',
  'promotions',
  'luxury',
  'holidays',
];

export default function LandingHero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="landing-hero" style={{ backgroundColor: '#001f3f', paddingTop: '5rem' }}>
      <div className="landing-container">
        <div className="hero-content" style={{ paddingTop: '3rem' }}>

          {/* Eyebrow */}
          <p className="hero-eyebrow" style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            Luxury Digital Gifting
          </p>

          {/* Main tagline */}
          <h1 className="hero-headline">
            Give Them Their Flowers<br />While They&rsquo;re Here.
          </h1>

          <p className="hero-subheadline">
            Cinematic floral bloom experiences — customized with your message and delivered as a premium digital gift for every occasion.
          </p>

          {/* Primary CTAs */}
          <div className="hero-ctas">
            <Link to="/shop" className="cta-primary">
              Shop All Blooms
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="cta-secondary"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* ── Category pill strip — horizontal scroll, full-bleed ── */}
      <div className="hero-category-strip" style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: '2rem',
        paddingTop: '2.5rem',
        marginTop: '1rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          width: 'max-content',
        }}>
          {HERO_CATEGORIES.map((slug) => {
            const occasion = OCCASIONS[slug];
            if (!occasion) return null;
            return (
              <Link
                key={slug}
                to={`/shop/${slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: `1px solid ${occasion.accent}55`,
                  background: `${occasion.accent}12`,
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'border-color 0.2s, background 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = occasion.accent;
                  e.currentTarget.style.background = `${occasion.accent}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${occasion.accent}55`;
                  e.currentTarget.style.background = `${occasion.accent}12`;
                }}
              >
                <span style={{ fontSize: '15px' }}>{occasion.emoji}</span>
                <span>{occasion.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
