# Digital Bloom

Digital Bloom is a luxury e-commerce experience for bespoke, AI-generated motion art.

- **Luxury Dark Theme UI**: Beautiful, modern interface with gold accents.
- **Atmospheric Audio Engine**: Cross-fading soundscapes for immersive browsing.
- **3D Rose Video Catalog**: Browse and preview stunning flower animations.

This project is built with Vite, React, Tailwind CSS, Supabase, and Stripe.

---

## Founder Command Dashboard

The Founder Command Dashboard is a private, internal tool for the Digital Bloom founder, A.K. Davis, to monitor the application's operational status, security, and financial health from a single, mobile-responsive interface. It is located at the `/founder` route.

### Access & Security

Access to the dashboard is strictly controlled:

1.  **Authentication Required**: A valid Supabase user session is required. The page will redirect to a login form if the user is not signed in.
2.  **Founder Allowlist**: Even after logging in, the user's email address is checked against a hardcoded allowlist of founder emails. Access is denied to any other authenticated user.

This two-layer security ensures that only the designated founder can view the dashboard.

**CRITICAL SECURITY NOTE:** The dashboard and its associated API endpoint (`/api/env-check`) are designed to **NEVER** display or transmit secret values (API keys, webhook secrets, etc.). It only ever shows the *presence* or *absence* of a required environment variable.

### Features

The dashboard is organized into five main sections:

1.  **Vault Seal Status**: A checklist for tracking the rotation and secure storage of critical secrets like Supabase and Stripe keys. The state is saved in the browser's `localStorage`.
2.  **Environment Readiness**: A table that checks for the presence of all required server-side and client-side environment variables. It calls the `/api/env-check` endpoint, which verifies the variables on the server without exposing their values.
3.  **Money Flow Quick Tests**: A set of buttons that trigger key financial API endpoints (e.g., creating a test checkout, validating a credit code) and display a simple pass/fail result. This allows for quick, end-to-end verification of the payment and credit systems.
4.  **Risk Dashboard**: A simple RAG (Red/Amber/Green) status board for tracking high-level operational risks. The status and notes are saved in `localStorage`.
5.  **Links Hub**: A collection of quick links to essential external services like Vercel, Stripe, Supabase, and GitHub.

### API Endpoint: `/api/env-check`

A new serverless function was created to support the Environment Readiness section.

-   **Endpoint**: `GET /api/env-check`
-   **Function**: Checks for the existence of required `process.env` variables on the Vercel server.
-   **Security**: It requires a valid Supabase JWT from an authorized founder and will only return a boolean `present` status for each variable, never the value itself.
