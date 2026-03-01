import { useParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

const CATEGORY_META = {
  'mothers-day': { label: "Mother's Day", tagline: 'Celebrate the woman who gave you everything' },
  'birthday': { label: 'Birthday', tagline: 'Make their special day unforgettable' },
  'love': { label: 'Love & Romance', tagline: 'Express your deepest feelings' },
  'valentine': { label: "Valentine's Day", tagline: 'For the one who has your heart' },
  'celebration': { label: 'Congratulations', tagline: 'Celebrate their achievements in style' },
  'grief': { label: 'Memorial & Sympathy', tagline: 'Honor those we hold dear' },
  'friendship': { label: 'Thinking of You', tagline: 'Let them know they matter' },
  'luxury': { label: 'Glass Stiletto Series', tagline: 'Where fashion meets floral artistry' },
  'zodiac': { label: 'Zodiac Collection', tagline: 'Written in the stars' },
  'general': { label: 'General Collection', tagline: 'Beautiful blooms for every moment' },
};

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const meta = CATEGORY_META[categorySlug];

  if (!meta) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-display text-[#1D1D1F] mb-4">Category not found</h2>
          <p className="text-[#6E6E73] mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[#1D1D1F] text-white hover:bg-[#D4AF37] hover:text-[#1D1D1F] transition-all">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Hero */}
      <section className="pt-32 pb-8 px-6 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center text-[11px] uppercase tracking-[0.15em] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors mb-8 font-medium"
        >
          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Categories
        </Link>
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-[#1D1D1F] tracking-tight mb-4">
          {meta.label}
        </h1>
        <p className="text-lg text-[#6E6E73] font-light max-w-xl mx-auto">
          {meta.tagline}
        </p>
      </section>

      {/* Products for this category */}
      <ProductGrid category={categorySlug} />
    </div>
  );
}
