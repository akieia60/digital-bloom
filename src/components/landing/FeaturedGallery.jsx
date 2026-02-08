import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function FeaturedGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
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
          A curated selection of DigitalBloom digital multimedia experiences, each designed to be customized and delivered with intention.
        </p>
        <div className="gallery-grid">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="gallery-card"
            >
              <div className="gallery-media">
                <video
                  src={product.video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="gallery-video"
                />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">{product.name}</h3>
                <p className="gallery-price">${product.price}</p>
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
