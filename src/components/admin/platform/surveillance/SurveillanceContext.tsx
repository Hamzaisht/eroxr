
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { LiveAlert } from "@/types/alerts";
import { LiveSession } from "./types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Define the surveillance context type
interface SurveillanceContextType {
  liveSessions: LiveSession[];
  liveAlerts: LiveAlert[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshSessions: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
}

// Create the context
const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

// Hook to use the surveillance context
export function useSurveillance() {
  const context = useContext(SurveillanceContext);
  if (!context) {
    throw new Error("useSurveillance must be used within a SurveillanceProvider");
  }
  return context;
}

// Provider props
interface SurveillanceProviderProps {
  children: ReactNode;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
}

// Provider component
export function SurveillanceProvider({
  children,
  liveAlerts,
  refreshAlerts,
  startSurveillance
}: SurveillanceProviderProps) {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("streams");
  const supabase = useSupabaseClient();
  
  // Fetch sessions from Supabase
  const refreshSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch live streams
      const { data: streams, error: streamsError } = await supabase
        .from('live_streams')
        .select('*, creator:creator_id(username, avatar_url)')
        .eq('status', 'live')
        .order('started_at', { ascending: false })
        .limit(20);
        
      if (streamsError) {
        throw streamsError;
      }
      
      // Transform data to LiveSession format
      const sessions: LiveSession[] = (streams || []).map(stream => ({
        id: stream.id,
        type: 'stream',
        user_id: stream.creator_id,
        created_at: stream.started_at,
        username: stream.creator?.username || 'Unknown',
        avatar_url: stream.creator?.avatar_url,
        title: stream.title,
        status: stream.is_private ? 'private' : 'public',
        content: stream.description || '',
        content_type: 'stream',
        started_at: stream.started_at,
      }));
      
      setLiveSessions(sessions);
    } catch (error: any) {
      console.error('Error fetching surveillance data:', error);
      setError('Failed to load surveillance data');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Fetch data on mount
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);
  
  // Start surveillance handler
  const handleStartSurveillance = async (session: LiveSession) => {
    return await startSurveillance(session);
  };
  
  // Context value
  const value: SurveillanceContextType = {
    liveSessions,
    liveAlerts,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    refreshSessions,
    refreshAlerts,
    handleStartSurveillance
  };
  
  return (
    <SurveillanceContext.Provider value={value}>
      {children}
    </SurveillanceContext.Provider>
  );
}
