/**
 * Shared CORS utility for Digital Bloom API endpoints.
 *
 * Allowed origins:
 *   - https://digitalbloom.store          (production)
 *   - https://www.digitalbloom.store      (production www)
 *   - https://digitabloom.com             (legacy alternate)
 *   - https://www.digitabloom.com         (legacy alternate www)
 *   - https://flower-shop*.vercel.app      (Vercel preview deployments for this project)
 *   - APP_BASE_URL / VERCEL_URL env vars  (explicit deployment overrides)
 *   - http://localhost:*                  (local development)
 *
 * Returns 403 for any other origin.
 */

const DEPLOYMENT_ORIGINS = [
  process.env.APP_BASE_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null,
].filter(Boolean);

const ALLOWED_ORIGINS = [
  'https://digitalbloom.store',
  'https://www.digitalbloom.store',
  'https://digitabloom.com',
  'https://www.digitabloom.com',
  ...DEPLOYMENT_ORIGINS,
];

/**
 * Check whether the given origin is allowed.
 * Allows production domains, Digital Bloom Vercel preview URLs, and any localhost port.
 */
function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server requests (no origin header)
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow any localhost port for development
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  // Allow any Vercel preview deployment for this project (flower-shop*.vercel.app)
  if (/^https:\/\/flower-shop[^.]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

/**
 * Apply CORS headers to the response.
 * If the origin is not allowed, sends a 403 and returns false.
 * On OPTIONS preflight, sends 200 and returns false (caller should stop).
 * Returns true when the caller should continue processing the request.
 */
export function applyCors(req, res) {
  const origin = req.headers.origin;

  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Forbidden: origin not allowed' });
    return false;
  }

  // Set CORS headers — reflect the actual origin when it's allowed
  const allowedOrigin = origin || ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  return true;
}
