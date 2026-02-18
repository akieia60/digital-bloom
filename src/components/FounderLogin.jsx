import { useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * FounderLogin — Auth gate for the Founder Command Dashboard.
 * Shows a login form styled to match Digital Bloom's obsidian/gold theme.
 * Mobile-optimized for iPhone 16 Pro Max.
 * Primary login: Email Magic Link (passwordless)
 */
const FounderLogin = ({ onLogin, error: externalError }) => {
  const [email, setEmail] = useState('akieia60@gmail.com');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/founder`,
        },
      });

      if (error) throw error;
      
      setMagicLinkSent(true);
    } catch (err) {
      setLocalError(err.message || 'Failed to send magic link');
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

        {/* Login Options */}
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-5">
          {displayError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {displayError}
            </div>
          )}

          {magicLinkSent ? (
            // Success state - magic link sent
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 mb-2">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-white">Check your email!</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                We sent a login link to <span className="text-[#D4AF37] font-medium">{email}</span>
              </p>
              <p className="text-xs text-white/40">
                Tap the link in your inbox to sign in. The link expires in 1 hour.
              </p>
              <button
                onClick={() => {
                  setMagicLinkSent(false);
                  setEmail('akieia60@gmail.com');
                }}
                className="mt-4 text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                ← Send another link
              </button>
            </div>
          ) : (
            // Email input form
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all text-base"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-sm uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#050510] hover:shadow-lg hover:shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Magic Link
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/40 leading-relaxed pt-2">
                No password needed. We'll email you a secure login link.
              </p>
            </form>
          )}

          <p className="text-center text-[11px] text-white/30 mt-4">
            Restricted to authorized founder accounts only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderLogin;
