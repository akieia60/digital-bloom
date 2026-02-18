import { useState } from 'react';

/**
 * FounderLogin — Auth gate for the Founder Command Dashboard.
 * Shows a login form styled to match Digital Bloom's obsidian/gold theme.
 * Mobile-optimized for iPhone 16 Pro Max.
 */
const FounderLogin = ({ onLogin, error: externalError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const displayError = externalError || localError;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 mb-4">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-semibold gradient-text mb-1">
            Founder Access
          </h1>
          <p className="text-sm text-white/40">
            Digital Bloom Command Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
          {displayError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {displayError}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all text-base"
              placeholder="founder@digitalbloom.art"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-medium text-sm uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#050510] hover:shadow-lg hover:shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-[11px] text-white/30 mt-4">
            Restricted to authorized founder accounts only.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FounderLogin;
