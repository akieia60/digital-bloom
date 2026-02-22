import LandingNav from '../components/landing/LandingNav';
import VideoHero from '../components/landing/VideoHero';
import SignatureBloom from '../components/landing/SignatureBloom';
import CategoryGrid from '../components/landing/CategoryGrid';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/video-hero.css';
import '../styles/landing.css';
import '../styles/signature-bloom.css';
import '../styles/landing-nav.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNav />
      {/* Hero → Signature Bloom → Categories → How It Works → FAQ → Footer */}
      <VideoHero />
      <SignatureBloom />
      <CategoryGrid />
      <HowItWorks />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
