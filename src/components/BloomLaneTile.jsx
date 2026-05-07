import { Link } from 'react-router-dom';
import { getPosterUrl } from '../lib/media';
import { useLocalizedProduct } from '../hooks/useLocalizedProduct';

/**
 * Compact tile for horizontal subcategory lanes (Ak whiteboard sketch
 * 2026-05-07). Smaller than BloomListCard so a row of them fits inside
 * a horizontally-scrolling strip on phones. Uses a static poster
 * instead of an autoplay video — multiple inline videos crushed
 * scroll performance on mid-range Androids during testing.
 */
export default function BloomLaneTile({ product: rawProduct }) {
  const product = useLocalizedProduct(rawProduct);
  const videoUrl = product.video_file_url || product.video_url;
  const posterUrl = getPosterUrl(videoUrl, product.image_url);

  return (
    <Link to={`/product/${product.id}`} className="bloom-lane-tile">
      <div className="bloom-lane-tile__media">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={product.name}
            loading="lazy"
            className="bloom-lane-tile__poster"
          />
        ) : (
          <div className="bloom-lane-tile__poster-placeholder" />
        )}
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
