// Observability bootstrap — Sentry + Vercel Analytics + Speed Insights.
//
// Sentry is gated on VITE_SENTRY_DSN being set in the build environment.
// If the DSN isn't present (e.g., before Ak creates the Sentry project),
// the import is still cheap but no events are sent. The moment she pastes
// a DSN into Vercel env vars and redeploys, error tracking kicks in
// without any further code change.
//
// Vercel Analytics + Speed Insights are zero-config — they detect the
// Vercel deployment URL automatically and start collecting page views
// and Core Web Vitals as soon as the components mount.

import * as Sentry from '@sentry/react';

export function initObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    // Sample rates kept conservative; can be tuned once we see real traffic.
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    // Don't send local development noise unless explicitly enabled
    enabled: import.meta.env.MODE !== 'development' || import.meta.env.VITE_SENTRY_DEBUG === 'true',
  });
}
