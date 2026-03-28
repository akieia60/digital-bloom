import LandingNav from '../components/landing/LandingNav';
import GradientHero from '../components/landing/GradientHero';
import CategoryGrid from '../components/landing/CategoryGrid';
import TwoWaysToBloom from '../components/landing/TwoWaysToBloom';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/landing.css';
import '../styles/landing-nav.css';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ background: '#0c1f3f' }}>
      <LandingNav />
      {/* GradientHero replaces VideoHero — VideoHero.jsx is kept for reference */}
      <GradientHero />
      <CategoryGrid />
      <TwoWaysToBloom />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
