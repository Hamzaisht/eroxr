
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
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
  setIsGhostMode: (state: boolean) => void;
  syncGhostModeFromSupabase: () => Promise<void>;
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
  refreshAlerts: async () => {},
  setIsGhostMode: () => {},
  syncGhostModeFromSupabase: async () => {}
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

  // Sync ghost mode state from Supabase
  const syncGhostModeFromSupabase = useCallback(async () => {
    if (!session?.user?.id || !isSuperAdmin) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('ghost_mode')
        .eq('admin_id', session.user.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error fetching ghost mode state:", error);
        }
        // No existing session found, we'll use the localStorage value
      } else if (data) {
        // Update state based on database value
        setIsGhostMode(data.ghost_mode);
        // Also update localStorage for consistency
        localStorage.setItem(GHOST_MODE_KEY, data.ghost_mode.toString());
        
        if (data.ghost_mode) {
          console.log("Ghost mode active state loaded from database");
        }
      }
    } catch (error) {
      console.error("Error syncing ghost mode from Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session, isSuperAdmin]);

  // Sync with Supabase on initial load
  useEffect(() => {
    if (session?.user?.id && isSuperAdmin) {
      syncGhostModeFromSupabase();
    }
  }, [session?.user?.id, isSuperAdmin, syncGhostModeFromSupabase]);

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
    if (!isSuperAdmin || !session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      const newGhostModeState = !isGhostMode;
      
      // Update database
      const { error } = await supabase
        .from('admin_sessions')
        .upsert({
          admin_id: session.user.id,
          ghost_mode: newGhostModeState,
          activated_at: newGhostModeState ? new Date() : null,
          last_active_at: new Date()
        }, {
          onConflict: 'admin_id' 
        });
        
      if (error) {
        console.error("Error updating ghost mode in database:", error);
        toast({
          title: "Error",
          description: "Failed to update ghost mode status",
          variant: "destructive"
        });
        return;
      }
      
      // Log action to admin_audit_logs
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
        details: {
          timestamp: new Date().toISOString(),
          user_email: session.user.email,
        }
      });
      
      if (isGhostMode && activeSurveillance.isWatching) {
        await stopSurveillance();
      }
      
      setIsGhostMode(newGhostModeState);
      
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
