import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../data/categories';
import OCCASIONS from '../../data/occasions';

// Curated preview overrides — used when Ak wants a specific video to be the
// face of a category regardless of upload order. Any category NOT listed
// here falls back to "first live product in Supabase wins", so new
// categories auto-populate the moment Ak uploads her first video.
//
// Key = canonical slug. Value = video URL (local path or full Supabase URL).
// To re-curate, just add/edit an entry here and push. To remove a curation
// and let auto-pick take over, delete the entry.
const PREVIEW_OVERRIDES = {
  'mothers-day': '/videos/category-previews/preview_mothers-day_grok1.mp4',
};

export default function CategoryGrid() {
  const { t } = useLanguage();
  const { products } = useProducts();
  const sectionRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  // Build the category list dynamically: canonical taxonomy × live products.
  // Preview video = curated override if set, else first product's video_url.
  // Categories with zero products are omitted so the landing page never shows
  // an empty / emoji-only tile for an unlaunched category.
  const categories = useMemo(() => {
    const firstVideoBySlug = {};
    for (const p of products) {
      if (!p.video_url) continue;
      if (!firstVideoBySlug[p.category]) firstVideoBySlug[p.category] = p.video_url;
    }

    return CATEGORIES
      .filter((cat) => !cat.hidden)
      .map((cat) => {
        const preview = PREVIEW_OVERRIDES[cat.slug] || firstVideoBySlug[cat.slug] || null;
        if (!preview) return null; // auto-hide categories with no content yet
        const occ = OCCASIONS[cat.slug];
        const fallbackName = occ?.name || cat.name;
        const i18nKey = `cat_${cat.slug.replace(/-/g, '_')}`;
        const translated = t(i18nKey);
        return {
          slug: cat.slug,
          previewVideo: preview,
          // Translation order: dictionary key → curated OCCASIONS name → canonical
          name: translated && translated !== i18nKey ? translated : fallbackName,
          accent: occ?.accent || cat.accent,
          emoji: occ?.emoji || cat.emoji,
        };
      })
      .filter(Boolean);
  }, [products, t]);

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
  }, [categories.length]);

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
                aria-label={`${t('shop_search_button')} ${cat.name}`}
              >
                <div className="db-watermark cat-stack-bloom-square">
                  <video
                    src={cat.previewVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="cat-stack-bloom-video"
                  />
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
