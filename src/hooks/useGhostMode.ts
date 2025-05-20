import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { LiveSession, SessionType } from '@/types/surveillance';
import { LiveAlert } from '@/types/alerts';
import { supabase } from '@/integrations/supabase/client';
import { toggleGhostModeState, syncGhostModeState } from '@/context/ghost/ghostModeUtils';

interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[] | null;
  refreshAlerts: () => Promise<void>;
  syncGhostModeFromSupabase: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[] | null>(null);
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const [activeSurveillance, setActiveSurveillance] = useState({
    isWatching: false,
    session: null,
    startTime: null
  });
  
  useEffect(() => {
    const isAdmin = async () => {
      if (!session?.user) {
        setCanUseGhostMode(false);
        return;
      }
      
      const { data, error } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching admin status:", error);
        setCanUseGhostMode(false);
        return;
      }
      
      setCanUseGhostMode(!!data);
    };
    
    isAdmin();
  }, [session, supabaseClient]);
  
  const toggleGhostMode = async () => {
    if (!session) return;
    
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
  
  const syncGhostModeFromSupabase = async () => {
    if (!session?.user) return;
    
    await syncGhostModeState(
      session.user.id,
      canUseGhostMode,
      setIsGhostMode,
      setIsLoading
    );
  };
  
  useEffect(() => {
    if (session?.user) {
      syncGhostModeFromSupabase();
    }
  }, [session]);
  
  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    setIsLoading(true);
    try {
      setActiveSurveillance({
        isWatching: true,
        session: session,
        startTime: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopSurveillance = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null
      });
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshAlerts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('alerts')
        .select('*')
        .limit(50);
      
      if (error) {
        console.error("Error fetching alerts:", error);
        setLiveAlerts([]);
      } else {
        setLiveAlerts(data);
      }
    } catch (error) {
      console.error("Error refreshing alerts:", error);
      setLiveAlerts([]);
    } finally {
      setIsLoading(false);
    }
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
};

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (!context) {
    throw new Error('useGhostMode must be used within a GhostModeProvider');
  }
  return context;
};

// Optional: Add this hook if it doesn't exist and is referenced in other files
export const useModerationActions = () => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  const handleModeration = async (
    content: any, 
    action: string, 
    editedContent?: string
  ) => {
    setActionInProgress(content.id);
    try {
      // Implementation for handling moderation actions
      console.log(`Moderation action '${action}' applied to content:`, content);
      // In a real app, you would make an API call here
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error applying moderation action:", error);
    } finally {
      setActionInProgress(null);
    }
  };
  
  return { handleModeration, actionInProgress };
};

// Helper function to create the hook for useLiveSurveillanceData
export const useLiveSurveillanceData = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchActiveSessions = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      // Mock sessions for now
      const mockSessions: LiveSession[] = [
        {
          id: '1',
          type: SessionType.STREAM,
          user_id: 'user-1',
          username: 'streamer1',
          title: 'Live Gaming Session',
          started_at: new Date().toISOString(),
          status: 'active',
          viewer_count: 42,
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: '2',
          type: SessionType.CHAT,
          user_id: 'user-2',
          username: 'chatter1',
          started_at: new Date().toISOString(),
          status: 'active',
          recipient_username: 'chatter2',
          content: 'Hello there!',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      
      setSessions(mockSessions);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load surveillance data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActiveSessions();
  }, []);
  
  return { sessions, isLoading, error, fetchActiveSessions };
};
