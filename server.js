import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase with service role key (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());

// Webhook endpoint needs raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    try {
      // Handle credit purchase
      if (metadata.type === 'experience_credit') {
        await handleCreditPurchase(session, metadata);
      }
      
      // Handle credit redemption (capture reservation)
      if (metadata.reservation_id) {
        await captureReservation(metadata.reservation_id, session.id);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  res.json({ received: true });
});

// All other endpoints use JSON
app.use(express.json());

// ============================================
// CREDIT PURCHASE
// ============================================

app.post('/api/create-credit-checkout', async (req, res) => {
  try {
    const { amount_cents, purchaser_email, recipient_email, delivery_date, note } = req.body;

    // Validate amount
    const validAmounts = [1000, 2500, 5000, 10000, 15000, 20000];
    if (!validAmounts.includes(amount_cents)) {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `DigitalBloom Experience Credit - $${(amount_cents / 100).toFixed(2)}`,
            description: 'Prepaid access to DigitalBloom digital multimedia experiences'
          },
          unit_amount: amount_cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/credits`,
      customer_email: purchaser_email,
      metadata: {
        type: 'experience_credit',
        credit_amount: amount_cents.toString(),
        purchaser_email,
        recipient_email: recipient_email || '',
        delivery_date: delivery_date || '',
        note: note || ''
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating credit checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREDIT VALIDATION & BALANCE
// ============================================

// Rate limiting storage (in-memory for simplicity)
const rateLimits = new Map();

function checkRateLimit(ip, endpoint, limit = 10, windowMs = 60000) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const record = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count++;
  rateLimits.set(key, record);

  return record.count <= limit;
}

app.get('/api/credits/balance', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!checkRateLimit(ip, 'balance')) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  try {
    const { code } = req.query;

    if (!code || !/^DBLOOM-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid credit code format' });
    }

    // Get credit
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (creditError || !credit) {
      return res.status(404).json({ error: 'Credit code not found' });
    }

    // Get ledger history
    const { data: history, error: historyError } = await supabase
      .from('experience_credit_ledger')
      .select('id, delta_cents, reason, created_at')
      .eq('credit_id', credit.id)
      .order('created_at', { ascending: false });

    if (historyError) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }

    // Return masked data (no purchaser email)
    res.json({
      remaining_amount_cents: credit.remaining_amount_cents,
      initial_amount_cents: credit.initial_amount_cents,
      status: credit.status,
      created_at: credit.created_at,
      history: history || []
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.post('/api/credits/validate', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!checkRateLimit(ip, 'validate')) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  try {
    const { code } = req.body;

    if (!code || !/^DBLOOM-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code)) {
      return res.status(400).json({ valid: false, error: 'Invalid code format' });
    }

    const { data: credit, error } = await supabase
      .from('experience_credits')
      .select('id, remaining_amount_cents, status')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !credit) {
      return res.json({ valid: false, error: 'Credit code not found' });
    }

    if (credit.status === 'void') {
      return res.json({ valid: false, error: 'Credit has been voided' });
    }

    if (credit.status === 'redeemed' || credit.remaining_amount_cents <= 0) {
      return res.json({ valid: false, error: 'Credit has been fully redeemed' });
    }

    res.json({
      valid: true,
      remaining_cents: credit.remaining_amount_cents
    });
  } catch (error) {
    console.error('Error validating credit:', error);
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
});

// ============================================
// CREDIT RESERVATION
// ============================================

app.post('/api/credits/reserve', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!checkRateLimit(ip, 'reserve')) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  try {
    const { code, order_total_cents } = req.body;

    if (!code || !order_total_cents) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate credit
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (creditError || !credit) {
      return res.status(404).json({ error: 'Credit code not found' });
    }

    if (credit.status === 'void' || credit.status === 'redeemed') {
      return res.status(400).json({ error: 'Credit is not usable' });
    }

    if (credit.remaining_amount_cents <= 0) {
      return res.status(400).json({ error: 'Credit has no remaining balance' });
    }

    // Calculate applied amount
    const applied_cents = Math.min(credit.remaining_amount_cents, order_total_cents);
    const remaining_after_cents = credit.remaining_amount_cents - applied_cents;

    // Create reservation (expires in 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const { data: reservation, error: reservationError } = await supabase
      .from('experience_credit_reservations')
      .insert({
        credit_id: credit.id,
        code: credit.code,
        reserved_cents: applied_cents,
        status: 'reserved',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (reservationError) {
      console.error('Reservation error:', reservationError);
      return res.status(500).json({ error: 'Failed to create reservation' });
    }

    res.json({
      reservation_id: reservation.id,
      applied_cents,
      remaining_after_cents,
      remaining_due_cents: order_total_cents - applied_cents
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Reservation failed' });
  }
});

// ============================================
// EXISTING CHECKOUT (MODIFIED)
// ============================================

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, successUrl, cancelUrl, customerEmail, metadata, reservation_id, remaining_due_cents } = req.body;

    // If there's a reservation and remaining due is 0, skip Stripe
    if (reservation_id && remaining_due_cents === 0) {
      // Capture reservation immediately
      await captureReservation(reservation_id, null);
      
      // Return success URL directly
      return res.json({
        sessionId: null,
        url: successUrl,
        free_checkout: true
      });
    }

    // Create line items from cart (dynamic pricing)
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    // If there's a reservation, adjust the total
    let sessionMetadata = metadata || {};
    if (reservation_id) {
      sessionMetadata.reservation_id = reservation_id;
      
      // Adjust line items to reflect discount
      if (remaining_due_cents !== undefined) {
        const originalTotal = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);
        const discountAmount = originalTotal - remaining_due_cents;
        
        if (discountAmount > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Experience Credit Applied',
              },
              unit_amount: -discountAmount,
            },
            quantity: 1,
          });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: sessionMetadata,
    });

    // Update reservation with stripe session ID
    if (reservation_id) {
      await supabase
        .from('experience_credit_reservations')
        .update({ stripe_session_id: session.id })
        .eq('id', reservation_id);
    }

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function handleCreditPurchase(session, metadata) {
  const { credit_amount, purchaser_email, recipient_email, delivery_date, note } = metadata;

  // Generate unique code
  let code;
  let attempts = 0;
  while (attempts < 10) {
    code = generateCreditCode();
    const { data: existing } = await supabase
      .from('experience_credits')
      .select('id')
      .eq('code', code)
      .single();
    
    if (!existing) break;
    attempts++;
  }

  if (attempts >= 10) {
    throw new Error('Failed to generate unique credit code');
  }

  // Create credit
  const { data: credit, error: creditError } = await supabase
    .from('experience_credits')
    .insert({
      code,
      initial_amount_cents: parseInt(credit_amount),
      remaining_amount_cents: parseInt(credit_amount),
      status: 'active',
      purchaser_email,
      recipient_email: recipient_email || null,
      stripe_session_id: session.id,
      notes: note || null
    })
    .select()
    .single();

  if (creditError) throw creditError;

  // Create ledger entry
  await supabase
    .from('experience_credit_ledger')
    .insert({
      credit_id: credit.id,
      delta_cents: parseInt(credit_amount),
      reason: 'purchase'
    });

  // Send email (or schedule if delivery_date exists)
  if (delivery_date && new Date(delivery_date) > new Date()) {
    // Schedule email
    await supabase
      .from('scheduled_credit_emails')
      .insert({
        credit_id: credit.id,
        recipient_email: recipient_email || purchaser_email,
        delivery_date,
        status: 'pending'
      });
  } else {
    // Send immediately (placeholder - implement actual email sending)
    console.log(`📧 Would send credit email to ${recipient_email || purchaser_email}`);
    console.log(`Credit Code: ${code}`);
    console.log(`Amount: $${(parseInt(credit_amount) / 100).toFixed(2)}`);
  }
}

async function captureReservation(reservationId, stripeSessionId) {
  // Get reservation
  const { data: reservation, error: resError } = await supabase
    .from('experience_credit_reservations')
    .select('*')
    .eq('id', reservationId)
    .single();

  if (resError || !reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.status !== 'reserved') {
    throw new Error('Reservation already processed');
  }

  // Check expiration
  if (new Date(reservation.expires_at) < new Date()) {
    await supabase
      .from('experience_credit_reservations')
      .update({ status: 'released' })
      .eq('id', reservationId);
    throw new Error('Reservation expired');
  }

  // Get credit
  const { data: credit, error: creditError } = await supabase
    .from('experience_credits')
    .select('*')
    .eq('id', reservation.credit_id)
    .single();

  if (creditError || !credit) {
    throw new Error('Credit not found');
  }

  // Deduct from credit
  const newBalance = credit.remaining_amount_cents - reservation.reserved_cents;
  const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

  await supabase
    .from('experience_credits')
    .update({
      remaining_amount_cents: newBalance,
      status: newStatus,
      redeemed_at: newStatus === 'redeemed' ? new Date().toISOString() : null
    })
    .eq('id', credit.id);

  // Create ledger entry
  await supabase
    .from('experience_credit_ledger')
    .insert({
      credit_id: credit.id,
      delta_cents: -reservation.reserved_cents,
      reason: 'redemption',
      related_order_id: stripeSessionId
    });

  // Mark reservation as captured
  await supabase
    .from('experience_credit_reservations')
    .update({ status: 'captured' })
    .eq('id', reservationId);
}

function generateCreditCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment1 = Array.from(crypto.randomBytes(4))
    .map(byte => chars[byte % chars.length])
    .join('');
  const segment2 = Array.from(crypto.randomBytes(4))
    .map(byte => chars[byte % chars.length])
    .join('');
  return `DBLOOM-${segment1}-${segment2}`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
