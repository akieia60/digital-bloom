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
    { slug: 'to-my-wife',            label: 'To My Wife',       tagline: "From the husband she's raising the kingdom with." },
    { slug: 'for-grandma',           label: 'For Grandma',      tagline: 'Matriarch, heirloom, the garden she planted.' },
    { slug: 'new-mom',               label: 'For New Mom',      tagline: "First Mother's Day — quiet awe, new motherhood." },
    { slug: 'mother-of-my-children', label: 'For the Mother of My Children', tagline: 'Parenthood-framed wife tribute — partnership and family.' },
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

  birthday: [
    { slug: 'for-her',            label: 'For Her',           tagline: 'Queens, sisters, daughters, friends — make the day hers.' },
    { slug: 'for-him',            label: 'For Him',           tagline: 'Kings, brothers, sons, friends — give him his crown.' },
    { slug: 'for-mom',            label: 'For Mom',           tagline: 'The woman who started it all — now her day.' },
    { slug: 'for-dad',            label: 'For Dad',           tagline: 'For Pops, Daddy, the man who made you who you are.' },
    { slug: 'for-grandma',        label: 'For Grandma',       tagline: 'Wisdom, warmth, and a lifetime of cake.' },
    { slug: 'for-sister',         label: 'For Sister',        tagline: 'Day-one, ride-or-die, sister bloom.' },
    { slug: 'for-brother',        label: 'For Brother',       tagline: 'For the brother who built you up alongside him.' },
    { slug: 'for-bestie',         label: 'For Bestie',        tagline: "Your person — the one who gets the inside jokes." },
    { slug: 'for-niece-nephew',   label: 'For Niece/Nephew',  tagline: 'For the sweet ones — Sweet Sixteen, Little Man, the next generation.' },
    { slug: 'for-partner',        label: 'For Partner',       tagline: "Wife, husband, the one you're choosing every birthday." },
    { slug: 'for-auntie',         label: 'For Auntie',        tagline: 'Auntie energy — fabulous and full of glow.' },
    { slug: 'for-twins',          label: 'For Twins',         tagline: 'Womb mates, twin flames — the day you both share.' },
    { slug: 'milestone',          label: 'Milestones',        tagline: 'Sweet Sixteen, 21, 30, 40, 50 — the years that earn their own scene.' },
    { slug: 'classic',            label: 'Classic Birthday',  tagline: 'Cards, roses, balloons — the bloom that fits anyone.' },
  ],

  anniversary: [
    { slug: 'for-spouse',         label: 'For Spouse',        tagline: 'Still choosing each other — the love you keep building.' },
    { slug: 'milestone',          label: 'Milestones',        tagline: 'Five, ten, twenty-five, golden — the years that earned a celebration.' },
    { slug: 'vault',              label: 'Vault Edition',     tagline: 'The premium anniversary blooms — heirloom-grade.' },
  ],

  graduation: [
    { slug: 'class-of-2026',      label: 'Class of 2026',     tagline: 'For the cap-tossing, future-ready Class of 2026.' },
    { slug: 'for-her',            label: 'For Her',           tagline: "Quiet dignity, hard-earned — she did it." },
    { slug: 'for-firstgen',       label: 'First in the Line', tagline: 'Generational pride — the first to make it through.' },
    { slug: 'classic',            label: 'Classic Graduation', tagline: 'The long nights, the comeback semesters — the diploma in hand.' },
  ],

  zodiac: [
    { slug: 'fire-signs',         label: 'Fire Signs',        tagline: 'Aries, Leo, Sagittarius — born to lead, roar, and aim higher.' },
    { slug: 'earth-signs',        label: 'Earth Signs',       tagline: 'Taurus, Virgo, Capricorn — built to bloom, quietly sacred, on stone.' },
    { slug: 'air-signs',          label: 'Air Signs',         tagline: 'Gemini, Libra, Aquarius — two sides, perfect balance, different by design.' },
    { slug: 'water-signs',        label: 'Water Signs',       tagline: 'Cancer, Scorpio, Pisces — soft heart, truth underneath, deeper than the sea.' },
  ],

  // Acknowledgement / Love / Valentine / Luxury / Sports / Women's Day /
  // Signature-Stories — no lane catalogs yet. CategoryPage falls back to
  // its flat grid for these. Add when there's editorial copy + enough
  // products to fill the lanes.
};

export function getLaneCatalog(categorySlug) {
  return LANE_CATALOGS[categorySlug] || null;
}
