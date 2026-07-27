// Mother's Day 2026 promo — flat $1 every bloom through May 10.
// Auto-expires after 2026-05-10 23:59:59 buyer-local time.
// Per Gamble (2026-05-02 21:03) and Ak greenlight (2026-05-03 — Mother's
// Day week only). After 5/10 the original tier prices restore automatically.

export const MOTHERS_DAY_PROMO_END = new Date('2026-05-11T05:00:00Z'); // 12:01 AM CDT 5/11
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
