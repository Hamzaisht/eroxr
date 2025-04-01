
import { useState, useCallback, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { LiveSession } from "../../user-analytics/types";
import { SurveillanceTab } from "../types";
import { useStreamsSurveillance } from "./useStreamsSurveillance";
import { useCallsSurveillance } from "./useCallsSurveillance";
import { useChatsSurveillance } from "./useChatsSurveillance";
import { useBodyContactSurveillance } from "./useBodyContactSurveillance";

export function useSurveillanceData() {
  const [activeTab, setActiveTab] = useState<SurveillanceTab>('streams');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const session = useSession();
  const { fetchStreams } = useStreamsSurveillance();
  const { fetchCalls } = useCallsSurveillance();
  const { fetchChats } = useChatsSurveillance();
  const { fetchBodyContact } = useBodyContactSurveillance();
  
  const fetchLiveSessions = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
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
      
      console.log(`Fetched ${data.length} ${activeTab} for surveillance`);
      setLiveSessions(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
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
    fetchLiveSessions
  };
}
