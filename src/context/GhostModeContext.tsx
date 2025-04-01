
import { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, LiveAlert } from "@/components/admin/platform/user-analytics/types";
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
  };
  startSurveillance: (session: LiveSession) => Promise<void>;
  stopSurveillance: () => Promise<void>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: async () => {},
  isLoading: false,
  activeSurveillance: {
    isWatching: false
  },
  startSurveillance: async () => {},
  stopSurveillance: async () => {},
  liveAlerts: [],
  refreshAlerts: async () => {}
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
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
      activeSurveillance,
      startSurveillance,
      stopSurveillance,
      liveAlerts,
      refreshAlerts
    }}>
      {children}
      
      <GhostModeIndicator isVisible={isSuperAdmin && isGhostMode} />
      <SurveillanceIndicator 
        isVisible={isSuperAdmin && isGhostMode && activeSurveillance.isWatching}
        session={activeSurveillance.session} 
      />
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);
