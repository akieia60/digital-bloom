import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Founder email allowlist.
 * Only these emails can access the Founder Command Dashboard.
 * Add additional founder emails here as needed.
 */
const FOUNDER_EMAILS = [
  'akieia60@gmail.com',
];

/**
 * Custom hook for founder authentication.
 * - Checks Supabase auth session (supports both OAuth and email/password)
 * - Validates email against founder allowlist
 * - Provides login/logout helpers
 * - Returns loading, authenticated, and authorization states
 */
export function useFounderAuth() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isFounder, setIsFounder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(currentSession);
        const currentUser = currentSession?.user || null;
        setUser(currentUser);

        if (currentUser?.email) {
          setIsFounder(FOUNDER_EMAILS.includes(currentUser.email.toLowerCase()));
        } else {
          setIsFounder(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes (handles both OAuth and password-based login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const newUser = newSession?.user || null;
      setUser(newUser);

      if (newUser?.email) {
        setIsFounder(FOUNDER_EMAILS.includes(newUser.email.toLowerCase()));
      } else {
        setIsFounder(false);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    return currentSession?.access_token || null;
  }, []);

  return {
    loading,
    session,
    user,
    isFounder,
    error,
    signIn,
    signOut,
    getAccessToken,
  };
}

export default useFounderAuth;
