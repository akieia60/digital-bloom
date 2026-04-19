import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BloomListCard from '../components/BloomListCard';
import { useProducts } from '../hooks/useProducts';
import OCCASIONS from '../data/occasions';
import { CATEGORY_BY_SLUG } from '../data/categories';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  // Prefer the canonical taxonomy; fall back to legacy OCCASIONS for slugs
  // like 'gratitude' or 'baby' that exist only in the legacy customizer data.
  const canonical = CATEGORY_BY_SLUG[categorySlug];
  const occasion = OCCASIONS[categorySlug] || (canonical && {
    name: canonical.name,
    title: canonical.title,
    tagline: canonical.tagline,
    accent: canonical.accent,
    emoji: canonical.emoji,
  });
  const { products, loading } = useProducts();

  const categoryProducts = products.filter((p) => p.category === categorySlug);

  // A category is "coming soon" when it's a real category but has no products
  // yet — so Ak doesn't have to hand-maintain a hardcoded list anymore.
  const isComingSoon = !loading && Boolean(canonical) && categoryProducts.length === 0;

  // Lightweight per-category SEO: set <title> and meta description so each
  // category page is individually indexable by Google.
  useEffect(() => {
    if (!occasion) return;
    const previousTitle = document.title;
    document.title = `${occasion.title} — Digital Bloom`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc?.getAttribute('content') ?? null;
    if (metaDesc && occasion.tagline) metaDesc.setAttribute('content', occasion.tagline);
    return () => {
      document.title = previousTitle;
      if (metaDesc && previousDesc !== null) metaDesc.setAttribute('content', previousDesc);
    };
  }, [occasion]);

  if (!occasion) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-display text-[var(--text-primary)] mb-4">Category not found</h2>
          <p className="text-[var(--text-secondary)] mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Category Hero */}
      <section className="relative pt-32 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${occasion.accent}, ${occasion.accent}66)` }} />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${occasion.accent}, transparent 65%)` }} />

        <div className="relative flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="inline-flex items-center text-[11px] uppercase tracking-[0.15em] hover:text-[var(--accent-gold)] transition-colors font-medium"
            style={{ color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', padding: '8px 16px' }}
          >
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Link to="/shop" className="inline-flex items-center text-[11px] uppercase tracking-[0.15em] hover:text-[var(--accent-gold)] transition-colors font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
            All Occasions
          </Link>
        </div>

        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-[0.06em] uppercase mb-4" style={{ color: '#FFFFFF' }}>
          {occasion.title}
        </h1>
        <p className="relative text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {occasion.tagline}
        </p>

        {/* Gamble's Sales Pitch */}
        {occasion.salesPitch && (
          <div className="relative max-w-2xl mx-auto mt-8 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid rgba(255,255,255,0.15)` }}>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {occasion.salesPitch}
            </p>
          </div>
        )}
        
        <div className="relative mx-auto mt-6 h-[2px] w-12 rounded-full" style={{ background: occasion.accent }} />
      </section>

      {isComingSoon ? (
        <section className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8" style={{ background: `${occasion.accent}15` }}>
            <span className="text-3xl">{occasion.emoji}</span>
          </div>
          <h2 className="text-2xl font-display font-medium text-[var(--text-primary)] mb-4">Coming Soon</h2>
          <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-10">
            We're crafting something special for {occasion.title}. Check back soon.
          </p>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold">
            Browse Other Occasions
          </Link>
        </section>
      ) : loading ? (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-8 h-8 border-2 border-[var(--border-default)] border-t-[var(--accent-gold)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] text-sm">Loading collection…</p>
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <p className="text-[var(--text-secondary)] font-light mb-8">No blooms found in this collection yet.</p>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold">
            Browse Other Occasions
          </Link>
        </div>
      ) : (
        /* Full-width stacked bloom cards matching the hand-drawn sketch */
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-32 pt-8">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-8 font-medium">
            {categoryProducts.length} experience{categoryProducts.length !== 1 ? 's' : ''} available
          </p>
          <div className="flex flex-col gap-6">
            {categoryProducts.map((product) => (
              <BloomListCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
