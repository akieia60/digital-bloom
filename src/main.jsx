import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'
import { initObservability } from './lib/observability.js'

// Wire up Sentry first so any boot-time error is captured.
initObservability();

// Bloom-protection: block long-press save / right-click "Save Video As" /
// context-menu copy on every <video> element across the site (Gamble
// 2026-05-05 PM: "you should not be able to copy and paste the digital
// blooms… the only options that should be on our videos is the option to
// play or pause"). Pairs with the `video { -webkit-touch-callout: none }`
// rule in index.css. We hang the listener on `document` so videos rendered
// AFTER mount are also covered.
if (typeof document !== 'undefined') {
  const blockOnVideo = (event) => {
    if (event.target?.tagName === 'VIDEO') {
      event.preventDefault();
    }
  };
  document.addEventListener('contextmenu', blockOnVideo);
  // Cancel iOS long-press selection / share before it opens the share sheet.
  document.addEventListener('selectstart', blockOnVideo);
  document.addEventListener('dragstart', blockOnVideo);
}

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
