/**
 * Digital Bloom Animation Prompts — Visual Doctrine
 * Data source for the Prompt Vault page.
 */

import {
  MOTHERS_DAY_COLLECTION,
  MISSING_ZODIAC_SIGNS,
  BIRTHDAY_CELEBRATION,
  HOLIDAY_COLLECTION,
  INCLUSIVE_SPECIAL_CATEGORIES,
} from './newPromptVaultData';

export const VISUAL_DOCTRINE = [
  'Dark void',
  'Single-source spotlight',
  'Gold particulate aura',
  'Hyper-detailed texture',
  'Luxury restraint',
];

export const CONSISTENCY_RULES = [
  'Black background nearly pure',
  'Warm gold particle tone consistent',
  'Slight film grain',
  'High contrast lighting',
  'Shallow depth of field',
];

export const HIGGS_FIELD_SUFFIX =
  'Use reference image for exact petal structure and color consistency.';

export const SIGNATURE_SERIES = [
  {
    id: 1,
    title: 'THE GOLDEN ROSE – Sacred Spotlight Bloom',
    reference: 'single rose with gold dust',
    mood: ['sacred', 'powerful', 'intimate luxury'],
    prompt: `Create a hyper-realistic cinematic animation of a deep crimson rose against a pure black background.

The rose is illuminated by a soft overhead spotlight. Fine golden dust particles drift slowly around it.

Tiny water droplets rest on the petals, catching warm light.

The camera slowly pushes in as the rose subtly rotates.

Golden particles gather toward the center of the rose, glowing slightly brighter before dispersing gently.

Lighting is dramatic and sculpted, with deep shadows and warm gold highlights.

Shallow depth of field.
Ultra-detailed velvet petal texture.
Fine film grain.

Mood: sacred, powerful, intimate luxury.
No text.
No logos.
If using Higgs Field, add:
"Use reference image for exact petal shape and color consistency."`,
  },
  {
    id: 2,
    title: 'PEONY CASCADE – Feminine Power Bloom',
    reference: 'peach peonies in bowl',
    mood: ['feminine strength', 'softness with depth', 'quiet confidence'],
    prompt: `Create a cinematic slow-motion animation of soft coral and peach peonies arranged in a dark antique bowl.

Golden dust rises gently from behind the flowers like sacred smoke.

Petals subtly tremble as if touched by invisible air.

One petal falls in slow motion toward the camera.

Camera slowly orbits from left to right.

Warm directional lighting from upper left.
Deep shadow background.
Hyper-detailed petal layers.
Shallow depth of field.

Mood: feminine strength, softness with depth, quiet confidence.
Cinematic realism.
To intensify:
"Add subtle glowing gold particles catching in the folds of the petals."`,
  },
  {
    id: 3,
    title: 'ORCHID ZEN – Balanced Duality Bloom',
    reference: 'white and purple orchids in black vase',
    mood: ['balance', 'duality', 'peace and power combined'],
    prompt: `Create a hyper-realistic animation of white and deep magenta orchids in a matte black vase.

A soft spotlight shines from above.

Tiny golden particles drift downward like stardust.

The orchids gently sway as if breathing.

The camera holds steady at first, then slowly pushes forward.

Light reflects softly on the vase surface.

Shallow depth of field.
Ultra-detailed orchid texture.
Soft gold sparkle highlights.

Mood: balance, duality, peace and power combined.
Minimal movement. Calm presence.`,
  },
  {
    id: 4,
    title: 'DIGITAL BLOOM EXPLOSION – Signature Brand Moment',
    reference: 'bloom explosion with text',
    mood: ['transformation', 'power', 'creation', 'digital luxury'],
    prompt: `Create a cinematic animation of multiple flowers suspended in a black void.

At first, the flowers are tightly gathered in the center.

Golden particles begin swirling rapidly.

The bouquet explodes outward in slow motion — petals flying gracefully through space.

Warm golden light radiates from the center.

Camera pulls back slightly, then gently pushes in as particles glow.

Petals move in elegant arcs, not chaotic.

Ultra-detailed textures.
High contrast lighting.
Shallow depth of field.

Mood: transformation, power, creation, digital luxury.

No visible brand text unless intentionally added at final frame.
If you want text reveal:
"After explosion, petals subtly reassemble to reveal 'DIGITAL BLOOM' in elegant minimal typography."`,
  },
  {
    id: 5,
    title: 'HANDS OFFERING – Sacred Offering Bloom',
    reference: 'hands holding roses with spotlight',
    mood: ['protection', 'offering', 'legacy', 'gratitude'],
    prompt: `Create a hyper-realistic cinematic animation of two dark-skinned hands gently cupping deep pink and blush roses.

A soft spotlight shines from above.

Fine golden particles drift downward into the flowers.

The hands subtly lift and tilt upward as if offering something sacred.

Golden light glows softly from within the roses.

Camera slowly pushes in.

Shallow depth of field.
Detailed skin texture.
Warm amber highlights.
Black void background.

Mood: protection, offering, legacy, gratitude.
Sacred and intimate.`,
  },
  {
    id: 6,
    title: 'LUXURY BOUQUET CELEBRATION – Elevated Abundance',
    reference: 'pink and orchid bouquet',
    mood: ['abundance', 'celebration', 'feminine elegance', 'premium luxury'],
    prompt: `Create a cinematic animation of a lush bouquet of blush roses and deep magenta orchids arranged in a glossy black vase.

Golden particles swirl gently around the bouquet.

Petals shimmer subtly as light moves across them.

Camera slowly rotates in a smooth arc.

Soft warm spotlight from above.
Deep shadow background.
High texture detail.
Shallow depth of field.

Mood: abundance, celebration, feminine elegance, premium luxury.`,
  },
];

export const BLOOM_COLLECTION_SERIES = [
  {
    id: 7,
    title: 'AMARYLLIS – Bold Crimson Authority',
    reference: 'red amaryllis with gold dust edges',
    mood: ['authority', 'bold presence', 'controlled power'],
    prompt: `Create a hyper-realistic cinematic animation of a deep crimson amaryllis against a pure black background.

Soft spotlight from upper left.
Gold dust clings subtly to the edges of the petals.

The bloom slowly rotates in place.
Fine golden particles drift outward like quiet embers.

Camera performs a slow, controlled push-in.

Ultra-detailed velvet petal texture.
Deep shadow contrast.
Shallow depth of field.

Mood: authority, bold presence, controlled power.
Sacred luxury.
No logos.`,
  },
  {
    id: 8,
    title: 'CARNATION – Layered Intimacy',
    reference: 'layered pink carnation',
    mood: ['vulnerability with strength', 'emotional depth', 'quiet beauty'],
    prompt: `Create a cinematic slow-motion animation of a blush pink carnation against a black void.

Golden dust rises gently behind the flower like sacred mist.

The layered petals subtly unfold one degree wider over time.

Camera holds steady, then slowly pushes forward.

Warm amber lighting.
Fine gold particles catching in the petal ridges.

Hyper-detailed texture.
Shallow depth of field.

Mood: vulnerability with strength, emotional depth, quiet beauty.`,
  },
  {
    id: 9,
    title: 'ANTHURIUM – Modern Minimalism',
    reference: 'glossy red anthurium in black vase',
    mood: ['modern elegance', 'precision', 'luxury minimalism'],
    prompt: `Create a hyper-realistic animation of a glossy deep red anthurium in a matte black vase.

The flower is illuminated by a soft, focused spotlight.

Tiny gold particles shimmer lightly across the waxy surface.

Camera performs a slow side-to-side glide.

Surface reflections are subtle and elegant.
High contrast lighting.
Shallow depth of field.

Mood: modern elegance, precision, luxury minimalism.
Controlled and refined.`,
  },
  {
    id: 10,
    title: 'POPPY – Passion Ignited',
    reference: 'red-orange poppy with black center',
    mood: ['passion', 'ignition', 'intensity with grace'],
    prompt: `Create a cinematic animation of a vivid red and orange poppy against a pure black background.

Golden dust erupts softly behind it like a solar flare.

The petals tremble gently in slow motion.

Camera slowly rotates around the center.

Warm glowing halo effect behind the flower.

Ultra-detailed texture.
High contrast shadows.
Shallow depth of field.

Mood: passion, ignition, intensity with grace.`,
  },
  {
    id: 11,
    title: 'GARDENIA – Purity and Light',
    reference: 'ivory gardenia spotlight',
    mood: ['purity', 'sacred calm', 'divine softness'],
    prompt: `Create a hyper-realistic cinematic animation of a soft ivory gardenia under a focused overhead spotlight.

Fine golden particles drift downward into the center of the bloom.

The petals glow subtly as light intensifies and then softens.

Camera slowly pushes forward.

Delicate petal texture.
Cream and warm ivory tones preserved.

Mood: purity, sacred calm, divine softness.
Minimal movement.
Elegant restraint.`,
  },
  {
    id: 12,
    title: 'IRIS – Royal Depth',
    reference: 'deep purple iris',
    mood: ['royalty', 'wisdom', 'depth', 'quiet dominance'],
    prompt: `Create a cinematic animation of a deep royal purple iris against a black void.

Golden dust settles gently into the folds of the petals.

Camera slowly orbits from left to right.

Subtle shimmer across textured surfaces.

High contrast lighting with dramatic shadows.

Shallow depth of field.
Ultra-detailed texture.

Mood: royalty, wisdom, depth, quiet dominance.`,
  },
  {
    id: 13,
    title: 'ANEMONE – Centered Mystery',
    reference: 'red anemone with dark core',
    mood: ['mystery', 'magnetic center', 'emotional gravity'],
    prompt: `Create a hyper-realistic animation of a deep red anemone with a dark central core.

Golden particles pulse subtly from the center outward.

The bloom rotates slowly as the camera gently pushes in.

Black background with warm gold halo.
High detail in petal veins.
Shallow depth of field.

Mood: mystery, magnetic center, emotional gravity.`,
  },
  {
    id: 14,
    title: 'PROTEA – Exotic Strength',
    reference: 'pink protea with gold tipped edges',
    mood: ['resilience', 'uniqueness', 'powerful femininity'],
    prompt: `Create a cinematic slow animation of a pink protea with gold-tipped edges in a black vase.

Golden dust swirls around the pointed petals.

Camera slowly rotates, emphasizing the structure.

Warm spotlight from above.
Deep shadow background.

Ultra-detailed petal texture.
Shallow depth of field.

Mood: resilience, uniqueness, powerful femininity.`,
  },
  {
    id: 15,
    title: 'MAGNOLIA – Grace in Bloom',
    reference: 'white magnolia',
    mood: ['grace', 'legacy', 'timeless beauty'],
    prompt: `Create a hyper-realistic animation of a white magnolia bloom under a soft golden spotlight.

Fine golden particles drift like sacred dust.

Petals subtly open slightly wider over time.

Camera performs a gentle forward push.

Creamy ivory tones preserved.
High detail.
Shallow depth of field.

Mood: grace, legacy, timeless beauty.`,
  },
  {
    id: 16,
    title: 'CHERRY BLOSSOM – Ephemeral Beauty',
    reference: 'branch with blossoms',
    mood: ['fleeting beauty', 'tenderness', 'quiet reflection'],
    prompt: `Create a cinematic animation of delicate pink cherry blossoms on a dark branch.

Golden particles float gently around the flowers.

One petal detaches and drifts toward the camera.

Camera slowly glides sideways.

Soft warm light.
Deep black background.

Mood: fleeting beauty, tenderness, quiet reflection.`,
  },
  {
    id: 17,
    title: 'DAHLIA – Structured Majesty',
    reference: 'deep pink layered dahlia',
    mood: ['structure', 'precision', 'majesty'],
    prompt: `Create a hyper-realistic cinematic animation of a deep rose dahlia.

Golden dust forms a soft halo behind it.

The bloom rotates slowly in place.

Camera performs a controlled push-in.

High detail layered petals.
Warm spotlight.
Shallow depth of field.

Mood: structure, precision, majesty.`,
  },
  {
    id: 18,
    title: 'LOTUS – Awakening',
    reference: 'pink lotus on reflective surface',
    mood: ['awakening', 'enlightenment', 'rebirth'],
    prompt: `Create a cinematic slow animation of a pink lotus resting on a reflective black surface.

Golden particles fall from above like sacred light.

The lotus glows softly from within.

Subtle reflection beneath it.

Camera slowly pushes forward.

Soft ambient halo.
Shallow depth of field.

Mood: awakening, enlightenment, rebirth.`,
  },
  {
    id: 19,
    title: 'SUNFLOWER – Radiant Force',
    reference: 'sunflower with gold burst',
    mood: ['confidence', 'radiance', 'unstoppable energy'],
    prompt: `Create a hyper-realistic cinematic animation of a vibrant yellow sunflower against a black background.

Golden light radiates from behind it in subtle pulses.

The camera slowly rotates around the center.

Fine golden particles shimmer outward.

Ultra-detailed center texture.
High contrast lighting.

Mood: confidence, radiance, unstoppable energy.`,
  },
  {
    id: 20,
    title: 'CALLA LILIES – Elegant Ascent',
    reference: 'three white calla lilies',
    mood: ['refinement', 'ascent', 'understated luxury'],
    prompt: `Create a cinematic animation of three white calla lilies rising gracefully against a black background.

Golden mist drifts upward around them.

The stems subtly sway.

Camera slowly pushes in.

Soft directional spotlight.
Elegant shadows.
Shallow depth of field.

Mood: refinement, ascent, understated luxury.`,
  },
];

// ─── New Launch Prompt Series (April 2026) ────────────────────────────────────
export { MOTHERS_DAY_COLLECTION } from './newPromptVaultData';
export { MISSING_ZODIAC_SIGNS } from './newPromptVaultData';
export { BIRTHDAY_CELEBRATION } from './newPromptVaultData';
export { HOLIDAY_COLLECTION } from './newPromptVaultData';
export { INCLUSIVE_SPECIAL_CATEGORIES } from './newPromptVaultData';



export const ORIGINAL_PROMPTS = [...SIGNATURE_SERIES, ...BLOOM_COLLECTION_SERIES];

export const LAUNCH_PROMPTS = [
  ...MOTHERS_DAY_COLLECTION,
  ...MISSING_ZODIAC_SIGNS,
  ...BIRTHDAY_CELEBRATION,
  ...HOLIDAY_COLLECTION,
  ...INCLUSIVE_SPECIAL_CATEGORIES,
];

export const ALL_PROMPTS = [...ORIGINAL_PROMPTS, ...LAUNCH_PROMPTS];
