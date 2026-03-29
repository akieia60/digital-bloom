import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/gallery.css';

const CATEGORIES = [
  { name: "Mother's Day", slug: 'mothers-day', nameKey: 'cat_mothers_day', taglineKey: 'cat_mothers_day_tagline', tagline: 'Celebrate the woman who gave you everything' },
  { name: 'Birthday', slug: 'birthday', nameKey: 'cat_birthday', taglineKey: 'cat_birthday_tagline', tagline: 'Make their special day unforgettable' },
  { name: 'Love & Romance', slug: 'love', nameKey: 'cat_love', taglineKey: 'cat_love_tagline', tagline: 'Express your deepest feelings' },
  { name: "Valentine's Day", slug: 'valentine', nameKey: 'cat_valentine', taglineKey: 'cat_valentine_tagline', tagline: 'For the one who has your heart' },
  { name: 'Congratulations', slug: 'celebration', nameKey: 'cat_celebration', taglineKey: 'cat_celebration_tagline', tagline: 'Celebrate their achievements in style' },
  { name: 'Memorial & Sympathy', slug: 'grief', nameKey: 'cat_grief', taglineKey: 'cat_grief_tagline', tagline: 'Honor those we hold dear' },
  { name: 'Thinking of You', slug: 'friendship', nameKey: 'cat_friendship', taglineKey: 'cat_friendship_tagline', tagline: 'Let them know they matter' },
  { name: 'Luxury Collection', slug: 'luxury', nameKey: 'cat_luxury', taglineKey: 'cat_luxury_tagline', tagline: 'Where fashion meets floral artistry' },
  { name: 'General Collection', slug: 'general', nameKey: 'cat_general', taglineKey: 'cat_general_tagline', tagline: 'Beautiful blooms for every moment' },
];

function CategorySection({ cat, products }) {
  const { t } = useLanguage();
  const catProducts = products.filter((p) => p.category === cat.slug);
  if (catProducts.length === 0) return null;

  const title = cat.nameKey ? t(cat.nameKey) : cat.name;
  const tagline = cat.taglineKey ? t(cat.taglineKey) : cat.tagline;

  return (
    <section className="gallery-section">
      <div className="gallery-section__header">
        <div className="gallery-section__info">
          <h2 className="gallery-section__title">{title}</h2>
          <p className="gallery-section__tagline">{tagline}</p>
        </div>
        <Link to={`/shop/${cat.slug}`} className="gallery-section__see-all">
          {t('shop_see_all')}
        </Link>
      </div>
      <div className="gallery-grid">
        {catProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Shop({ searchQuery, setSearchQuery }) {
  const { t } = useLanguage();
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

  // Search mode — use ProductGrid
  if (searchQuery) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <ProductGrid searchQuery={searchQuery} />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">

        {/* ── PAGE HEADER ── */}
        <header className="gallery-header">
          <div className="gallery-header__meta">
            <h1 className="gallery-header__title">{t('shop_title')}</h1>
            <p className="gallery-header__count">
              {t('shop_subtitle')}
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="gallery-search">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('shop_search_placeholder')}
              className="gallery-search__input"
            />
            <button type="submit" className="gallery-search__btn">
              {t('shop_search_button')}
            </button>
          </form>
        </header>

        {/* ── CATEGORY SECTIONS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[var(--accent-gold)] rounded-full animate-spin" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', color: '#6E6E73' }}>{t('shop_loading')}</p>
          </div>
        ) : (
          <div className="gallery-sections">
            {CATEGORIES.map((cat) => (
              <CategorySection key={cat.slug} cat={cat} products={products} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
