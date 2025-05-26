
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { LiveSession, SessionType } from '@/types/surveillance';
import { LiveAlert } from '@/types/alerts';
import { supabase } from '@/integrations/supabase/client';
import { toggleGhostModeState, syncGhostModeState } from '@/context/ghost/ghostModeUtils';

interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
  syncGhostModeFromSupabase: () => Promise<void>;
  ghostedProfile: any | null;
  setGhostedProfile: (profile: any | null) => void;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export const GhostModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ghostedProfile, setGhostedProfile] = useState<any | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  
  const [activeSurveillance, setActiveSurveillance] = useState<{
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  }>({
    isWatching: false,
    session: null,
    startTime: null
  });
  
  useEffect(() => {
    const isAdmin = async () => {
      if (!session?.user) {
        setCanUseGhostMode(false);
        return;
      }
      
      const { data, error } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching admin status:", error);
        setCanUseGhostMode(false);
        return;
      }
      
      setCanUseGhostMode(!!data);
    };
    
    isAdmin();
  }, [session, supabaseClient]);
  
  const toggleGhostMode = async () => {
    if (!session) return;
    
    await toggleGhostModeState(
      session,
      canUseGhostMode,
      isGhostMode,
      setIsGhostMode,
      setIsLoading,
      stopSurveillance,
      activeSurveillance
    );
  };
  
  const syncGhostModeFromSupabase = async () => {
    if (!session?.user) return;
    
    await syncGhostModeState(
      session.user.id,
      canUseGhostMode,
      setIsGhostMode,
      setIsLoading
    );
  };
  
  useEffect(() => {
    if (session?.user) {
      syncGhostModeFromSupabase();
    }
  }, [session]);
  
  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    setIsLoading(true);
    try {
      setActiveSurveillance({
        isWatching: true,
        session: session,
        startTime: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopSurveillance = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null
      });
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshAlerts = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('alerts')
        .select('*')
        .limit(50);
      
      if (error) {
        console.error("Error fetching alerts:", error);
        setLiveAlerts([]);
        return false;
      } else {
        setLiveAlerts(data || []);
        return true;
      }
    } catch (error) {
      console.error("Error refreshing alerts:", error);
      setLiveAlerts([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostModeContext.Provider value={{
      isGhostMode,
      setIsGhostMode,
      toggleGhostMode,
      canUseGhostMode,
      isLoading,
      activeSurveillance,
      startSurveillance,
      stopSurveillance,
      liveAlerts,
      refreshAlerts,
      syncGhostModeFromSupabase,
      ghostedProfile,
      setGhostedProfile
    }}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    throw new Error('useGhostMode must be used within a GhostModeProvider');
  }
  return context;
};
