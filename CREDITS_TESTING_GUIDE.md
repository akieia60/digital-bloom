# Experience Credits Backend - Testing Guide

## Local Development Setup

### 1. Install Dependencies

```bash
cd Archive/flower-shop
npm install @supabase/supabase-js
```

### 2. Run Database Migrations

```bash
# Apply the credit system migrations to your Supabase database
# Go to Supabase Dashboard > SQL Editor and run:
# - supabase/migrations/004_experience_credits.sql
# - supabase/migrations/005_credit_reservations.sql
```

### 3. Start the Server

```bash
# In one terminal, start the Express server
node server.js
```

```bash
# In another terminal, start the Vite dev server
npm run dev
```

### 4. Set Up Stripe Webhook Forwarding

```bash
# Install Stripe CLI if you haven't already
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Copy the webhook signing secret (whsec_...) and add it to your .env file as STRIPE_WEBHOOK_SECRET
```

---

## Testing Checklist

### ✅ Test 1: Purchase Experience Credit

1. Navigate to `http://localhost:5173/credits`
2. Select an amount (e.g., $25)
3. Click "Buy Experience Credit"
4. Enter your email when prompted
5. Complete Stripe test checkout:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
6. **Expected Result:**
   - Webhook receives `checkout.session.completed`
   - Credit code generated (DBLOOM-XXXX-XXXX)
   - Credit inserted into `experience_credits` table
   - Ledger entry created with `reason: 'purchase'`
   - Console logs credit code (email would be sent in production)

### ✅ Test 2: Check Credit Balance

1. Navigate to `http://localhost:5173/credits/balance`
2. Enter the credit code from Test 1
3. Click "Check Balance"
4. **Expected Result:**
   - Balance displays: $25.00
   - Status: "active"
   - History shows 1 entry: "Purchase" with +$25.00

### ✅ Test 3: Apply Credit to Checkout (Partial)

1. Add a $50 experience to cart
2. Open cart
3. Enter credit code in "Apply Experience Credit" field
4. Click "Apply"
5. **Expected Result:**
   - Credit applied: $25.00
   - Remaining due: $25.00
   - Remaining on card: $0.00
   - "Remove Credit" button appears

### ✅ Test 4: Complete Checkout with Credit

1. Continue from Test 3
2. Click "Publish Experience"
3. Complete Stripe checkout for remaining $25.00
4. **Expected Result:**
   - Webhook captures reservation
   - Credit status updated to "redeemed"
   - Ledger entry created with `reason: 'redemption'`, `delta_cents: -2500`
   - Success page displays

### ✅ Test 5: Check Balance After Redemption

1. Navigate to `/credits/balance`
2. Enter same credit code
3. **Expected Result:**
   - Balance: $0.00
   - Status: "redeemed"
   - History shows 2 entries:
     - Purchase: +$25.00
     - Redemption: -$25.00

### ✅ Test 6: Partial Credit Usage

1. Purchase $50 credit
2. Add $25 experience to cart
3. Apply credit
4. Complete checkout
5. Check balance
6. **Expected Result:**
   - Balance: $25.00
   - Status: "partially_used"
   - Can use remaining $25 on another purchase

### ✅ Test 7: Zero-Checkout (Credit Covers Full Amount)

1. Purchase $50 credit
2. Add $50 experience to cart
3. Apply credit
4. **Expected Result:**
   - Remaining due: $0.00
   - Click "Publish Experience"
   - No Stripe redirect (free checkout)
   - Reservation captured immediately
   - Redirected to success page

### ✅ Test 8: Invalid Credit Code

1. Go to cart with items
2. Enter invalid code: "INVALID-CODE-1234"
3. Click "Apply"
4. **Expected Result:**
   - Error: "Invalid credit code format"

### ✅ Test 9: Already Redeemed Credit

1. Try to apply a fully redeemed credit from Test 5
2. **Expected Result:**
   - Error: "Credit has been fully redeemed"

### ✅ Test 10: Rate Limiting

1. Make 11 rapid requests to `/api/credits/validate`
2. **Expected Result:**
   - First 10 succeed
   - 11th returns: "Rate limit exceeded. Try again later."

### ✅ Test 11: Gift Credit Purchase

1. Go to `/credits`
2. Select $25
3. Toggle "Send as a gift"
4. Fill in:
   - Recipient Name: "Test User"
   - Recipient Email: "recipient@test.com"
   - Delivery Date: Tomorrow
   - Note: "Happy Birthday!"
5. Complete purchase
6. **Expected Result:**
   - Credit created with `recipient_email`
   - Entry added to `scheduled_credit_emails` table
   - Console logs gift details

---

## API Endpoint Testing

### Test with cURL

```bash
# 1. Create credit checkout
curl -X POST http://localhost:3001/api/create-credit-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "amount_cents": 2500,
    "purchaser_email": "test@example.com"
  }'

# 2. Validate credit
curl -X POST http://localhost:3001/api/credits/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "DBLOOM-ABCD-1234"}'

# 3. Check balance
curl "http://localhost:3001/api/credits/balance?code=DBLOOM-ABCD-1234"

# 4. Reserve credit
curl -X POST http://localhost:3001/api/credits/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "code": "DBLOOM-ABCD-1234",
    "order_total_cents": 5000
  }'
```

---

## Troubleshooting

### Webhook not receiving events
- Ensure `stripe listen` is running
- Check webhook secret matches in `.env`
- Verify server is running on port 3001

### Credit not created after purchase
- Check server console for errors
- Verify Supabase service role key is correct
- Check `experience_credits` table exists

### Rate limiting not working
- Rate limits are in-memory (resets on server restart)
- For production, use Redis or similar

### Zero-checkout not working
- Verify `free_checkout` flag is returned from API
- Check reservation is being captured
- Ensure success URL is correct

---

## Production Deployment Notes

1. **Webhook Endpoint:** Configure in Stripe Dashboard to point to `https://yourdomain.com/api/stripe/webhook`
2. **Environment Variables:** Set all required vars in Vercel/hosting platform
3. **Email Delivery:** Implement actual email sending (SendGrid, Resend, etc.)
4. **Scheduled Emails:** Set up cron job or serverless function to process `scheduled_credit_emails`
5. **Rate Limiting:** Consider Redis-based rate limiting for production
6. **Monitoring:** Add logging/monitoring for webhook failures
