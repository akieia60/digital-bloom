import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getTierByNumber } from '../config/pricingTiers';
import { getPosterUrl } from '../lib/media';
import OCCASIONS from '../data/occasions';

/**
 * Full-width stacked card for the category page list view.
 * Matches the hand-drawn sketch: large rectangular card with bloom
 * image/video as the focal point.
 */
export default function BloomListCard({ product }) {
  const tierInfo = product.tier ? getTierByNumber(product.tier) : null;
  const videoUrl = product.video_file_url || product.video_url;
  const posterUrl = getPosterUrl(videoUrl, product.image_url);
  const occasion = OCCASIONS[product.category];
  const occasionName = occasion?.name;
  const balloonGreeting = occasion?.customizerDefaults?.balloonMessage;

  return (
    <Link
      to={`/product/${product.id}`}
      className="bloom-list-card"
    >
      {/* Bloom media — fills the card */}
      <div className="bloom-list-card__media">
        <VideoPlayer
          videoUrl={videoUrl}
          posterUrl={posterUrl}
          alt={product.name}
        />
        <div className="bloom-list-card__media-overlay" />
        {/* Occasion greeting — overlaid on the video */}
        {balloonGreeting && (
          <div className="bloom-list-card__occasion-label" aria-hidden="true">
            {balloonGreeting}
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="bloom-list-card__info">
        <div className="bloom-list-card__meta">
          {occasionName && (
            <span className="bloom-list-card__occasion-badge">{occasionName}</span>
          )}
          {tierInfo && (
            <span className="bloom-list-card__tier">Tier {tierInfo.tier}</span>
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
          <span className="bloom-list-card__cta">Customize</span>
        </div>
      </div>
    </Link>
  );
}
