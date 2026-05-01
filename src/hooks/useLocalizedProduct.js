import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Returns the product with name and description swapped to the active locale
// when a translation exists in product.i18n[lang]. Falls back to the canonical
// English name/description when a key is missing — so a partially-backfilled
// product still renders cleanly.
export function useLocalizedProduct(product) {
  const { lang } = useLanguage();
  return useMemo(() => {
    if (!product) return product;
    const t = product.i18n && product.i18n[lang];
    if (!t) return product;
    return {
      ...product,
      name: t.name || product.name,
      description: t.description || product.description,
    };
  }, [product, lang]);
}
