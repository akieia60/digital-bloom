import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DemoVideo() {
  const { t } = useLanguage();
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
        <span className="demo-video-eyebrow">{t('demo_eyebrow')}</span>
        <h2 className="demo-video-title">{t('demo_title')}</h2>
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
        <div className="db-watermark demo-video-player">
          <video
            controls
            playsInline
            preload="metadata"
            poster="https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/site-assets/digital_bloom_poster.jpg"
          >
            <source src="https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/site-assets/digital_bloom_seamless.mp4" type="video/mp4" />
            {t('demo_fallback')}
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
        className="demo-video-caption"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}
      >
        <p>
          {t('demo_caption')}
        </p>
      </div>
    </section>
  );
}
