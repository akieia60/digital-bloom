import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { getCanonicalVideoUrl, getPosterUrl } from '../lib/media';

/**
 * /brie — public, no-auth distribution page for Brianna.
 *
 * Built 2026-05-26 per Ak's directive: Bri needs to self-serve flyers +
 * products as downloadable MP4s for her social-media uploads. Bouncing
 * watermark + Digital Bloom branding already baked into every asset by
 * the upstream pipelines.
 *
 * Tap-to-download via Supabase ?download=name.mp4 trick — mobile Safari
 * saves directly to Camera Roll. No auth, no token, no friction.
 *
 * Curation source for flyers = hardcoded list below (Ak swaps via PR).
 * Curation source for products = `products` table where is_active=true
 * (browsable, dynamic — new products auto-appear).
 */

// ── Hardcoded flyer manifest. Update this list when Ak says swap X. ──
// URLs are the v6 batch (QR top-right per Gamble feedback 2026-05-26).
const SUPA_FLYERS = 'https://yhdbeblowolfinxxhsnt.supabase.co/storage/v1/object/public/monique-videos/flyers';

// Placeholder — gets overwritten by the v6 upload script's manifest at build time.
// Until then, falls back to v5 URLs which are still live.
const FATHERS_DAY_FLYERS = [
  { slot: 'fd-1-ladies-its-time',     label: "Ladies, It's Time" },
  { slot: 'fd-2-change-narrative',    label: 'Change the Narrative' },
  { slot: 'fd-3-real-fathers',        label: 'Real Fathers' },
  { slot: 'fd-4-manly-day',           label: 'A Manly Day' },
  { slot: 'fd-5-dollar-to-show-love', label: 'One Dollar to Show Love' },
  { slot: 'fd-6-most-underrated',     label: 'The Most Underrated Holiday' },
];

const EVERGREEN_FLYERS = [
  { slot: 'ev-birthday-classic',    label: 'Happy Birthday' },
  { slot: 'ev-birthday-queen',      label: 'Birthday Queen' },
  { slot: 'ev-birthday-bestie',     label: 'For Your Bestie' },
  { slot: 'ev-birthday-brother',    label: 'For Your Brother' },
  { slot: 'ev-birthday-king',       label: 'For the King' },
  { slot: 'ev-birthday-dad',        label: 'Happy Birthday Dad' },
  { slot: 'ev-birthday-grandma',    label: 'For Grandma' },
  { slot: 'ev-birthday-auntie',     label: 'Auntie Energy' },
  { slot: 'ev-birthday-cosmic',     label: 'Born to Shine (Cosmic)' },
  { slot: 'ev-thinking-of-you',     label: 'Thinking of You' },
  { slot: 'ev-just-because',        label: 'Just Because' },
  { slot: 'ev-encouragement',       label: 'Keep Going' },
  { slot: 'ev-acknowledge-goat',    label: 'Goat Status' },
  { slot: 'ev-acknowledge-deserve', label: 'You Deserve This' },
];

// v6 manifest gets injected here once published. For now we resolve at runtime
// by listing the latest matching file in the bucket via the public listing API.
// Simpler v1: hard-link to the v6 upload URLs once we know them.
const V6_BASE = `${SUPA_FLYERS}/v6-qr-topright`;

function flyerUrl({ slot, label }) {
  const name = `${slot}.mp4`;
  return {
    src: `${V6_BASE}/${name}`,
    download: `${V6_BASE}/${name}?download=${encodeURIComponent(`${label}.mp4`)}`,
    label,
  };
}

export default function Brie() {
  const [tab, setTab] = useState('fathers');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab !== 'products' || products.length) return;
    setLoading(true);
    supabase
      .from('products')
      .select('id, name, category, subcategory, video_url, video_file_url, image_url')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[Brie] product load', error);
        setProducts(data || []);
        setLoading(false);
      });
  }, [tab, products.length]);

  const grouped = useMemo(() => {
    const byCat = {};
    for (const p of products) {
      const k = p.category || 'other';
      if (!byCat[k]) byCat[k] = [];
      byCat[k].push(p);
    }
    return Object.entries(byCat).sort((a, b) => b[1].length - a[1].length);
  }, [products]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f2ede4', fontFamily: 'Georgia, serif' }}>
      <header style={{ padding: '24px 16px 12px', textAlign: 'center', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '14px', letterSpacing: '2px' }}>DIGITAL BLOOM</div>
        <h1 style={{ margin: '6px 0', fontSize: '22px', fontWeight: 400 }}>For Brianna</h1>
        <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Tap any video to save it to your phone.</p>
      </header>

      <nav style={{ display: 'flex', gap: 0, borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 10 }}>
        {[
          { id: 'fathers',   label: `Father's Day · ${FATHERS_DAY_FLYERS.length}` },
          { id: 'evergreen', label: `Evergreen · ${EVERGREEN_FLYERS.length}` },
          { id: 'products',  label: `Products · ${products.length || '…'}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '14px 8px', background: 'transparent',
              color: tab === t.id ? '#D4AF37' : '#888',
              border: 'none', borderBottom: tab === t.id ? '2px solid #D4AF37' : '2px solid transparent',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: '16px', maxWidth: '900px', margin: '0 auto' }}>
        {tab === 'fathers' && <FlyerGrid items={FATHERS_DAY_FLYERS} />}
        {tab === 'evergreen' && <FlyerGrid items={EVERGREEN_FLYERS} />}
        {tab === 'products' && (
          loading ? <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading…</p>
                  : <ProductGrid grouped={grouped} />
        )}
      </main>

      <footer style={{ padding: '24px 16px', textAlign: 'center', color: '#555', fontSize: '12px', borderTop: '1px solid #2a2a2a', marginTop: '40px' }}>
        digitalbloom.store · Updated {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}

function FlyerGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
      {items.map((it) => {
        const f = flyerUrl(it);
        return (
          <div key={it.slot} style={{ background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
            <video src={f.src} muted playsInline preload="metadata" style={{ width: '100%', display: 'block', background: '#000' }} controls />
            <div style={{ padding: '8px' }}>
              <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '6px', lineHeight: 1.3 }}>{it.label}</div>
              <a href={f.download} download
                 style={{ display: 'block', background: '#D4AF37', color: '#000', textAlign: 'center', padding: '8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '12px' }}>
                ↓ Save to Phone
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductGrid({ grouped }) {
  return (
    <div>
      {grouped.map(([cat, items]) => (
        <section key={cat} style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#D4AF37', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            {cat.replace(/-/g, ' ')} · {items.length}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {items.map((p) => {
              const v = getCanonicalVideoUrl(p);
              const poster = getPosterUrl(v, p.image_url);
              const fileName = `${p.name || 'bloom'}.mp4`.replace(/[^a-zA-Z0-9._-]/g, '-');
              const downloadUrl = v ? `${v}${v.includes('?') ? '&' : '?'}download=${encodeURIComponent(fileName)}` : null;
              return (
                <div key={p.id} style={{ background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                  {v && (
                    <video src={v} poster={poster} muted playsInline preload="metadata" controls
                           style={{ width: '100%', display: 'block', background: '#000' }} />
                  )}
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '4px', lineHeight: 1.2 }}>{p.name}</div>
                    {downloadUrl && (
                      <a href={downloadUrl} download
                         style={{ display: 'block', background: '#D4AF37', color: '#000', textAlign: 'center', padding: '6px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '11px' }}>
                        ↓ Save
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
