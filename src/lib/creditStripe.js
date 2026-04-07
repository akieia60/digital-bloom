import { getApiBase } from './apiBase';

/**
 * Client-side credit API functions
 * All credit operations go through server endpoints
 */

const getCreditApiBase = () => getApiBase();

/**
 * Create Stripe checkout session for credit purchase
 */
export async function createCreditCheckoutSession({
  amountDollars,
  purchaserEmail,
  recipientEmail = null,
  recipientName = null,
  deliveryDate = null,
  note = null
}) {
  try {
    const amountCents = Math.round(amountDollars * 100);

    const response = await fetch(`${getCreditApiBase()}/api/create-credit-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount_cents: amountCents,
        purchaser_email: purchaserEmail,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        delivery_date: deliveryDate,
        note
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating credit checkout:', error);
    throw error;
  }
}

/**
 * Get credit balance and history
 */
export async function getCreditBalance(code) {
  try {
    const response = await fetch(`${getCreditApiBase()}/api/credits/balance?code=${encodeURIComponent(code)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

/**
 * Validate a credit code
 */
export async function validateCreditCode(code) {
  try {
    const response = await fetch(`${getCreditApiBase()}/api/credits/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Validation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating credit:', error);
    throw error;
  }
}

/**
 * Reserve credit for checkout
 */
export async function reserveCredit(code, orderTotalCents) {
  try {
    const response = await fetch(`${getCreditApiBase()}/api/credits/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        order_total_cents: orderTotalCents
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Reservation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error reserving credit:', error);
    throw error;
  }
}
