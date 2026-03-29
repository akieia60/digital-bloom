import { useState } from 'react';
import LandingNav from '../components/landing/LandingNav';
import GradientHero from '../components/landing/GradientHero';
import StatsBar from '../components/landing/StatsBar';
import CategoryGrid from '../components/landing/CategoryGrid';
import TwoWaysToBloom from '../components/landing/TwoWaysToBloom';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/landing.css';
import '../styles/landing-nav.css';
import '../styles/gradient-hero.css';

export default function LandingPage() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="landing-page" style={{ background: '#0c1f3f' }}>
      <LandingNav onOpenFaq={() => setIsFaqOpen(true)} />
      <GradientHero />
      <StatsBar />
      <CategoryGrid />
      <TwoWaysToBloom />
      <LandingFooter />

      {/* Floating FAQ pill button */}
      <button
        className="faq-pill-btn"
        onClick={() => setIsFaqOpen(true)}
        aria-label="Open FAQ"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>{t('nav_faq') || 'FAQ'}</span>
      </button>

      {/* FAQ Modal Overlay */}
      <FAQ isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </div>
  );
}
