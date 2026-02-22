import { applyCors } from '../_lib/cors.js';

/**
 * POST /api/grok/generate
 *
 * Starts a Grok Imagine video generation request.
 * Calls xAI's API at https://api.x.ai/v1/videos/generations
 *
 * Body: { prompt, duration, aspect_ratio, resolution, image_url? }
 * Returns: { request_id }
 *
 * Fix (PR #19): Corrected model name from 'grok-2-image' → 'grok-imagine-video',
 * removed unsupported 'resolution' top-level field (must be nested in 'output'),
 * and ensured 'aspect_ratio' is passed correctly per xAI API spec.
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

    // Build request body per xAI API spec:
    // https://docs.x.ai/developers/rest-api-reference/inference/videos
    const body = {
      model: 'grok-imagine-video',   // FIX: was 'grok-2-image' (wrong model name)
      prompt,
      duration: parseInt(duration) || 10,
      aspect_ratio: aspect_ratio || '16:9',  // FIX: top-level field (not nested)
    };

    // Resolution is nested inside the 'output' object per xAI spec
    // FIX: was incorrectly placed as a top-level field
    if (resolution) {
      body.output = { resolution };
    }

    // Optional: image-to-video — provide image as nested object with url
    if (image_url) {
      body.image = { url: image_url };  // FIX: was body.image_url (wrong structure)
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
