
import { useState, useEffect, useContext, createContext } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useSuperAdminCheck } from './useSuperAdminCheck';
import { useToast } from '@/hooks/use-toast';
import { useGhostAlerts } from '@/components/admin/platform/surveillance/hooks/useGhostAlerts';
import { useGhostSurveillance } from '@/components/admin/platform/surveillance/hooks/useGhostSurveillance';
import { LiveSession } from '@/types/surveillance';
import { LiveAlert } from '@/types/alerts';

interface ActiveSurveillanceState {
  isWatching: boolean;
  targetUserId?: string;
  startedAt?: string;
  session?: LiveSession | null;
  startTime?: string | null;
}

interface GhostModeContextType {
  isGhostMode: boolean;
  canUseGhostMode: boolean;
  isLoading: boolean;
  toggleGhostMode: () => Promise<void>;
  activeSurveillance: ActiveSurveillanceState;
  liveAlerts?: LiveAlert[];
  refreshAlerts?: () => Promise<void>;
  startSurveillance: (targetUserIdOrSession: string | LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  endSurveillance: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { toast } = useToast();
  
  // Initialize surveillance state
  const { activeSurveillance, startSurveillance: startGhostSurveillance, stopSurveillance } = 
    useGhostSurveillance(isGhostMode, isSuperAdmin);
  
  // Get alerts for ghost mode
  const { liveAlerts, refreshAlerts } = useGhostAlerts(isGhostMode);

  // Check if user is admin on mount and sync ghost mode state
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        setCanUseGhostMode(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // First check if this is a super admin
        if (isSuperAdmin) {
          setCanUseGhostMode(true);
          
          // Check if ghost mode was previously enabled
          const prevMode = localStorage.getItem('ghost_mode') === 'true';
          setIsGhostMode(prevMode);
          
          // Log ghost mode status check
          console.log(`Ghost mode check: ${prevMode ? 'Enabled' : 'Disabled'}`);
        } else {
          // Not a super admin, check specific ghost mode permissions
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error checking admin status:', error);
            setCanUseGhostMode(false);
            return;
          }
          
          // If admin settings were found, we can enable ghost mode
          if (data) {
            setCanUseGhostMode(true);
            // Never enable ghost mode by default, just allow it to be toggled
            const prevMode = localStorage.getItem('ghost_mode') === 'true';
            setIsGhostMode(prevMode);
          } else {
            setCanUseGhostMode(false);
          }
        }
      } catch (err) {
        console.error('Failed to check admin status:', err);
        setCanUseGhostMode(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [session?.user?.id, isSuperAdmin]);

  const toggleGhostMode = async () => {
    if (!canUseGhostMode) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to use Ghost Mode.",
        variant: "destructive"
      });
      return;
    }
    
    const newMode = !isGhostMode;
    setIsGhostMode(newMode);
    localStorage.setItem('ghost_mode', String(newMode));
    
    // If turning off ghost mode, also end any active surveillance
    if (!newMode && activeSurveillance.isWatching) {
      await endSurveillance();
    }
    
    // Log the ghost mode toggle
    if (session?.user?.id) {
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: newMode ? 'enable_ghost_mode' : 'disable_ghost_mode',
        details: {
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const startSurveillance = async (targetUserIdOrSession: string | LiveSession): Promise<boolean> => {
    if (!session?.user?.id || !isGhostMode) return false;
    
    try {
      // Handle both string ID and LiveSession object
      if (typeof targetUserIdOrSession === 'string') {
        // We have just a user ID, create simple surveillance
        const targetUserId = targetUserIdOrSession;
        
        // Log surveillance start for a user ID
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'start_surveillance',
          details: {
            target_user_id: targetUserId,
            timestamp: new Date().toISOString()
          }
        });
        
        toast({
          title: "Surveillance Started",
          description: `Now monitoring user activity`
        });
        
        return true;
      } else {
        // We have a live session object, use the surveillance handler
        return await startGhostSurveillance(targetUserIdOrSession);
      }
    } catch (error) {
      console.error('Error starting surveillance:', error);
      toast({
        title: "Error",
        description: "Failed to start surveillance",
        variant: "destructive"
      });
      return false;
    }
  };

  const endSurveillance = async () => {
    if (!session?.user?.id || !activeSurveillance.isWatching) return;
    
    try {
      // Stop the surveillance
      await stopSurveillance();
      
      // Log surveillance end
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'end_surveillance',
        details: {
          target_user_id: activeSurveillance.targetUserId,
          started_at: activeSurveillance.startedAt,
          ended_at: new Date().toISOString(),
          duration_ms: activeSurveillance.startedAt 
            ? new Date().getTime() - new Date(activeSurveillance.startedAt).getTime()
            : 0
        }
      });
    } catch (error) {
      console.error('Error ending surveillance:', error);
    }
  };

  return (
    <GhostModeContext.Provider value={{ 
      isGhostMode, 
      canUseGhostMode,
      isLoading,
      toggleGhostMode,
      activeSurveillance,
      liveAlerts,
      refreshAlerts,
      startSurveillance,
      stopSurveillance,
      endSurveillance
    }}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    return { 
      isGhostMode: false, 
      canUseGhostMode: false,
      isLoading: false,
      toggleGhostMode: async () => {},
      activeSurveillance: { isWatching: false },
      startSurveillance: async () => false,
      stopSurveillance: async () => false,
      endSurveillance: async () => {}
    };
  }
  return context;
};
