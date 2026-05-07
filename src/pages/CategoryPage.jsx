import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BloomListCard from '../components/BloomListCard';
import { useProducts } from '../hooks/useProducts';
import OCCASIONS from '../data/occasions';
import { CATEGORY_BY_SLUG } from '../data/categories';

// Subcategory chips (Ak / David 2026-05-07): each chip filters the
// in-category list to products tagged with the matching `subcategory`
// slug (set at publish time from the prompt's badge — see
// api/process-bloom.js). Chips with zero matches in the current category
// auto-hide so customers never tap an empty pill.
// Each chip filters in-category products by `subcategory`. Chips with zero
// matches in the current category auto-hide so customers never tap an empty
// pill. The list mixes legacy slugs (mother-of-my-children, single-mom, …)
// with the 2026-05-07 backfill buckets (from-son, for-grandma, memorial, …)
// so every category shows whatever pills it actually has products for.
const RECIPIENT_CHIPS = [
  { label: 'All',              subcategory: null }, // default — clear filter
  { label: 'For Mom',          subcategory: 'for-mom' },
  { label: 'From Son',         subcategory: 'from-son' },
  { label: 'For Grandma',      subcategory: 'for-grandma' },
  { label: 'For New Mom',      subcategory: 'new-mom' },
  { label: 'In Memory',        subcategory: 'memorial' },
  { label: 'Long Distance',    subcategory: 'long-distance' },
  { label: 'For Wife',         subcategory: 'mother-of-my-children' },
  { label: 'For Friend',       subcategory: 'friend-honoring' },
  { label: 'For Stepmom',      subcategory: 'stepmom' },
  { label: 'For Auntie',       subcategory: 'godmother-auntie' },
  { label: 'For Single Mom',   subcategory: 'single-mom' },
];

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

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === categorySlug),
    [products, categorySlug],
  );

  // Search-within-category state. Empty string = no filter, show everything.
  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState(null);

  // Which subcategories actually have products in this category right now?
  // Chips that aren't represented get hidden so users never tap an empty pill.
  const availableSubcats = useMemo(() => {
    const set = new Set();
    for (const p of categoryProducts) {
      if (p.subcategory) set.add(p.subcategory);
    }
    return set;
  }, [categoryProducts]);

  const visibleChips = useMemo(
    () => RECIPIENT_CHIPS.filter(
      (c) => c.subcategory === null || availableSubcats.has(c.subcategory),
    ),
    [availableSubcats],
  );

  const visibleProducts = useMemo(() => {
    let pool = categoryProducts;

    // Subcategory filter — exact match on the slug stamped at publish time.
    if (activeSubcat) {
      pool = pool.filter((p) => p.subcategory === activeSubcat);
    }

    // Free-text search runs on top of any subcategory filter.
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((p) => {
      const haystack = [
        p.name || '',
        p.description || '',
        ...Object.values(p.i18n || {}).flatMap((entry) =>
          [entry?.name, entry?.description].filter(Boolean),
        ),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [categoryProducts, search, activeSubcat]);

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
      {/* Sticky floating back button — stays visible as the user scrolls */}
      <button
        onClick={() => navigate(-1)}
        type="button"
        aria-label="Back"
        className="db-sticky-back"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      {/* Category Hero — pt-44 on mobile so the sticky Back pill (which lives
          at top:64px from the safe-area inset) doesn't overlap the salesPitch
          copy. Ak/Breana 2026-05-07 caught Back hovering over the pitch text. */}
      <section className="relative pt-44 sm:pt-32 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${occasion.accent}, ${occasion.accent}66)` }} />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${occasion.accent}, transparent 65%)` }} />

        <div className="relative flex items-center justify-center gap-4 mb-10">
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
          {/* ── SEARCH + RECIPIENT CHIPS (David 2026-05-06):
              he was on Mother's Day looking for "for a friend who's a mom"
              with no way to refine. Now he can type "friend" or tap the
              For Friend chip and the list filters in-place. ── */}
          <div className="mb-8">
            <div className="relative mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${occasion.title}…  e.g. "friend", "sister", "auntie"`}
                aria-label={`Search ${occasion.title}`}
                className="w-full px-5 py-4 rounded-full text-base focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleChips.map((chip) => {
                const isActive = chip.subcategory === activeSubcat;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => { setActiveSubcat(chip.subcategory); setSearch(''); }}
                    className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.12em] font-medium transition-all"
                    style={{
                      background: isActive ? occasion.accent : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#0D1B36' : 'rgba(255,255,255,0.78)',
                      border: `1px solid ${isActive ? occasion.accent : 'rgba(255,255,255,0.15)'}`,
                    }}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-8 font-medium">
            {visibleProducts.length} experience{visibleProducts.length !== 1 ? 's' : ''}
            {search ? ` matching "${search}"` : (activeSubcat ? ` in this collection` : ' available')}
          </p>

          {visibleProducts.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                {search
                  ? <>No {occasion.title.toLowerCase()} blooms match "<span className="font-medium" style={{ color: '#FFFFFF' }}>{search}</span>".</>
                  : <>No blooms in this collection yet — check back soon.</>}
              </p>
              {search && (
                <>
                  <p className="text-sm text-[var(--text-muted)] font-light mb-8">
                    Try searching across every category — the right bloom might live somewhere unexpected.
                  </p>
                  <Link
                    to={`/shop?search=${encodeURIComponent(search)}`}
                    className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold"
                  >
                    Search all blooms for "{search}"
                  </Link>
                </>
              )}
              {!search && activeSubcat && (
                <button
                  type="button"
                  onClick={() => setActiveSubcat(null)}
                  className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold"
                >
                  Show all {occasion.title.toLowerCase()} blooms
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {visibleProducts.map((product) => (
                <BloomListCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
