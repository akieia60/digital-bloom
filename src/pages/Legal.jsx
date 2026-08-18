import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LEGAL_DOCS,
  LEGAL_ENTITY,
  BRAND,
  LAST_UPDATED,
  CONTACT_EMAIL,
} from '../data/legal';

/**
 * Legal — renders Terms, Privacy, or Refunds from src/data/legal.js.
 *
 * One component, three routes. Twilio's carrier review and Google Ads
 * advertiser approval both want these reachable at stable, obvious URLs,
 * so /terms, /privacy and /refunds are hardcoded rather than nested.
 */
export default function Legal({ doc }) {
  const content = LEGAL_DOCS[doc];

  useEffect(() => {
    if (content) document.title = `${content.title} · ${BRAND}`;
  }, [content]);

  if (!content) return null;

  return (
    <div style={styles.page}>
      <div style={styles.sheet}>
        <Link to="/" style={styles.back}>← Digital Bloom</Link>

        <h1 style={styles.title}>{content.title}</h1>
        <p style={styles.updated}>Last updated {LAST_UPDATED}</p>
        <p style={styles.intro}>{content.intro}</p>

        {content.sections.map((section) => (
          <section key={section.heading} style={styles.section}>
            <h2 style={styles.heading}>{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} style={styles.paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <nav style={styles.nav}>
          {Object.values(LEGAL_DOCS)
            .filter((d) => d.slug !== content.slug)
            .map((d) => (
              <Link key={d.slug} to={`/${d.slug}`} style={styles.navLink}>
                {d.title}
              </Link>
            ))}
          <a href={`mailto:${CONTACT_EMAIL}`} style={styles.navLink}>Contact us</a>
        </nav>

        <p style={styles.entity}>© {new Date().getFullYear()} {LEGAL_ENTITY}. All rights reserved.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0D1B36',
    color: '#E8EDF7',
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '48px 20px 80px',
  },
  sheet: { maxWidth: '720px', margin: '0 auto' },
  back: {
    color: '#D4AF37',
    textDecoration: 'none',
    fontSize: '0.9rem',
    letterSpacing: '0.04em',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(1.9rem, 5vw, 2.6rem)',
    color: '#FFFFFF',
    margin: '28px 0 6px',
  },
  updated: {
    color: '#8F9DBA',
    fontSize: '0.85rem',
    margin: '0 0 24px',
  },
  intro: {
    fontSize: '1.02rem',
    lineHeight: 1.7,
    color: '#C9D2E4',
    borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
    paddingLeft: '16px',
    margin: '0 0 40px',
  },
  section: { marginBottom: '32px' },
  heading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    color: '#D4AF37',
    margin: '0 0 10px',
  },
  paragraph: {
    fontSize: '0.98rem',
    lineHeight: 1.75,
    margin: '0 0 12px',
    color: '#D8DFEE',
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    paddingTop: '24px',
    marginTop: '48px',
  },
  navLink: { color: '#D4AF37', textDecoration: 'none', fontSize: '0.92rem' },
  entity: { color: '#66748F', fontSize: '0.8rem', marginTop: '24px' },
};
