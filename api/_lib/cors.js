/**
 * Shared CORS utility for Digital Bloom API endpoints.
 *
 * Allowed origins:
 *   - https://digitabloom.com        (production)
 *   - https://www.digitabloom.com    (production www)
 *   - https://*.vercel.app           (Vercel preview deployments)
 *   - APP_BASE_URL env var           (any custom deployment URL)
 *   - http://localhost:*             (local development)
 *
 * Returns 403 for any other origin.
 */

const ALLOWED_ORIGINS = [
  'https://digitabloom.com',
  'https://www.digitabloom.com',
  // Pull in any custom deployment URL set via environment variable
  ...(process.env.APP_BASE_URL ? [process.env.APP_BASE_URL] : []),
];

/**
 * Check whether the given origin is allowed.
 * Allows production domains, Vercel preview URLs, and any localhost port.
 */
function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server requests (no origin header)
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow any Vercel preview deployment (*.vercel.app)
  if (/^https:\/\/[a-zA-Z0-9._-]+(\.vercel\.app)$/.test(origin)) return true;
  // Allow any localhost port for development
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
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
