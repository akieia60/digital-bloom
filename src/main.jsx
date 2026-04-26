import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'
import { initObservability } from './lib/observability.js'

// Wire up Sentry first so any boot-time error is captured.
initObservability();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Vercel Analytics — visitor counts + page views in the Vercel dashboard.
        Zero-config; gated by deployment URL automatically. */}
    <Analytics />
    {/* Vercel Speed Insights — Core Web Vitals (LCP / CLS / INP) per route. */}
    <SpeedInsights />
  </StrictMode>,
)
