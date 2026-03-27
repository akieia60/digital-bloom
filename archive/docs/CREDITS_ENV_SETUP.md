# Experience Credits Backend - Environment Variables

## Required Environment Variables

Add these to your `.env` file in the root of the flower-shop directory:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
APP_BASE_URL=http://localhost:5173
PORT=3001

# Email Provider (Optional - for scheduled delivery)
# EMAIL_PROVIDER_API_KEY=your_sendgrid_or_resend_api_key
```

## Client-Side Environment Variables

Add these to your `.env` file (these are safe to expose to the client):

```bash
# Vite environment variables (must start with VITE_)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001
VITE_STRIPE_SUCCESS_URL=http://localhost:5173/success
VITE_STRIPE_CANCEL_URL=http://localhost:5173
```

## Security Notes

⚠️ **NEVER** expose these server-side keys to the client:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

✅ **Safe to expose** (client-side):
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Production Setup

For production deployment (Vercel):

1. Add all environment variables in Vercel dashboard
2. Update `APP_BASE_URL` to your production domain
3. Update `VITE_API_URL` to your production API URL
4. Configure Stripe webhook endpoint to point to your production domain
