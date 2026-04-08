const FALLBACK_PUBLIC_BASE_URL = 'https://www.digitalbloom.store';

function normalizeHostname(hostname = '') {
  const value = String(hostname || '').toLowerCase();
  if (
    value === 'digitalbloom.com' ||
    value === 'www.digitalbloom.com' ||
    value === 'digitabloom.com' ||
    value === 'www.digitabloom.com' ||
    value === 'digitalbloom.store'
  ) {
    return 'www.digitalbloom.store';
  }
  return value;
}

function normalizeCandidate(value) {
  if (!value) return null;

  try {
    const url = new URL(value, FALLBACK_PUBLIC_BASE_URL);
    const normalizedHostname = normalizeHostname(url.hostname);
    if (normalizedHostname) {
      url.hostname = normalizedHostname;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function normalizePublicBaseUrl(value) {
  return normalizeCandidate(value) || FALLBACK_PUBLIC_BASE_URL;
}

export function resolvePublicBaseUrl(req) {
  const forwardedProto = req?.headers?.['x-forwarded-proto'];
  const forwardedHost = req?.headers?.['x-forwarded-host'] || req?.headers?.host;
  const forwardedOrigin = forwardedHost ? `${forwardedProto || 'https'}://${forwardedHost}` : null;

  const candidates = [
    req?.headers?.origin,
    req?.headers?.referer,
    forwardedOrigin,
    process.env.APP_BASE_URL,
    process.env.VITE_APP_URL,
    process.env.VITE_API_URL,
    FALLBACK_PUBLIC_BASE_URL,
  ];

  for (const candidate of candidates) {
    const resolved = normalizeCandidate(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return FALLBACK_PUBLIC_BASE_URL;
}
