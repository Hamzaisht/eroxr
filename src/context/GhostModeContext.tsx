import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, LiveAlert } from "@/components/admin/platform/surveillance/types";
import { useGhostAlerts } from "@/hooks/useGhostAlerts";
import { useGhostSurveillance } from "@/hooks/useGhostSurveillance";
import { GhostModeIndicator } from "@/components/admin/platform/ghost/GhostModeIndicator";
import { SurveillanceIndicator } from "@/components/admin/platform/ghost/SurveillanceIndicator";

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  isLoading: boolean;
  activeSurveillance: {
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
}

const GHOST_MODE_KEY = 'eroxr_ghost_mode_active';

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
  refreshAlerts: async () => {}
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  // Try to get the initial ghost mode state from localStorage
  const storedGhostMode = typeof window !== 'undefined' ? 
    localStorage.getItem(GHOST_MODE_KEY) === 'true' : false;
    
  const [isGhostMode, setIsGhostMode] = useState(storedGhostMode);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Persist ghost mode state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GHOST_MODE_KEY, isGhostMode.toString());
    }
  }, [isGhostMode]);

  // Log ghost mode status for debugging
  useEffect(() => {
    if (session?.user?.email === "hamzaishtiaq242@gmail.com") {
      console.log("Ghost mode state updated:", isGhostMode);
      console.log("Is admin:", isSuperAdmin);
      console.log("Active surveillance:", activeSurveillance);
    }
  }, [isGhostMode, isSuperAdmin, activeSurveillance, session?.user?.email]);

  const toggleGhostMode = async () => {
    if (!isSuperAdmin) return;
    
    setIsLoading(true);
    
    try {
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
          details: {
            timestamp: new Date().toISOString(),
            user_email: session.user.email,
          }
        });
      }
      
      if (isGhostMode && activeSurveillance.isWatching) {
        await stopSurveillance();
      }
      
      setIsGhostMode(!isGhostMode);
      
      toast({
        title: isGhostMode ? "Ghost Mode Deactivated" : "Ghost Mode Activated",
        description: isGhostMode 
          ? "Your actions are now visible to users" 
          : "You are now browsing invisibly",
      });
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
    } finally {
      setIsLoading(false);
    }
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
      refreshAlerts
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
