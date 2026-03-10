import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

const CATEGORIES = [
  { name: "Mother's Day", slug: 'mothers-day', tagline: 'Celebrate the woman who gave you everything', color: '#FF4DA6' },
  { name: 'Birthday', slug: 'birthday', tagline: 'Make their special day unforgettable', color: '#FFD23F' },
  { name: 'Love', slug: 'love', tagline: 'Express your deepest feelings', color: '#FF3B7F' },
  { name: "Valentine's Day", slug: 'valentine', tagline: 'For the one who has your heart', color: '#FF6B6B' },
  { name: 'Congratulations', slug: 'celebration', tagline: 'Celebrate their achievements in style', color: '#B45FFF' },
  { name: 'Memorial', slug: 'grief', tagline: 'Honor those we hold dear', color: '#7B9FFF' },
  { name: 'Thinking of You', slug: 'friendship', tagline: 'Let them know they matter', color: '#FF8C42' },
  { name: 'Luxury', slug: 'luxury', tagline: 'Where fashion meets floral artistry', color: '#D4AF37' },
  { name: 'Zodiac', slug: 'zodiac', tagline: 'Written in the stars', color: '#9B59B6', comingSoon: true },
  { name: 'General', slug: 'general', tagline: 'Beautiful blooms for every moment', color: '#6E6E73' },
];

export default function Shop({ searchQuery, setSearchQuery }) {
  // If there's a search query, show the full product grid with search results
  if (searchQuery) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <ProductGrid searchQuery={searchQuery} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Shop Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-white tracking-tight mb-6">
          Choose Your Occasion
        </h1>
        <p className="text-lg text-white/50 font-light max-w-xl mx-auto leading-relaxed">
          Browse our curated collections of cinematic digital bloom experiences, crafted for every occasion.
        </p>
      </section>

      {/* Category Tiles */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            if (cat.comingSoon) {
              return (
                <div
                  key={cat.slug}
                  className="relative bg-white/[0.04] rounded-2xl p-8 border border-white/[0.06] opacity-55 cursor-default transition-all duration-300"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-40"
                    style={{ background: cat.color }}
                  />
                  <h3 className="text-lg font-display font-medium text-white/60 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed">
                    {cat.tagline}
                  </p>
                  <div className="mt-6 text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: cat.color }}>
                    Coming Soon
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="group relative bg-white/[0.04] rounded-2xl p-8 border border-white/[0.06] hover:border-[#D4AF37]/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#D4AF37]/5 transition-all duration-300"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: cat.color }}
                />
                <h3 className="text-lg font-display font-medium text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-white/40 font-light leading-relaxed">
                  {cat.tagline}
                </p>
                <div className="mt-6 flex items-center text-[11px] uppercase tracking-[0.15em] text-white/30 group-hover:text-[#D4AF37] transition-colors font-medium">
                  <span>Explore</span>
                  <svg className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
