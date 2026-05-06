// Twilio SMS sender for Digital Bloom recipient delivery.
//
// Wired up 2026-05-06. Ak provisioned a Twilio account, bought
// +1 (864) 528-3139, and dropped the credentials into Vercel env:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER
//
// Uses raw fetch against Twilio's REST API — no SDK package — to keep the
// Vercel build lean and avoid bloating the bundle. The Messages endpoint
// takes form-urlencoded body, basic auth (SID:Token base64), and returns
// JSON.

function resolveCreds() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
  };
}

function normalizePhone(input) {
  const digits = String(input || '').replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) return digits;
  // Bare 10-digit US number → +1 prefix.
  if (digits.length === 10) return `+1${digits}`;
  // 11-digit starting with 1 → add the + sign.
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // Anything else, just prepend + and hope it's E.164. Twilio rejects bad
  // numbers with a clear error so we don't try to be cleverer than this.
  return `+${digits}`;
}

export function buildBloomSmsBody({ recipientName, senderName, giftUrl, isTest = false }) {
  const trimmedSender = String(senderName || '').trim();
  const trimmedRecipient = String(recipientName || '').trim();
  const intro = trimmedSender
    ? `${trimmedSender} sent you a Digital Bloom`
    : 'You have a Digital Bloom waiting';
  const greeting = trimmedRecipient ? `${trimmedRecipient}, ` : '';
  const body = `${greeting}${intro} 💐 ${giftUrl}`;
  return isTest ? `[TEST] ${body}` : body;
}

export async function sendBloomDeliverySms({
  to,
  purchase,
  delivery,
  giftUrl,
  isTest = false,
}) {
  const { accountSid, authToken, fromNumber } = resolveCreds();

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Bloom SMS skipped: Twilio env not configured');
    return { skipped: true, reason: 'missing_twilio_env' };
  }

  const normalizedTo = normalizePhone(to);
  if (!normalizedTo) {
    console.warn('Bloom SMS skipped: missing recipient phone');
    return { skipped: true, reason: 'missing_recipient_phone' };
  }

  const message = purchase?.composition_manifest?.customization?.message || {};
  const body = buildBloomSmsBody({
    recipientName: delivery?.recipientName || message.toName,
    senderName: delivery?.senderName || message.fromName || purchase?.customer_name,
    giftUrl,
    isTest,
  });

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
  const formBody = new URLSearchParams({
    To: normalizedTo,
    From: fromNumber,
    Body: body,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason =
      payload?.message ||
      payload?.detail ||
      payload?.error ||
      `Twilio responded ${response.status}`;
    throw new Error(`Twilio SMS failed: ${reason}`);
  }

  return {
    sid: payload?.sid || null,
    status: payload?.status || 'queued',
    to: normalizedTo,
  };
}
