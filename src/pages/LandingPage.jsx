import LandingNav from '../components/landing/LandingNav';
import VideoHero from '../components/landing/VideoHero';
import SignatureBloom from '../components/landing/SignatureBloom';
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
      {/* Hero → Signature Bloom → FAQ → Footer */}
      {/* CategoryGrid removed — "Send a Bloom" CTA takes users to /shop where categories are shown */}
      <VideoHero />
      <SignatureBloom />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
