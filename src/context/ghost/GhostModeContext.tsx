
import { createContext, useContext, useState, ReactNode } from "react";
import { LiveAlert } from "@/types/alerts";
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export interface GhostModeContextType {
  isGhostMode: boolean
  setIsGhostMode: (value: boolean) => void
  toggleGhostMode: () => Promise<void>
  canUseGhostMode: boolean
  isLoading: boolean
  activeSurveillance: {
    session?: LiveSession
    isWatching: boolean
    startTime?: string
  }
  startSurveillance: (session: LiveSession) => Promise<boolean>
  stopSurveillance: () => Promise<boolean>
  liveAlerts: LiveAlert[]
  refreshAlerts: () => Promise<void>
  syncGhostModeFromSupabase: () => Promise<void>
}

export const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export function useGhostModeContext() {
  const context = useContext(GhostModeContext);
  if (!context) throw new Error("useGhostModeContext must be used within GhostModeProvider");
  return context;
}

export function GhostModeProvider({ children }: { children: ReactNode }) {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [activeSurveillance, setActiveSurveillance] = useState<{
    session?: LiveSession
    isWatching: boolean
    startTime?: string
  }>({ isWatching: false });

  // These are stubs that will be implemented in the actual context
  const toggleGhostMode = async (): Promise<void> => {
    setIsGhostMode(!isGhostMode);
  };

  const syncGhostModeFromSupabase = async (): Promise<void> => {
    // This is a stub
  };

  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    setActiveSurveillance({
      session,
      isWatching: true,
      startTime: new Date().toISOString()
    });
    return true;
  };

  const stopSurveillance = async (): Promise<boolean> => {
    setActiveSurveillance({ isWatching: false });
    return true;
  };

  const refreshAlerts = async (): Promise<void> => {
    // This is a stub
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
