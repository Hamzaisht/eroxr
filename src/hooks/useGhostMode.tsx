
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActiveSurveillanceState, LiveAlert } from '@/utils/media/types';
import { LiveSession } from '@/types/surveillance';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from './use-toast';

interface GhostModeContextType {
  isGhostMode: boolean;
  hasGhostAccess: boolean;
  isLoading: boolean;
  canUseGhostMode: boolean;
  toggleGhostMode: () => void;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  hasGhostAccess: false,
  isLoading: false,
  canUseGhostMode: false,
  toggleGhostMode: () => {},
  activeSurveillance: {
    isWatching: false,
    session: null,
    startTime: null
  },
  startSurveillance: async () => false,
  stopSurveillance: async () => false,
  liveAlerts: [],
  refreshAlerts: async () => false,
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
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
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

  // Update the startSurveillance function to use the LiveSession interface
  const startSurveillance = async (liveSession: LiveSession): Promise<boolean> => {
    if (!liveSession || !hasGhostAccess) return false;
    
    setIsLoading(true);
    
    try {
      // Create a new surveillance session
      const sessionId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const currentUserId = session?.user?.id; // Get the current logged-in user's ID
      
      // Update local state
      setActiveSurveillance({
        isActive: true,
        lastUpdated: new Date(),
        userId: currentUserId, // Use the current logged-in user ID
        targetUserId: liveSession.user_id, // This should be from the LiveSession
        startedAt: new Date(),
        sessionId,
        isWatching: true,
        session: liveSession,
        startTime: timestamp
      });
      
      setActiveSession(liveSession);
      
      // Record in database
      const { error } = await supabase
        .from('admin_surveillance')
        .insert({
          session_id: sessionId,
          admin_id: currentUserId, // Use the current logged-in user ID
          target_user_id: liveSession.user_id, // This should be from the LiveSession
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
  const stopSurveillance = async (): Promise<boolean> => {
    if (!activeSurveillance.isActive || !activeSurveillance.sessionId) return false;
    
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
      
      setActiveSession(null);
      
      toast({
        title: "Surveillance Ended",
        description: "Monitoring session has been terminated",
      });
      
      return true;
    } catch (error) {
      console.error('Error stopping surveillance:', error);
      return false;
    }
  };

  // Fetch live alerts
  const refreshAlerts = async (): Promise<boolean> => {
    if (!session?.user?.id || !hasGhostAccess) return false;
    
    try {
      const { data, error } = await supabase
        .from('live_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        console.error('Error fetching alerts:', error);
        return false;
      }
      
      if (data) {
        const formattedAlerts: LiveAlert[] = data.map(alert => ({
          id: alert.id,
          type: alert.type || 'information',
          alert_type: (alert.type === 'violation' ? 'violation' : 
                      alert.type === 'risk' ? 'risk' : 'information') as 'violation' | 'risk' | 'information',
          user_id: alert.user_id || '',
          username: alert.username || 'Anonymous',
          avatar_url: alert.avatar_url,
          timestamp: new Date(alert.created_at),
          created_at: alert.created_at,
          content_type: alert.content_type || '',
          reason: alert.reason,
          severity: (alert.severity as 'high' | 'medium' | 'low') || 'medium',
          content_id: alert.content_id,
          message: alert.message || '',
          status: alert.status || 'pending',
          title: alert.title || 'Alert',
          description: alert.description,
          is_viewed: alert.is_viewed || false,
          urgent: alert.urgent || false,
          session: alert.session
        }));
        
        setLiveAlerts(formattedAlerts);
      }
      return true;
    } catch (error) {
      console.error('Error in refreshAlerts:', error);
      return false;
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
            startTime: data.started_at,
            isWatching: true
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
    const intervalId = setInterval(() => refreshAlerts(), 30000); // refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [session, hasGhostAccess]);
  
  const canUseGhostMode = hasGhostAccess && !isLoading;

  const surveillanceState = {
    isWatching: activeSurveillance.isActive || false,
    session: activeSession,
    startTime: activeSurveillance.startTime || null
  };

  const contextValue = {
    isGhostMode,
    hasGhostAccess,
    isLoading,
    canUseGhostMode,
    toggleGhostMode,
    activeSurveillance: surveillanceState,
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
