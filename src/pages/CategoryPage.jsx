import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BloomListCard from '../components/BloomListCard';
import SubcatLane from '../components/SubcatLane';
import { useProducts } from '../hooks/useProducts';
import OCCASIONS from '../data/occasions';
import { CATEGORY_BY_SLUG } from '../data/categories';

// Lane catalog (Ak whiteboard 2026-05-07): each entry is a potential
// row on the category page. Rows with products show the strip; rows
// with no products yet show a "Coming soon" placeholder so customers
// see the breadth of the catalog. Order is editorial — closest
// recipients (Mom, Grandma) first, support roles after, sender-side
// labels (From Son) mixed in where they read naturally.
const LANE_CATALOG = [
  { slug: 'for-mom',               label: 'For Mom',          tagline: 'The classic — for the woman who raised you.' },
  { slug: 'for-grandma',           label: 'For Grandma',      tagline: 'Matriarch, heirloom, the garden she planted.' },
  { slug: 'new-mom',               label: 'For New Mom',      tagline: 'First Mother\'s Day — quiet awe, new motherhood.' },
  { slug: 'mother-of-my-children', label: 'For Wife',         tagline: 'From a husband — the mother of your children.' },
  { slug: 'stepmom',               label: 'For Stepmom',      tagline: 'The woman who chose to show up.' },
  { slug: 'godmother-auntie',      label: 'For Auntie',       tagline: 'Auntie, godmother, the second mom in the family.' },
  { slug: 'single-mom',            label: 'For Single Mom',   tagline: 'For the mom who did it on her own.' },
  { slug: 'friend-honoring',       label: 'For Friend',       tagline: 'For your friend — celebrate her motherhood.' },
  { slug: 'from-son',              label: 'From a Son',       tagline: 'Masculine tribute — son\'s perspective on Mom.' },
  { slug: 'long-distance',         label: 'Long Distance',    tagline: 'When miles are between you and her.' },
  { slug: 'memorial',              label: 'In Memory',        tagline: 'For the mother whose love still blooms.' },
];

export default function CategoryPage() {
  const { categorySlug } = useParams();
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

  // Search-within-category state. Empty string = no filter, show lanes.
  // Non-empty = flat list across every subcategory matching the query.
  const [search, setSearch] = useState('');

  // Bucket products by subcategory so each LANE_CATALOG row gets its
  // matched products in O(n) instead of O(n²).
  const productsBySubcat = useMemo(() => {
    const map = new Map();
    for (const p of categoryProducts) {
      const key = p.subcategory || 'for-mom'; // untagged → default lane
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return map;
  }, [categoryProducts]);

  // The lanes we actually render: every catalog entry, marked
  // populated or coming-soon based on whether this category has
  // products under that subcategory.
  const lanes = useMemo(() => {
    return LANE_CATALOG.map((entry) => {
      const items = productsBySubcat.get(entry.slug) || [];
      return { ...entry, products: items, comingSoon: items.length === 0 };
    });
  }, [productsBySubcat]);

  // Search results — flat list, used when search is non-empty.
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return categoryProducts.filter((p) => {
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
  }, [categoryProducts, search]);

  const isSearching = search.trim().length > 0;

  // A category is "coming soon" when it's a real category but has no
  // products yet — so Ak doesn't have to hand-maintain a hardcoded list.
  const isComingSoon = !loading && Boolean(canonical) && categoryProducts.length === 0;

  // Lightweight per-category SEO: set <title> and meta description so
  // each category page is individually indexable by Google.
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
      {/* Category Hero — Ak 2026-05-07 #3: removed the floating sticky
          Back pill (it was overlapping the title on phones). The
          "All Occasions" eyebrow is now the Back link, prefixed with
          a chevron and left-aligned so it sits cleanly above the
          title with no overlay. Same destination — /shop — which is
          where back-from-category-page belongs in the hierarchy. */}
      <section className="relative pt-28 sm:pt-24 pb-8 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${occasion.accent}, ${occasion.accent}66)` }} />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${occasion.accent}, transparent 65%)` }} />

        <div className="relative flex items-center mb-6 px-1">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" style={{ width: 14, height: 14, color: '#D4AF37' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Occasions
          </Link>
        </div>

        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-[0.06em] uppercase mb-3" style={{ color: '#FFFFFF' }}>
          {occasion.title}
        </h1>
        <p className="relative text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {occasion.tagline}
        </p>

        <div className="relative mx-auto mt-5 h-[2px] w-12 rounded-full" style={{ background: occasion.accent }} />
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-32 pt-4">
          {/* Search bar — when active, replaces lanes with a flat list. */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
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
          </div>

          {isSearching ? (
            // Search mode: flat list across all subcategories.
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-6 font-medium text-center">
                {searchResults.length} match{searchResults.length === 1 ? '' : 'es'} for "{search}"
              </p>
              {searchResults.length === 0 ? (
                <div className="text-center py-16 px-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p className="text-[var(--text-secondary)] font-light mb-6">
                    No {occasion.title.toLowerCase()} blooms match "<span className="font-medium" style={{ color: '#FFFFFF' }}>{search}</span>".
                  </p>
                  <p className="text-sm text-[var(--text-muted)] font-light mb-8">
                    Try searching across every category — the right bloom might live somewhere unexpected.
                  </p>
                  <Link
                    to={`/shop?search=${encodeURIComponent(search)}`}
                    className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[var(--accent-gold)] text-[var(--bg-page)] hover:bg-[var(--accent-gold-hover)] transition-all font-semibold"
                  >
                    Search all blooms for "{search}"
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {searchResults.map((product) => (
                    <BloomListCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Lane mode: stacked subcategory rows, each horizontally scrollable.
            <div className="flex flex-col gap-12">
              {lanes.map((lane) => (
                <SubcatLane
                  key={lane.slug}
                  label={lane.label}
                  tagline={lane.tagline}
                  products={lane.products}
                  comingSoon={lane.comingSoon}
                  accent={occasion.accent}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
