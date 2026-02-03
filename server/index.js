// ============================================
// STRIPE CHECKOUT API SERVER
// ============================================
// This is a minimal Express server to handle Stripe checkout
// Run with: node server/index.js

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stripe API server is running' });
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      priceId,
      quantity = 1,
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail,
      metadata = {}
    } = req.body;

    // Build line items array
    let items = [];
    if (lineItems) {
      // Multiple products (cart checkout)
      items = lineItems;
    } else if (priceId) {
      // Single product checkout
      items = [{ price: priceId, quantity }];
    } else {
      return res.status(400).json({ error: 'Either priceId or lineItems required' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add your countries
      },
    });

    res.json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events (payment success, etc.)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);

      // Update your database here
      // - Mark purchase as completed
      // - Generate download links
      // - Send confirmation email

      // Example: Update Supabase purchase record
      // await updatePurchaseStatus(session.id, 'completed', {
      //   stripe_payment_intent_id: session.payment_intent,
      //   download_url: generateDownloadUrl()
      // });

      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      console.log('Checkout session expired:', expiredSession.id);
      // Update purchase status to failed
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Stripe API server running on http://localhost:${PORT}`);
  console.log(`✓ Create checkout endpoint: http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`✓ Webhook endpoint: http://localhost:${PORT}/api/webhook`);
});

export default app;
