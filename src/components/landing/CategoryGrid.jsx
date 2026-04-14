import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import OCCASIONS from '../../data/occasions';

// Ordered list of slugs to display in the grid + their video previews.
// Edit this array to control which categories appear and in what order.
// Only categories with active products in Supabase are listed here.
// Hidden (no products): anniversary, graduation, thank-you, encouragement,
//   gratitude, baby, milestones, promotions, holidays
const CATEGORY_DISPLAY = [
  { slug: 'mothers-day',  previewVideo: '/videos/category-previews/preview_mothers-day_grok1.mp4' },
  { slug: 'birthday',     previewVideo: '/videos/shop/birthday_birthday_roses_bloom_v1.mp4' },
  { slug: 'love',         previewVideo: '/videos/shop/iloveyou_iloveyou_roses_bloom_v1.mp4' },
  { slug: 'valentine',    previewVideo: '/videos/shop/valentine_valentine_roses_bloom_v1.mp4' },
  { slug: 'celebration',  previewVideo: '/videos/shop/congratulations_congratulations_roses_bloom_v1.mp4' },
  { slug: 'fathers-day',  previewVideo: 'https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/product-media/Mother%27s%20Day/grok_1770456116168_grok-video-22b2297c-7068-4f69-bba0-13413067a0f4.mp4' },
  { slug: 'friendship',   previewVideo: '/videos/shop/thinkingofyou_thinkingofyou_roses_bloom_v1.mp4' },
  { slug: 'grief',        previewVideo: '/videos/shop/memorial_memorial_roses_artistic_v1.mp4' },
  { slug: 'luxury',       previewVideo: '/videos/shop/glassstiletto_glassstilettoseries_roses_artistic_v1.mp4' },
  { slug: 'general',      previewVideo: '/videos/shop/general_general_goldenroses_bloom_v1.mp4' },
  { slug: 'zodiac',       previewVideo: null },
];

export default function CategoryGrid() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute('data-idx');
            setVisibleItems((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-idx]');
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Build the enriched category list from OCCASIONS so there's one source of truth
  const categories = CATEGORY_DISPLAY.map(({ slug, previewVideo }) => {
    const occ = OCCASIONS[slug];
    if (!occ) return null;
    return { slug, previewVideo, name: occ.name, accent: occ.accent, emoji: occ.emoji };
  }).filter(Boolean);

  return (
    <section className="cat-stack-section" ref={sectionRef}>
      {/* Section header */}
      <div className="cat-stack-header">
        <span className="cat-stack-eyebrow">{t('category_title')}</span>
        <h2 className="cat-stack-headline">{t('category_subtitle')}</h2>
      </div>

      {/* Stacked category list */}
      <div className="cat-stack-list">
        {categories.map((cat, idx) => {
          const visible = visibleItems.has(String(idx));
          return (
            <div
              key={cat.slug}
              className={`cat-stack-item ${visible ? 'cat-stack-item--visible' : ''}`}
              data-idx={idx}
              style={{ transitionDelay: `${idx * 0.07}s` }}
            >
              {/* Category name row — full width */}
              <div className="cat-stack-name-row">
                <h3 className="cat-stack-name">
                  <span style={{ marginRight: '8px', opacity: 0.85 }}>{cat.emoji}</span>
                  {cat.name}
                </h3>
              </div>

              {/* Divider line — full width */}
              <div className="cat-stack-divider" style={{ background: cat.accent }} />

              {/* Full-width square bloom — tap to open */}
              <Link
                to={`/shop/${cat.slug}`}
                className="cat-stack-bloom-link"
                aria-label={`Browse ${cat.name}`}
              >
                <div className="db-watermark cat-stack-bloom-square">
                  {cat.previewVideo ? (
                    <video
                      src={cat.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="cat-stack-bloom-video"
                    />
                  ) : (
                    <div
                      className="cat-stack-bloom-placeholder"
                      style={{
                        background: `radial-gradient(ellipse at 50% 40%, ${cat.accent}33, #0a0a0a)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.5rem',
                      }}
                    >
                      {cat.emoji}
                    </div>
                  )}
                  {/* Tap hint overlay */}
                  <div className="cat-stack-tap-hint">
                    <span className="cat-stack-tap-text">{t('cat_tap_explore')}</span>
                  </div>
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
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
