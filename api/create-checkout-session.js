import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Tier price ID map — reads from environment variables.
 * Set these in your Vercel project settings after running the Stripe setup script.
 * Keys: VITE_STRIPE_PRICE_TIER1 … VITE_STRIPE_PRICE_TIER4
 *
 * Note: Vercel serverless functions use process.env (not import.meta.env).
 * Both VITE_ prefixed and non-prefixed versions are checked for compatibility.
 */
const TIER_PRICE_IDS = {
  1: process.env.VITE_STRIPE_PRICE_TIER1 || process.env.STRIPE_PRICE_TIER1 || null,
  2: process.env.VITE_STRIPE_PRICE_TIER2 || process.env.STRIPE_PRICE_TIER2 || null,
  3: process.env.VITE_STRIPE_PRICE_TIER3 || process.env.STRIPE_PRICE_TIER3 || null,
  4: process.env.VITE_STRIPE_PRICE_TIER4 || process.env.STRIPE_PRICE_TIER4 || null,
};

export default async function handler(req, res) {
  // FIX #6 — CORS hardening (replaces wildcard origin)
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      cartItems,
      successUrl,
      cancelUrl,
      customerEmail,
      reservation_id,
      remaining_due_cents,
      metadata = {}
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    // Calculate total
    const totalCents = cartItems.reduce((sum, item) => {
      return sum + (Math.round(item.product.price * 100) * item.quantity);
    }, 0);

    // If credit covers full amount, handle free checkout
    if (reservation_id && remaining_due_cents === 0) {
      const { data: reservation, error: resError } = await supabase
        .from('experience_credit_reservations')
        .select('*, experience_credits(*)')
        .eq('id', reservation_id)
        .single();

      if (resError || !reservation) {
        return res.status(400).json({ error: 'Invalid reservation' });
      }

      const newBalance =
        reservation.experience_credits.remaining_amount_cents - reservation.reserved_cents;
      const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

      await supabase
        .from('experience_credits')
        .update({
          remaining_amount_cents: newBalance,
          status: newStatus,
          redeemed_at: newBalance === 0 ? new Date().toISOString() : null
        })
        .eq('id', reservation.credit_id);

      await supabase.from('experience_credit_ledger').insert({
        credit_id: reservation.credit_id,
        type: 'redemption',
        amount_cents: -reservation.reserved_cents,
        description: `Redeemed for cart purchase (${cartItems.length} items)`
      });

      await supabase
        .from('experience_credit_reservations')
        .update({ status: 'captured' })
        .eq('id', reservation_id);

      return res.status(200).json({
        free_checkout: true,
        url: successUrl.replace('{CHECKOUT_SESSION_ID}', 'free_' + reservation_id)
      });
    }

    // Build Stripe line items.
    const lineItems = cartItems.map((item) => {
      const product = item.product || {};

      // Option 1: Use the stored Stripe price ID (most reliable)
      if (product.stripe_price_id && !product.stripe_price_id.startsWith('REPLACE_WITH')) {
        return {
          price: product.stripe_price_id,
          quantity: item.quantity || 1,
        };
      }

      // Option 2: Use tier-based env var price ID
      const tierPriceId = product.tier ? TIER_PRICE_IDS[product.tier] : null;
      if (tierPriceId) {
        return {
          price: tierPriceId,
          quantity: item.quantity || 1,
        };
      }

      // Option 3: Fallback — create price inline
      const priceInCents = Math.round((product.price || 1.99) * 100);
      
      // Stripe STRICTLY requires absolute URLs for images. Relative URLs will cause a 400 fatal crash.
      const baseUrl = 'https://digitabloom.com';
      let validImageUrl = null;
      
      if (product.image_url) {
        if (product.image_url.startsWith('http')) {
          validImageUrl = product.image_url;
        } else if (product.image_url.startsWith('/')) {
          validImageUrl = `${baseUrl}${product.image_url}`;
        }
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title || product.name || 'DigitalBloom Experience',
            description: product.description || 'Customized luxury motion art',
            images: validImageUrl ? [validImageUrl] : [],
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity || 1,
      };
    });

    // Prepare session config
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      // Apple Pay and Google Pay are enabled automatically by Stripe Checkout
      // when the site is on HTTPS and the customer's device supports them.
      metadata: {
        ...metadata,
        reservation_id: reservation_id || '',
        cart_items: JSON.stringify(
          cartItems.map((item) => ({
            id: item.product.id,
            title: item.product.title || item.product.name,
            tier: item.product.tier || null,
            quantity: item.quantity,
            price: item.product.price,
          }))
        ),
      },
    };

    // If credit is applied but doesn't cover full amount, add discount
    if (reservation_id && remaining_due_cents > 0 && remaining_due_cents < totalCents) {
      const creditDiscount = totalCents - remaining_due_cents;
      sessionConfig.discounts = [
        {
          coupon: await stripe.coupons
            .create({
              amount_off: creditDiscount,
              currency: 'usd',
              duration: 'once',
              name: `Experience Credit: -$${(creditDiscount / 100).toFixed(2)}`,
            })
            .then((c) => c.id),
        },
      ];
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
