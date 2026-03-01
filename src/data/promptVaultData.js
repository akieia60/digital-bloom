/**
 * Digital Bloom Animation Prompts — Visual Doctrine
 * Data source for the Prompt Vault page.
 * 
 * MEGA-PROMPT FORMAT: Each prompt now includes:
 *   - prompt: The initial base prompt (paste first into Grok Imagine)
 *   - iteration1: Follow-up refinement prompt (paste after first result)
 *   - iteration2: Second follow-up refinement prompt (paste after second result)
 */

import {
  MOTHERS_DAY_COLLECTION,
  MISSING_ZODIAC_SIGNS,
  BIRTHDAY_CELEBRATION,
  HOLIDAY_COLLECTION,
  INCLUSIVE_SPECIAL_CATEGORIES,
} from './newPromptVaultData';

import { VAULT_EXPANSION_PHASE_1 } from './newly_created_prompts';

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
    iteration1: `Refine the previous generation. Push the camera movement to a slower, more deliberate pace — almost meditative. Increase the density of the golden dust particles in the mid-ground, creating visible swirling eddies around the rose. Make the water droplets on the petals larger and more reflective, catching individual light rays. Add a subtle warm amber rim light from behind the rose to separate it from the black void.`,
    iteration2: `Further refinement. Intensify the overhead spotlight to create more dramatic Rembrandt-style lighting with brighter highlights on the upper petal edges and deeper, richer shadows in the petal folds. Push the velvet petal texture to an extreme — make each micro-fiber visible. Add a more pronounced film grain for a vintage, timeless quality. Let the golden particles leave faint trailing streaks as they drift, like slow-motion embers.`,
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
    iteration1: `Refine the previous generation. Enhance the falling petal — give it a more graceful, tumbling trajectory with visible light catching its edges as it descends. Increase the golden sacred smoke density behind the arrangement, making it billow more dynamically. Add a second soft fill light from the right side to reveal more detail in the shadow areas of the petal layers while maintaining the dramatic mood.`,
    iteration2: `Further refinement. Focus on texture and atmosphere. Make the antique bowl surface more detailed — show patina, subtle reflections, and age marks. Push the petal layer detail so each fold and crease is visible with almost tactile quality. Intensify the warm directional lighting to create more contrast between the lit coral tones and the deep shadow areas. Add slightly more pronounced film grain for a classic cinematic feel.`,
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
    iteration1: `Refine the previous generation. Enhance the breathing sway of the orchids — make it more organic and rhythmic, like a slow inhale and exhale. Increase the golden stardust particle count and add subtle variation in particle size, with some larger motes catching more light. Add a faint reflection of the orchids on the matte black vase surface to increase depth.`,
    iteration2: `Further refinement. Focus on the contrast between the white and magenta orchids — push the white petals to a brighter, more luminous quality while deepening the magenta to a richer, more saturated tone. Intensify the spotlight to create sharper light falloff and more dramatic shadows on the vase. Make the orchid petal texture more detailed — show the delicate veining and translucent quality of the petals. Add a subtle warm color shift to the film grain.`,
  },
  {
    id: 4,
    title: 'DIGITAL BLOOM EXPLOSION – Signature Brand Moment (Legacy)',
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
    iteration1: `Refine the previous generation. Make the initial gathering of flowers tighter and more compressed, building greater tension before the explosion. Enhance the explosion with more dynamic, swirling eddies of golden particles rather than a uniform burst. Increase the number of petals in the mid-ground to create a greater sense of depth and layered chaos while keeping foreground elements sharply focused.`,
    iteration2: `Further refinement. Push the golden light radiating from the center to be more volumetric — visible light rays cutting through the petal debris. Intensify the petal textures to show torn edges, gilded highlights, and crushed-velvet surfaces. Add more pronounced film grain and a slight warm color grade shift. Make the camera movement more cinematic with a subtle rack focus from the explosion center to a single drifting hero petal.`,
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
    iteration1: `Refine the previous generation. Enhance the skin texture on the hands — show pores, subtle highlights on the knuckles, and warm subsurface scattering where light passes through the thinner skin between fingers. Make the golden particles drift more purposefully toward the roses, as if drawn by gravity. Add a faint warm glow emanating from the cupped space between the hands and flowers.`,
    iteration2: `Further refinement. Intensify the overhead spotlight to create more dramatic Rembrandt lighting on the hands and roses. Push the rose petal detail — show individual cell structures and micro-droplets of moisture. Deepen the black void background to absolute black. Add a more pronounced film grain with a warm amber tone. Make the upward lifting motion of the hands even more subtle and reverent, almost imperceptible.`,
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
    iteration1: `Refine the previous generation. Enhance the shimmer on the petals — make it more dynamic, with light catching different surfaces as the camera rotates. Increase the golden particle density in the lower third of the frame, creating a swirling base of gold mist around the vase. Add subtle reflections of the bouquet on the glossy black vase surface. Make the camera rotation smoother and more cinematic.`,
    iteration2: `Further refinement. Focus on the contrast between the blush roses and magenta orchids — push the color separation while maintaining harmony. Intensify the spotlight to create brighter specular highlights on the glossy vase and petal edges. Push the texture detail on every petal to an extreme level — visible veins, micro-textures, and light-catching surfaces. Add a vintage film grain and a subtle warm color grade for timeless luxury.`,
  },
  {
    id: 55,
    title: 'DIGITAL BLOOM EXPLOSION – Signature Brand Moment (Mega-Prompt)',
    reference: 'cinematic peonies explosion',
    mood: ['sacred luxury', 'profound tranquility', 'cinematic masterpiece'],
    prompt: `Cinematic masterpiece, single continuous shot, ARRI Alexa 65 with an anamorphic lens. The scene opens in a pure black void, absolute nothingness. Floating in the center is a single, impossibly tight bouquet of white and cream-colored peonies, their petals furled shut. The only light is a soft, warm Rembrandt-style key light, catching the delicate, hyper-detailed textures of the petals and casting deep, soft shadows. Suddenly, the bouquet erupts in a silent, graceful explosion. A shockwave of shimmering warm gold particles expands outwards in a perfect sphere. The petals, now fully unfurled, are caught in a mesmerizing slow-motion ballet, tumbling and twisting through the void. The camera maintains a shallow depth of field, focusing on a single hero petal as it drifts, revealing its intricate, almost microscopic texture and fine, gilded edges. The background is a soft, bokeh-filled dreamscape of distant, out-of-focus gold dust and softly blurred petals. The scene resolves into a serene aftermath: the explosion has subsided, leaving a sparse, elegant nebula of floating petals and slowly fading gold embers in the vast, silent blackness. The mood is one of sacred luxury and profound tranquility. Fine film grain is visible throughout.`,
    iteration1: `Refine the previous generation. Enhance the sense of motion and energy in the initial explosion. Make the outward burst of gold particles more dynamic and less uniform, with swirling eddies and trails. Increase the density of the petals in the mid-ground to create a greater sense of depth and chaos, while keeping the foreground hero petal sharply in focus.`,
    iteration2: `Further refinement. Focus on the lighting and texture. Intensify the Rembrandt lighting so the contrast is more dramatic, with brighter highlights on the petal edges and deeper, richer shadows. Push the detail on the petal textures to an extreme, making them feel almost tangible, like crushed velvet or fine porcelain. Adjust the film grain to be slightly more pronounced for a more vintage, timeless feel.`,
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
    iteration1: `Refine the previous generation. Enhance the gold dust clinging to the petal edges — make it more visible with individual particles catching the spotlight. Increase the rotation speed slightly and add a subtle wobble to make the movement feel more organic. Push the ember-like particles to leave faint golden trails as they drift outward. Add a second, very faint rim light from the opposite side to define the flower's silhouette.`,
    iteration2: `Further refinement. Intensify the upper-left spotlight to create more dramatic chiaroscuro lighting with deeper blacks and brighter highlights. Push the velvet petal texture to show individual fibers and micro-ridges. Make the crimson color richer and more saturated in the lit areas while the shadow areas fall to near-black. Add more pronounced film grain with a warm tone for a classic, timeless feel.`,
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
    iteration1: `Refine the previous generation. Enhance the unfolding motion of the layered petals — make each layer reveal itself with more visible separation and depth. Increase the sacred mist density behind the flower, giving it a more volumetric, three-dimensional quality. Add subtle light refracting through the thinner petal edges, creating a translucent glow effect.`,
    iteration2: `Further refinement. Push the warm amber lighting to create more dramatic contrast — brighter warm highlights on the petal tips and deeper shadows in the layered folds. Make the petal ridge texture more pronounced, showing the characteristic ruffled edges of the carnation in extreme detail. Intensify the film grain and add a slight vignette to draw the eye to the center of the bloom.`,
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
    iteration1: `Refine the previous generation. Enhance the waxy surface reflections — make the spotlight create a more defined specular highlight that moves across the anthurium surface as the camera glides. Increase the gold particle shimmer to be more visible against the glossy red surface. Add a subtle reflection of the anthurium on the matte black vase for added depth.`,
    iteration2: `Further refinement. Push the high contrast lighting to its extreme — near-white highlights on the glossy surface and absolute black shadows. Make the waxy texture hyper-detailed, showing the smooth, almost liquid quality of the anthurium surface. Refine the camera glide to be even smoother and more controlled. Add a subtle film grain and a cool-to-warm color transition across the frame.`,
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
    iteration1: `Refine the previous generation. Enhance the solar flare effect — make the golden dust eruption more dynamic with visible rays and streaks radiating outward. Intensify the petal trembling to feel more alive, like the flower is vibrating with energy. Add a pulsing quality to the warm halo, making it breathe in sync with the petal movement.`,
    iteration2: `Further refinement. Push the red-orange color palette to be more vivid and saturated, with the orange tones glowing almost incandescent in the highlights. Make the black center of the poppy a true void — absolute darkness that contrasts dramatically with the fiery petals. Intensify the texture detail on the delicate, paper-thin poppy petals. Add a more pronounced vintage film grain for a timeless, painterly quality.`,
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
    iteration1: `Refine the previous generation. Enhance the light pulsing effect — make the intensifying and softening more gradual and hypnotic, like a slow heartbeat of light. Increase the golden particle density and add variation in their descent speed, with some drifting lazily while others fall more directly. Add a subtle warm glow emanating from within the gardenia's center.`,
    iteration2: `Further refinement. Push the ivory petal texture to show the waxy, almost porcelain quality of gardenia petals in extreme detail. Intensify the overhead spotlight to create more defined shadows in the petal overlaps while keeping the overall mood soft. Make the cream and ivory tones warmer and more luminous. Add a delicate film grain and a slight soft-focus halo around the bloom edges for a dreamlike quality.`,
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
    iteration1: `Refine the previous generation. Enhance the golden dust settling into the petal folds — make it accumulate more visibly in the deeper creases, creating rivers of gold. Slow the camera orbit and add a subtle vertical drift to the movement. Increase the shimmer effect across the textured surfaces, making it respond to the changing camera angle.`,
    iteration2: `Further refinement. Push the royal purple to be deeper and more saturated, with subtle blue and indigo undertones revealed in the highlights. Intensify the dramatic shadows to create a more sculptural, three-dimensional quality. Make the iris petal texture hyper-detailed — show the characteristic beard and falls with extreme clarity. Add a warm-toned film grain and a slight golden color cast to the highlights.`,
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
    iteration1: `Refine the previous generation. Enhance the pulsing golden particles — make each pulse more defined with a visible wave of particles expanding outward from the dark core. Increase the detail in the petal veins, making them glow faintly with golden light. Add a subtle magnetic quality to the particle movement, as if they're being drawn back toward the center after each pulse.`,
    iteration2: `Further refinement. Push the contrast between the deep red petals and the absolute black core to its maximum — the core should feel like a void within a void. Intensify the warm gold halo to create more dramatic rim lighting on the petal edges. Make the petal texture feel like crushed silk with visible micro-ridges. Add a more pronounced film grain and darken the overall exposure slightly for a more mysterious, moody atmosphere.`,
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
    iteration1: `Refine the previous generation. Enhance the gold-tipped edges — make them catch the spotlight more dramatically, creating bright golden accents against the pink. Increase the swirling golden dust to form more defined spiral patterns around the pointed petals. Add a subtle upward drift to the camera rotation, creating a sense of ascent and power.`,
    iteration2: `Further refinement. Push the protea's unique structural texture to extreme detail — show the layered, architectural quality of each bract and petal. Intensify the warm spotlight to create more dramatic chiaroscuro with deeper shadows between the petal layers. Make the gold-tipped edges more pronounced and luminous. Add a warm vintage film grain and a slight desaturation in the shadow areas for a more refined, editorial look.`,
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
    iteration1: `Refine the previous generation. Enhance the petal opening motion — make it more visible and graceful, with each petal moving independently at slightly different speeds. Increase the golden sacred dust density and add larger, slower-moving particles among the fine ones. Add a subtle warm backlight to create a glowing halo effect around the magnolia's silhouette.`,
    iteration2: `Further refinement. Push the creamy ivory tones to be warmer and more luminous, with subtle pink undertones in the thinner petal areas where light passes through. Intensify the golden spotlight to create more defined shadows and highlights on the thick, waxy magnolia petals. Make the texture hyper-detailed — show the smooth, almost leather-like quality of magnolia petals. Add a classic film grain with warm tones for a timeless, heirloom quality.`,
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
    iteration1: `Refine the previous generation. Enhance the detaching petal — give it a more graceful, spiraling descent with light catching its edges as it tumbles toward the camera. Increase the number of golden particles and add subtle variation in their movement patterns. Add a second petal beginning to detach in the background, creating a sense of the ephemeral nature of the blossoms.`,
    iteration2: `Further refinement. Push the delicate pink tones of the cherry blossoms to be more luminous and translucent, with visible light passing through the thin petals. Intensify the contrast between the soft warm light on the blossoms and the deep black background. Make the dark branch texture more detailed — show bark grain and subtle moss. Add a pronounced film grain and a slight soft-focus quality to the background blossoms for a dreamy, wistful atmosphere.`,
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
    iteration1: `Refine the previous generation. Enhance the layered petal structure — make each concentric ring of petals more defined and individually lit. Increase the golden halo intensity and add subtle pulsing to it, synchronized with the rotation. Add a faint reflection of the dahlia on a glossy surface below it for added depth and luxury.`,
    iteration2: `Further refinement. Push the deep rose color to be richer and more saturated, with subtle gradient variations from the outer petals to the tightly wound center. Intensify the warm spotlight to create more dramatic shadows between each petal layer, emphasizing the geometric precision. Make each petal's texture hyper-detailed — show the smooth, almost sculpted quality. Add a vintage film grain and a slight warm vignette for a majestic, regal atmosphere.`,
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
    iteration1: `Refine the previous generation. Enhance the inner glow of the lotus — make it pulse gently like a heartbeat, with the light intensity rising and falling. Increase the golden particle rain and add ripple effects on the reflective surface where particles land. Make the reflection beneath the lotus more detailed and mirror-like, creating a sense of infinite depth.`,
    iteration2: `Further refinement. Push the pink tones to be more ethereal and luminous, with the inner petals glowing warmer than the outer ones. Intensify the contrast between the glowing lotus and the dark reflective surface. Make the petal texture hyper-detailed — show the delicate, almost paper-thin quality of lotus petals with visible veining. Add a soft film grain and a slight bloom effect around the light sources for a transcendent, spiritual atmosphere.`,
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
    iteration1: `Refine the previous generation. Enhance the radiating golden light — make the pulses more dynamic with visible light rays extending outward through the petals. Increase the shimmer of the outward-moving particles, giving them more defined trails. Add a subtle heat-haze distortion effect around the sunflower to emphasize its radiant energy.`,
    iteration2: `Further refinement. Push the vibrant yellow to be more intense and saturated, almost glowing with its own internal light. Intensify the high contrast lighting to create more dramatic shadows on the intricate center seed pattern. Make the center texture hyper-detailed — show each individual seed and the Fibonacci spiral pattern. Add a warm, golden film grain and push the overall exposure slightly brighter for a more radiant, powerful feel.`,
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
    iteration1: `Refine the previous generation. Enhance the upward golden mist — make it more volumetric and three-dimensional, with visible layers of density. Add subtle independent movement to each lily, with each one swaying at a slightly different rhythm. Increase the spotlight definition to create more elegant shadow play on the curved lily surfaces.`,
    iteration2: `Further refinement. Push the white calla lily surfaces to show their characteristic smooth, waxy texture in extreme detail — almost like polished marble. Intensify the directional spotlight to create more dramatic light and shadow on the curved trumpet shapes. Make the stems more detailed with visible green texture and subtle moisture. Add a refined film grain and a slight cool-to-warm gradient across the frame for a sophisticated, gallery-quality feel.`,
  },
];

// ─── New Launch Prompt Series (April 2026) ────────────────────────────────────
export { MOTHERS_DAY_COLLECTION } from './newPromptVaultData';
export { MISSING_ZODIAC_SIGNS } from './newPromptVaultData'; // now empty — replaced by Celestial Saga
export { BIRTHDAY_CELEBRATION } from './newPromptVaultData';
export { HOLIDAY_COLLECTION } from './newPromptVaultData';
export { INCLUSIVE_SPECIAL_CATEGORIES } from './newPromptVaultData';

// ─── Celestial Saga Series (replaces old zodiac prompts) ──────────────────────
export { CELESTIAL_SAGA } from './celestialSagaData';


export const ORIGINAL_PROMPTS = [...SIGNATURE_SERIES, ...BLOOM_COLLECTION_SERIES];

export const LAUNCH_PROMPTS = [
  ...MOTHERS_DAY_COLLECTION,
  // MISSING_ZODIAC_SIGNS intentionally omitted — replaced by CELESTIAL_SAGA
  ...BIRTHDAY_CELEBRATION,
  ...HOLIDAY_COLLECTION,
  ...INCLUSIVE_SPECIAL_CATEGORIES,
];

export { VAULT_EXPANSION_PHASE_1 } from './newly_created_prompts';

export const ALL_PROMPTS = [...ORIGINAL_PROMPTS, ...LAUNCH_PROMPTS, ...VAULT_EXPANSION_PHASE_1];
