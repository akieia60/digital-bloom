import { resolvePublicBaseUrl } from './publicBaseUrl.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function resolveSender() {
  return (
    process.env.BLOOM_CREDIT_EMAIL_FROM ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    'Digital Bloom <onboarding@resend.dev>'
  );
}

export async function sendBloomCreditEmail({
  req,
  to,
  code,
  amountCents,
  remainingAmountCents,
  recipientName,
  purchaserEmail,
  note,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Bloom Credit email skipped: RESEND_API_KEY not configured');
    return { skipped: true, reason: 'missing_resend_api_key' };
  }

  if (!to) {
    console.warn('Bloom Credit email skipped: missing recipient address');
    return { skipped: true, reason: 'missing_recipient_email' };
  }

  const appBaseUrl = resolvePublicBaseUrl(req);
  const balanceUrl = `${appBaseUrl}/credits/balance?code=${encodeURIComponent(code)}`;
  const safeRecipientName = recipientName ? escapeHtml(recipientName) : 'there';
  const safeCode = escapeHtml(code);
  const safeNote = note ? escapeHtml(note) : '';
  const safePurchaser = purchaserEmail ? escapeHtml(purchaserEmail) : '';
  const balanceText = formatCurrency(remainingAmountCents ?? amountCents);

  const html = `
    <div style="background:#f7efe7;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#201b17;">
      <div style="max-width:560px;margin:0 auto;background:#fffaf5;border:1px solid rgba(201,161,74,0.28);border-radius:24px;overflow:hidden;">
        <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#0c1b3f 0%,#132a58 100%);color:#f8f1eb;">
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#d9b45d;margin-bottom:10px;">Digital Bloom</div>
          <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:600;">Your Bloom Credit is ready</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:rgba(248,241,235,0.84);">
            ${safeRecipientName === 'there' ? 'You now have a Bloom Credit ready to use.' : `${safeRecipientName}, you now have a Bloom Credit ready to use.`}
          </p>
        </div>
        <div style="padding:28px;">
          <div style="border:1px solid rgba(201,161,74,0.2);border-radius:18px;padding:18px 20px;background:rgba(201,161,74,0.07);margin-bottom:20px;">
            <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9a7b25;margin-bottom:8px;font-family:Arial,sans-serif;">Bloom Credit Code</div>
            <div style="font-size:28px;line-height:1.2;font-weight:700;letter-spacing:0.08em;color:#0c1b3f;font-family:Arial,sans-serif;">${safeCode}</div>
          </div>
          <div style="margin-bottom:18px;font-size:16px;line-height:1.7;">
            <strong>Available balance:</strong> ${balanceText}<br />
            <strong>Original amount:</strong> ${formatCurrency(amountCents)}
          </div>
          ${safeNote ? `<div style="margin-bottom:18px;padding:14px 16px;border-radius:14px;background:#f5ece1;font-size:15px;line-height:1.6;"><strong>Personal note:</strong><br />${safeNote}</div>` : ''}
          ${safePurchaser ? `<p style="font-size:14px;line-height:1.6;color:#5f554b;margin:0 0 22px;">Purchased by ${safePurchaser}</p>` : ''}
          <a href="${balanceUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#c9a14a;color:#0e0f12;text-decoration:none;font-weight:700;font-family:Arial,sans-serif;">Check balance</a>
          <p style="font-size:14px;line-height:1.6;color:#5f554b;margin:18px 0 0;">
            Keep this code handy. You can apply it in your cart the next time you check out.
          </p>
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
      subject: `Your Bloom Credit is ready: ${code}`,
      html,
      text: [
        'Your Bloom Credit is ready.',
        `Code: ${code}`,
        `Available balance: ${balanceText}`,
        `Check balance: ${balanceUrl}`,
      ].join('\n'),
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Failed to send Bloom Credit email');
  }

  return payload;
}
