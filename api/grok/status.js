import { applyCors } from '../_lib/cors.js';

/**
 * GET /api/grok/status?request_id=xxx
 *
 * Polls the xAI Grok Imagine API for video generation status.
 * Endpoint: GET https://api.x.ai/v1/videos/{request_id}
 *
 * Returns: { status, video_url?, duration?, model? }
 *
 * Fix (PR #19): Updated status polling endpoint path from
 * /v1/videos/generations/{request_id} → /v1/videos/{request_id}
 * per xAI API spec. Also aligned 'done' status detection with
 * the spec (status field is absent when done; video object is present).
 */
export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    return res.status(500).json({ error: 'GROK_API_KEY not configured' });
  }

  const { request_id } = req.query;
  if (!request_id) {
    return res.status(400).json({ error: 'request_id is required' });
  }

  try {
    // FIX: correct polling endpoint is /v1/videos/{request_id}
    // (was /v1/videos/generations/{request_id})
    const response = await fetch(`https://api.x.ai/v1/videos/${request_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok status error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Grok status error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    // xAI API response when done: { video: { url, duration }, model }
    // xAI API response when pending: { status: "pending" }
    // xAI API response when expired: { status: "expired" }
    const result = {
      status: data.status || 'pending',
    };

    if (data.video && data.video.url) {
      // Video is ready — status field may be absent or "done"
      result.status = 'done';
      result.video_url = data.video.url;
      result.duration = data.video.duration || null;
      result.model = data.model || null;
    } else if (data.status === 'done' || data.status === 'completed') {
      result.status = 'done';
      result.video_url = data.video?.url || data.url || data.video_url || null;
      result.duration = data.video?.duration || data.duration || null;
      result.model = data.model || null;
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Grok status check error:', error);
    return res.status(500).json({ error: error.message });
  }
}
