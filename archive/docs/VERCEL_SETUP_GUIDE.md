# 🚀 SUPER SIMPLE Vercel Setup Guide

## Don't worry - this is easier than it looks! Just follow these steps.

---

## STEP 1: Update Your Local .env File First

Open this file: `/Users/akieiamoniquedavis/Desktop/DigitalBloom_Project_Archive/Archive/flower-shop/.env`

**Add these lines at the bottom:**

```bash
# Add these new lines:
SUPABASE_URL=https://yhdbeblowolfinxxhsnt.supabase.co
STRIPE_WEBHOOK_SECRET=whsec_TEMP_placeholder
APP_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
PORT=3001
```

Save the file. ✅

---

## STEP 2: Go to Vercel

1. Open your browser
2. Go to: **https://vercel.com**
3. Log in
4. You should see your "Digital Bloom" or "flower-shop" project
5. **Click on the project name**

---

## STEP 3: Go to Settings

1. At the top of the page, you'll see tabs: Overview, Deployments, Analytics, **Settings**
2. **Click "Settings"**

---

## STEP 4: Go to Environment Variables

1. On the left side, you'll see a menu
2. Look for **"Environment Variables"**
3. **Click it**

---

## STEP 5: Add Variables (Do this 14 times)

For EACH variable below, do this:

1. Click the **"Add New"** button (or similar)
2. You'll see two boxes:
   - **Name** (or "Key"): Type the variable name from the list below
   - **Value**: Copy the value from your `.env` file
3. Make sure **ALL THREE checkboxes** are checked:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
4. Click **"Save"** or **"Add"**

### 📋 Copy These 14 Variables:

| Name | Where to get the value |
|------|----------------------|
| `GOOGLE_AI_STUDIO_KEY` | From your .env line 2 |
| `VITE_SUPABASE_URL` | From your .env line 5 |
| `VITE_SUPABASE_ANON_KEY` | From your .env line 6 |
| `SUPABASE_URL` | Same as VITE_SUPABASE_URL (line 5) |
| `SUPABASE_SERVICE_ROLE_KEY` | From your .env line 7 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | From your .env line 10 |
| `STRIPE_SECRET_KEY` | From your .env line 11 |
| `STRIPE_WEBHOOK_SECRET` | Type: `whsec_TEMP` (we'll update this later) |
| `VITE_APP_URL` | Type: `https://YOUR-APP-NAME.vercel.app` |
| `VITE_STRIPE_SUCCESS_URL` | Type: `https://YOUR-APP-NAME.vercel.app/success` |
| `VITE_STRIPE_CANCEL_URL` | Type: `https://YOUR-APP-NAME.vercel.app` |
| `APP_BASE_URL` | Type: `https://YOUR-APP-NAME.vercel.app` |
| `VITE_API_URL` | Type: `https://YOUR-APP-NAME.vercel.app` |
| `PORT` | Type: `3001` |

**Replace `YOUR-APP-NAME` with your actual Vercel app name!**

To find your app name:
- Look at the top of your Vercel project page
- You'll see something like: `digital-bloom.vercel.app`
- That's your app name!

---

## STEP 6: Deploy

1. Go back to your project (click the project name at the top)
2. Click the **"Deployments"** tab
3. Find your latest deployment
4. Click the **three dots (•••)** next to it
5. Click **"Redeploy"**
6. Wait for it to finish (you'll see a green checkmark when done)

---

## STEP 7: Set Up Stripe Webhook (IMPORTANT!)

1. Go to: **https://dashboard.stripe.com**
2. Click **"Developers"** in the top right corner
3. Click **"Webhooks"** on the left
4. Click the **"Add endpoint"** button
5. In the "Endpoint URL" box, type:
   ```
   https://YOUR-APP-NAME.vercel.app/api/stripe/webhook
   ```
   (Replace YOUR-APP-NAME with your actual Vercel domain!)

6. Click **"Select events"**
7. In the search box, type: `checkout.session.completed`
8. Check the box next to it
9. Click **"Add events"**
10. Click **"Add endpoint"**

---

## STEP 8: Get the Webhook Secret

1. You should now see your webhook in the list
2. Click on it
3. Look for **"Signing secret"**
4. Click **"Reveal"** or the eye icon
5. **Copy that secret** (it starts with `whsec_`)

---

## STEP 9: Update Webhook Secret in Vercel

1. Go back to Vercel
2. Go to Settings → Environment Variables (like you did before)
3. Find `STRIPE_WEBHOOK_SECRET`
4. Click the **three dots (•••)** next to it
5. Click **"Edit"**
6. Paste the webhook secret you just copied from Stripe
7. Click **"Save"**

---

## STEP 10: Deploy Again

1. Go to Deployments tab
2. Click the three dots (•••) next to latest deployment
3. Click **"Redeploy"**
4. Wait for the green checkmark

---

## ✅ YOU'RE DONE!

Your Experience Credits system is now live on Vercel!

---

## 🆘 If You Get Stuck

**Tell me:**
1. Which step number you're on
2. What you see on your screen
3. Any error messages

I'll walk you through it!

---

## Quick Test

After everything is deployed:

1. Go to: `https://YOUR-APP-NAME.vercel.app/credits`
2. You should see the Experience Credits page
3. Try clicking "Buy Experience Credit"
4. If it redirects to Stripe checkout, it's working! 🎉

(Don't actually complete the purchase unless you want to test it - use Stripe test card: `4242 4242 4242 4242`)
