import { resolvePublicBaseUrl } from './publicBaseUrl.js';

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

  return {
    target,
    purchaserEmail,
    recipientEmail,
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
  const giftUrl = purchase.bloom_slug
    ? `${appBaseUrl}/gift/${encodeURIComponent(purchase.bloom_slug)}`
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
    ? `We’ve reserved your Digital Bloom and will email it to ${targetLabel} on the scheduled date.`
    : (delivery.target === 'recipient'
        ? `Your Digital Bloom purchase is confirmed. We’ll email it to ${targetLabel}${hasRenderReady ? ' right away.' : ' as soon as the protected bloom is ready.'}`
        : `Your Digital Bloom purchase is confirmed. ${hasRenderReady ? 'It is ready for you now.' : 'We’re preparing your protected bloom now.'}`);

  const html = `
    <div style="background:#f7efe7;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#201b17;">
      <div style="max-width:560px;margin:0 auto;background:#fffaf5;border:1px solid rgba(201,161,74,0.28);border-radius:24px;overflow:hidden;">
        <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#0c1b3f 0%,#132a58 100%);color:#f8f1eb;">
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#d9b45d;margin-bottom:10px;">${isTest ? 'TEST ORDER · ' : ''}Digital Bloom</div>
          <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:600;">${headline}</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:rgba(248,241,235,0.84);">${bodyCopy}</p>
        </div>
        <div style="padding:28px;">
          <div style="margin-bottom:18px;font-size:16px;line-height:1.7;">
            <strong>Bloom:</strong> ${escapeHtml(productName)}<br />
            <strong>From:</strong> ${safeSender}<br />
            <strong>${isScheduled ? 'Delivery timing' : 'Recipient'}:</strong> ${isScheduled ? deliveryLine : targetLabel}
          </div>
          ${!isScheduled ? `<div style="margin-bottom:18px;font-size:15px;line-height:1.6;color:#5f554b;">${deliveryLine}</div>` : ''}
          ${safeMessage ? `<div style="margin-bottom:18px;padding:14px 16px;border-radius:14px;background:#f5ece1;font-size:15px;line-height:1.6;"><strong>Message:</strong><br />${safeMessage}</div>` : ''}
          <a href="${giftUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#c9a14a;color:#0e0f12;text-decoration:none;font-weight:700;font-family:Arial,sans-serif;">${hasRenderReady ? 'View bloom backup link' : 'Track your bloom'}</a>
          <p style="font-size:14px;line-height:1.6;color:#5f554b;margin:18px 0 0;">
            Save this email for your records. Your protected bloom link stays on the Digital Bloom site.
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
      subject: `${testPrefix}${headline}`,
      html,
      text: [
        `${testPrefix}${headline}`,
        `Bloom: ${productName}`,
        isScheduled
          ? `Scheduled for: ${formatDeliveryDate(delivery.deliveryDate, delivery.buyerTimezone) || delivery.deliveryDate}`
          : `Recipient: ${delivery.target === 'recipient' ? (delivery.recipientName || message.toName || 'your recipient') : 'you'}`,
        !isScheduled ? deliveryLine : null,
        safeMessage ? `Message: ${message.short}` : null,
        `Backup link: ${giftUrl}`,
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
      purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
        buyerEmailStatus: 'sending',
        buyerLastAttemptAt: now.toISOString(),
        buyerLastError: null,
        testLabel: isTestModePurchase(purchase, explicitTestMode),
      });

      try {
        await sendBloomBuyerConfirmationEmail({
          req,
          to: purchaserEmail,
          purchase,
          delivery,
          isTest: isTestModePurchase(purchase, explicitTestMode),
        });

        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          buyerEmailStatus: 'sent',
          buyerEmailSentAt: now.toISOString(),
          buyerLastError: null,
          purchaserEmail,
        });
      } catch (error) {
        console.error(`Bloom buyer confirmation failed for purchase ${purchase.id}:`, error);
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          buyerEmailStatus: 'failed',
          buyerLastError: String(error.message || error).slice(0, 240),
          purchaserEmail,
        });
      }
    }

    const hasProtectedDeliveryReady = Boolean(String(purchase.download_url || '').trim());
    if (!hasProtectedDeliveryReady) {
      const pendingStatus = delivery.deliveryMode === 'scheduled' && !isBloomDeliveryDue(delivery, now)
        ? 'queued'
        : 'pending';

      if (delivery.emailStatus !== pendingStatus) {
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          emailStatus: pendingStatus,
          lastError: null,
        });
      }

      processed.push(purchase);
      continue;
    }

    if (delivery.emailStatus === 'sent' && delivery.emailSentAt) {
      processed.push(purchase);
      continue;
    }

    const due = isBloomDeliveryDue(delivery, now);
    if (!due) {
      if (delivery.emailStatus !== 'queued') {
        purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
          emailStatus: 'queued',
          lastError: null,
        });
      }
      processed.push(purchase);
      continue;
    }

    purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
      emailStatus: 'sending',
      lastAttemptAt: now.toISOString(),
      lastError: null,
      testLabel: isTestModePurchase(purchase, explicitTestMode),
    });

    try {
      await sendBloomDeliveryEmail({
        req,
        to: recipientEmail,
        purchase,
        delivery,
        isTest: isTestModePurchase(purchase, explicitTestMode),
      });

      purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
        emailStatus: 'sent',
        emailSentAt: now.toISOString(),
        lastError: null,
        recipientEmail,
      });
    } catch (error) {
      console.error(`Bloom delivery email failed for purchase ${purchase.id}:`, error);
      purchase = await updatePurchaseDeliveryManifest(supabase, purchase, {
        emailStatus: 'failed',
        lastError: String(error.message || error).slice(0, 240),
        recipientEmail,
      });
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
