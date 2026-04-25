/**
 * api/refine-prompt.js
 * Digital Bloom — Raw Idea → AI-Refined 3-Scene Video Prompt
 *
 * POST body: { rawIdea: string, category: string, variation: number (1-3) }
 * Returns:   { scenes: [{ label, text }, ...] }
 *
 * Requires: ANTHROPIC_API_KEY in Vercel environment variables
 */

import { applyCors } from './_lib/cors.js';

export const maxDuration = 30;

const VARIATION_SEEDS = {
  1: {
    palette: 'deep navy, pure gold, and ivory',
    flowers: 'roses and peonies',
    balloons: 'gold, black, and ivory',
    light: 'warm cinematic gold lighting',
    energy: 'elegant and cinematic',
  },
  2: {
    palette: 'rich burgundy, champagne, and deep purple',
    flowers: 'dahlias, orchids, and roses',
    balloons: 'burgundy, champagne, and violet',
    light: 'dramatic warm candlelit lighting',
    energy: 'bold and luxurious',
  },
  3: {
    palette: 'deep teal, rose gold, and white',
    flowers: 'garden roses, ranunculus, and wildflowers',
    balloons: 'teal, rose gold, and white',
    light: 'soft natural cinematic light',
    energy: 'warm and deeply personal',
  },
};

const SYSTEM_PROMPT = `You are the Creative Director for Digital Bloom™, a luxury digital gifting platform.
Your job is to take a raw idea (a phrase, a description, or a vague concept) and write a polished, detailed, 3-scene AI video generation prompt formatted for the Digital Bloom™ system.

DIGITAL BLOOM FORMAT RULES:
• Every video is exactly 30 seconds: Scene 1 (0–10s), Scene 2 (10–20s), Scene 3 (20–30s)
• Scene 1: "Card & Reveal" — ALWAYS begin the text with the exact phrase: "Motion begins immediately from frame one." Then: a beautiful card is shown, it opens, a message appears, 3 balloons begin to rise. Motion is continuous — never a still or static opening frame.
• Scene 2: "The Gift & Bloom" — a gift box appears, the lid opens with a dramatic light release, flowers bloom upward in slow motion. Maintain continuous movement throughout — transformation from card to box must feel seamless.
• Scene 3: "Finale" — flowers fill the frame, balloons float into full view with the message text. ALWAYS end the text with the exact phrase: "In the final 3 seconds motion gradually slows. Scene breathes and fades gently to warm golden light. Never abrupt."
• Every scene must be rich with sensory detail: textures, colors, lighting, camera movement, petal behavior
• The color palette, flower types, and balloon colors should match the variation seed provided
• Never use "Digital Bloom" as text in the prompt (no logos)
• Keep each scene between 60–90 words — detailed enough to guide an AI video model precisely
• The message on the card and balloons should reflect the raw idea faithfully

THE GOAT FORMULA (non-negotiable structure):
  Scene 1 → Starts with: "Motion begins immediately from frame one."
  Scene 2 → Continuous motion, card-to-gift transformation, no pauses
  Scene 3 → Ends with: "In the final 3 seconds motion gradually slows. Scene breathes and fades gently to warm golden light. Never abrupt."

VARIATION SEEDS will be provided — use them to make each output feel distinct.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{"title":"Short memorable title for this prompt","scenes":[{"label":"Scene 1 — Card & Reveal (0–10s)","text":"..."},{"label":"Scene 2 — The Gift & Bloom (10–20s)","text":"..."},{"label":"Scene 3 — Finale (20–30s)","text":"..."}]}`;

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { rawIdea, category, variation = 1 } = req.body || {};

  if (!rawIdea || !rawIdea.trim()) {
    return res.status(400).json({ error: 'rawIdea is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set. Add it to your Vercel environment variables at vercel.com/dashboard → your project → Settings → Environment Variables.'
    });
  }

  const seed = VARIATION_SEEDS[variation] || VARIATION_SEEDS[1];

  const userMessage = `Raw idea: "${rawIdea.trim()}"
Category: ${category || 'General'}
Variation seed:
  - Color palette: ${seed.palette}
  - Flowers: ${seed.flowers}
  - Balloons: ${seed.balloons}
  - Lighting: ${seed.light}
  - Overall energy: ${seed.energy}

Transform this raw idea into a polished Digital Bloom 3-scene video prompt. The message on the card and balloons should reflect the raw idea. Use the variation seed for colors, flowers, and mood.`;

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error('[refine-prompt] Anthropic error:', errBody);
      let userMsg = 'AI service error. Check your API key and try again.';
      try {
        const errJson = JSON.parse(errBody);
        if (errJson?.error?.message) userMsg = errJson.error.message;
      } catch (_) {}
      return res.status(502).json({ error: userMsg });
    }

    const data = await anthropicRes.json();
    const rawText = data?.content?.[0]?.text || '';

    // Parse the JSON response from Claude
    let parsed;
    try {
      // Strip any accidental markdown code fences
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[refine-prompt] JSON parse error:', rawText);
      return res.status(502).json({ error: 'AI returned an unexpected format. Try again.' });
    }

    return res.status(200).json({
      title: parsed.title || 'Refined Prompt',
      scenes: parsed.scenes || [],
      category,
      variation,
    });

  } catch (err) {
    console.error('[refine-prompt] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
