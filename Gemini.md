# Digital Bloom Project Knowledge & Scope (from Gemini Web)

## Project Overview
- **Name:** Digital Bloom
- **Owner:** Akieia Davis
- **Status:** Active Development
- **Launch Target:** Easter 2026
- **Primary Goal:** High-end multimedia digital gifting platform (roses, custom music, video blooms).

## Tech Stack
- **Frontend:** React / Vite (Note: Metadata says Next.js, but current local setup is Vite)
- **Backend/Auth:** Supabase
- **Payments:** Stripe
- **Deployment:** Vercel / GitHub `akieia60/digital-bloom`
- **IDE:** Google Antigravity (Gemini 3.1 Pro)

## Core Features
- **Customization:** Move beyond static CSS to dynamic user-driven styling.
- **Theme Engine:** JS-to-CSS Variable Bridge (State-managed styles).
- **Visual Logic:** WebGL/Three.js for 3D "blooming" effects, Design Tokens for brand consistency.
- **Monetization:** Pricing tiers for different gifting levels (Gold, Crystal, Custom).

## The Dynamic Theme Engine
**Concept:** A React-based bridge syncing application state to CSS variables in real-time.

### Key Variables Expected:
- `--bloom-primary` (controlling the core tint/glow)
- `--bloom-radius` (controlling visual softness/structure)
- `--bloom-glow` (controlling luminosity of the premium effects)

**Logic:**
```javascript
// Syncing React state to document.documentElement.style.setProperty
document.documentElement.style.setProperty('--bloom-primary', themeState.color);
```

## Instructions for Agent (Antigravity)
1. Prioritize premium UI/UX for a luxury gifting experience.
2. Integrate Supabase for saving user-generated 'Bloom' configurations.
3. Help bridge the gap between the current React/Vite code and the new dynamic customization tools.
4. **CRITICAL:** Ignore CB radio conversations if mentioned in logs.

## Next Steps Road Map
- [ ] Implement the Supabase schema for theme persistence.
- [ ] Develop the 'Gift Editor' interface using the State-to-Variable bridge.
- [ ] Ensure trademark compliance for 'DigitalBloom'.
