import Stripe from 'stripe';
import { captureReservedCredit } from './creditReservations.js';
import { processBloomDeliveryEmails } from './bloomDeliveryEmail.js';
import {
  buildPurchaseRows,
  finalizePurchaseRecord,
  insertPurchaseRows,
  supabase,
} from './purchaseFlow.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// NOTE: Pre-baked price IDs (TIER_PRICE_IDS) intentionally removed.
// Test-mode price IDs don't exist in live mode, so we ALWAYS use dynamic
// price_data built from product metadata. This is mode-agnostic and safer.

// "All blooms $1 until further notice" — Gamble 2026-05-13 07:45 AM.
// Mirrors src/config/promo.js — keep the cutoff in sync. Variable name kept
// as MOTHERS_DAY_PROMO_END_MS so the rest of this file stays unchanged.
// To roll back: set to a past timestamp and tier prices restore.
const MOTHERS_DAY_PROMO_END_MS = Date.parse('2027-12-31T23:59:59Z');
const isMothersDayPromoActive = () => Date.now() < MOTHERS_DAY_PROMO_END_MS;

function buildLineItems(cartItems) {
  const promoActive = isMothersDayPromoActive();
  return cartItems.map((item) => {
    const product = item.product || {};

    const basePriceCents = Math.round((Number(product.price) || 1.99) * 100);
    const priceInCents = promoActive ? 100 : basePriceCents;
    let imageUrl = product.image_url || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://digitalbloom.store${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
  req,
  cartItems,
  successUrl,
  cancelUrl,
  customerEmail,
  reservation_id,
  remaining_due_cents,
  metadata = {},
  delivery = null,
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
    let step = 'init';
    try {
      step = 'insertPurchaseRows';
      const purchases = await insertPurchaseRows(
        buildPurchaseRows(cartItems, {
          customerEmail,
          stripeSessionId: pseudoSessionId,
          status: 'pending',
          delivery,
        })
      );

      step = 'captureFullCreditReservation';
      await captureFullCreditReservation(reservation_id);

      const finalizedPurchases = [];
      for (const purchase of purchases) {
        step = `finalizePurchaseRecord(${purchase.id})`;
        finalizedPurchases.push(await finalizePurchaseRecord(purchase, null));
      }

      step = 'processBloomDeliveryEmails';
      await processBloomDeliveryEmails({
        supabase,
        purchases: finalizedPurchases,
        req,
        explicitTestMode: String(process.env.STRIPE_SECRET_KEY || '').includes('_test_'),
      });

      return {
        free_checkout: true,
        url: successUrl.replace('{CHECKOUT_SESSION_ID}', pseudoSessionId),
      };
    } catch (err) {
      // Re-throw with the failing step prefixed so the front-end + logs show
      // which call broke (insertPurchaseRows / captureFullCreditReservation /
      // finalizePurchaseRecord / processBloomDeliveryEmails).
      const detail = err && err.message ? err.message : String(err);
      console.error(`free_checkout failed at step=${step}:`, err);
      throw new Error(`free_checkout step=${step}: ${detail}`);
    }
  }

  const lineItems = buildLineItems(cartItems);
  const sessionConfig = {
    automatic_payment_methods: { enabled: true },
    phone_number_collection: { enabled: true },
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
        delivery,
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
