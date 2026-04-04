import { applyCors } from './_lib/cors.js';
import { requireFounder } from './_lib/founderAuth.js';
import { renderBloomDelivery } from './_lib/renderBloom.js';

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const founder = await requireFounder(req, res);
  if (!founder) return;

  try {
    const { purchaseId } = req.body || {};
    if (!purchaseId) {
      return res.status(400).json({ error: 'purchaseId is required' });
    }

    const result = await renderBloomDelivery(purchaseId);
    return res.status(200).json({
      ok: true,
      founder: founder.email,
      ...result,
    });
  } catch (error) {
    console.error('render-bloom error:', error);
    return res.status(500).json({
      error: 'Failed to render personalized bloom',
      details: error.message,
    });
  }
}
