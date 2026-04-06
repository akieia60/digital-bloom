/**
 * /api/env-check
 * Returns present/missing status for each required environment variable.
 * NEVER exposes actual values — only boolean presence.
 */
import { applyCors } from './_lib/cors.js';
import { requireFounder } from './_lib/founderAuth.js';

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'APP_BASE_URL',
];

export default async function handler(req, res) {
  // CORS hardening
  if (!applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const founder = await requireFounder(req, res);
    if (!founder) return;

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
