import { queueApprovedMarketingPosts } from '../admin/buffer.js';

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
    const result = await queueApprovedMarketingPosts({ source: 'cron' });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error('buffer-marketing cron failed:', error);
    return res.status(error.statusCode || 500).json({ ok: false, error: error.message });
  }
}
