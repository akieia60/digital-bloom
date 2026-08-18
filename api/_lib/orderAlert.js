// Order alerts — tells Ak a new order came in.
//
// 2026-08-18 (A.K. lane): rewritten from the SMS-only version.
//
// Why: every order alert between 2026-06-21 and 2026-08-17 was silently
// dropped by the carriers. Twilio ACCEPTS a message (HTTP 201) and only
// reports delivery failure asynchronously, so the old code logged
// "[order-alert] Sent" while nothing ever reached her phone. She missed a
// real order on 2026-08-01 that way.
//
// Both Twilio numbers are currently unusable:
//   +1 866 435 4046 (toll-free) — verification TWILIO_REJECTED, error 30032
//   +1 864 528 3139 (local)     — A2P brand FAILED,             error 30034
//
// So email is now the primary alert channel. SMS is attempted only when
// TWILIO_SMS_ENABLED is explicitly turned on, which is what we flip once
// carrier registration finally passes.

function resolveSender() {
  return (
    process.env.BLOOM_CREDIT_EMAIL_FROM ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    'Digital Bloom <onboarding@resend.dev>'
  );
}

function smsEnabled() {
  const flag = String(process.env.TWILIO_SMS_ENABLED || '').trim().toLowerCase();
  return flag === '1' || flag === 'true' || flag === 'yes';
}

function buildOrderSummary({ purchase, delivery, cartItems }) {
  const productName =
    purchase?.products?.name ||
    purchase?.products?.title ||
    cartItems?.[0]?.product?.name ||
    'Digital Bloom';

  const priceCents = purchase?.amount_total || purchase?.products?.price_cents;
  const priceStr = priceCents
    ? `$${(Number(priceCents) / 100).toFixed(2)}`
    : (purchase?.products?.price ? `$${purchase.products.price}` : '$?.??');

  const buyer =
    purchase?.customer_name ||
    purchase?.customer_email ||
    delivery?.purchaserEmail ||
    'Unknown buyer';

  const recipientName = delivery?.recipientName || 'not specified';
  const channel = delivery?.deliveryChannel === 'phone' ? 'text' : 'email';
  const recipientTarget =
    delivery?.deliveryChannel === 'phone'
      ? (delivery?.recipientPhone || 'no phone captured')
      : (delivery?.recipientEmail || 'no email captured');

  return { productName, priceStr, buyer, recipientName, channel, recipientTarget };
}

async function sendAlertEmail({ purchase, delivery, cartItems }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.AK_ALERT_EMAIL || 'akieia60@gmail.com';

  if (!apiKey) {
    console.log('[order-alert] Email skipped: RESEND_API_KEY not configured');
    return { skipped: true, reason: 'missing_resend_api_key' };
  }

  const s = buildOrderSummary({ purchase, delivery, cartItems });
  const slug = purchase?.bloom_slug || '';
  const manageUrl = slug ? `https://digitalbloom.store/manage/${encodeURIComponent(slug)}` : '';

  // Flag the case that burned us on 2026-08-01: an order with no way to
  // reach the recipient. Ak needs to see that at a glance, not dig for it.
  const missingTarget =
    s.recipientTarget.startsWith('no ') ? '⚠️ NO RECIPIENT ADDRESS CAPTURED — this order cannot auto-deliver.' : '';

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0D1B36;color:#fff;border-radius:12px">
      <h2 style="color:#D4AF37;margin:0 0 4px;font-size:22px">🌸 New order</h2>
      <p style="margin:0 0 20px;color:#c9d2e4;font-size:14px">Digital Bloom™</p>
      ${missingTarget ? `<p style="background:#5c1f1f;padding:12px;border-radius:8px;font-size:14px;margin:0 0 16px">${missingTarget}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:6px 0;color:#8f9dba">Bloom</td><td style="padding:6px 0;text-align:right"><strong>${s.productName}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#8f9dba">Paid</td><td style="padding:6px 0;text-align:right"><strong>${s.priceStr}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#8f9dba">Buyer</td><td style="padding:6px 0;text-align:right">${s.buyer}</td></tr>
        <tr><td style="padding:6px 0;color:#8f9dba">Recipient</td><td style="padding:6px 0;text-align:right">${s.recipientName}</td></tr>
        <tr><td style="padding:6px 0;color:#8f9dba">Via</td><td style="padding:6px 0;text-align:right">${s.channel} — ${s.recipientTarget}</td></tr>
      </table>
      ${manageUrl ? `<p style="margin:24px 0 0"><a href="${manageUrl}" style="background:#D4AF37;color:#0D1B36;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block">Open this order</a></p>` : ''}
    </div>
  `;

  const text = [
    '🌸 New order!',
    `${s.productName} (${s.priceStr})`,
    `From: ${s.buyer}`,
    `To: ${s.recipientName} via ${s.channel} — ${s.recipientTarget}`,
    missingTarget || null,
    manageUrl || 'digitalbloom.store',
  ].filter(Boolean).join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: resolveSender(),
      to: [to],
      subject: `🌸 New order — ${s.productName} (${s.priceStr})`,
      html,
      text,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('[order-alert] Resend error:', payload?.message || response.status);
    return { skipped: true, reason: 'resend_error', detail: payload?.message };
  }

  console.log(`[order-alert] Email sent to ${to}, id: ${payload?.id}`);
  return { sent: true, id: payload?.id };
}

async function sendAlertSms({ purchase, delivery, cartItems }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const authToken = process.env.TWILIO_AUTH_TOKEN || '';
  const fromNumber = (process.env.TWILIO_FROM_NUMBER || '').trim();
  const alertPhone = (process.env.AK_ALERT_PHONE || '').trim();

  if (!accountSid || !authToken || !fromNumber || !alertPhone) {
    return { skipped: true, reason: 'missing_config' };
  }

  const s = buildOrderSummary({ purchase, delivery, cartItems });
  const body = [
    '🌸 New order!',
    `${s.productName} (${s.priceStr})`,
    `From: ${s.buyer}`,
    `To: ${s.recipientName} via ${s.channel}`,
    '',
    'digitalbloom.store',
  ].join('\n');

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: alertPhone, From: fromNumber, Body: body }).toString(),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('[order-alert] Twilio error:', payload?.message || response.status);
    return { skipped: true, reason: 'twilio_error', detail: payload?.message };
  }

  // NOTE: this only means Twilio queued it. Carrier delivery failures
  // (30032 / 30034) arrive later on the status callback, not here. Never
  // treat this as proof Ak actually got the text.
  console.log(`[order-alert] SMS queued to ${alertPhone}, SID: ${payload?.sid} (queued != delivered)`);
  return { queued: true, sid: payload?.sid };
}

export async function sendOrderAlert({ purchase, delivery, cartItems }) {
  const results = {};

  // Email first — it is the channel that actually works today.
  try {
    results.email = await sendAlertEmail({ purchase, delivery, cartItems });
  } catch (err) {
    console.error('[order-alert] Email failed (non-blocking):', err.message);
    results.email = { skipped: true, reason: 'exception', detail: err.message };
  }

  if (smsEnabled()) {
    try {
      results.sms = await sendAlertSms({ purchase, delivery, cartItems });
    } catch (err) {
      console.error('[order-alert] SMS failed (non-blocking):', err.message);
      results.sms = { skipped: true, reason: 'exception', detail: err.message };
    }
  } else {
    results.sms = { skipped: true, reason: 'sms_disabled_pending_carrier_registration' };
  }

  return results;
}
