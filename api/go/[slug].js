import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

// /go/:slug — tracked redirect for influencer / marketing share links.
// Built 2026-05-06 so Ak can hand each promoter a unique URL like
//   digitalbloom.store/go/karen
// and measure who actually drives sales.
//
// Behaviour:
//  • ANY slug works — no pre-registration. A click on /go/anything just
//    redirects to / with ?ref=anything and logs a row in referral_clicks.
//  • If a row exists in referral_links for this slug, its destination_path
//    + UTM fields override the defaults (e.g. /go/gospel → /shop/spiritual).
//  • IPs are SHA-256-hashed before storage — we never persist raw IPs.
//  • The redirect itself is 302 so browsers don't cache it; Ak can re-route
//    a slug later by editing the override row.

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(`db-ip:${ip}`).digest('hex').slice(0, 32);
}

function resolveBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
  const proto = req?.headers?.['x-forwarded-proto'] || 'https';
  const host = req?.headers?.host || 'digitalbloom.store';
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  const rawSlug = String(req.query?.slug || '').trim();
  // Sanitise — strip everything that isn't url-friendly. Keeps the table
  // clean and stops SQL/log injection at the door.
  const slug = rawSlug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64).toLowerCase();

  if (!slug) {
    return res.redirect(302, '/');
  }

  // Check for a destination override.
  let override = null;
  try {
    const { data } = await supabase
      .from('referral_links')
      .select('destination_path, utm_source, utm_medium, utm_campaign, is_active')
      .eq('slug', slug)
      .maybeSingle();
    if (data && data.is_active) override = data;
  } catch (lookupErr) {
    // A flaky lookup never blocks the redirect — fall through to the
    // default homepage destination.
    console.warn(`[go/${slug}] override lookup failed:`, lookupErr);
  }

  const baseUrl = resolveBaseUrl(req);
  const destinationPath = override?.destination_path || '/';
  const url = new URL(destinationPath, baseUrl);
  url.searchParams.set('ref', slug);
  if (override?.utm_source)   url.searchParams.set('utm_source', override.utm_source);
  if (override?.utm_medium)   url.searchParams.set('utm_medium', override.utm_medium);
  if (override?.utm_campaign) url.searchParams.set('utm_campaign', override.utm_campaign);

  // Fire-and-forget click log — we don't await on it for the user-facing
  // redirect, but we await briefly to avoid losing it if Vercel kills
  // the function early.
  const clientIp =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    null;

  try {
    await supabase.from('referral_clicks').insert({
      slug,
      destination: url.toString(),
      user_agent: String(req.headers['user-agent'] || '').slice(0, 400),
      referrer: String(req.headers['referer'] || req.headers['referrer'] || '').slice(0, 400),
      ip_hash: hashIp(clientIp),
      country: req.headers['x-vercel-ip-country'] || null,
      region:  req.headers['x-vercel-ip-country-region'] || null,
      city:    req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : null,
      utm_source:   override?.utm_source || null,
      utm_medium:   override?.utm_medium || null,
      utm_campaign: override?.utm_campaign || null,
    });
  } catch (logErr) {
    console.warn(`[go/${slug}] click logging failed:`, logErr);
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.redirect(302, url.toString());
}
