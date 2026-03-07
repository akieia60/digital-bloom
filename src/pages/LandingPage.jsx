import LandingNav from '../components/landing/LandingNav';
import VideoHero from '../components/landing/VideoHero';
import SignatureBloom from '../components/landing/SignatureBloom';
import BloomBuilderTeaser from '../components/landing/BloomBuilderTeaser';
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
      {/* Hero → What is a Digital Bloom → Build Your Own → FAQ → Footer */}
      <VideoHero />
      <SignatureBloom />
      <BloomBuilderTeaser />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
