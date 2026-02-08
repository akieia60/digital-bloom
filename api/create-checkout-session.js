import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
      // Capture the reservation immediately
      const { data: reservation, error: resError } = await supabase
        .from('experience_credit_reservations')
        .select('*, experience_credits(*)')
        .eq('id', reservation_id)
        .single();

      if (resError || !reservation) {
        return res.status(400).json({ error: 'Invalid reservation' });
      }

      // Update credit balance
      const newBalance = reservation.experience_credits.remaining_amount_cents - reservation.reserved_cents;
      const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

      await supabase
        .from('experience_credits')
        .update({
          remaining_amount_cents: newBalance,
          status: newStatus,
          redeemed_at: newBalance === 0 ? new Date().toISOString() : null
        })
        .eq('id', reservation.credit_id);

      // Add ledger entry
      await supabase
        .from('experience_credit_ledger')
        .insert({
          credit_id: reservation.credit_id,
          type: 'redemption',
          amount_cents: -reservation.reserved_cents,
          description: `Redeemed for cart purchase (${cartItems.length} items)`
        });

      // Mark reservation as captured
      await supabase
        .from('experience_credit_reservations')
        .update({ status: 'captured' })
        .eq('id', reservation_id);

      // Return success URL for free checkout
      return res.status(200).json({
        free_checkout: true,
        url: successUrl.replace('{CHECKOUT_SESSION_ID}', 'free_' + reservation_id)
      });
    }

    // Create Stripe line items
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title || item.product.name,
          description: item.product.description || '',
          images: item.product.image_url ? [item.product.image_url] : []
        },
        unit_amount: Math.round(item.product.price * 100)
      },
      quantity: item.quantity
    }));

    // Prepare session config
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      metadata: {
        ...metadata,
        reservation_id: reservation_id || '',
        cart_items: JSON.stringify(cartItems.map(item => ({
          id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price
        })))
      }
    };

    // If credit is applied but doesn't cover full amount, add discount
    if (reservation_id && remaining_due_cents > 0 && remaining_due_cents < totalCents) {
      const creditDiscount = totalCents - remaining_due_cents;
      
      // Use Stripe's discount feature instead of negative line items
      sessionConfig.discounts = [{
        coupon: await stripe.coupons.create({
          amount_off: creditDiscount,
          currency: 'usd',
          duration: 'once',
          name: `Experience Credit: -$${(creditDiscount / 100).toFixed(2)}`
        }).then(c => c.id)
      }];
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
