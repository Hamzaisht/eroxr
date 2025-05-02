
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActiveSurveillanceState, LiveAlert } from '@/utils/media/types';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from './use-toast';

interface GhostModeContextType {
  isGhostMode: boolean;
  hasGhostAccess: boolean;
  isLoading: boolean;
  canUseGhostMode: boolean;
  toggleGhostMode: () => void;
  activeSurveillance: ActiveSurveillanceState;
  startSurveillance: (targetUserId: string) => Promise<boolean>;
  stopSurveillance: () => Promise<void>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  hasGhostAccess: false,
  isLoading: false,
  canUseGhostMode: false,
  toggleGhostMode: () => {},
  activeSurveillance: {
    isActive: false,
    lastUpdated: null,
  },
  startSurveillance: async () => false,
  stopSurveillance: async () => {},
  liveAlerts: [],
  refreshAlerts: async () => {},
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGhostAccess, setHasGhostAccess] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<ActiveSurveillanceState>({
    isActive: false,
    lastUpdated: null,
  });
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const session = useSession();
  const { toast } = useToast();

  // Check if user has ghost mode access
  useEffect(() => {
    const checkGhostAccess = async () => {
      if (!session?.user?.id) {
        setHasGhostAccess(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking ghost access:', error);
          setHasGhostAccess(false);
          return;
        }

        setHasGhostAccess(!!data && !!data.can_use_ghost_mode);
      } catch (err) {
        console.error('Error in ghost access check:', err);
        setHasGhostAccess(false);
      }
    };

    checkGhostAccess();
  }, [session]);

  // Toggle ghost mode
  const toggleGhostMode = () => {
    if (!hasGhostAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to use Ghost Mode",
        variant: "destructive",
      });
      return;
    }

    setIsGhostMode((prev) => !prev);
    
    // Log this action
    if (session?.user) {
      supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: !isGhostMode ? 'ghost_mode_enabled' : 'ghost_mode_disabled',
        details: {
          timestamp: new Date().toISOString(),
          ip_address: 'client_ip' // The server will replace this
        }
      }).then(({ error }) => {
        if (error) console.error('Failed to log ghost mode toggle:', error);
      });
    }

    toast({
      title: !isGhostMode ? "Ghost Mode Enabled" : "Ghost Mode Disabled",
      description: !isGhostMode 
        ? "You can now view content invisibly" 
        : "Your visibility has returned to normal",
    });
  };

  // Start surveillance on a user
  const startSurveillance = async (targetUserId: string): Promise<boolean> => {
    if (!session?.user?.id || !hasGhostAccess) return false;
    
    setIsLoading(true);
    
    try {
      // Create a new surveillance session
      const sessionId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      // Update local state
      setActiveSurveillance({
        isActive: true,
        lastUpdated: new Date(),
        userId: session.user.id,
        targetUserId,
        startedAt: new Date(),
        sessionId,
        startTime: timestamp
      });
      
      // Record in database
      const { error } = await supabase
        .from('admin_surveillance')
        .insert({
          session_id: sessionId,
          admin_id: session.user.id,
          target_user_id: targetUserId,
          started_at: timestamp,
          status: 'active'
        });
        
      if (error) {
        console.error('Error starting surveillance:', error);
        setActiveSurveillance({
          isActive: false,
          lastUpdated: new Date()
        });
        
        toast({
          title: "Surveillance Failed",
          description: "Could not establish the surveillance session",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return false;
      }
      
      // Activate ghost mode if it's not already on
      if (!isGhostMode) {
        setIsGhostMode(true);
      }
      
      toast({
        title: "Surveillance Active",
        description: "Monitoring session has started",
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error in startSurveillance:', error);
      setActiveSurveillance({
        isActive: false,
        lastUpdated: new Date()
      });
      setIsLoading(false);
      return false;
    }
  };

  // Stop active surveillance
  const stopSurveillance = async (): Promise<void> => {
    if (!activeSurveillance.isActive || !activeSurveillance.sessionId) return;
    
    try {
      // Update database record
      await supabase
        .from('admin_surveillance')
        .update({
          ended_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('session_id', activeSurveillance.sessionId);
      
      // Update local state
      setActiveSurveillance({
        isActive: false,
        lastUpdated: new Date()
      });
      
      toast({
        title: "Surveillance Ended",
        description: "Monitoring session has been terminated",
      });
    } catch (error) {
      console.error('Error stopping surveillance:', error);
    }
  };

  // Fetch live alerts
  const refreshAlerts = async (): Promise<void> => {
    if (!session?.user?.id || !hasGhostAccess) return;
    
    try {
      const { data, error } = await supabase
        .from('live_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }
      
      if (data) {
        setLiveAlerts(
          data.map(alert => ({
            id: alert.id,
            type: alert.type,
            message: alert.message,
            timestamp: new Date(alert.created_at)
          }))
        );
      }
    } catch (error) {
      console.error('Error in refreshAlerts:', error);
    }
  };

  // Check for active surveillance on mount
  useEffect(() => {
    if (!session?.user?.id || !hasGhostAccess) return;
    
    const checkActiveSurveillance = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_surveillance')
          .select('*')
          .eq('admin_id', session.user.id)
          .eq('status', 'active')
          .order('started_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Error checking active surveillance:', error);
          return;
        }
        
        if (data) {
          setActiveSurveillance({
            isActive: true,
            lastUpdated: new Date(),
            userId: session.user.id,
            targetUserId: data.target_user_id,
            startedAt: new Date(data.started_at),
            sessionId: data.session_id,
            startTime: data.started_at
          });
          
          // Make sure ghost mode is active
          setIsGhostMode(true);
        }
      } catch (error) {
        console.error('Error in checkActiveSurveillance:', error);
      }
    };
    
    checkActiveSurveillance();
    refreshAlerts();
    
    // Set up interval to refresh alerts
    const intervalId = setInterval(refreshAlerts, 30000); // refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [session, hasGhostAccess]);
  
  const canUseGhostMode = hasGhostAccess && !isLoading;

  const contextValue = {
    isGhostMode,
    hasGhostAccess,
    isLoading,
    canUseGhostMode,
    toggleGhostMode,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };

  return (
    <GhostModeContext.Provider value={contextValue}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);
