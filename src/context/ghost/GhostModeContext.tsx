
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { LiveAlert } from '@/types/alerts';
import { LiveSession } from '@/types/surveillance';
import { toggleGhostModeState, syncGhostModeState } from './ghostModeUtils';

export interface GhostModeContextProps {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  ghostedProfile: any | null;
  setGhostedProfile: (profile: any | null) => void;
}

export const GhostModeContext = createContext<GhostModeContextProps | undefined>(
  undefined
);

export const GhostModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ghostedProfile, setGhostedProfile] = useState<any | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const session = useSession();
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState({
    isWatching: false,
    session: null as LiveSession | null,
    startTime: null as string | null
  });

  // Check if user can use ghost mode (super admin check)
  useEffect(() => {
    const checkSuperAdmin = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (!error && data && data.role === 'super_admin') {
          setCanUseGhostMode(true);
        } else {
          setCanUseGhostMode(false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setCanUseGhostMode(false);
      }
    };
    
    checkSuperAdmin();
  }, [session?.user]);

  // Sync ghost mode state from database on mount
  useEffect(() => {
    if (session?.user?.id) {
      syncGhostModeState(
        session.user.id, 
        canUseGhostMode, 
        setIsGhostMode, 
        setIsLoading
      );
    }
  }, [session?.user?.id, canUseGhostMode]);

  // Toggle ghost mode function
  const toggleGhostMode = async () => {
    if (!session?.user) return;
    
    await toggleGhostModeState(
      session, 
      canUseGhostMode, 
      isGhostMode, 
      setIsGhostMode, 
      setIsLoading,
      stopSurveillance,
      activeSurveillance
    );
  };

  // Refresh alerts from the backend
  const refreshAlerts = useCallback(async (): Promise<boolean> => {
    if (!session?.user) {
      console.warn('No user session found, cannot refresh alerts.');
      return false;
    }

    try {
      // Mock alerts for development
      if (import.meta.env.MODE !== 'production') {
        const mockAlerts: LiveAlert[] = [
          {
            id: "1",
            type: 'violation',
            severity: 'high',
            title: "Content Violation",
            description: "Post with inappropriate content detected",
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString(),
            userId: "user-123",
            username: "suspicious_user",
            contentId: "post-456",
            isRead: false,
            alert_type: 'violation'
          },
          {
            id: "2",
            type: 'risk',
            severity: 'medium',
            title: "Potential Spam",
            description: "Multiple identical messages sent in short timeframe",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            created_at: new Date(Date.now() - 15 * 60000).toISOString(),
            userId: "user-234",
            username: "potential_bot",
            contentId: "message-789",
            isRead: false,
            alert_type: 'risk'
          }
        ];
        setLiveAlerts(mockAlerts);
        return true;
      }

      // Fetch alerts for the user (production mode)
      const { data: alerts, error: alertsError } = await supabase
        .from('flagged_content')
        .select('*, user:user_id(*)')
        .order('created_at', { ascending: false });

      if (alertsError) {
        console.error('Error fetching alerts:', alertsError);
        return false;
      }

      if (alerts) {
        const formattedAlerts: LiveAlert[] = alerts.map((alert: any) => ({
          id: alert.id,
          type: alert.severity === 'high' ? 'violation' : 'risk',
          severity: alert.severity || 'medium',
          title: alert.reason || 'Content Flagged',
          description: alert.notes || 'No additional details',
          timestamp: alert.flagged_at,
          created_at: alert.flagged_at,
          userId: alert.user_id,
          username: alert.user?.username || 'Unknown User',
          contentId: alert.content_id,
          isRead: false,
          alert_type: 'violation'
        }));
        
        setLiveAlerts(formattedAlerts);
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error refreshing alerts:', err);
      return false;
    }
  }, [session?.user]);

  // Start surveillance of a session
  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    try {
      setActiveSurveillance({
        isWatching: true,
        session,
        startTime: new Date().toISOString()
      });
      
      // Log surveillance activity (if in production)
      if (import.meta.env.MODE === 'production') {
        await supabase.from('admin_logs').insert({
          admin_id: session?.user?.id,
          action: 'started_surveillance',
          action_type: 'security',
          target_id: session.user_id,
          target_type: 'user',
          details: { session_id: session.id, session_type: session.type }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      return false;
    }
  };

  // Stop active surveillance
  const stopSurveillance = async (): Promise<boolean> => {
    try {
      const sessionToLog = activeSurveillance.session;
      
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null
      });
      
      // Log surveillance activity (if in production)
      if (import.meta.env.MODE === 'production' && sessionToLog) {
        await supabase.from('admin_logs').insert({
          admin_id: session?.user?.id,
          action: 'stopped_surveillance',
          action_type: 'security',
          target_id: sessionToLog.user_id,
          target_type: 'user',
          details: { session_id: sessionToLog.id, session_type: sessionToLog.type }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error stopping surveillance:', error);
      return false;
    }
  };

  // Initial alerts fetch
  useEffect(() => {
    if (isGhostMode && session?.user) {
      refreshAlerts();
    }
  }, [isGhostMode, session?.user, refreshAlerts]);

  const value: GhostModeContextProps = {
    isGhostMode,
    toggleGhostMode,
    canUseGhostMode,
    isLoading,
    liveAlerts,
    refreshAlerts,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    ghostedProfile,
    setGhostedProfile,
  };

  return (
    <GhostModeContext.Provider value={value}>
      {children}
    </GhostModeContext.Provider>
  );
};
