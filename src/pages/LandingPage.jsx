import { lazy, Suspense } from 'react';
import LandingNav from '../components/landing/LandingNav';
import HeroRecipientVideo from '../components/landing/HeroRecipientVideo';
import GradientHero from '../components/landing/GradientHero';
import MothersDayCountdown from '../components/landing/MothersDayCountdown';
import LazySection from '../components/LazySection';
import '../styles/landing.css';
import '../styles/landing-nav.css';
import '../styles/gradient-hero.css';

const LandingBelowFold = lazy(() => import('../components/landing/LandingBelowFold'));

export default function LandingPage({ onOpenFaq }) {
  return (
    <div className="landing-page" style={{ background: '#0c1f3f' }}>
      {/* Time-bounded urgency banner — auto-removes itself the day after
          Mother's Day so the page doesn't go stale. */}
      <MothersDayCountdown />
      <LandingNav onOpenFaq={onOpenFaq} />
      <HeroRecipientVideo />
      <GradientHero />
      <LazySection
        fallback={<div style={{ minHeight: '1200px' }} aria-hidden="true" />}
      >
        <Suspense fallback={<div style={{ minHeight: '1200px' }} aria-hidden="true" />}>
          <LandingBelowFold />
        </Suspense>
      </LazySection>
    </div>
  );
}
