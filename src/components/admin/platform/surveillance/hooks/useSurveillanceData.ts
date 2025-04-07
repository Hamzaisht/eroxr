
import { useState, useEffect, useCallback } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { LiveSession, SurveillanceTab } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSurveillance } from "../SurveillanceContext";

export function useSurveillanceData() {
  const { isGhostMode, liveAlerts, refreshAlerts } = useGhostMode();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { activeTab } = useSurveillance();

  const supabase = useSupabaseClient();

  // Generate fallback data to ensure we always have something to display
  const generateFallbackData = useCallback((): LiveSession[] => {
    console.log("Generating fallback data");
    return [
      {
        id: "fallback-1",
        type: "stream",
        user_id: "system",
        username: "Demo User",
        created_at: new Date().toISOString(),
        title: "Sample Live Stream",
        status: "live",
        media_url: []
      },
      {
        id: "fallback-2",
        type: "chat",
        user_id: "system",
        username: "Chat User",
        created_at: new Date().toISOString(),
        content: "Sample Message",
        status: "active",
        media_url: []
      }
    ];
  }, []);

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
      
      // Attempt to fetch live sessions from various tables
      const fetchStreams = async () => {
        const { data, error } = await supabase
          .from("live_streams")
          .select("*, creator:creator_id(username, avatar_url)")
          .eq("status", "live")
          .limit(10);
          
        if (error) throw error;
        console.log(`Fetched ${data?.length || 0} streams for surveillance`);
        return data?.map(stream => ({
          id: stream.id,
          type: "stream",
          user_id: stream.creator_id,
          username: stream.creator?.username || "Unknown",
          created_at: stream.created_at,
          title: stream.title,
          description: stream.description,
          status: stream.status,
          media_url: stream.playback_url ? [stream.playback_url] : []
        })) || [];
      };
      
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("direct_messages")
          .select("*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)")
          .order("created_at", { ascending: false })
          .limit(10);
          
        if (error) throw error;
        console.log(`Fetched ${data?.length || 0} chats for surveillance`);
        return data?.map(msg => ({
          id: msg.id,
          type: "chat",
          user_id: msg.sender_id,
          username: msg.sender?.username || "Unknown",
          recipient_username: msg.recipient?.username,
          created_at: msg.created_at,
          content: msg.content,
          media_url: msg.media_url ? (Array.isArray(msg.media_url) ? msg.media_url : [msg.media_url]) : []
        })) || [];
      };
      
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
  }, [isGhostMode, supabase, activeTab, generateFallbackData, liveSessions.length]);

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
