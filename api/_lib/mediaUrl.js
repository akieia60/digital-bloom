// Backend mirror of src/lib/media.js getCanonicalVideoUrl. Prefers absolute
// remote URLs (Supabase / R2 / CDN) over legacy local /videos/... paths.
// Used by server-side handlers that can't import from src/.
const REMOTE_URL_RE = /^https?:\/\//i;

export function getCanonicalVideoUrl(product) {
  if (!product || typeof product !== 'object') return null;
  const candidates = [product.video_file_url, product.video_url];
  for (const c of candidates) {
    if (typeof c === 'string' && REMOTE_URL_RE.test(c)) return c;
  }
  return candidates.find((v) => typeof v === 'string' && v.length > 0) || null;
}
