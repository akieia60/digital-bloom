import { useEffect, useRef, useState } from 'react';

export default function SignatureBloom() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start playing video when visible
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="signature-bloom" ref={sectionRef}>
      <div className="signature-bloom__inner">
        {/* Eyebrow */}
        <div
          className="signature-bloom__header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="signature-bloom__eyebrow">THE EXPERIENCE</span>
          <h2 className="signature-bloom__title">This Is a Digital Bloom</h2>
          <p className="signature-bloom__subtitle">
            A cinematic, personalized digital flower experience — crafted with intention, 
            delivered instantly, and treasured forever.
          </p>
        </div>

        {/* Video Showcase */}
        <div
          className="signature-bloom__showcase"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <div className="db-watermark signature-bloom__video-frame">
            {/* Gold corner accents */}
            <div className="signature-bloom__corner signature-bloom__corner--tl" />
            <div className="signature-bloom__corner signature-bloom__corner--tr" />
            <div className="signature-bloom__corner signature-bloom__corner--bl" />
            <div className="signature-bloom__corner signature-bloom__corner--br" />
            
            <video
              ref={videoRef}
              className="signature-bloom__video"
              muted
              loop
              playsInline
              preload="none"
              poster="/videos/digital_bloom_poster.jpg"
            >
              <source src="/videos/digital_bloom_seamless.mp4" type="video/mp4" />
            </video>
            {/* Getty-style diagonal watermark */}
            <div className="db-watermark-overlay" aria-hidden="true">
              <div className="db-watermark-grid">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="db-watermark-row">
                    <span>© Digital Bloom</span>
                    <span>© Digital Bloom</span>
                    <span>© Digital Bloom</span>
                    <span>© Digital Bloom</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div
          className="signature-bloom__caption"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          <p>See what you're sending — every bloom is a cinematic moment.</p>
        </div>
      </div>
    </section>
  );
}
