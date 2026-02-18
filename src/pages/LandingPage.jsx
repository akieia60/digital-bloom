import VideoHero from '../components/landing/VideoHero';
import LandingHero from '../components/landing/LandingHero';
import ValueProps from '../components/landing/ValueProps';
import FeaturedGallery from '../components/landing/FeaturedGallery';
import AboutSection from '../components/landing/AboutSection';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';
import ContactSection from '../components/landing/ContactSection';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/video-hero.css';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <VideoHero />
      <ValueProps />
      <FeaturedGallery />
      <AboutSection />
      <HowItWorks />
      <FAQ />
      <ContactSection />
      <LandingFooter />
    </div>
  );
}
