import { Link, useLocation } from 'react-router-dom';

const COMING_SOON_PATHS = ['/about', '/contact', '/checkout'];

const PAGE_INFO = {
  '/about': {
    title: 'About Digital Bloom',
    description: 'Our story is unfolding. We\'re crafting something beautiful — check back soon.',
  },
  '/contact': {
    title: 'Get in Touch',
    description: 'Our contact page is on its way. In the meantime, reach us at hello@digitalbloom.com.',
  },
  '/checkout': {
    title: 'Checkout',
    description: 'Our checkout experience is being refined. Browse our shop while you wait.',
  },
};

const DEFAULT_COMING_SOON = {
  title: 'Coming Soon',
  description: 'This page is being crafted with care. Check back soon.',
};

const NOT_FOUND_INFO = {
  title: 'Page Not Found',
  description: 'The page you\'re looking for doesn\'t exist. Let\'s get you back to something beautiful.',
};

export default function ComingSoon() {
  const location = useLocation();
  const isKnownPath = COMING_SOON_PATHS.includes(location.pathname) || location.pathname in PAGE_INFO;
  const info = PAGE_INFO[location.pathname] || (isKnownPath ? DEFAULT_COMING_SOON : NOT_FOUND_INFO);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050510',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        {/* Gold bloom icon */}
        <div style={{ marginBottom: '32px' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="28" r="6" stroke="#D4AF37" strokeWidth="1.5" />
            <path
              d="M32 22C30 18 26 16 26 16C26 16 22 18 22 22C22 26 26 28 32 28"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M32 22C34 18 38 16 38 16C38 16 42 18 42 22C42 26 38 28 32 28"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M32 34V48" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 600,
            color: '#F5F5F7',
            letterSpacing: '0.05em',
            marginBottom: '16px',
          }}
        >
          {info.title}
        </h1>

        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1rem',
            fontWeight: 300,
            color: 'rgba(245, 245, 247, 0.5)',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}
        >
          {info.description}
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: 'transparent',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '50px',
            color: '#D4AF37',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
