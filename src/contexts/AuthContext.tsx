
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing auth system');
    
    let isMounted = true;
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        console.log('🔄 AuthProvider: Getting initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
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
        
        // Set loading to false after initial session check
        setLoading(false);
        
      } catch (err: any) {
        console.error('💥 AuthProvider: Error getting initial session:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log('🔄 AuthProvider: Auth state change:', {
          event,
          hasSession: !!newSession,
          hasUser: !!newSession?.user
        });
        
        try {
          if (event === 'SIGNED_IN' && newSession) {
            console.log('✅ AuthProvider: User signed in, checking/creating profile');
            
            // Check if profile exists, create if it doesn't
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('❌ AuthProvider: Error checking profile:', profileError);
            } else if (!profile) {
              console.log('📝 AuthProvider: Creating new profile');
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: newSession.user.id,
                  username: newSession.user.email?.split('@')[0] || 'user',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              
              if (insertError) {
                console.error('❌ AuthProvider: Error creating profile:', insertError);
                setError('Failed to create user profile');
              } else {
                console.log('✅ AuthProvider: Profile created successfully');
              }
            }
          }
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setError(null);
          
          // Only set loading to false if we haven't already done so
          if (loading) {
            setLoading(false);
          }
          
        } catch (err: any) {
          console.error('💥 AuthProvider: Error in auth state change:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    );

    // Get initial session
    getInitialSession();

    return () => {
      console.log('🧹 AuthProvider: Cleaning up auth listener');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
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
      
      console.log('📝 AuthProvider: Signup result:', data, error);
      
      if (error) {
        setError(error.message);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('💥 AuthProvider: Signup error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 AuthProvider: Attempting signin for:', email);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔑 AuthProvider: Signin result:', data, error);
      
      if (error) {
        setError(error.message);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('💥 AuthProvider: Signin error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const signOut = async () => {
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
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError
  };

  console.log('🔄 AuthProvider: Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    error: error || 'none'
  });

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
