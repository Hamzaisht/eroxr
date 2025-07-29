
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    console.log('🚪 AuthProvider: Signing out');
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthProvider: Signout error:', error);
        setError(error.message);
      } else {
        console.log('✅ AuthProvider: Signout successful');
      }
    } catch (err: any) {
      console.error('💥 AuthProvider: Signout error:', err);
      setError(err.message);
    }
  }, []);

  // 30-minute inactivity timeout (30 * 60 * 1000 = 1800000 milliseconds)
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

  useInactivityTimeout({
    timeout: INACTIVITY_TIMEOUT,
    onTimeout: () => {
      console.log('⏰ AuthProvider: User inactive for 30 minutes, signing out');
      signOut();
    },
    enabled: !!session && !!user // Only enable timeout when user is logged in
  });

  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing optimized auth system');
    
    let isMounted = true;
    let hasInitialized = false;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log('🔄 AuthProvider: Auth state change:', {
          event,
          hasSession: !!newSession,
          hasUser: !!newSession?.user
        });
        
        // Only process changes after initial setup to prevent loops
        if (hasInitialized) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setError(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      
      console.log('🔄 AuthProvider: Initial session result:', {
        hasSession: !!initialSession,
        hasUser: !!initialSession?.user,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ AuthProvider: Error getting initial session:', error);
        setError(error.message);
      } else {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      }
      
      setLoading(false);
      hasInitialized = true;
    });

    return () => {
      console.log('🧹 AuthProvider: Cleaning up auth listener');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    console.log('📝 AuthProvider: Attempting signup for:', email);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('📝 AuthProvider: Signup result:', !!data, !!error);
      
      if (error) {
        setError(error.message);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('💥 AuthProvider: Signup error:', err);
      setError(err.message);
      return { error: err };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔑 AuthProvider: Attempting signin for:', email);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔑 AuthProvider: Signin result:', !!data, !!error);
      
      if (error) {
        setError(error.message);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('💥 AuthProvider: Signin error:', err);
      setError(err.message);
      return { error: err };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError
  }), [user, session, loading, error, signUp, signIn, signOut, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
