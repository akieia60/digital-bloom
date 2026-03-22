import { Link } from 'react-router-dom';

export default function LandingHero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="landing-hero" style={{ backgroundColor: '#001f3f', paddingTop: '5rem' }}>
      <div className="landing-container">
        <div className="hero-content" style={{ paddingTop: '3rem' }}>
          <h1 className="hero-headline">
            DigitalBloom publishes meaningful digital multimedia experiences designed for expression, connection, and gifting.
          </h1>
          <p className="hero-subheadline">
            Each DigitalBloom experience is thoughtfully created, customized, and delivered as a digital expression for personal moments or shared connections.
          </p>
          <div className="hero-ctas">
            <Link to="/shop" className="cta-primary">
              Create a DigitalBloom Experience
            </Link>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="cta-secondary"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
