import { useParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import OCCASIONS from '../data/occasions';

const COMING_SOON_SLUGS = new Set(['zodiac']);

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const occasion = OCCASIONS[categorySlug];
  const isComingSoon = COMING_SOON_SLUGS.has(categorySlug);

  if (!occasion) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-display text-white mb-4">Category not found</h2>
          <p className="text-white/50 mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#C4A030] transition-all font-semibold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Occasion Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        {/* Accent gradient bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${occasion.accent}, ${occasion.accent}66)` }}
        />

        {/* Subtle background wash */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${occasion.accent}, transparent 70%)` }}
        />

        {/* Back link */}
        <Link
          to="/shop"
          className="relative inline-flex items-center text-[11px] uppercase tracking-[0.15em] text-white/40 hover:text-[#D4AF37] transition-colors mb-10 font-medium"
        >
          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Occasions
        </Link>

        {/* Emoji icon */}
        <div className="relative mb-6">
          <span className="text-5xl">{occasion.emoji}</span>
        </div>

        {/* Title */}
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-display font-medium text-white tracking-tight mb-5">
          {occasion.title}
        </h1>

        {/* Tagline */}
        <p className="relative text-lg sm:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
          {occasion.tagline}
        </p>

        {/* Accent underline */}
        <div
          className="relative mx-auto mt-8 h-[2px] w-16 rounded-full"
          style={{ background: occasion.accent }}
        />
      </section>

      {isComingSoon ? (
        /* Coming Soon empty state */
        <section className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8" style={{ background: `${occasion.accent}15` }}>
            <span className="text-3xl">{occasion.emoji}</span>
          </div>
          <h2 className="text-2xl font-display font-medium text-white mb-4">Coming Soon</h2>
          <p className="text-white/50 font-light leading-relaxed mb-10">
            We're crafting something special for the {occasion.title}. Check back soon — beautiful blooms are on the way.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#C4A030] transition-all font-semibold"
          >
            Browse Other Occasions
          </Link>
        </section>
      ) : (
        /* Products for this category — UNCHANGED */
        <ProductGrid category={categorySlug} />
      )}
    </div>
  );
}
