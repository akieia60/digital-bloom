import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import LazySection from './LazySection';
import { getCanonicalVideoUrl, getPosterUrl } from '../lib/media';
import { useLocalizedProduct } from '../hooks/useLocalizedProduct';

/**
 * Compact tile for horizontal subcategory lanes (Ak whiteboard sketch
 * 2026-05-07).
 *
 * Lazy-mounts the VideoPlayer only when the tile is near the viewport
 * (Ak 2026-05-08 lazy-load audit): with ~73 active Mother's Day
 * products across 11 lanes, eagerly mounting every <video> = 70+
 * concurrent Supabase metadata fetches on first paint, which is what
 * was making the category page feel sluggish. Now off-screen tiles
 * render a poster-only fallback and the video only mounts when the
 * user actually scrolls near it.
 */
export default function BloomLaneTile({ product: rawProduct }) {
  const product = useLocalizedProduct(rawProduct);
  const videoUrl = getCanonicalVideoUrl(product);
  const posterUrl = getPosterUrl(videoUrl, product.image_url);

  // Static poster fallback rendered until the tile is near-viewport.
  // Same dimensions as VideoPlayer so the layout doesn't jump.
  const posterFallback = (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #1a2640, #0d1b36)' }}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <Link to={`/product/${product.id}`} className="bloom-lane-tile">
      <div className="bloom-lane-tile__media">
        <LazySection
          fallback={posterFallback}
          rootMargin="200px 0px"
          className="w-full h-full"
        >
          <VideoPlayer videoUrl={videoUrl} posterUrl={posterUrl} alt={product.name} />
        </LazySection>
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
