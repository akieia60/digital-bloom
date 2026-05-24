// Order alert SMS — notifies AK when a new order comes in.
//
// Sends a quick text to AK_ALERT_PHONE with order details so she knows
// immediately when someone buys without checking Supabase.

function resolveCreds() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
    alertPhone: process.env.AK_ALERT_PHONE || '',
  };
}

export async function sendOrderAlertSms({ purchase, delivery, cartItems }) {
  const { accountSid, authToken, fromNumber, alertPhone } = resolveCreds();

  // Skip silently if not configured
  if (!accountSid || !authToken || !fromNumber || !alertPhone) {
    console.log('[order-alert] Skipped: missing Twilio or alert phone config');
    return { skipped: true, reason: 'missing_config' };
  }

  const productName =
    purchase?.products?.name ||
    purchase?.products?.title ||
    cartItems?.[0]?.product?.name ||
    'Digital Bloom';

  const priceCents = purchase?.amount_total || purchase?.products?.price_cents;
  const priceStr = priceCents
    ? `$${(Number(priceCents) / 100).toFixed(2)}`
    : (purchase?.products?.price ? `$${purchase.products.price}` : '$?.??');

  const customerName = purchase?.customer_name || purchase?.customer_email || 'Unknown buyer';

  const recipientName = delivery?.recipientName || 'not specified';
  const channel = delivery?.deliveryChannel === 'phone' ? 'text' : 'email';

  const body = [
    `🌸 New order!`,
    `${productName} (${priceStr})`,
    `From: ${customerName}`,
    `To: ${recipientName} via ${channel}`,
    ``,
    `digitalbloom.store`,
  ].join('\n');

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
  const formBody = new URLSearchParams({
    To: alertPhone,
    From: fromNumber,
    Body: body,
  });

  try {
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
      console.error('[order-alert] Twilio error:', payload?.message || response.status);
      return { skipped: true, reason: 'twilio_error', detail: payload?.message };
    }

    console.log(`[order-alert] Sent to ${alertPhone}, SID: ${payload?.sid}`);
    return { sent: true, sid: payload?.sid };
  } catch (err) {
    // Order alerts are non-critical — never let them block checkout
    console.error('[order-alert] Failed (non-blocking):', err.message);
    return { skipped: true, reason: 'exception', detail: err.message };
  }
}
