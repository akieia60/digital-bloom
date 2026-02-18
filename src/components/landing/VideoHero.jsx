import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function VideoHero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure video plays on iOS Safari
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — poster image will show as fallback
      });
    }
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
  const heroScale = 1 + scrollY * 0.0003;

  const scrollToContent = () => {
    const hero = heroRef.current;
    if (hero) {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section ref={heroRef} className="video-hero">
      {/* Video Background */}
      <div
        className="video-hero__bg"
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
        }}
      >
        <video
          ref={videoRef}
          className="video-hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/digital_bloom_poster.jpg"
          preload="auto"
        >
          <source src="/videos/digital_bloom_seamless.mp4" type="video/mp4" />
        </video>
        <div className="video-hero__overlay" />
      </div>

      {/* Text Content */}
      <div
        className="video-hero__content"
        style={{ opacity: heroOpacity }}
      >
        <h1
          className={`video-hero__title ${isVisible ? 'video-hero__animate-in' : 'video-hero__hidden'}`}
        >
          DIGITAL BLOOM
        </h1>
        <p
          className={`video-hero__tagline ${isVisible ? 'video-hero__animate-in video-hero__delay-1' : 'video-hero__hidden'}`}
        >
          Give Them Their Flowers While They&rsquo;re Here
        </p>
        <div
          className={`video-hero__cta-wrap ${isVisible ? 'video-hero__animate-in video-hero__delay-2' : 'video-hero__hidden'}`}
        >
          <Link to="/shop" className="video-hero__btn">
            <span className="video-hero__btn-text">Send a Bloom</span>
            <span className="video-hero__btn-glow" />
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        className={`video-hero__scroll-indicator ${isVisible ? 'video-hero__animate-in video-hero__delay-3' : 'video-hero__hidden'}`}
        onClick={scrollToContent}
        aria-label="Scroll down"
        style={{ opacity: heroOpacity }}
      >
        <span className="video-hero__scroll-text">Scroll</span>
        <svg
          className="video-hero__chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}
