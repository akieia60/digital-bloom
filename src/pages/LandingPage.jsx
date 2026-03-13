import LandingNav from '../components/landing/LandingNav';
import VideoHero from '../components/landing/VideoHero';
import CategoryGrid from '../components/landing/CategoryGrid';
import TwoWaysToBloom from '../components/landing/TwoWaysToBloom';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/video-hero.css';
import '../styles/landing.css';
import '../styles/landing-nav.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNav />
      {/* Hero → Categories → Two Ways → FAQ → Footer */}
      <VideoHero />
      <CategoryGrid />
      <TwoWaysToBloom />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
