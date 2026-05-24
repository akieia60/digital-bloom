const VIDEO_ASSET_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
const REMOTE_URL_RE = /^https?:\/\//i;
const DEFAULT_VIDEO_START_OFFSET = 0.9;

export function isVideoAsset(url) {
  return Boolean(url) && VIDEO_ASSET_RE.test(url);
}

// Canonical bloom-video resolver. Prefers absolute remote URLs (Supabase / R2 /
// CDN) over legacy local /videos/... paths so the storefront never falls back
// to bundled Vercel static assets when a remote URL exists. Returns null if
// the product has nothing playable.
export function getCanonicalVideoUrl(product) {
  if (!product || typeof product !== 'object') return null;
  const candidates = [product.video_file_url, product.video_url];
  for (const c of candidates) {
    if (typeof c === 'string' && REMOTE_URL_RE.test(c)) return c;
  }
  return candidates.find((v) => typeof v === 'string' && v.length > 0) || null;
}

export function getSafeImageUrl(imageUrl) {
  return isVideoAsset(imageUrl) ? null : imageUrl || null;
}

export function getPosterUrl(videoUrl, imageUrl) {
  const explicitPoster = getSafeImageUrl(imageUrl);
  if (explicitPoster) return explicitPoster;

  const cleanVideoUrl = String(videoUrl || '').split('?')[0];
  const shopVideoMatch = cleanVideoUrl.match(/\/videos\/shop\/([^/]+)\.(mp4|webm|mov|m4v)$/i);
  if (shopVideoMatch) {
    return `/images/posters/${shopVideoMatch[1]}.jpg`;
  }

  return null;
}

export function primeVideoPlayback(eventOrVideo, startAt = DEFAULT_VIDEO_START_OFFSET) {
  const video = eventOrVideo?.currentTarget || eventOrVideo;
  if (!video || video.dataset?.primed === 'true') return;

  try {
    const duration = Number(video.duration || 0);
    if (duration > startAt + 0.25 && Number(video.currentTime || 0) < startAt) {
      video.currentTime = startAt;
    }
    if (video.dataset) video.dataset.primed = 'true';
  } catch {
    // Some browsers block seeking until enough metadata is ready.
  }
}
