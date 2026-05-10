import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const COLORS = {
  bg: '#050510',
  navy: '#0D1B36',
  gold: '#D4AF37',
  white: '#F5F5F7',
  muted: 'rgba(245, 245, 247, 0.55)',
  cardBorder: 'rgba(212, 175, 55, 0.22)',
  cardBg: 'rgba(212, 175, 55, 0.04)',
  pillBg: 'rgba(13, 27, 54, 0.6)',
};

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned', color: 'rgba(245,245,247,0.55)' },
  { value: 'in-production', label: 'In Production', color: '#F4C9D7' },
  { value: 'scheduled', label: 'Scheduled', color: '#9DD3F4' },
  { value: 'live', label: 'Live', color: '#9DE39B' },
  { value: 'done', label: 'Done', color: COLORS.gold },
];

const OWNER_OPTIONS = ['Brie', 'Gamble', 'Ak', 'Magic', 'Brie + Magic'];

function statusColor(status) {
  return STATUS_OPTIONS.find((o) => o.value === status)?.color || COLORS.muted;
}

function statusLabel(status) {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label || status;
}

export default function TeamCalendar() {
  const [searchParams] = useSearchParams();
  const teamKey = searchParams.get('key') || '';
  const editMode = teamKey.length > 0;
  const editorName = searchParams.get('as') || '';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [filter, setFilter] = useState('all');

  async function loadEvents() {
    try {
      setError('');
      const res = await fetch('/api/cal', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
    const poll = setInterval(loadEvents, 30000);
    return () => clearInterval(poll);
  }, []);

  // Set the iOS "Add to Home Screen" icon + display title to a Digital Bloom
  // calendar tile so it's identifiable on the home screen, separate from
  // the main storefront icon.
  useEffect(() => {
    const head = document.head;
    const previousTitle = document.title;
    document.title = 'Digital Bloom · Team Calendar';

    const tags = [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/cal-icon-180.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/cal-icon-192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/cal-icon-512.png' },
    ];
    const linkEls = tags.map((t) => {
      const el = document.createElement('link');
      Object.entries(t).forEach(([k, v]) => el.setAttribute(k, v));
      el.dataset.calOwned = 'true';
      head.appendChild(el);
      return el;
    });

    const metas = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Bloom Cal' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'theme-color', content: '#0D1B36' },
    ];
    const metaEls = metas.map(({ name, content }) => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute('content', content);
      el.dataset.calOwned = 'true';
      head.appendChild(el);
      return el;
    });

    return () => {
      document.title = previousTitle;
      [...linkEls, ...metaEls].forEach((el) => {
        try { head.removeChild(el); } catch {}
      });
    };
  }, []);

  async function patchEvent(id, updates) {
    if (!editMode) return;
    setSavingId(id);
    setEvents((current) =>
      current.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    try {
      const res = await fetch('/api/cal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Team-Cal-Key': teamKey },
        body: JSON.stringify({ id, updates, by: editorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setEvents((current) =>
        current.map((e) => (e.id === id ? data.event : e))
      );
    } catch (err) {
      setError(err.message);
      loadEvents();
    } finally {
      setSavingId(null);
    }
  }

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    if (filter === 'mine' && editorName) {
      return events.filter((e) => (e.owner || '').toLowerCase().includes(editorName.toLowerCase()));
    }
    return events.filter((e) => e.status === filter);
  }, [events, filter, editorName]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px)',
        fontFamily: "'Outfit', sans-serif",
        color: COLORS.white,
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              marginBottom: '8px',
            }}
          >
            🌸 Digital Bloom — Team Calendar
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4.5vw, 2.2rem)',
              fontWeight: 600,
              marginBottom: '6px',
              lineHeight: 1.2,
            }}
          >
            2026 Content Calendar
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: COLORS.muted,
              fontWeight: 300,
            }}
          >
            {editMode
              ? editorName
                ? `Editing as ${editorName} · changes save instantly`
                : 'Edit mode · changes save instantly'
              : 'View only — get the team link from Ak to edit'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            marginBottom: '20px',
            paddingBottom: '4px',
          }}
        >
          {[
            { id: 'all', label: 'All' },
            ...(editMode && editorName ? [{ id: 'mine', label: 'Mine' }] : []),
            ...STATUS_OPTIONS.map((s) => ({ id: s.value, label: s.label })),
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              style={{
                padding: '8px 14px',
                background: filter === chip.id ? COLORS.gold : 'transparent',
                color: filter === chip.id ? COLORS.navy : COLORS.muted,
                border: `1px solid ${filter === chip.id ? COLORS.gold : 'rgba(245,245,247,0.15)'}`,
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(245, 100, 100, 0.12)',
              border: '1px solid rgba(245, 100, 100, 0.3)',
              borderRadius: '12px',
              color: '#FFC1C1',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {loading && events.length === 0 ? (
          <p style={{ textAlign: 'center', color: COLORS.muted, padding: '40px 0' }}>
            Loading calendar…
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {filteredEvents.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                editMode={editMode}
                saving={savingId === e.id}
                onUpdate={(updates) => patchEvent(e.id, updates)}
              />
            ))}
            {filteredEvents.length === 0 && (
              <p style={{ textAlign: 'center', color: COLORS.muted, padding: '32px 0' }}>
                Nothing matches that filter.
              </p>
            )}
          </div>
        )}

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              border: `1.5px solid rgba(212, 175, 55, 0.4)`,
              borderRadius: '999px',
              color: COLORS.gold,
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ← Back to Digital Bloom
          </Link>
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            border: `1px dashed ${COLORS.cardBorder}`,
            borderRadius: '12px',
            color: COLORS.muted,
            fontSize: '0.75rem',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          🌸 Add this page to your iPhone home screen — Safari → Share → Add to Home Screen.
          <br />
          Opens in one tap, looks like an app, no install.
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, editMode, saving, onUpdate }) {
  const [expandedField, setExpandedField] = useState(null);

  const cardStyle = {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: '18px',
    padding: '18px',
    opacity: saving ? 0.7 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <article style={cardStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '6px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              marginBottom: '2px',
            }}
          >
            {event.event_date}
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.15rem',
              fontWeight: 600,
              color: COLORS.white,
              lineHeight: 1.2,
            }}
          >
            {event.event_name}
          </h2>
        </div>

        {editMode ? (
          <select
            value={event.status}
            onChange={(ev) => onUpdate({ status: ev.target.value })}
            style={{
              background: COLORS.pillBg,
              color: statusColor(event.status),
              border: `1px solid ${statusColor(event.status)}`,
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        ) : (
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              border: `1px solid ${statusColor(event.status)}`,
              color: statusColor(event.status),
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {statusLabel(event.status)}
          </span>
        )}
      </div>

      <Field
        label="Content idea"
        value={event.content_idea}
        editMode={editMode}
        expanded={expandedField === 'content_idea'}
        onToggle={() => setExpandedField((x) => (x === 'content_idea' ? null : 'content_idea'))}
        onSave={(v) => onUpdate({ content_idea: v })}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
        <PillField
          label="Prep start"
          value={event.prep_start_date}
          editMode={editMode}
          inputType="date"
          onSave={(v) => onUpdate({ prep_start_date: v || null })}
        />
        <PillField
          label="Owner"
          value={event.owner}
          editMode={editMode}
          options={OWNER_OPTIONS}
          onSave={(v) => onUpdate({ owner: v })}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <PillField
          label="Platforms"
          value={event.platform_focus}
          editMode={editMode}
          onSave={(v) => onUpdate({ platform_focus: v })}
        />
      </div>

      <Field
        label="Notes"
        value={event.notes}
        editMode={editMode}
        expanded={expandedField === 'notes'}
        onToggle={() => setExpandedField((x) => (x === 'notes' ? null : 'notes'))}
        onSave={(v) => onUpdate({ notes: v })}
      />

      {event.updated_by && (
        <p
          style={{
            fontSize: '0.65rem',
            color: 'rgba(245,245,247,0.3)',
            marginTop: '12px',
            fontStyle: 'italic',
          }}
        >
          last edit by {event.updated_by}
        </p>
      )}
    </article>
  );
}

function Field({ label, value, editMode, expanded, onToggle, onSave }) {
  const [draft, setDraft] = useState(value || '');

  useEffect(() => {
    setDraft(value || '');
  }, [value]);

  if (!editMode || !expanded) {
    return (
      <div
        onClick={editMode ? onToggle : undefined}
        style={{
          marginTop: '10px',
          cursor: editMode ? 'pointer' : 'default',
        }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: COLORS.muted,
            marginBottom: '3px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: '0.92rem',
            color: COLORS.white,
            lineHeight: 1.4,
          }}
        >
          {value || (editMode ? <span style={{ color: COLORS.muted }}>tap to add…</span> : '—')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <p
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      <textarea
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== (value || '')) onSave(draft);
          onToggle();
        }}
        rows={3}
        style={{
          width: '100%',
          padding: '10px',
          background: COLORS.pillBg,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: '10px',
          color: COLORS.white,
          fontSize: '0.92rem',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    </div>
  );
}

function PillField({ label, value, editMode, inputType, options, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');

  useEffect(() => {
    setDraft(value || '');
  }, [value]);

  if (!editMode || !editing) {
    return (
      <div
        onClick={editMode ? () => setEditing(true) : undefined}
        style={{ cursor: editMode ? 'pointer' : 'default' }}
      >
        <p
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: COLORS.muted,
            marginBottom: '3px',
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: '0.85rem', color: COLORS.white }}>
          {value || (editMode ? <span style={{ color: COLORS.muted }}>tap…</span> : '—')}
        </p>
      </div>
    );
  }

  function commit() {
    if (draft !== (value || '')) onSave(draft);
    setEditing(false);
  }

  if (options) {
    return (
      <div>
        <p
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            marginBottom: '3px',
          }}
        >
          {label}
        </p>
        <select
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: COLORS.pillBg,
            border: `1px solid ${COLORS.gold}`,
            borderRadius: '8px',
            color: COLORS.white,
            fontSize: '0.85rem',
          }}
        >
          {!options.includes(draft) && draft && <option value={draft}>{draft}</option>}
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <p
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          marginBottom: '3px',
        }}
      >
        {label}
      </p>
      <input
        autoFocus
        type={inputType || 'text'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
        }}
        style={{
          width: '100%',
          padding: '6px 8px',
          background: COLORS.pillBg,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: '8px',
          color: COLORS.white,
          fontSize: '0.85rem',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
