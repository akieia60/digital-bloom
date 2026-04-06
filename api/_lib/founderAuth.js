import { createClient } from '@supabase/supabase-js';

const FOUNDER_EMAILS = [
  'akieia60@gmail.com',
  'akieia.davis@gmail.com',
  'admin@digitalbloom.art',
];

export async function requireFounder(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized — missing auth token' });
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Unauthorized — invalid token' });
    return null;
  }

  if (!FOUNDER_EMAILS.includes(user.email?.toLowerCase())) {
    res.status(403).json({ error: 'Forbidden — not a founder account' });
    return null;
  }

  return user;
}

export { FOUNDER_EMAILS };
