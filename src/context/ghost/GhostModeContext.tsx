
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LiveAlert } from "@/types/alerts";
import { LiveSession } from "@/types/surveillance";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useSession } from "@supabase/auth-helpers-react";
import { toggleGhostModeState, syncGhostModeState } from "./ghostModeUtils";
import { useGhostSurveillance, useGhostAlerts } from "./hooks";
import { GhostModeContextType } from "./types";

export const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export function useGhostModeContext() {
  const context = useContext(GhostModeContext);
  if (!context) throw new Error("useGhostModeContext must be used within GhostModeProvider");
  return context;
}

export function GhostModeProvider({ children }: { children: ReactNode }) {
  const { isSuperAdmin } = useSuperAdminCheck();
  const session = useSession();
  
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  
  // Initialize ghost alerts
  const { liveAlerts, refreshAlerts } = useGhostAlerts(isGhostMode);
  
  // Initialize ghost surveillance functionality
  const { activeSurveillance, startSurveillance, stopSurveillance } = useGhostSurveillance(isGhostMode, isSuperAdmin);

  // Sync ghost mode state with Supabase on component mount
  useEffect(() => {
    if (session?.user?.id) {
      console.log('Initial sync of ghost mode state on provider mount');
      syncGhostModeFromSupabase();
    }
  }, [session?.user?.id]);

  // Update canUseGhostMode based on isSuperAdmin
  useEffect(() => {
    setCanUseGhostMode(isSuperAdmin);
    
    // If user is not a super admin, ensure ghost mode is off
    if (!isSuperAdmin && isGhostMode) {
      console.log('User is not super admin, disabling ghost mode');
      setIsGhostMode(false);
    }
  }, [isSuperAdmin, isGhostMode]);

  // Toggle ghost mode
  const toggleGhostMode = async (): Promise<void> => {
    if (!session?.user?.id) {
      console.error('Cannot toggle ghost mode: No user session available');
      return;
    }
    
    if (!isSuperAdmin) {
      console.error('Cannot toggle ghost mode: User is not a super admin');
      return;
    }
    
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

  // Sync ghost mode state with Supabase
  const syncGhostModeFromSupabase = async (): Promise<void> => {
    if (!session?.user?.id) {
      console.error('Cannot sync ghost mode: No user session available');
      return;
    }
    
    await syncGhostModeState(
      session.user.id,
      isSuperAdmin,
      setIsGhostMode,
      setIsLoading
    );
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
      syncGhostModeFromSupabase
    }}>
      {children}
    </GhostModeContext.Provider>
  );
}
