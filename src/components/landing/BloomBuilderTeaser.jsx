import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  { num: '01', label: 'Choose the occasion', desc: 'Birthday, anniversary, sympathy — seven categories, every moment.' },
  { num: '02', label: 'Set the tone', desc: 'Heartfelt, elegant, playful, romantic. Your bloom should sound like you.' },
  { num: '03', label: 'Pick your bloom style', desc: 'Curated premium templates tied to real cinematic assets.' },
  { num: '04', label: 'Choose a message', desc: 'Curated from our message bank — or write it yourself.' },
  { num: '05', label: 'Personalize it', desc: 'Add who it\'s for, who it\'s from, and when it should arrive.' },
  { num: '06', label: 'Preview & checkout', desc: 'See exactly what they\'ll receive. Then send it.' },
];

export default function BloomBuilderTeaser() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for entrance animation
  const observerRef = useRef(null);
  const attach = (el) => {
    if (!el || observerRef.current) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observerRef.current.observe(el);
  };

  return (
    <section
      ref={(el) => { sectionRef.current = el; attach(el); }}
      style={{
        padding: '100px 0',
        background: '#FAFAFA',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <div className="landing-container">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '64px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            marginBottom: 14,
          }}>
            The Builder
          </div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Create Your Bloom
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            A guided experience for crafting something personal, giftable, and premium — in under five minutes.
          </p>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 56,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                padding: '28px 24px',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#D4AF37',
                marginBottom: 10,
              }}>
                {step.num}
              </div>
              <div style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 17,
                fontWeight: 600,
                color: '#1D1D1F',
                marginBottom: 8,
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 300,
                color: '#6E6E73',
                lineHeight: 1.6,
              }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        >
          <Link to="/build" className="cta-primary" style={{ display: 'inline-block' }}>
            Start Building Your Bloom
          </Link>
          <p style={{ marginTop: 16, fontSize: 14, color: '#86868B' }}>
            Takes about 3 minutes. No account required.
          </p>
        </div>
      </div>
    </section>
  );
}
