// "All blooms $1 until further notice" — Gamble 2026-05-13 07:45 AM.
// Originally a Mother's Day 2026 promo (2026-05-02 → 2026-05-11). Gamble
// extended it after Mother's Day to keep momentum while we build Father's
// Day catalog and stabilize the rest of the funnel. Variable + flag names
// keep the MOTHERS_DAY_PROMO prefix so imports across the codebase don't
// churn — what matters is the date constant below.
// To roll back: set this date to a past timestamp (e.g. yesterday) and
// the original tier prices ($1.99 / $2.99 / $3.99) restore automatically.

export const MOTHERS_DAY_PROMO_END = new Date('2027-12-31T23:59:59Z'); // indefinite per Gamble 2026-05-13
export const PROMO_PRICE_DOLLARS = 1.00;
export const PROMO_PRICE_CENTS = 100;

export const isMothersDayPromoActive = (now = new Date()) => now < MOTHERS_DAY_PROMO_END;

// Apply the promo override to a single Supabase product row.
export const applyPromoToProduct = (product) => {
  if (!product || !isMothersDayPromoActive()) return product;
  return {
    ...product,
    price: PROMO_PRICE_DOLLARS,
    price_cents: PROMO_PRICE_CENTS,
    original_price: product.price,
  };
};

export const applyPromoToProducts = (rows) =>
  Array.isArray(rows) ? rows.map(applyPromoToProduct) : rows;
