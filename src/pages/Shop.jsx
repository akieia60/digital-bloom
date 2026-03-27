import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/gallery.css';

const CATEGORY_SLUGS = [
  { slug: 'mothers-day', nameKey: 'cat_mothers_day', taglineKey: 'shop_tag_mothers_day' },
  { slug: 'birthday',    nameKey: 'cat_birthday',    taglineKey: 'shop_tag_birthday' },
  { slug: 'love',        nameKey: 'cat_love',         taglineKey: 'shop_tag_love' },
  { slug: 'valentine',   nameKey: 'cat_valentine',    taglineKey: 'shop_tag_valentine' },
  { slug: 'celebration', nameKey: 'cat_celebration',  taglineKey: 'shop_tag_celebration' },
  { slug: 'grief',       nameKey: 'cat_grief',        taglineKey: 'shop_tag_grief' },
  { slug: 'friendship',  nameKey: 'cat_friendship',   taglineKey: 'shop_tag_friendship' },
  { slug: 'luxury',      nameKey: 'cat_luxury',       taglineKey: 'shop_tag_luxury' },
  { slug: 'general',     nameKey: 'cat_general',      taglineKey: 'shop_tag_general' },
];

function CategorySection({ cat, products }) {
  const catProducts = products.filter((p) => p.category === cat.slug);
  if (catProducts.length === 0) return null;

  return (
    <section className="gallery-section">
      <div className="gallery-section__header">
        <div className="gallery-section__info">
          <h2 className="gallery-section__title">{cat.name}</h2>
          <p className="gallery-section__tagline">{cat.tagline}</p>
        </div>
        <Link to={`/shop/${cat.slug}`} className="gallery-section__see-all">
          {cat.seeAll}
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
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const { products, loading } = useProducts();
  const { t } = useLanguage();

  const CATEGORIES = CATEGORY_SLUGS.map((c) => ({
    slug: c.slug,
    name: t(c.nameKey),
    tagline: t(c.taglineKey),
    seeAll: t('shop_see_all'),
  }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

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
            <p className="gallery-header__count">{t('shop_subtitle')}</p>
          </div>

          <form onSubmit={handleSearch} className="gallery-search">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('shop_search_placeholder')}
              className="gallery-search__input"
            />
            <button type="submit" className="gallery-search__btn">
              {t('shop_search_btn')}
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
