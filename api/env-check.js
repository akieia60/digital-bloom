/**
 * /api/env-check
 * Returns present/missing status for each required environment variable.
 * NEVER exposes actual values — only boolean presence.
 * 
 * Security: Requires a valid Supabase auth token in the Authorization header.
 * Only founder emails in the allowlist can access this endpoint.
 */
import { createClient } from '@supabase/supabase-js';

// Founder email allowlist — only these emails can access the env-check endpoint
const FOUNDER_EMAILS = [
  'akieia60@gmail.com',
  'akieia.davis@gmail.com',
  'admin@digitalbloom.art',
];

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'APP_BASE_URL',
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized — missing auth token' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Create a Supabase client with the user's token to verify identity
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized — invalid token' });
    }

    // Check founder allowlist
    if (!FOUNDER_EMAILS.includes(user.email?.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden — not a founder account' });
    }

    // Build status map — NEVER expose actual values
    const envStatus = {};
    for (const varName of REQUIRED_ENV_VARS) {
      const value = process.env[varName];
      envStatus[varName] = {
        present: !!(value && value.trim().length > 0),
      };
    }

    // Also check VITE_ prefixed versions (used by frontend)
    const vitePrefixed = {
      'VITE_SUPABASE_URL': 'SUPABASE_URL (frontend)',
      'VITE_SUPABASE_ANON_KEY': 'SUPABASE_ANON_KEY (frontend)',
    };

    for (const [varName, label] of Object.entries(vitePrefixed)) {
      const value = process.env[varName];
      envStatus[varName] = {
        present: !!(value && value.trim().length > 0),
        label,
      };
    }

    res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      env: envStatus,
    });
  } catch (error) {
    console.error('env-check error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
