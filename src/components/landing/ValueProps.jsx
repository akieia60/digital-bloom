import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ValueProps() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  const values = [
    {
      title: "value_handpicked_title",
      description: "value_handpicked_desc",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="vp-icon">
          <circle cx="32" cy="32" r="30" stroke="url(#goldGrad1)" strokeWidth="1.5" opacity="0.4"/>
          <path d="M32 12C32 12 20 22 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 22 32 12 32 12Z" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 20C32 20 26 26 26 32C26 35.314 28.686 38 32 38C35.314 38 38 35.314 38 32C38 26 32 20 32 20Z" stroke="url(#goldGrad1)" strokeWidth="1" opacity="0.6"/>
          <line x1="32" y1="44" x2="32" y2="52" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeLinecap="round"/>
          <defs>
            <linearGradient id="goldGrad1" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#D4AF37"/>
              <stop offset="100%" stopColor="#F5E6A3"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "value_personal_title",
      description: "value_personal_desc",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="vp-icon">
          <circle cx="32" cy="32" r="30" stroke="url(#goldGrad2)" strokeWidth="1.5" opacity="0.4"/>
          <path d="M32 16L35 26H46L37 32L40 42L32 36L24 42L27 32L18 26H29L32 16Z" stroke="url(#goldGrad2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="6" stroke="url(#goldGrad2)" strokeWidth="1" opacity="0.5"/>
          <defs>
            <linearGradient id="goldGrad2" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#D4AF37"/>
              <stop offset="100%" stopColor="#F5E6A3"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "value_forever_title",
      description: "value_forever_desc",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="vp-icon">
          <circle cx="32" cy="32" r="30" stroke="url(#goldGrad3)" strokeWidth="1.5" opacity="0.4"/>
          <path d="M32 14C32 14 18 20 18 32C18 44 32 50 32 50C32 50 46 44 46 32C46 20 32 14 32 14Z" stroke="url(#goldGrad3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 22C32 22 24 26 24 32C24 38 32 42 32 42C32 42 40 38 40 32C40 26 32 22 32 22Z" stroke="url(#goldGrad3)" strokeWidth="1" opacity="0.5"/>
          <circle cx="32" cy="32" r="3" fill="url(#goldGrad3)" opacity="0.6"/>
          <defs>
            <linearGradient id="goldGrad3" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#D4AF37"/>
              <stop offset="100%" stopColor="#F5E6A3"/>
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  // Scroll-triggered fade-in animation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const cards = sectionRef.current?.querySelectorAll('.vp-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="dark-to-light-transition">
      <section className="vp-section" id="experience" ref={sectionRef}>
        {/* Subtle bloom pattern background */}
        <div className="vp-bg-pattern" />
        
        {/* Gold line divider at top */}
        <div className="vp-divider-top">
          <div className="vp-divider-line" />
          <div className="vp-divider-diamond" />
          <div className="vp-divider-line" />
        </div>

        {/* Section header */}
        <div className="vp-header">
          <span className="vp-eyebrow">{t('value_eyebrow')}</span>
          <h2 className="vp-headline">{t('value_headline')}</h2>
          <p className="vp-subtext">
            {t('value_body')}
          </p>
        </div>

        {/* Value cards */}
        <div className="vp-grid">
          {values.map((value, index) => (
            <div
              key={index}
              className={`vp-card ${visibleCards.has(String(index)) ? 'vp-card--visible' : ''}`}
              data-index={index}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="vp-card-inner">
                <div className="vp-card-icon-wrap">
                  {value.icon}
                </div>
                <div className="vp-card-gold-line" />
                <h3 className="vp-card-title">{t(value.title)}</h3>
                <p className="vp-card-desc">{t(value.description)}</p>
              </div>
              <div className="vp-card-glow" />
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="vp-cta-section">
          <Link to="/shop" className="vp-btn-primary">
            <span className="vp-btn-primary-text">{t('value_cta')}</span>
            <span className="vp-btn-primary-glow" />
          </Link>
        </div>

        {/* Gold line divider at bottom */}
        <div className="vp-divider-bottom">
          <div className="vp-divider-line" />
          <div className="vp-divider-diamond" />
          <div className="vp-divider-line" />
        </div>
      </section>
    </div>
  );
}
