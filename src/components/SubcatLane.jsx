import BloomLaneTile from './BloomLaneTile';

/**
 * One subcategory row inside CategoryPage. Header on the left,
 * horizontal-scrolling strip of bloom tiles on the right.
 *
 * Two modes:
 *   - populated: products array has items → render the row
 *   - comingSoon: products empty → render a placeholder strip
 *     so customers know the category exists and is coming.
 *
 * Sketch reference: Ak whiteboard 2026-05-07.
 */
export default function SubcatLane({ label, tagline, products = [], comingSoon = false, accent }) {
  const showSeeAll = products.length > 4;

  return (
    <section className="subcat-lane" aria-label={label}>
      <header className="subcat-lane__header">
        <div className="subcat-lane__title-row">
          <h2 className="subcat-lane__title">{label}</h2>
          {showSeeAll && (
            <span className="subcat-lane__count">{products.length}</span>
          )}
        </div>
        {tagline && <p className="subcat-lane__tagline">{tagline}</p>}
      </header>

      {comingSoon ? (
        <div className="subcat-lane__coming-soon">
          <div className="subcat-lane__coming-soon-tile">
            <span className="subcat-lane__coming-soon-eyebrow">Coming soon</span>
            <p className="subcat-lane__coming-soon-copy">
              {label} blooms are in production — watch this row.
            </p>
          </div>
        </div>
      ) : (
        <div className="subcat-lane__strip" role="list">
          {products.map((p) => (
            <div className="subcat-lane__strip-item" role="listitem" key={p.id}>
              <BloomLaneTile product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
