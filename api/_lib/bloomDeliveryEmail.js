import { resolvePublicBaseUrl } from './publicBaseUrl.js';
import { sendBloomDeliverySms } from './bloomDeliverySms.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDeliveryDate(deliveryDate, timezone = 'America/Chicago') {
  if (!deliveryDate) return '';

  try {
    const [year, month, day] = String(deliveryDate).split('-').map(Number);
    const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1, 14, 0, 0));
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return deliveryDate;
  }
}

function currentDateInTimezone(timezone = 'America/Chicago', now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function resolveSender() {
  return (
    process.env.BLOOM_CREDIT_EMAIL_FROM ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    'Digital Bloom <onboarding@resend.dev>'
  );
}

function cloneManifest(purchase) {
  return purchase?.composition_manifest && typeof purchase.composition_manifest === 'object'
    ? JSON.parse(JSON.stringify(purchase.composition_manifest))
    : {};
}

export function normalizeBloomDeliverySettings(purchase) {
  const delivery = purchase?.composition_manifest?.delivery;
  if (!delivery || typeof delivery !== 'object') return null;

  const target = delivery.target === 'recipient' ? 'recipient' : 'self';
  const purchaserEmail = String(delivery.purchaserEmail || purchase.customer_email || '').trim();
  const recipientEmail = String(
    target === 'recipient'
      ? (delivery.recipientEmail || '')
      : (delivery.recipientEmail || purchaserEmail || '')
  ).trim();

  // Phone delivery surfaced 2026-05-06 (Twilio wired). When the buyer chose
  // the Text option in checkout, recipientPhone + deliveryChannel='phone'
  // ride along on the manifest. Stays empty for email-channel orders.
  const recipientPhone = String(delivery.recipientPhone || '').trim();
  const deliveryChannel = delivery.deliveryChannel === 'phone' ? 'phone' : 'email';

  return {
    target,
    purchaserEmail,
    recipientEmail,
    recipientPhone,
    deliveryChannel,
    deliveryMode: delivery.deliveryMode === 'scheduled' ? 'scheduled' : 'now',
    deliveryDate: delivery.deliveryDate ? String(delivery.deliveryDate) : '',
    buyerTimezone: delivery.buyerTimezone || 'America/Chicago',
    emailStatus: delivery.emailStatus || 'pending',
    emailSentAt: delivery.emailSentAt || null,
    lastAttemptAt: delivery.lastAttemptAt || null,
    lastError: delivery.lastError || null,
    recipientName: delivery.recipientName || purchase.composition_manifest?.customization?.message?.toName || '',
    senderName: delivery.senderName || purchase.composition_manifest?.customization?.message?.fromName || '',
    testLabel: Boolean(delivery.testLabel),
    buyerEmailStatus: delivery.buyerEmailStatus || 'pending',
    buyerEmailSentAt: delivery.buyerEmailSentAt || null,
    buyerLastAttemptAt: delivery.buyerLastAttemptAt || null,
    buyerLastError: delivery.buyerLastError || null,
  };
}

export function isBloomDeliveryDue(delivery, now = new Date()) {
  if (!delivery) return false;
  if (delivery.deliveryMode !== 'scheduled') return true;
  if (!delivery.deliveryDate) return true;
  return currentDateInTimezone(delivery.buyerTimezone, now) >= delivery.deliveryDate;
}

export function isScheduledBloomLocked(delivery, now = new Date()) {
  if (!delivery) return false;
  if (delivery.deliveryMode !== 'scheduled') return false;
  if (delivery.emailStatus === 'sent' && delivery.emailSentAt) return false;
  return !isBloomDeliveryDue(delivery, now);
}

function isTestModePurchase(purchase, explicitTestMode) {
  if (typeof explicitTestMode === 'boolean') return explicitTestMode;
  const stripeKey = String(process.env.STRIPE_SECRET_KEY || '');
  const sessionId = String(purchase?.stripe_session_id || '');
  return stripeKey.includes('_test_') || sessionId.startsWith('cs_test_') || sessionId.startsWith('free_');
}

async function updatePurchaseDeliveryManifest(supabase, purchase, patch) {
  const manifest = cloneManifest(purchase);
  const currentDelivery = manifest.delivery && typeof manifest.delivery === 'object' ? manifest.delivery : {};
  const nextManifest = {
    ...manifest,
    delivery: {
      ...currentDelivery,
      ...patch,
    },
  };

  const { data, error } = await supabase
    .from('purchases')
    .update({
      composition_manifest: nextManifest,
      updated_at: new Date().toISOString(),
    })
    .eq('id', purchase.id)
    .select('*, products(*)')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function sendBloomDeliveryEmail({
  req,
  to,
  purchase,
  delivery,
  isTest = false,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Bloom delivery email skipped: RESEND_API_KEY not configured');
    return { skipped: true, reason: 'missing_resend_api_key' };
  }

  if (!to) {
    console.warn('Bloom delivery email skipped: missing recipient address');
    return { skipped: true, reason: 'missing_recipient_email' };
  }

  const appBaseUrl = resolvePublicBaseUrl(req);
  const giftUrl = `${appBaseUrl}/gift/${encodeURIComponent(purchase.bloom_slug)}`;
  const message = purchase.composition_manifest?.customization?.message || {};
  const productName = purchase.products?.name || 'Digital Bloom';
  const safeToName = escapeHtml(delivery.recipientName || message.toName || 'there');
  const safeFromName = escapeHtml(delivery.senderName || message.fromName || purchase.customer_name || 'Someone special');
  const safeMessage = escapeHtml(message.short || '');
  const testPrefix = isTest ? '[TEST] ' : '';

  const html = `
    <div style="background:#f7efe7;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#201b17;">
      <div style="max-width:560px;margin:0 auto;background:#fffaf5;border:1px solid rgba(201,161,74,0.28);border-radius:24px;overflow:hidden;">
        <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#0c1b3f 0%,#132a58 100%);color:#f8f1eb;">
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#d9b45d;margin-bottom:10px;">${isTest ? 'TEST DELIVERY · ' : ''}Digital Bloom</div>
          <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:600;">A bloom is ready for you</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:rgba(248,241,235,0.84);">
            ${safeToName === 'there' ? 'Your Digital Bloom is ready to open.' : `${safeToName}, your Digital Bloom is ready to open.`}
          </p>
        </div>
        <div style="padding:28px;">
          <div style="margin-bottom:18px;font-size:16px;line-height:1.7;">
            <strong>Bloom:</strong> ${escapeHtml(productName)}<br />
            <strong>From:</strong> ${safeFromName}
          </div>
          ${safeMessage ? `<div style="margin-bottom:18px;padding:14px 16px;border-radius:14px;background:#f5ece1;font-size:15px;line-height:1.6;"><strong>Message:</strong><br />${safeMessage}</div>` : ''}
          <a href="${giftUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#c9a14a;color:#0e0f12;text-decoration:none;font-weight:700;font-family:Arial,sans-serif;">Open your bloom</a>
          <p style="font-size:14px;line-height:1.6;color:#5f554b;margin:18px 0 0;">
            This protected bloom opens in your browser and includes Digital Bloom protection.
          </p>
          ${isTest ? '<p style="font-size:13px;line-height:1.6;color:#8b6a1f;margin:12px 0 0;"><strong>Test mode:</strong> This is a rehearsal email generated before launch.</p>' : ''}
        </div>
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resolveSender(),
      to,
      subject: `${testPrefix}A Digital Bloom is ready for you`,
      html,
      text: [
        `${testPrefix}A Digital Bloom is ready for you.`,
        `Bloom: ${productName}`,
        `From: ${delivery.senderName || message.fromName || purchase.customer_name || 'Someone special'}`,
        safeMessage ? `Message: ${message.short}` : null,
        `Open your bloom: ${giftUrl}`,
      ].filter(Boolean).join('\n'),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Failed to send bloom delivery email');
  }

  return payload;
}

export async function sendBloomBuyerConfirmationEmail({
  req,
  to,
  purchase,
  delivery,
  isTest = false,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Bloom buyer confirmation skipped: RESEND_API_KEY not configured');
    return { skipped: true, reason: 'missing_resend_api_key' };
  }

  if (!to) {
    console.warn('Bloom buyer confirmation skipped: missing purchaser address');
    return { skipped: true, reason: 'missing_purchaser_email' };
  }

  const appBaseUrl = resolvePublicBaseUrl(req);
  const manageUrl = purchase.bloom_slug
    ? `${appBaseUrl}/bloom/${encodeURIComponent(purchase.bloom_slug)}/manage`
    : `${appBaseUrl}/shop`;
  const message = purchase.composition_manifest?.customization?.message || {};
  const productName = purchase.products?.name || 'Digital Bloom';
  const safeRecipient = escapeHtml(delivery.recipientName || message.toName || 'your recipient');
  const safeSender = escapeHtml(delivery.senderName || message.fromName || purchase.customer_name || 'You');
  const safeMessage = escapeHtml(message.short || '');
  const testPrefix = isTest ? '[TEST] ' : '';
  const hasRenderReady = Boolean(String(purchase.download_url || '').trim());
  const isScheduled = delivery.deliveryMode === 'scheduled';
  const targetLabel = delivery.target === 'recipient' ? safeRecipient : 'you';
  const deliveryLine = isScheduled
    ? `Scheduled for ${escapeHtml(formatDeliveryDate(delivery.deliveryDate, delivery.buyerTimezone) || delivery.deliveryDate)}`
    : (hasRenderReady
        ? `Delivery status: ready`
        : `Delivery status: preparing your protected bloom`);
  const headline = isScheduled
    ? 'Your Digital Bloom is scheduled'
    : 'Your Digital Bloom order is confirmed';
  const bodyCopy = isScheduled
    ? `We've reserved your Digital Bloom and will email it to ${targetLabel} on the scheduled date.`
    : (delivery.target === 'recipient'
        ? `Your Digital Bloom for ${targetLabel} is ready. Preview it and send it when you're ready.`
        : `Your Digital Bloom purchase is confirmed. ${hasRenderReady ? 'It is ready for you now.' : "We're preparing your protected bloom now."}`);

  const html = `
    <div style="background:#f7efe7;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#201b17;">
      <div style="max-width:520px;margin:0 auto;background:#fffaf5;border:1px solid rgba(201,161,74,0.28);border-radius:24px;overflow:hidden;">
        <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#0c1b3f 0%,#132a58 100%);color:#f8f1eb;text-align:center;">
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#d9b45d;margin-bottom:12px;">${isTest ? 'TEST · ' : ''}Digital Bloom™</div>
          <h1 style="margin:0 0 10px;font-size:26px;line-height:1.2;font-weight:600;">${headline}</h1>
          <p style="margin:0;font-size:15px;line-height:1.5;color:rgba(248,241,235,0.8);">${escapeHtml(productName)}</p>
        </div>
        <div style="padding:32px 28px;text-align:center;">
          ${safeMessage ? `<div style="margin-bottom:24px;padding:16px 18px;border-radius:14px;background:#f5ece1;font-size:16px;line-height:1.65;font-style:italic;color:#3a2f22;">"${safeMessage}"</div>` : ''}
          <p style="font-size:15px;color:#5f554b;margin:0 0 24px;line-height:1.6;">
            From <strong>${safeSender}</strong>${isScheduled ? ` · Delivers ${escapeHtml(formatDeliveryDate(delivery.deliveryDate, delivery.buyerTimezone) || delivery.deliveryDate)}` : ''}
          </p>
          <a href="${manageUrl}" style="display:inline-block;padding:16px 32px;border-radius:999px;background:#c9a14a;color:#0e0f12;text-decoration:none;font-weight:700;font-family:Arial,sans-serif;font-size:17px;letter-spacing:0.02em;">Preview &amp; Send Your Bloom →</a>
          <p style="font-size:13px;line-height:1.5;color:#9e8f83;margin:20px 0 0;">
            Review your bloom, then send it to ${targetLabel} when you're ready.
          </p>
          ${isTest ? '<p style="font-size:12px;color:#8b6a1f;margin:12px 0 0;"><strong>Test mode</strong> — rehearsal email only.</p>' : ''}
        </div>
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resolveSender(),
      to,
      subject: `${testPrefix}${headline}`,
      html,
      text: [
        `${testPrefix}${headline}`,
        `Bloom: ${productName}`,
        `From: ${delivery.senderName || message.fromName || purchase.customer_name || 'Someone special'}`,
        isScheduled ? `Delivers: ${formatDeliveryDate(delivery.deliveryDate, delivery.buyerTimezone) || delivery.deliveryDate}` : null,
        safeMessage ? `"${message.short}"` : null,
        `Preview & send your bloom: ${manageUrl}`,
      ].filter(Boolean).join('\n'),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Failed to send bloom buyer confirmation email');
  }

  return payload;
}

export async function processBloomDeliveryEmails({
  supabase,
  purchases,
  req,
  explicitTestMode,
  now = new Date(),
}) {
  const processed = [];

  for (const originalPurchase of purchases || []) {
    let purchase = originalPurchase;
    const delivery = normalizeBloomDeliverySettings(purchase);

    if (!delivery) {
      processed.push(purchase);
      continue;
    }

    if (!purchase.composition_manifest?.customization || !purchase.bloom_slug) {
      processed.push(purchase);
      continue;
    }

    const recipientEmail = delivery.target === 'recipient'
      ? delivery.recipientEmail
      : (delivery.recipientEmail || delivery.purchaserEmail || purchase.customer_email || '');
    const purchaserEmail = delivery.purchaserEmail || purchase.customer_email || '';

    if (!recipientEmail && !purchaserEmail) {
      processed.push(purchase);
      continue;
    }

    if (purchaserEmail && delivery.buyerEmailStatus !== 'sent') {
      try {
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          buyerEmailStatus: 'sending',
          buyerLastAttemptAt: now.toISOString(),
          buyerLastError: null,
          testLabel: isTestModePurchase(purchase, explicitTestMode),
        });
      } catch (manifestError) {
        console.error(`Failed to update buyer manifest to 'sending' for purchase ${purchase.id}:`, manifestError);
      }

      try {
        await sendBloomBuyerConfirmationEmail({
          req,
          to: purchaserEmail,
          purchase,
          delivery,
          isTest: isTestModePurchase(purchase, explicitTestMode),
        });

        try {
          purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
            buyerEmailStatus: 'sent',
            buyerEmailSentAt: now.toISOString(),
            buyerLastError: null,
            purchaserEmail,
          });
        } catch (manifestError) {
          console.error(`Failed to update buyer manifest to 'sent' for purchase ${purchase.id}:`, manifestError);
        }
      } catch (error) {
        console.error(`Bloom buyer confirmation failed for purchase ${purchase.id}:`, error);
        try {
          purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
            buyerEmailStatus: 'failed',
            buyerLastError: String(error.message || error).slice(0, 240),
            purchaserEmail,
          });
        } catch (manifestError) {
          console.error(`Failed to update buyer manifest to 'failed' for purchase ${purchase.id}:`, manifestError);
        }
      }
    }

    // The bloom is ready when it has a bloom_slug and is completed — the LivePreview
    // CSS composition is the delivery experience; a rendered download_url is optional.
    const hasBloomReady = Boolean(purchase.bloom_slug) && String(purchase.status || '').toLowerCase() === 'completed';
    if (!hasBloomReady) {
      const pendingStatus = delivery.deliveryMode === 'scheduled' && !isBloomDeliveryDue(delivery, now)
        ? 'queued'
        : 'pending';

      if (delivery.emailStatus !== pendingStatus) {
        try {
          purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
            emailStatus: pendingStatus,
            lastError: null,
          });
        } catch (manifestError) {
          console.error(`Failed to update delivery manifest to '${pendingStatus}' for purchase ${purchase.id}:`, manifestError);
        }
      }

      processed.push(purchase);
      continue;
    }

    if (delivery.emailStatus === 'sent' && delivery.emailSentAt) {
      processed.push(purchase);
      continue;
    }

    // ── Auto-deliver immediately for both "now" and "scheduled" modes ──
    // Previously, immediate-mode deliveries were skipped here and required
    // the buyer to manually click "Send Now" from /bloom/:slug/manage.
    // Now we auto-send right after checkout for a seamless buyer experience.

    // For scheduled deliveries, still wait until the date arrives.
    if (delivery.deliveryMode === 'scheduled') {
      const due = isBloomDeliveryDue(delivery, now);
      if (!due) {
        if (delivery.emailStatus !== 'queued') {
          try {
            purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
              emailStatus: 'queued',
              lastError: null,
            });
          } catch (manifestError) {
            console.error(`Failed to update delivery manifest to 'queued' for purchase ${purchase.id}:`, manifestError);
          }
        }
        processed.push(purchase);
        continue;
      }
    }

    try {
      purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
        emailStatus: 'sending',
        lastAttemptAt: now.toISOString(),
        lastError: null,
        testLabel: isTestModePurchase(purchase, explicitTestMode),
      });
    } catch (manifestError) {
      console.error(`Failed to update delivery manifest to 'sending' for purchase ${purchase.id}:`, manifestError);
    }

    // ── Route delivery: SMS if buyer chose phone, else email ──
    const wantsSms = delivery.deliveryChannel === 'phone' && delivery.recipientPhone;
    const twilioReady = Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
    );
    const useSms = wantsSms && twilioReady;

    try {
      let sentVia = 'email';
      let smsResult = null;

      if (useSms) {
        // SMS path — send text with gift link
        const appBaseUrl = resolvePublicBaseUrl(req);
        const giftUrl = `${appBaseUrl}/gift/${encodeURIComponent(purchase.bloom_slug)}`;
        try {
          smsResult = await sendBloomDeliverySms({
            to: delivery.recipientPhone,
            purchase,
            delivery,
            giftUrl,
            isTest: isTestModePurchase(purchase, explicitTestMode),
          });
          sentVia = 'sms';
        } catch (smsError) {
          // SMS failed — fall back to email if we have an address
          console.warn(`[processBloomDeliveryEmails] SMS failed for purchase ${purchase.id}, falling back to email:`, smsError);
          if (recipientEmail) {
            await sendBloomDeliveryEmail({
              req,
              to: recipientEmail,
              purchase,
              delivery,
              isTest: isTestModePurchase(purchase, explicitTestMode),
            });
            sentVia = 'email_fallback';
          } else {
            throw smsError; // No fallback available
          }
        }
      } else {
        // Email path
        await sendBloomDeliveryEmail({
          req,
          to: recipientEmail,
          purchase,
          delivery,
          isTest: isTestModePurchase(purchase, explicitTestMode),
        });
      }

      // Mark as sent
      const sentPatch = {
        emailStatus: 'sent',
        emailSentAt: now.toISOString(),
        lastError: null,
        sentVia,
        recipientEmail: recipientEmail || '',
      };
      if (smsResult?.sid) sentPatch.smsMessageSid = smsResult.sid;
      if (delivery.recipientPhone) sentPatch.recipientPhone = delivery.recipientPhone;

      try {
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, sentPatch);
      } catch (manifestError) {
        console.error(`Failed to update delivery manifest to 'sent' for purchase ${purchase.id}:`, manifestError);
      }
    } catch (error) {
      console.error(`Bloom delivery failed for purchase ${purchase.id}:`, error);
      try {
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          emailStatus: 'failed',
          lastError: String(error.message || error).slice(0, 240),
          recipientEmail,
        });
      } catch (manifestError) {
        console.error(`Failed to update delivery manifest to 'failed' for purchase ${purchase.id}:`, manifestError);
      }
    }

    processed.push(purchase);
  }

  return processed;
}

export function buildDeliverySummary(delivery) {
  if (!delivery) return null;
  return {
    target: delivery.target,
    recipient_email: delivery.recipientEmail || '',
    recipient_phone: delivery.recipientPhone || '',
    delivery_channel: delivery.deliveryChannel === 'phone' ? 'phone' : 'email',
    purchaser_email: delivery.purchaserEmail || '',
    delivery_mode: delivery.deliveryMode,
    delivery_date: delivery.deliveryDate || '',
    buyer_timezone: delivery.buyerTimezone || 'America/Chicago',
    email_status: delivery.emailStatus || 'pending',
    email_sent_at: delivery.emailSentAt || null,
    buyer_email_status: delivery.buyerEmailStatus || 'pending',
    buyer_email_sent_at: delivery.buyerEmailSentAt || null,
    display_date: delivery.deliveryDate ? formatDeliveryDate(delivery.deliveryDate, delivery.buyerTimezone) : '',
    test_label: Boolean(delivery.testLabel),
  };
}
