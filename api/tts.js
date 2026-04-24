import { applyCors } from './_lib/cors.js';

const VOICE_ID = 'mOBAekTJFm2VaK96eghn';
const ELEVENLABS_API = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

export const maxDuration = 30;

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ElevenLabs API key not configured' });

  const { text, model_id, voice_settings } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const elRes = await fetch(ELEVENLABS_API, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: model_id || 'eleven_multilingual_v2',
        voice_settings: voice_settings || {
          stability: 0.6,
          similarity_boost: 0.95,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elRes.ok) {
      const errText = await elRes.text();
      console.error('[tts] ElevenLabs error:', elRes.status, errText);
      return res.status(elRes.status).json({ error: `ElevenLabs error: ${elRes.status}` });
    }

    // Stream the audio back
    const audioBuffer = await elRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h
    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    console.error('[tts]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
