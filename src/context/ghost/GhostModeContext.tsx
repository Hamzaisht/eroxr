
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { toggleGhostModeState, syncGhostModeState } from "./ghostModeUtils";
import { useGhostAlerts } from "./hooks/useGhostAlerts";
import { LiveSession } from "@/types/surveillance";

export interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  liveAlerts: any[];
  refreshAlerts: () => Promise<boolean>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
}

export const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: async () => {},
  canUseGhostMode: false,
  isLoading: false,
  liveAlerts: [],
  refreshAlerts: async () => false,
  startSurveillance: async () => false,
  stopSurveillance: async () => false,
  activeSurveillance: {
    isWatching: false,
    session: null,
    startTime: null,
  },
});

interface GhostModeProviderProps {
  children: ReactNode;
}

export const GhostModeProvider: React.FC<GhostModeProviderProps> = ({ children }) => {
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSurveillance, setActiveSurveillance] = useState({
    isWatching: false,
    session: null as LiveSession | null,
    startTime: null as string | null,
  });
  
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { liveAlerts, refreshAlerts } = useGhostAlerts(isGhostMode);

  const canUseGhostMode = !!isSuperAdmin;

  useEffect(() => {
    if (session?.user?.id && isSuperAdmin) {
      syncGhostModeState(session.user.id, isSuperAdmin, setIsGhostMode, setIsLoading);
    } else {
      setIsGhostMode(false);
      setIsLoading(false);
    }
  }, [session?.user?.id, isSuperAdmin]);

  const toggleGhostMode = async () => {
    if (!session || !canUseGhostMode) return;
    
    await toggleGhostModeState(
      session, 
      !!isSuperAdmin, 
      isGhostMode, 
      setIsGhostMode, 
      setIsLoading,
      stopSurveillance,
      activeSurveillance
    );
  };

  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    if (!isGhostMode || !canUseGhostMode) {
      console.error("Cannot start surveillance: Ghost mode is not active");
      return false;
    }
    
    try {
      // Log the surveillance action
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_surveillance_start',
          details: {
            timestamp: new Date().toISOString(),
            session_id: session.id,
            session_type: session.type,
            target_user_id: session.user_id,
            target_username: session.username || 'Unknown'
          }
        });
      }
      
      setActiveSurveillance({
        isWatching: true,
        session,
        startTime: new Date().toISOString(),
      });
      
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    }
  };
  
  const stopSurveillance = async (): Promise<boolean> => {
    if (!activeSurveillance.isWatching) return true;
    
    try {
      const currentSession = activeSurveillance.session;
      
      // Log the end of surveillance
      if (session?.user?.id && currentSession) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_surveillance_end',
          details: {
            timestamp: new Date().toISOString(),
            session_id: currentSession.id,
            session_type: currentSession.type,
            duration_seconds: activeSurveillance.startTime 
              ? Math.floor((new Date().getTime() - new Date(activeSurveillance.startTime).getTime()) / 1000)
              : 0,
            target_user_id: currentSession.user_id,
            target_username: currentSession.username || 'Unknown'
          }
        });
      }
      
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null,
      });
      
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    }
  };

  return (
    <GhostModeContext.Provider 
      value={{ 
        isGhostMode, 
        toggleGhostMode, 
        canUseGhostMode, 
        isLoading,
        liveAlerts,
        refreshAlerts: async () => {
          try {
            await refreshAlerts();
            return true;
          } catch (error) {
            console.error("Error refreshing alerts:", error);
            return false;
          }
        },
        startSurveillance,
        stopSurveillance,
        activeSurveillance,
      }}
    >
      {children}
    </GhostModeContext.Provider>
  );
};

// Export the hook directly from this file
export const useGhostMode = (): GhostModeContextType => {
  const context = useContext(GhostModeContext);
  
  if (!context) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  
  return context;
};
