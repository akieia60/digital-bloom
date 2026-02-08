import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Credit code is required' });
    }

    // Look up credit in database
    const { data: credit, error } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !credit) {
      return res.status(404).json({ 
        error: 'Invalid credit code',
        valid: false 
      });
    }

    // Check if credit is active and has balance
    if (credit.status !== 'active' && credit.status !== 'partially_used') {
      return res.status(400).json({ 
        error: 'This credit has already been fully redeemed',
        valid: false 
      });
    }

    if (credit.remaining_amount_cents <= 0) {
      return res.status(400).json({ 
        error: 'This credit has no remaining balance',
        valid: false 
      });
    }

    // Return credit details
    res.status(200).json({
      valid: true,
      code: credit.code,
      remaining_amount_cents: credit.remaining_amount_cents,
      initial_amount_cents: credit.initial_amount_cents,
      status: credit.status
    });

  } catch (error) {
    console.error('Error validating credit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
