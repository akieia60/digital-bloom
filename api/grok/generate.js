
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
 * Fix (PR #20): Corrected `resolution` to be a top-level parameter and improved error logging.
 * The previous fix (PR #19) incorrectly nested `resolution` inside an `output` object,
 * causing a 422 Unprocessable Entity error. The official xAI API documentation confirms
 * `resolution` is a top-level field.
 */
export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    console.error('FATAL: GROK_API_KEY is not configured in environment variables.');
    return res.status(500).json({ error: 'GROK_API_KEY not configured' });
  }

  try {
    const { prompt, duration, aspect_ratio, resolution, image_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '`prompt` is a required parameter.' });
    }

    // Build the request body according to the official xAI API documentation:
    // https://docs.x.ai/developers/rest-api-reference/inference/videos#video-generation
    const body = {
      model: 'grok-imagine-video',
      prompt,
    };

    // Add optional parameters if they are provided
    if (duration) {
      body.duration = parseInt(duration, 10);
    }
    if (aspect_ratio) {
      body.aspect_ratio = aspect_ratio;
    }
    // FIX: `resolution` is a top-level parameter, not nested in `output`.
    if (resolution) {
      body.resolution = resolution;
    }

    // Handle optional image-to-video generation by providing the image URL in a nested object.
    if (image_url) {
      body.image = { url: image_url };
    }

    console.log('Sending request to xAI Grok API with body:', JSON.stringify(body, null, 2));

    const response = await fetch('https://api.x.ai/v1/videos/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    // CRITICAL: Log the full error response from xAI for debugging.
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Grok API Error: Status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        responseBody: errorBody,
      });
      // Return a detailed error to the client.
      return res.status(response.status).json({
        error: `Grok API request failed with status ${response.status}`,
        details: JSON.parse(errorBody), // Try to parse for structured error details
      });
    }

    const data = await response.json();
    console.log('Successfully initiated Grok video generation. Request ID:', data.id);
    return res.status(200).json({ request_id: data.id });

  } catch (error) {
    console.error('An unexpected error occurred in /api/grok/generate:', error);
    return res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}
