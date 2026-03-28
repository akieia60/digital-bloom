import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getTierByNumber } from '../config/pricingTiers';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Full-width stacked card for the category page list view.
 */
export default function BloomListCard({ product }) {
  const { t } = useLanguage();
  const tierInfo = product.tier ? getTierByNumber(product.tier) : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="bloom-list-card"
    >
      {/* Bloom media */}
      <div className="bloom-list-card__media">
        <VideoPlayer
          videoUrl={product.video_file_url || product.video_url}
          posterUrl={product.image_url}
          alt={product.name}
        />
        <div className="bloom-list-card__media-overlay" />
      </div>

      {/* Bottom info bar */}
      <div className="bloom-list-card__info">
        <div className="bloom-list-card__meta">
          {tierInfo && (
            <span className="bloom-list-card__tier">{t('card_tier')} {tierInfo.tier}</span>
          )}
          <h3 className="bloom-list-card__name">{product.name}</h3>
          {product.description && (
            <p className="bloom-list-card__desc">{product.description}</p>
          )}
        </div>
        <div className="bloom-list-card__right">
          <span className="bloom-list-card__price">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="bloom-list-card__cta">{t('card_customize')}</span>
        </div>
      </div>
    </Link>
  );
}
