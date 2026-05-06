import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * /c/:slug — content-creator portal.
 *
 * Built 2026-05-06 evening for Ak's first creator partnership (Breana).
 * Each creator gets their own page that lists every video Ak has pushed
 * to them, organized by bucket (commercials, flyers, blooms by category).
 * Each tile has Preview + Download. Tiles can be tapped to play inline.
 *
 * Row source: creator_video_assignments table, filtered by creator_slug.
 * Storage:    Vercel Blob (public read URLs).
 */

const BUCKET_ORDER = [
  ['master-zip',     '⬇ Download Everything', 'One zip file with every video'],
  ['commercials',    'Hero Commercials',      'Long-form ads with full storyline'],
  ['flyers',         'Daily Flyers',          'Daily-post format with FLOWERS CLIP music'],
  ['mothers-day',    'Mother\'s Day',         'For her — every kind of mother'],
  ['fathers-day',    'Father\'s Day',         'Strong roots, tall flowers'],
  ['birthday',       'Birthday',              'Their day — make it unforgettable'],
  ['graduation',     'Graduation',            'For the diploma earned the long way home'],
  ['love',           'Love & Romance',        'For the one who has their heart'],
  ['anniversary',    'Anniversary',           'Every year you chose each other'],
];

export default function CreatorPortal() {
  const { slug } = useParams();
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [{ data: c, error: cErr }, { data: v, error: vErr }] = await Promise.all([
          supabase.from('creators').select('*').eq('slug', slug).maybeSingle(),
          supabase
            .from('creator_video_assignments')
            .select('*')
            .eq('creator_slug', slug)
            .eq('is_active', true)
            .order('assigned_at', { ascending: false }),
        ]);
        if (cancelled) return;
        if (cErr) throw cErr;
        if (vErr) throw vErr;
        if (!c) throw new Error('not_found');
        setCreator(c);
        setVideos(v || []);
      } catch (err) {
        if (cancelled) return;
        setError(String(err.message || err));
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const grouped = useMemo(() => {
    const map = {};
    for (const v of videos) {
      const b = v.bucket || 'misc';
      if (!map[b]) map[b] = [];
      map[b].push(v);
    }
    return map;
  }, [videos]);

  // Bucket order with anything not in the canonical list pushed to the end.
  const orderedBuckets = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const [key, label, sub] of BUCKET_ORDER) {
      if (grouped[key]?.length) {
        out.push({ key, label, sub, items: grouped[key] });
        seen.add(key);
      }
    }
    for (const k of Object.keys(grouped)) {
      if (!seen.has(k)) {
        out.push({
          key: k,
          label: k.charAt(0).toUpperCase() + k.slice(1).replace(/-/g, ' '),
          sub: '',
          items: grouped[k],
        });
      }
    }
    return out;
  }, [grouped]);

  const trackedUrl = `https://digitalbloom.store/go/${slug}`;

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '80px 0' }}>
            Loading your videos…
          </p>
        </div>
      </div>
    );
  }

  if (error === 'not_found' || !creator) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={{ color: '#FFFFFF', fontSize: '28px', textAlign: 'center', marginBottom: '12px' }}>
            Portal not found
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
            This creator portal doesn't exist yet. Check the link, or ask Akieia.
          </p>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/" style={ctaStyle}>← Digital Bloom Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <p style={eyebrowStyle}>DIGITAL BLOOM × CREATORS</p>
          <h1 style={titleStyle}>Hi {creator.display_name} 💐</h1>
          <p style={subtitleStyle}>
            Every video below carries your tracked QR code:{' '}
            <a href={trackedUrl} style={{ color: '#D4AF37' }} target="_blank" rel="noreferrer">
              {trackedUrl.replace('https://', '')}
            </a>
            <br />
            <span style={{ fontSize: '13px', opacity: 0.65 }}>
              Tap any tile to preview. Tap Download to save the file. Then post it
              to your viral page — every viewer who scans your QR is attributed to you.
            </span>
          </p>
        </header>

        {orderedBuckets.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              No videos assigned yet. Akieia will push some shortly.
            </p>
          </div>
        ) : (
          orderedBuckets.map((b) => (
            <section key={b.key} style={sectionStyle}>
              <h2 style={sectionTitleStyle}>{b.label}</h2>
              {b.sub && <p style={sectionSubStyle}>{b.sub}</p>}
              <div style={gridStyle}>
                {b.items.map((v) => (
                  <VideoTile key={v.id} v={v} />
                ))}
              </div>
            </section>
          ))
        )}

        <footer style={footerStyle}>
          <p>Need help? Text Akieia. Tap the digital bloom dot store link
            in the U R L bar at the top to visit the storefront.</p>
        </footer>
      </div>
    </div>
  );
}

function VideoTile({ v }) {
  const isZip = v.bucket === 'master-zip';
  return (
    <div style={tileStyle}>
      {isZip ? (
        <div style={zipTileInner}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>📦</span>
          <p style={{ color: '#FFFFFF', fontSize: '15px', marginBottom: '14px', textAlign: 'center' }}>
            {v.title}
          </p>
          <a
            href={v.video_url}
            download
            style={{ ...downloadBtnStyle, background: '#D4AF37', color: '#0D1B36' }}
          >
            Download Zip
          </a>
        </div>
      ) : (
        <>
          <video
            src={v.video_url}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            style={videoStyle}
          />
          <div style={tileFooterStyle}>
            <p style={tileTitleStyle}>{v.title}</p>
            <a
              href={v.video_url}
              download
              style={downloadBtnStyle}
            >
              Download
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const pageStyle = {
  minHeight: '100vh',
  background: '#0D1B36',
  color: '#FFFFFF',
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 32px)',
};
const containerStyle = { maxWidth: '900px', margin: '0 auto', padding: '32px 18px 48px' };
const headerStyle = { textAlign: 'center', marginBottom: '40px' };
const eyebrowStyle = { fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '14px' };
const titleStyle = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '34px', fontWeight: 600, marginBottom: '14px' };
const subtitleStyle = { fontSize: '15px', lineHeight: 1.65, color: 'rgba(255,255,255,0.78)' };
const sectionStyle = { marginBottom: '40px' };
const sectionTitleStyle = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 600, marginBottom: '6px', borderTop: '1px solid rgba(212,175,55,0.25)', paddingTop: '18px' };
const sectionSubStyle = { fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' };
const tileStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', overflow: 'hidden' };
const videoStyle = { width: '100%', display: 'block', aspectRatio: '9/16', background: '#000', objectFit: 'cover', minHeight: '280px' };
const tileFooterStyle = { padding: '12px 14px 14px' };
const tileTitleStyle = { fontSize: '14px', fontWeight: 500, marginBottom: '10px', minHeight: '40px', lineHeight: 1.35 };
const downloadBtnStyle = {
  display: 'block', textAlign: 'center', padding: '10px 14px', borderRadius: '999px',
  background: 'rgba(212,175,55,0.15)', color: '#D4AF37', textDecoration: 'none',
  border: '1px solid rgba(212,175,55,0.4)', fontSize: '12px', fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase',
};
const zipTileInner = { padding: '28px 18px', textAlign: 'center', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const emptyStyle = { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px' };
const footerStyle = { marginTop: '48px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 };
const ctaStyle = { display: 'inline-block', padding: '12px 28px', borderRadius: '999px', background: '#D4AF37', color: '#0D1B36', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.1em', fontSize: '14px' };
