import LandingNav from '../components/landing/LandingNav';
import GradientHero from '../components/landing/GradientHero';
import StatsBar from '../components/landing/StatsBar';
import CategoryGrid from '../components/landing/CategoryGrid';
import TwoWaysToBloom from '../components/landing/TwoWaysToBloom';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/landing.css';
import '../styles/landing-nav.css';
import '../styles/gradient-hero.css';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ background: '#0c1f3f' }}>
      <LandingNav />
      <GradientHero />
      <StatsBar />
      <CategoryGrid />
      <TwoWaysToBloom />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
