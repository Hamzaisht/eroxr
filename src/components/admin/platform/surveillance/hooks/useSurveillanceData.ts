
import { useState, useEffect, useCallback } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { LiveSession, SurveillanceTab } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSurveillance } from "../SurveillanceContext";
import { useFallbackData } from "./useFallbackData";
import { useSurveillanceQueries } from "./useSurveillanceQueries";

export function useSurveillanceData() {
  const { isGhostMode, liveAlerts, refreshAlerts } = useGhostMode();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { activeTab } = useSurveillance();

  const supabase = useSupabaseClient();
  const { generateFallbackData } = useFallbackData();
  const { fetchStreams, fetchMessages } = useSurveillanceQueries();

  const refreshData = useCallback(async () => {
    if (!isGhostMode) {
      setLiveSessions([]);
      setIsLoading(false);
      return;
    }

    // Start by setting some initial data to prevent flashing
    if (liveSessions.length === 0) {
      setLiveSessions(generateFallbackData());
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching surveillance data...");
      
      // Execute the appropriate fetch based on active tab
      let data: LiveSession[] = [];
      
      if (activeTab === "streams") {
        data = await fetchStreams();
      } else if (activeTab === "chats") {
        data = await fetchMessages();
      } else {
        // Fetch all data for other tabs
        const streams = await fetchStreams();
        const messages = await fetchMessages();
        data = [...streams, ...messages];
      }
      
      // If no data is returned, use fallback data
      if (data.length === 0) {
        data = generateFallbackData();
      }
      
      setLiveSessions(data);
    } catch (err: any) {
      console.error("Error in surveillance data hook:", err.message);
      setError("Failed to load surveillance data");
      
      // Even in case of error, provide fallback data
      setLiveSessions(generateFallbackData());
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, supabase, activeTab, fetchStreams, fetchMessages, generateFallbackData, liveSessions.length]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
    
    // Set up realtime subscription for the relevant tables
    if (isGhostMode) {
      const messagesChannel = supabase
        .channel('surveillance-messages')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'direct_messages' 
        }, () => refreshData())
        .subscribe();
        
      const streamsChannel = supabase
        .channel('surveillance-streams')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'live_streams' 
        }, () => refreshData())
        .subscribe();
        
      return () => {
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(streamsChannel);
      };
    }
  }, [refreshData, isGhostMode, supabase]);

  // Include all the data and methods needed by components
  return {
    isLoading,
    liveSessions,
    liveAlerts,
    error,
    refreshData,
    activeTab,
    // Include properties from surveillance context for compatibility
    ...useSurveillance()
  };
}
