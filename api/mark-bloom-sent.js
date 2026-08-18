import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/mark-bloom-sent
 *
 * The hand-off-to-Messages path (A.K. lane, 2026-08-18).
 *
 * Digital Bloom cannot send SMS itself right now — both Twilio numbers are
 * blocked at the carrier (toll-free verification TWILIO_REJECTED / error
 * 30032; A2P 10DLC brand FAILED / error 30034). Rather than leave text
 * delivery broken, the buyer's manage page opens THEIR OWN Messages app with
 * the recipient and the bloom link prefilled. The text then arrives from a
 * number the recipient already knows, which lands better anyway.
 *
 * This endpoint records that hand-off so the send-once lock, the "Delivered"
 * state, and Ak's reporting all behave the same as a server-side send. It
 * deliberately does NOT talk to any provider.
 *
 * Body: { bloom_slug: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bloom_slug } = req.body || {};
  if (!bloom_slug || typeof bloom_slug !== 'string') {
    return res.status(400).json({ error: 'Missing bloom_slug' });
  }

  try {
    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('id, bloom_slug, composition_manifest')
      .eq('bloom_slug', bloom_slug.trim())
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!purchase) return res.status(404).json({ error: 'Bloom not found' });

    const manifest = JSON.parse(JSON.stringify(purchase.composition_manifest || {}));
    const delivery = manifest.delivery || {};

    // Same send-once lock as /api/send-bloom.
    const currentSendCount = Number(delivery.sendCount || 0);
    if (currentSendCount >= 1 || (delivery.emailStatus === 'sent' && delivery.emailSentAt)) {
      return res.status(409).json({
        error: 'already_sent',
        message: 'This bloom has already been delivered.',
        sentAt: delivery.emailSentAt || null,
      });
    }

    const now = new Date().toISOString();
    manifest.delivery = {
      ...delivery,
      emailStatus: 'sent',
      emailSentAt: now,
      sentByBuyerAt: now,
      sendCount: currentSendCount + 1,
      sentVia: 'buyer_sms',
      lastError: null,
      lastAttemptAt: now,
    };

    const { error: updateError } = await supabase
      .from('purchases')
      .update({ composition_manifest: manifest, updated_at: now })
      .eq('id', purchase.id);

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      channel: 'buyer_sms',
      sentTo: delivery.recipientPhone || '',
      sentAt: now,
    });
  } catch (error) {
    console.error('[mark-bloom-sent] Error:', error);
    return res.status(500).json({ error: 'Failed to record delivery' });
  }
}
