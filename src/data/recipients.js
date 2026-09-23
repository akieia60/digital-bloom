/**
 * Digital Bloom — Canonical Recipient Taxonomy
 * ────────────────────────────────────────────
 * Ak's list, 2026-09-23. These are the people a bloom gets sent TO.
 *
 * Categories answer "what is the occasion." Recipients answer "who is it
 * for." A recipient row is reusable: "For Dad" means something on Thank
 * You, on Birthday, and at Christmas, and it should read the same way in
 * all three places.
 *
 * Order is Ak's order. She listed closest family first, then the circle
 * widens outward to the people who show up for you professionally and in
 * the community. Do not alphabetize it — the order is editorial.
 *
 * Consumed by:
 *   • src/data/laneCatalogs.js  → category lane catalogs
 *   • src/pages/CategoryPage.jsx (indirectly, via getLaneCatalog)
 *
 * HOW TO USE ON A NEW CATEGORY:
 *   import { RECIPIENTS } from './recipients';
 *   'christmas': RECIPIENTS,
 */

export const RECIPIENTS = [
  { slug: 'for-dad',        label: 'For Dad',        tagline: 'For the man who showed up, every time, without being asked.' },
  { slug: 'for-mom',        label: 'For Mom',        tagline: 'For the woman who carried it all and never handed you the weight.' },
  { slug: 'for-sister',     label: 'For Sister',     tagline: 'Day one. The one who knew you before you knew yourself.' },
  { slug: 'for-brother',    label: 'For Brother',    tagline: 'For the brother who built you up while building himself.' },
  { slug: 'for-coworkers',  label: 'For Co-Workers', tagline: 'For the people who carried the load beside you all year.' },
  { slug: 'friends',        label: 'For Friends',    tagline: 'For the friend who never once asked for credit.' },
  { slug: 'for-girlfriend', label: 'For Girlfriend', tagline: 'For her — the one you keep choosing.' },
  { slug: 'for-boyfriend',  label: 'For Boyfriend',  tagline: 'For him — steady, yours, worth saying it out loud.' },
  { slug: 'for-husband',    label: 'For Husband',    tagline: 'For the man who stayed through all of it.' },
  { slug: 'for-wife',       label: 'For Wife',       tagline: 'For the woman who made a life with you out of nothing but nerve.' },
  { slug: 'for-fiance',     label: 'For Fiancé',     tagline: 'Almost. The yes that started everything.' },
  { slug: 'business-partners', label: 'For Business Partner', tagline: 'For the one sharing the table and the risk.' },
  { slug: 'teachers',       label: 'For Teacher',    tagline: 'For the one who shaped the kid you love.' },
  { slug: 'for-cousin',     label: 'For Cousin',     tagline: 'First friend, forever family — the cousin who feels like a sibling.' },
  { slug: 'for-aunt',       label: 'For Aunt',       tagline: 'Auntie energy — the second mother every family needs.' },
  { slug: 'for-uncle',      label: 'For Uncle',      tagline: 'For the uncle who taught you the things nobody else would.' },
  { slug: 'for-grandma',    label: 'For Grandma',    tagline: 'Matriarch. The garden everyone in this family grew from.' },
  { slug: 'for-granddad',   label: 'For Granddad',   tagline: 'Patriarch. The roots under everything that came after.' },
  { slug: 'for-boss',       label: 'For Boss',       tagline: 'For the one who believed in you before the results did.' },
  { slug: 'for-coach',      label: 'For Coaches',    tagline: 'For the voice still in your head on the hard days.' },
  { slug: 'for-police',     label: 'For Police',     tagline: 'For the ones who answer the call on the worst day of somebody else’s life.' },
  { slug: 'for-firefighter',label: 'For Fireman',    tagline: 'For the ones who run toward it while everyone else runs out.' },
  { slug: 'employees',      label: 'For Employee',   tagline: 'For the ones who built it alongside you.' },
  { slug: 'for-mechanic',   label: 'For Mechanic',   tagline: 'For the hands that keep you on the road.' },
  { slug: 'for-teammates',  label: 'For Teammates',  tagline: 'For the ones in it with you — win or lose, same bench.' },
];

/**
 * Thank-You-only rows. These are professional and institutional
 * relationships that read as gratitude but are not general-purpose
 * recipients — you do not send a "For a Lawyer" birthday bloom. Kept
 * from the 2026-05-07 editorial pass; they sit after Ak's list.
 */
export const THANK_YOU_PROFESSIONAL = [
  { slug: 'doctors',              label: 'For a Doctor',             tagline: 'For the hands that held you up.' },
  { slug: 'pastors',              label: 'For a Pastor',             tagline: 'For the shepherd of your soul.' },
  { slug: 'lawyers',              label: 'For a Lawyer',             tagline: 'For counsel that watched your back.' },
  { slug: 'contractors',          label: 'For a Contractor',         tagline: 'For the craftsman behind the work.' },
  { slug: 'investors',            label: 'For an Investor',          tagline: 'For the believer who funded the vision.' },
  { slug: 'nonprofit-supporters', label: 'For a Nonprofit Supporter', tagline: 'For the giver who powers your mission.' },
];

export const RECIPIENT_SLUGS = RECIPIENTS.map((r) => r.slug);

export const RECIPIENT_BY_SLUG = Object.fromEntries(
  [...RECIPIENTS, ...THANK_YOU_PROFESSIONAL].map((r) => [r.slug, r]),
);
