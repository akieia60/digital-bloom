import Stripe from 'stripe';
import { captureReservedCredit } from './creditReservations.js';
import {
  buildPurchaseRows,
  finalizePurchaseRecord,
  insertPurchaseRows,
} from './purchaseFlow.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const TIER_PRICE_IDS = {
  1: process.env.VITE_STRIPE_PRICE_TIER1 || process.env.STRIPE_PRICE_TIER1 || null,
  2: process.env.VITE_STRIPE_PRICE_TIER2 || process.env.STRIPE_PRICE_TIER2 || null,
  3: process.env.VITE_STRIPE_PRICE_TIER3 || process.env.STRIPE_PRICE_TIER3 || null,
  4: process.env.VITE_STRIPE_PRICE_TIER4 || process.env.STRIPE_PRICE_TIER4 || null,
};

function buildLineItems(cartItems) {
  return cartItems.map((item) => {
    const product = item.product || {};

    if (product.stripe_price_id && !product.stripe_price_id.startsWith('REPLACE_WITH')) {
      return {
        price: product.stripe_price_id,
        quantity: item.quantity || 1,
      };
    }

    const tierPriceId = product.tier ? TIER_PRICE_IDS[product.tier] : null;
    if (tierPriceId) {
      return {
        price: tierPriceId,
        quantity: item.quantity || 1,
      };
    }

    const priceInCents = Math.round((Number(product.price) || 1.99) * 100);
    let imageUrl = product.image_url || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://digitabloom.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    const productData = {
      name: product.title || product.name || 'DigitalBloom Experience',
    };

    if (product.description) {
      productData.description = product.description;
    }

    if (imageUrl) {
      productData.images = [imageUrl];
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: productData,
        unit_amount: priceInCents,
      },
      quantity: item.quantity || 1,
    };
  });
}

async function captureFullCreditReservation(reservationId) {
  await captureReservedCredit(reservationId, `free_${reservationId}`);
}

export async function createCheckoutSessionResult({
  cartItems,
  successUrl,
  cancelUrl,
  customerEmail,
  reservation_id,
  remaining_due_cents,
  metadata = {},
}) {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart items are required');
  }

  if (!successUrl || !cancelUrl) {
    throw new Error('Success and cancel URLs are required');
  }

  const totalCents = cartItems.reduce((sum, item) => {
    return sum + (Math.round(Number(item.product?.price || 0) * 100) * Number(item.quantity || 1));
  }, 0);

  if (reservation_id && remaining_due_cents === 0) {
    const pseudoSessionId = `free_${reservation_id}`;
    const purchases = await insertPurchaseRows(
      buildPurchaseRows(cartItems, {
        customerEmail,
        stripeSessionId: pseudoSessionId,
        status: 'pending',
      })
    );

    await captureFullCreditReservation(reservation_id);

    for (const purchase of purchases) {
      await finalizePurchaseRecord(purchase, null);
    }

    return {
      free_checkout: true,
      url: successUrl.replace('{CHECKOUT_SESSION_ID}', pseudoSessionId),
    };
  }

  const lineItems = buildLineItems(cartItems);
  const sessionConfig = {
    automatic_payment_methods: { enabled: true },
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail || undefined,
    metadata: {
      ...metadata,
      reservation_id: reservation_id || '',
      cart_items: JSON.stringify(
        cartItems.map((item) => ({
          id: item.product?.id || null,
          q: item.quantity,
          t: item.product?.tier || null,
        }))
      ).substring(0, 500),
    },
  };

  if (reservation_id && remaining_due_cents > 0 && remaining_due_cents < totalCents) {
    const creditDiscount = totalCents - remaining_due_cents;
    const coupon = await stripe.coupons.create({
      amount_off: creditDiscount,
      currency: 'usd',
      duration: 'once',
      name: `Bloom Credit: -$${(creditDiscount / 100).toFixed(2)}`,
    });

    sessionConfig.discounts = [{ coupon: coupon.id }];
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create(sessionConfig);
  } catch (stripeError) {
    if (stripeError.message && stripeError.message.includes('automatic_payment_methods')) {
      delete sessionConfig.automatic_payment_methods;
      sessionConfig.payment_method_types = ['card'];
      session = await stripe.checkout.sessions.create(sessionConfig);
    } else {
      throw stripeError;
    }
  }

  try {
    await insertPurchaseRows(
      buildPurchaseRows(cartItems, {
        customerEmail,
        stripeSessionId: session.id,
        status: 'pending',
      })
    );
  } catch (purchaseError) {
    await stripe.checkout.sessions.expire(session.id).catch(() => {});
    throw new Error('Failed to create purchase records for checkout');
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}
