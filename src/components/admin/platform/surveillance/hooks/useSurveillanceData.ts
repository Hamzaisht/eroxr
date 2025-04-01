
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { LiveSession, SurveillanceTab } from "../types";
import { useStreamsSurveillance } from "./useStreamsSurveillance";
import { useCallsSurveillance } from "./useCallsSurveillance";
import { useChatsSurveillance } from "./useChatsSurveillance";
import { useBodyContactSurveillance } from "./useBodyContactSurveillance";

export function useSurveillanceData() {
  const [activeTab, setActiveTab] = useState<SurveillanceTab>('streams');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const { fetchStreams } = useStreamsSurveillance();
  const { fetchCalls } = useCallsSurveillance();
  const { fetchChats } = useChatsSurveillance();
  const { fetchBodyContact } = useBodyContactSurveillance();
  
  const fetchLiveSessions = useCallback(async () => {
    if (!session?.user?.id) return;
    
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
          data = await fetchChats();
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
        started_at: item.started_at || item.created_at || new Date().toISOString()
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
  }, [activeTab, session?.user?.id, fetchStreams, fetchCalls, fetchChats, fetchBodyContact]);
  
  return {
    activeTab,
    setActiveTab,
    liveSessions,
    setLiveSessions,
    isLoading,
    setIsLoading,
    isRefreshing,
    setIsRefreshing,
    error,
    setError,
    fetchLiveSessions
  };
}
