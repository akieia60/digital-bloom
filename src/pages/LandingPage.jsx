import LandingNav from '../components/landing/LandingNav';
import GradientHero from '../components/landing/GradientHero';
import DemoVideo from '../components/landing/DemoVideo';
import StatsBar from '../components/landing/StatsBar';
import CategoryGrid from '../components/landing/CategoryGrid';
import TwoWaysToBloom from '../components/landing/TwoWaysToBloom';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/landing.css';
import '../styles/landing-nav.css';
import '../styles/gradient-hero.css';

export default function LandingPage({ onOpenFaq }) {
  return (
    <div className="landing-page" style={{ background: '#0c1f3f' }}>
      <LandingNav onOpenFaq={onOpenFaq} />
      <GradientHero />
      <DemoVideo />
      <StatsBar />
      <CategoryGrid />
      <TwoWaysToBloom />
      <LandingFooter />
    </div>
  );
}
