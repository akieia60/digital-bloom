import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getPosterUrl } from '../lib/media';
import { useLocalizedProduct } from '../hooks/useLocalizedProduct';

/**
 * Compact tile for horizontal subcategory lanes (Ak whiteboard sketch
 * 2026-05-07). Uses VideoPlayer so the bloom auto-plays inline like
 * every other product card — Ak's first phone test caught that the
 * tiles were just dark navy placeholders without it.
 */
export default function BloomLaneTile({ product: rawProduct }) {
  const product = useLocalizedProduct(rawProduct);
  const videoUrl = product.video_file_url || product.video_url;
  const posterUrl = getPosterUrl(videoUrl, product.image_url);

  return (
    <Link to={`/product/${product.id}`} className="bloom-lane-tile">
      <div className="bloom-lane-tile__media">
        <VideoPlayer videoUrl={videoUrl} posterUrl={posterUrl} alt={product.name} />
        <div className="bloom-lane-tile__media-overlay" />
        <span className="bloom-lane-tile__price">
          ${parseFloat(product.price).toFixed(2)}
        </span>
      </div>
      <div className="bloom-lane-tile__info">
        <h4 className="bloom-lane-tile__name">{product.name}</h4>
      </div>
    </Link>
  );
}
