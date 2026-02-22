import { applyCors } from '../_lib/cors.js';

/**
 * POST /api/grok/generate
 *
 * Starts a Grok Imagine video generation request.
 * Calls xAI's Grok API at https://api.x.ai/v1/videos/generations
 *
 * Body: { prompt, duration, aspect_ratio, resolution, image_url? }
 * Returns: { request_id }
 */
export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    return res.status(500).json({ error: 'GROK_API_KEY not configured' });
  }

  try {
    const { prompt, duration, aspect_ratio, resolution, image_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const body = {
      model: 'grok-2-image',
      prompt,
      duration: parseInt(duration) || 10,
      aspect_ratio: aspect_ratio || '16:9',
      resolution: resolution || '720p',
    };

    if (image_url) {
      body.image_url = image_url;
    }

    const response = await fetch('https://api.x.ai/v1/videos/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Grok API error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json({ request_id: data.request_id || data.id });
  } catch (error) {
    console.error('Grok generate error:', error);
    return res.status(500).json({ error: error.message });
  }
}
