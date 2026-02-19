import { useEffect, useRef, useState } from 'react';

export default function DemoVideo() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="demo-video-section"
      ref={sectionRef}
      id="demo"
    >
      {/* Section Header */}
      <div
        className="demo-video-header"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span className="demo-video-eyebrow">THE EXPERIENCE</span>
        <h2 className="demo-video-title">Watch a Bloom Come to Life</h2>
      </div>

      {/* Video Player */}
      <div
        className="demo-video-wrapper"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}
      >
        <div className="demo-video-player">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/videos/digital_bloom_poster.jpg"
          >
            <source src="/videos/digital_bloom_seamless.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Caption */}
      <div
        className="demo-video-caption"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}
      >
        <p>
          Every bloom is a cinematic experience, crafted with intention and delivered with love.
        </p>
      </div>
    </section>
  );
}
