const VIDEO_ASSET_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
const DEFAULT_VIDEO_START_OFFSET = 0.9;

export function isVideoAsset(url) {
  return Boolean(url) && VIDEO_ASSET_RE.test(url);
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
