
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { LiveAlert } from "@/types/alerts";
import { LiveSession, SurveillanceTab } from "./types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useStreamsSurveillance } from "./hooks/useStreamsSurveillance";
import { useCallsSurveillance } from "./hooks/useCallsSurveillance";
import { useChatsSurveillance } from "./hooks/useChatsSurveillance";
import { useBodyContactSurveillance } from "./hooks/useBodyContactSurveillance";

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
  fetchLiveSessions: () => Promise<void>;
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
  
  const { fetchStreams } = useStreamsSurveillance();
  const { fetchCalls } = useCallsSurveillance();
  const { fetchChatSessions } = useChatsSurveillance();
  const { fetchBodyContact } = useBodyContactSurveillance();
  
  // Fetch sessions from Supabase based on active tab
  const fetchLiveSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: LiveSession[] = [];
      
      switch (activeTab) {
        case 'streams':
          data = await fetchStreams();
          break;
          
        case 'calls':
          data = await fetchCalls();
          break;
          
        case 'chats':
          data = await fetchChatSessions();
          break;
          
        case 'bodycontact':
          data = await fetchBodyContact();
          break;
          
        default:
          break;
      }
      
      // Ensure all items comply with the LiveSession interface
      const validatedData = data.map(item => ({
        ...item,
        media_url: Array.isArray(item.media_url) ? item.media_url : 
                   item.media_url ? [item.media_url] : [],
        created_at: item.created_at || item.started_at || new Date().toISOString(),
        // Ensure type is a valid enum value
        type: (item.type as "stream" | "call" | "chat" | "bodycontact" | "content")
      }));
      
      console.log(`Fetched ${validatedData.length} ${activeTab} for surveillance`);
      setLiveSessions(validatedData);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setError(`Could not load ${activeTab} data. Please try again.`);
      setLiveSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, fetchStreams, fetchCalls, fetchChatSessions, fetchBodyContact]);
  
  // Refresh all sessions
  const refreshSessions = useCallback(async () => {
    await fetchLiveSessions();
  }, [fetchLiveSessions]);

  // Fetch data on mount and when tab changes
  useEffect(() => {
    fetchLiveSessions();
  }, [activeTab, fetchLiveSessions]);
  
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
    handleStartSurveillance,
    fetchLiveSessions
  };
  
  return (
    <SurveillanceContext.Provider value={value}>
      {children}
    </SurveillanceContext.Provider>
  );
}
