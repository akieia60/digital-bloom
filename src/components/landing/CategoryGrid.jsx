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
    <section
      ref={sectionRef}
      aria-labelledby="category-grid-title"
      style={{
        background: '#0c1f3f',
        padding: '3rem 1rem 2.5rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header — matches RelationshipNav styling */}
        <div style={{
          textAlign: 'center',
          marginBottom: '0.6rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#D4AF37',
          fontStyle: 'italic',
        }}>
          {t('category_title') || 'Shop by occasion'}
        </div>
        <h2
          id="category-grid-title"
          style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '0 0 2.2rem',
            lineHeight: 1.2,
          }}
        >
          {t('category_subtitle') || "Every moment has its bloom."}
        </h2>

        {/* 9:16 tile grid — matches RelationshipNav size + style */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
        }}>
          {categories.map((cat, idx) => {
            const visible = visibleItems.has(String(idx));
            return (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                data-idx={idx}
                aria-label={`${t('shop_search_button')} ${cat.name}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.45s ease ${idx * 0.04}s, transform 0.45s ease ${idx * 0.04}s, border-color 0.18s, box-shadow 0.18s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 9:16 video preview */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '9 / 16',
                  background: '#000',
                  overflow: 'hidden',
                }}>
                  <video
                    src={cat.previewVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {/* Soft bottom gradient for label legibility */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(13,27,54,0.85) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>

                {/* Label + emoji accent */}
                <div style={{ padding: '0.85rem 0.9rem 1rem' }}>
                  <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    marginBottom: '0.3rem',
                    letterSpacing: '0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}>
                    <span style={{ opacity: 0.85, fontSize: '1rem' }}>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
