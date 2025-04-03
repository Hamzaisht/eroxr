
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, LiveAlert } from "@/components/admin/platform/surveillance/types";
import { GhostModeIndicator } from "@/components/admin/platform/ghost/GhostModeIndicator";
import { SurveillanceIndicator } from "@/components/admin/platform/ghost/SurveillanceIndicator";
import { GhostModeContextType } from "./types";
import { syncGhostModeState, toggleGhostModeState } from "./ghostModeUtils";
import { useGhostAlerts, useGhostSurveillance } from "./hooks";

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: async () => {},
  isLoading: false,
  activeSurveillance: {
    isWatching: false
  },
  startSurveillance: async () => false,
  stopSurveillance: async () => false,
  liveAlerts: [],
  refreshAlerts: async () => {},
  setIsGhostMode: () => {},
  syncGhostModeFromSupabase: async () => {}
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const session = useSession();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { toast } = useToast();
  
  // Use our custom hooks
  const { liveAlerts, refreshAlerts } = useGhostAlerts(isGhostMode, isSuperAdmin);
  const { 
    activeSurveillance, 
    startSurveillance, 
    stopSurveillance 
  } = useGhostSurveillance(isGhostMode, isSuperAdmin);

  // Sync ghost mode state from Supabase
  const syncGhostModeFromSupabase = useCallback(async () => {
    if (!session?.user?.id || !isSuperAdmin) return;
    await syncGhostModeState(
      session.user.id,
      isSuperAdmin,
      setIsGhostMode,
      setIsLoading
    );
  }, [session, isSuperAdmin]);

  // Sync with Supabase on initial load
  useEffect(() => {
    if (session?.user?.id && isSuperAdmin) {
      syncGhostModeFromSupabase();
    }
  }, [session?.user?.id, isSuperAdmin, syncGhostModeFromSupabase]);

  // Log ghost mode status for debugging
  useEffect(() => {
    if (session?.user?.email === "hamzaishtiaq242@gmail.com") {
      console.log("Ghost mode state updated:", isGhostMode);
      console.log("Is admin:", isSuperAdmin);
      console.log("Active surveillance:", activeSurveillance);
    }
  }, [isGhostMode, isSuperAdmin, activeSurveillance, session?.user?.email]);

  const toggleGhostMode = async () => {
    await toggleGhostModeState(
      session,
      isSuperAdmin,
      isGhostMode,
      setIsGhostMode,
      setIsLoading,
      stopSurveillance,
      activeSurveillance
    );
  };

  return (
    <GhostModeContext.Provider value={{ 
      isGhostMode, 
      toggleGhostMode, 
      isLoading,
      activeSurveillance: activeSurveillance as {
        session?: LiveSession;
        isWatching: boolean;
        startTime?: string;
      },
      startSurveillance: startSurveillance as (session: LiveSession) => Promise<boolean>,
      stopSurveillance,
      liveAlerts: liveAlerts as LiveAlert[],
      refreshAlerts,
      setIsGhostMode,
      syncGhostModeFromSupabase
    }}>
      {children}
      
      <GhostModeIndicator isVisible={isSuperAdmin && isGhostMode} />
      <SurveillanceIndicator 
        isVisible={isSuperAdmin && isGhostMode && activeSurveillance.isWatching}
        session={activeSurveillance.session as LiveSession} 
      />
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);
