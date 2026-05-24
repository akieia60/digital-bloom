import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCanonicalVideoUrl } from '../../lib/media';

/**
 * FeaturedGallery — Landing Page
 * Displays featured products from Supabase.
 * Prices come from the database (product.price), never hardcoded.
 */
export default function FeaturedGallery() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, video_url, video_file_url, image_url, tier, category, i18n')
          .eq('is_active', true)
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-gallery" id="gallery">
        <div className="landing-container">
          <h2 className="section-title">Featured Collection</h2>
          <div className="gallery-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="gallery-card skeleton"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-gallery" id="gallery">
      <div className="landing-container">
        <h2 className="section-title">Published Experiences</h2>
        <p className="section-subtitle">
          A curated selection of DigitalBloom digital multimedia experiences, each designed to be
          customized and delivered with intention.
        </p>
        <div className="gallery-grid">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="gallery-card"
            >
              <div className="db-watermark gallery-media">
                <video
                  src={getCanonicalVideoUrl(product)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="gallery-video"
                />
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
                {/* Paired corner pills — TM left, © right (Gamble 2026-05-05 PM) */}
                <div className="db-watermark-corner db-watermark-corner--left" aria-hidden="true">™ Digital Bloom</div>
                <div className="db-watermark-corner" aria-hidden="true">© Digital Bloom</div>
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">{product.i18n?.[lang]?.name || product.name}</h3>
                {/* Price always comes from the database — never hardcoded */}
                <p className="gallery-price">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="gallery-cta">
          <Link to="/shop" className="cta-secondary">
            Explore All Experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
