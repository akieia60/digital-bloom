import { createClient } from '@supabase/supabase-js';
import { processBloomDeliveryEmails } from '../_lib/bloomDeliveryEmail.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function isAuthorizedCronRequest(req) {
  const configuredSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || '';
  const userAgent = String(req.headers['user-agent'] || '');

  if (configuredSecret && authHeader === `Bearer ${configuredSecret}`) {
    return true;
  }

  return userAgent.includes('vercel-cron');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorizedCronRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('status', 'completed')
      .not('composition_manifest', 'is', null)
      .gte('created_at', cutoff.toISOString())
      .order('created_at', { ascending: false })
      .limit(250);

    if (error) throw error;

    const processed = await processBloomDeliveryEmails({
      supabase,
      purchases: purchases || [],
      req,
      explicitTestMode: String(process.env.STRIPE_SECRET_KEY || '').includes('_test_'),
    });

    const sentCount = processed.filter((purchase) => purchase.composition_manifest?.delivery?.emailStatus === 'sent').length;
    const queuedCount = processed.filter((purchase) => purchase.composition_manifest?.delivery?.emailStatus === 'queued').length;

    return res.status(200).json({
      ok: true,
      processed: processed.length,
      sent: sentCount,
      queued: queuedCount,
    });
  } catch (error) {
    console.error('process-bloom-deliveries cron failed:', error);
    return res.status(500).json({ error: 'Failed to process bloom delivery queue' });
  }
}
