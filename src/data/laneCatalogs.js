/**
 * Lane catalogs per category — edited 2026-05-07 PM after David caught
 * "For Grandma" appearing as a Coming Soon row on Father's Day.
 *
 * Each entry is the editorial taxonomy for one category page. CategoryPage
 * looks up the catalog by slug — if there's no catalog, it falls back to
 * the flat-list grid (so newly created categories don't inherit the wrong
 * relationships).
 *
 * Order is editorial: closest recipients first, sender-side rows mixed in
 * where they read naturally, "In Memory" last.
 */

export const LANE_CATALOGS = {
  'mothers-day': [
    { slug: 'for-mom',               label: 'For Mom',          tagline: 'The classic — for the woman who raised you.' },
    { slug: 'for-grandma',           label: 'For Grandma',      tagline: 'Matriarch, heirloom, the garden she planted.' },
    { slug: 'new-mom',               label: 'For New Mom',      tagline: "First Mother's Day — quiet awe, new motherhood." },
    { slug: 'mother-of-my-children', label: 'For Wife',         tagline: 'From a husband — the mother of your children.' },
    { slug: 'stepmom',               label: 'For Stepmom',      tagline: 'The woman who chose to show up.' },
    { slug: 'godmother-auntie',      label: 'For Auntie',       tagline: 'Auntie, godmother, the second mom in the family.' },
    { slug: 'single-mom',            label: 'For Single Mom',   tagline: 'For the mom who did it on her own.' },
    { slug: 'friend-honoring',       label: 'For Friend',       tagline: 'For your friend — celebrate her motherhood.' },
    { slug: 'from-son',              label: 'From a Son',       tagline: "Masculine tribute — son's perspective on Mom." },
    { slug: 'long-distance',         label: 'Long Distance',    tagline: 'When miles are between you and her.' },
    { slug: 'memorial',              label: 'In Memory',        tagline: 'For the mother whose love still blooms.' },
  ],

  'fathers-day': [
    { slug: 'for-dad',           label: 'For Dad',           tagline: 'The classic — for the man who raised you.' },
    { slug: 'for-grandpa',       label: 'For Grandpa',       tagline: 'Patriarch, legacy, the wisdom passed down.' },
    { slug: 'for-stepdad',       label: 'For Stepdad',       tagline: "Bonus Dad — the man who chose to show up." },
    { slug: 'father-in-law',     label: 'For Father-in-Law', tagline: 'The dad you inherited.' },
    { slug: 'from-son',          label: 'From a Son',        tagline: "Father-and-son — proud-son perspective." },
    { slug: 'from-daughter',     label: 'From a Daughter',   tagline: "Daddy's girl, all grown up." },
    { slug: 'memorial',          label: 'In Memory',         tagline: 'For the father whose strength still echoes.' },
  ],

  // Birthday / Anniversary / etc. — no lane catalogs yet. CategoryPage falls
  // back to its flat grid for these until Monique starts tagging products
  // and we lock in editorial copy here.
};

export function getLaneCatalog(categorySlug) {
  return LANE_CATALOGS[categorySlug] || null;
}
