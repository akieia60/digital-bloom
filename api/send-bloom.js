import { createClient } from '@supabase/supabase-js';
import {
  normalizeBloomDeliverySettings,
  sendBloomDeliveryEmail,
} from './_lib/bloomDeliveryEmail.js';
import { sendBloomDeliverySms } from './_lib/bloomDeliverySms.js';
import { resolvePublicBaseUrl } from './_lib/publicBaseUrl.js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/send-bloom
 *
 * Called from the buyer's manage page when they click "Send Now".
 * Sends the bloom delivery email to the recipient ONE time,
 * then marks the bloom as delivered so the button disappears.
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
    // Look up the purchase by bloom slug
    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('bloom_slug', bloom_slug.trim())
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!purchase) {
      return res.status(404).json({ error: 'Bloom not found' });
    }

    // Normalize delivery settings
    const delivery = normalizeBloomDeliverySettings(purchase);
    if (!delivery) {
      return res.status(400).json({ error: 'No delivery config on this bloom' });
    }

    // Check if already sent
    if (delivery.emailStatus === 'sent' && delivery.emailSentAt) {
      return res.status(409).json({
        error: 'already_sent',
        message: 'This bloom has already been delivered.',
        sentAt: delivery.emailSentAt,
      });
    }

    // Decide channel — Text (Twilio SMS) if buyer chose phone in checkout
    // AND we have a recipientPhone AND Twilio is configured. Otherwise email.
    const wantsSms = delivery.deliveryChannel === 'phone' && delivery.recipientPhone;
    const twilioConfigured = Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
    );
    const useSms = wantsSms && twilioConfigured;

    const recipientEmail = delivery.target === 'recipient'
      ? delivery.recipientEmail
      : (delivery.recipientEmail || delivery.purchaserEmail || purchase.customer_email || '');

    if (!useSms && !recipientEmail) {
      return res.status(400).json({ error: 'No recipient address (email or phone) on this bloom' });
    }

    // Mark as sending
    const manifest = JSON.parse(JSON.stringify(purchase.composition_manifest || {}));
    manifest.delivery = {
      ...(manifest.delivery || {}),
      emailStatus: 'sending',
      lastAttemptAt: new Date().toISOString(),
      lastError: null,
    };

    await supabase
      .from('purchases')
      .update({ composition_manifest: manifest, updated_at: new Date().toISOString() })
      .eq('id', purchase.id);

    let sentVia = 'email';
    let smsResult = null;

    if (useSms) {
      const giftUrl = `${resolvePublicBaseUrl(req)}/gift/${encodeURIComponent(purchase.bloom_slug)}`;
      try {
        smsResult = await sendBloomDeliverySms({
          to: delivery.recipientPhone,
          purchase,
          delivery,
          giftUrl,
          isTest: isTestMode(purchase),
        });
        sentVia = 'sms';
      } catch (smsError) {
        // Twilio refused — fall back to email if we have one. Mother's Day
        // weekend the manual iMessage path also still exists from Success.
        console.warn('[send-bloom] Twilio SMS failed, falling back to email:', smsError);
        if (!recipientEmail) {
          throw smsError;
        }
        await sendBloomDeliveryEmail({
          req,
          to: recipientEmail,
          purchase,
          delivery,
          isTest: isTestMode(purchase),
        });
      }
    } else {
      await sendBloomDeliveryEmail({
        req,
        to: recipientEmail,
        purchase,
        delivery,
        isTest: isTestMode(purchase),
      });
    }

    // Mark as sent
    const now = new Date().toISOString();
    manifest.delivery.emailStatus = 'sent';
    manifest.delivery.emailSentAt = now;
    manifest.delivery.sentByBuyerAt = now;
    manifest.delivery.lastError = null;
    manifest.delivery.sentVia = sentVia;
    if (sentVia === 'sms' && smsResult?.sid) {
      manifest.delivery.smsMessageSid = smsResult.sid;
    }
    if (recipientEmail) manifest.delivery.recipientEmail = recipientEmail;
    if (delivery.recipientPhone) manifest.delivery.recipientPhone = delivery.recipientPhone;

    await supabase
      .from('purchases')
      .update({ composition_manifest: manifest, updated_at: now })
      .eq('id', purchase.id);

    return res.status(200).json({
      success: true,
      channel: sentVia,
      sentTo: sentVia === 'sms' ? delivery.recipientPhone : recipientEmail,
      sentAt: now,
    });
  } catch (error) {
    console.error('[send-bloom] Error:', error);

    // Try to mark as failed
    try {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('composition_manifest')
        .eq('bloom_slug', bloom_slug.trim())
        .maybeSingle();

      if (purchase) {
        const manifest = JSON.parse(JSON.stringify(purchase.composition_manifest || {}));
        manifest.delivery = {
          ...(manifest.delivery || {}),
          emailStatus: 'failed',
          lastError: String(error.message || error).slice(0, 240),
        };
        await supabase
          .from('purchases')
          .update({ composition_manifest: manifest, updated_at: new Date().toISOString() })
          .eq('id', purchase.id);
      }
    } catch (updateError) {
      console.error('[send-bloom] Failed to update error status:', updateError);
    }

    return res.status(500).json({ error: 'Failed to send bloom' });
  }
}

function isTestMode(purchase) {
  const stripeKey = String(process.env.STRIPE_SECRET_KEY || '');
  const sessionId = String(purchase?.stripe_session_id || '');
  return stripeKey.includes('_test_') || sessionId.startsWith('cs_test_') || sessionId.startsWith('free_');
}
