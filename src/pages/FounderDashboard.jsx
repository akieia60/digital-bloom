import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFounderAuth } from '../hooks/useFounderAuth';
import FounderLogin from '../components/FounderLogin';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_VAULT = 'db_founder_vault_checklist';
const STORAGE_KEY_RISK = 'db_founder_risk_dashboard';
const STORAGE_KEY_TESTS = 'db_founder_test_results';

const VAULT_ITEMS = [
  { id: 'supabase_service_rotated', label: 'Supabase service role rotated' },
  { id: 'supabase_anon_rotated', label: 'Supabase anon key rotated' },
  { id: 'stripe_secret_rotated', label: 'Stripe secret key rotated' },
  { id: 'stripe_webhook_rotated', label: 'Stripe webhook secret rotated' },
  { id: 'secrets_in_vault', label: 'All secrets saved in password vault' },
  { id: 'secrets_in_vercel', label: 'All secrets saved in Vercel env vars' },
  { id: 'redeployed', label: 'Redeployed after rotation' },
];

const ENV_VARS = [
  { name: 'SUPABASE_URL', sensitive: false },
  { name: 'SUPABASE_ANON_KEY', sensitive: true },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', sensitive: true },
  { name: 'STRIPE_SECRET_KEY', sensitive: true },
  { name: 'STRIPE_WEBHOOK_SECRET', sensitive: true },
  { name: 'APP_BASE_URL', sensitive: false },
  { name: 'VITE_SUPABASE_URL', sensitive: false },
  { name: 'VITE_SUPABASE_ANON_KEY', sensitive: true },
];

const MONEY_FLOW_TESTS = [
  {
    id: 'create_credit_checkout',
    label: 'Create Credit Checkout',
    method: 'POST',
    endpoint: '/api/create-credit-checkout',
    body: { amount_cents: 1000, purchaser_email: 'founder-test@digitalbloom.app' },
  },
  {
    id: 'create_checkout_session',
    label: 'Create Checkout Session',
    method: 'POST',
    endpoint: '/api/create-checkout-session',
    body: {
      cartItems: [
        {
          product: { id: 'test', title: 'Test Product', name: 'Test', description: 'Test', price: 1.00, image_url: '' },
          quantity: 1,
        },
      ],
      successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: window.location.origin + '/shop',
    },
  },
  {
    id: 'credits_validate',
    label: 'Validate Credit Code',
    method: 'POST',
    endpoint: '/api/credits/validate',
    body: { code: '' },
    hasInput: true,
    inputPlaceholder: 'Enter credit code...',
  },
  {
    id: 'credits_reserve',
    label: 'Reserve Credits',
    method: 'POST',
    endpoint: '/api/credits/reserve',
    body: { code: '', order_total_cents: 100 },
    hasInput: true,
    inputPlaceholder: 'Enter credit code...',
  },
];

const RISK_CATEGORIES = [
  { id: 'secrets_exposure', label: 'Secrets Exposure', icon: '🔐' },
  { id: 'stripe_integrity', label: 'Stripe Integrity', icon: '💳' },
  { id: 'supabase_rls', label: 'Supabase RLS Safety', icon: '🛡️' },
  { id: 'production_stability', label: 'Production Stability', icon: '🚀' },
  { id: 'customer_data', label: 'Customer Data Safety', icon: '👤' },
];

const RAG_OPTIONS = [
  { value: 'green', label: 'Green', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  { value: 'amber', label: 'Amber', color: 'bg-amber-500', textColor: 'text-amber-400' },
  { value: 'red', label: 'Red', color: 'bg-red-500', textColor: 'text-red-400' },
];

const QUICK_LINKS = [
  { label: 'Vercel Project', url: 'https://vercel.com/akieia60s-projects/digital-bloom', icon: '▲' },
  { label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com', icon: '💳' },
  { label: 'Supabase Project', url: 'https://supabase.com/dashboard', icon: '⚡' },
  { label: 'GitHub Repo', url: 'https://github.com/akieia60/digital-bloom', icon: '🐙' },
  { label: 'Prompt Vault', url: '/vault', icon: '🗃️', internal: true },
  { label: 'Incident Log', url: '#', icon: '📋', optional: true },
];

// ─── Helper: localStorage persistence ─────────────────────────────────────────

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <h2 className="text-base sm:text-lg font-display font-semibold text-white/90">{title}</h2>
        </div>
        <svg
          className={`w-5 h-5 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function StatusBadge({ present }) {
  return present ? (
    <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
      <span>✅</span> Present
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium">
      <span>❌</span> Missing
    </span>
  );
}

function RAGBadge({ status }) {
  const option = RAG_OPTIONS.find((o) => o.value === status) || RAG_OPTIONS[2];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${option.textColor} bg-white/5`}>
      <span className={`w-2 h-2 rounded-full ${option.color}`} />
      {option.label}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const FounderDashboard = () => {
  const { loading, user, isFounder, error, signIn, signOut, getAccessToken } = useFounderAuth();

  // ── Vault Seal State ──
  const [vaultChecks, setVaultChecks] = useState(() =>
    loadFromStorage(STORAGE_KEY_VAULT, {})
  );

  // ── Env Readiness State ──
  const [envStatus, setEnvStatus] = useState(null);
  const [envLoading, setEnvLoading] = useState(false);
  const [envError, setEnvError] = useState(null);

  // ── Money Flow Test State ──
  const [testResults, setTestResults] = useState(() =>
    loadFromStorage(STORAGE_KEY_TESTS, {})
  );
  const [testInputs, setTestInputs] = useState({});
  const [testRunning, setTestRunning] = useState({});

  // ── Risk Dashboard State ──
  const [riskData, setRiskData] = useState(() =>
    loadFromStorage(STORAGE_KEY_RISK, RISK_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = { status: 'amber', notes: '', fixed: false };
      return acc;
    }, {}))
  );

  // ── Persist vault checks ──
  useEffect(() => {
    saveToStorage(STORAGE_KEY_VAULT, vaultChecks);
  }, [vaultChecks]);

  // ── Persist risk data ──
  useEffect(() => {
    saveToStorage(STORAGE_KEY_RISK, riskData);
  }, [riskData]);

  // ── Persist test results ──
  useEffect(() => {
    saveToStorage(STORAGE_KEY_TESTS, testResults);
  }, [testResults]);

  // ── Fetch env status on mount ──
  const fetchEnvStatus = useCallback(async () => {
    setEnvLoading(true);
    setEnvError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No auth token available');

      const res = await fetch('/api/env-check', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setEnvStatus(data.env);
    } catch (err) {
      setEnvError(err.message);
    } finally {
      setEnvLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (isFounder) {
      fetchEnvStatus();
    }
  }, [isFounder, fetchEnvStatus]);

  // ── Vault toggle ──
  const toggleVault = (id) => {
    setVaultChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Run money flow test ──
  const runTest = async (test) => {
    setTestRunning((prev) => ({ ...prev, [test.id]: true }));
    const startTime = Date.now();

    try {
      const body = { ...test.body };
      // Inject user input for tests that require it
      if (test.hasInput && testInputs[test.id]) {
        if (body.code !== undefined) body.code = testInputs[test.id];
      }

      const token = await getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(test.endpoint, {
        method: test.method,
        headers,
        body: test.method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      const data = await res.json().catch(() => null);
      const elapsed = Date.now() - startTime;

      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          pass: res.ok,
          status: res.status,
          message: data?.error || (res.ok ? 'OK' : 'Failed'),
          timestamp: new Date().toISOString(),
          elapsed,
        },
      }));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          pass: false,
          status: 0,
          message: err.message,
          timestamp: new Date().toISOString(),
          elapsed: Date.now() - startTime,
        },
      }));
    } finally {
      setTestRunning((prev) => ({ ...prev, [test.id]: false }));
    }
  };

  // ── Risk update helpers ──
  const updateRisk = (id, field, value) => {
    setRiskData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#D4AF37]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-white/40 text-sm">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return <FounderLogin onLogin={signIn} error={error} />;
  }

  // ── Not a founder ──
  if (!isFounder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-white/40 text-sm mb-6">
            Your account ({user.email}) is not authorized to access the Founder Dashboard.
          </p>
          <button
            onClick={signOut}
            className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Vault completion percentage ──
  const vaultComplete = VAULT_ITEMS.filter((item) => vaultChecks[item.id]).length;
  const vaultTotal = VAULT_ITEMS.length;
  const vaultPct = Math.round((vaultComplete / vaultTotal) * 100);

  // ── Render Dashboard ──
  return (
    <div className="min-h-screen pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/40 hover:text-white/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-sm sm:text-base font-display font-semibold gradient-text uppercase tracking-wider">
              Command Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30 hidden sm:inline">{user.email}</span>
            <button
              onClick={signOut}
              className="text-[11px] uppercase tracking-wider text-white/40 hover:text-red-400 transition-colors px-2 py-1"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-3xl mx-auto px-4 pt-6">

        {/* ━━━ 1) Vault Seal Status ━━━ */}
        <SectionCard title="Vault Seal Status" icon="🔒">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">Completion</span>
              <span className="text-xs font-medium text-[#D4AF37]">{vaultPct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] rounded-full transition-all duration-500"
                style={{ width: `${vaultPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {VAULT_ITEMS.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={!!vaultChecks[item.id]}
                    onChange={() => toggleVault(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-md border border-white/20 peer-checked:bg-[#D4AF37] peer-checked:border-[#D4AF37] transition-all flex items-center justify-center">
                    {vaultChecks[item.id] && (
                      <svg className="w-3 h-3 text-[#050510]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`text-sm transition-colors ${vaultChecks[item.id] ? 'text-white/50 line-through' : 'text-white/80'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* ━━━ 2) Environment Readiness ━━━ */}
        <SectionCard title="Environment Readiness" icon="⚙️">
          {envLoading ? (
            <div className="flex items-center gap-2 py-4 text-white/40 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking environment...
            </div>
          ) : envError ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                <p className="font-medium mb-1">Could not reach /api/env-check</p>
                <p className="text-xs text-amber-300/70">{envError}</p>
                <p className="text-xs text-amber-300/50 mt-2">
                  This is expected in local dev. The endpoint works on Vercel.
                </p>
              </div>
              {/* Show static list as fallback */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2 px-2 text-xs uppercase tracking-wider text-white/30 font-medium">Variable</th>
                      <th className="text-right py-2 px-2 text-xs uppercase tracking-wider text-white/30 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENV_VARS.map((v) => (
                      <tr key={v.name} className="border-b border-white/[0.03]">
                        <td className="py-2.5 px-2 text-white/70 font-mono text-xs break-all">
                          {v.name}
                          {v.sensitive && (
                            <span className="ml-1.5 text-[10px] text-amber-400/60">(status only)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="text-white/30 text-xs">Deploy to check</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={fetchEnvStatus}
                className="text-xs text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
              >
                Retry check
              </button>
            </div>
          ) : envStatus ? (
            <div className="space-y-3">
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2 px-2 text-xs uppercase tracking-wider text-white/30 font-medium">Variable</th>
                      <th className="text-right py-2 px-2 text-xs uppercase tracking-wider text-white/30 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(envStatus).map(([name, info]) => (
                      <tr key={name} className="border-b border-white/[0.03]">
                        <td className="py-2.5 px-2 text-white/70 font-mono text-xs break-all">
                          {info.label || name}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <StatusBadge present={info.present} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={fetchEnvStatus}
                className="text-xs text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : null}
        </SectionCard>

        {/* ━━━ 3) Money Flow Quick Tests ━━━ */}
        <SectionCard title="Money Flow Quick Tests" icon="💰" defaultOpen={false}>
          <p className="text-xs text-white/30 mb-4">
            These tests call your live API endpoints. Use test-mode Stripe keys for safety.
          </p>
          <div className="space-y-3">
            {MONEY_FLOW_TESTS.map((test) => {
              const result = testResults[test.id];
              const running = testRunning[test.id];

              return (
                <div key={test.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white/80 font-medium">{test.label}</span>
                      <div className="text-[11px] text-white/30 font-mono mt-0.5">
                        {test.method} {test.endpoint}
                      </div>
                    </div>
                    <button
                      onClick={() => runTest(test)}
                      disabled={running}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all disabled:opacity-50"
                    >
                      {running ? 'Running...' : 'Run'}
                    </button>
                  </div>

                  {/* Optional input field */}
                  {test.hasInput && (
                    <input
                      type="text"
                      value={testInputs[test.id] || ''}
                      onChange={(e) => setTestInputs((prev) => ({ ...prev, [test.id]: e.target.value }))}
                      placeholder={test.inputPlaceholder}
                      className="w-full mb-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 font-mono"
                    />
                  )}

                  {/* Result */}
                  {result && (
                    <div className={`flex items-center gap-2 text-xs mt-1 ${result.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span>{result.pass ? '✅' : '❌'}</span>
                      <span>HTTP {result.status} — {result.message}</span>
                      <span className="text-white/20 ml-auto">{result.elapsed}ms</span>
                    </div>
                  )}
                  {result?.timestamp && (
                    <div className="text-[10px] text-white/20 mt-1">
                      Last run: {new Date(result.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ━━━ 4) Risk Dashboard ━━━ */}
        <SectionCard title="Risk Dashboard" icon="🎯" defaultOpen={false}>
          <div className="space-y-3">
            {RISK_CATEGORIES.map((cat) => {
              const data = riskData[cat.id] || { status: 'amber', notes: '', fixed: false };

              return (
                <div key={cat.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="text-sm text-white/80 font-medium">{cat.label}</span>
                    </div>
                    <RAGBadge status={data.status} />
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2 mb-2">
                    {RAG_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateRisk(cat.id, 'status', opt.value)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          data.status === opt.value
                            ? `${opt.color} text-white`
                            : 'bg-white/5 text-white/30 hover:text-white/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Notes */}
                  <textarea
                    value={data.notes}
                    onChange={(e) => updateRisk(cat.id, 'notes', e.target.value)}
                    placeholder="Add notes..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 resize-none"
                  />

                  {/* Mark fixed */}
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!data.fixed}
                      onChange={(e) => updateRisk(cat.id, 'fixed', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border border-white/20 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center flex-shrink-0">
                      {data.fixed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-white/50">Mark as fixed</span>
                  </label>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ━━━ 5) Links Hub ━━━ */}
        <SectionCard title="Links Hub" icon="🔗">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_LINKS.map((link) => (
              link.internal ? (
                <Link
                  key={link.label}
                  to={link.url}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="text-lg">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group ${
                    link.optional ? 'opacity-50' : ''
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    {link.optional && (
                      <span className="block text-[10px] text-white/30">Not configured yet</span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )
            ))}
          </div>
        </SectionCard>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-[10px] text-white/20 uppercase tracking-wider">
            Digital Bloom — Founder Command Dashboard
          </p>
          <p className="text-[10px] text-white/15 mt-1">
            No secrets are displayed or stored on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;
