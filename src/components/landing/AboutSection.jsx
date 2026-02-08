import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="landing-container">
        <div className="about-content">
          <h2 className="section-title">What Is DigitalBloom</h2>
          <div className="about-text">
            <p>
              DigitalBloom is a digital multimedia publishing platform focused on creating and delivering intentional digital experiences. Each experience is crafted to communicate emotion, meaning, and connection through visual and multimedia expression.
            </p>
            <p>
              Rather than selling generic digital files, DigitalBloom publishes customized digital experiences designed to be shared, gifted, or privately enjoyed.
            </p>
          </div>
          <Link to="/shop" className="cta-secondary">
            Explore the Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
