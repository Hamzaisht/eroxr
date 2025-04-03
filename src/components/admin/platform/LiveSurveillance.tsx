
import React, { useState, useEffect, useCallback } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { AlertsList } from "./surveillance/AlertsList";
import { Button } from "@/components/ui/button";
import { PowerOff, RefreshCw } from "lucide-react";
import { LiveSession, LiveAlert } from "./surveillance/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const LiveSurveillance = () => {
  const {
    isGhostMode,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  } = useGhostMode();

  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = useSupabaseClient();
  
  // Function to fetch active chats/direct messages
  const fetchActiveSessions = useCallback(async () => {
    if (!isGhostMode) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching active surveillance sessions...");
      
      // Fetch recent direct messages (chats)
      const { data: messages, error: messagesError } = await supabase
        .from('direct_messages')
        .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      } else {
        console.log("Fetched messages:", messages?.length || 0);
      }
      
      // Fetch recent user posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*, creator:creator_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        console.log("Fetched posts:", posts?.length || 0);
      }
      
      // Transform messages to LiveSession format
      const messageSessions: LiveSession[] = (messages || []).map(msg => ({
        id: msg.id,
        type: "chat",
        user_id: msg.sender_id,
        created_at: msg.created_at,
        media_url: msg.media_url || [],
        username: msg.sender?.username || "Unknown",
        avatar_url: msg.sender?.avatar_url,
        content: msg.content || "",
        content_type: msg.message_type || "text",
        status: "active",
        message_type: msg.message_type || "text",
        recipient_id: msg.recipient_id,
        recipient_username: msg.recipient?.username,
        sender_username: msg.sender?.username,
      }));
      
      // Transform posts to LiveSession format
      const postSessions: LiveSession[] = (posts || []).map(post => ({
        id: post.id,
        type: "content",
        user_id: post.creator_id,
        created_at: post.created_at,
        media_url: post.media_url || [],
        username: post.creator?.username || "Unknown",
        avatar_url: post.creator?.avatar_url,
        content: post.content || "",
        content_type: "post",
        status: post.visibility || "public",
        title: `Post by ${post.creator?.username || "Unknown"}`,
        tags: post.tags,
      }));
      
      // Combine all session types
      const allSessions = [...messageSessions, ...postSessions];
      
      // Set sessions state
      setSessions(allSessions);
      console.log(`Total active sessions: ${allSessions.length}`);
    } catch (error) {
      console.error("Error in fetchActiveSessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, supabase]);
  
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
      fetchActiveSessions();
    }
  }, [isGhostMode, refreshAlerts, fetchActiveSessions]);
  
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await Promise.all([refreshAlerts(), fetchActiveSessions()]);
    setLoadingRefresh(false);
  };
  
  const handleStartWatching = async (session: LiveSession) => {
    try {
      // Type safety: Create a properly typed session object 
      const validSession: LiveSession = {
        id: session.id,
        type: session.type as "stream" | "call" | "chat" | "bodycontact" | "content",
        user_id: session.user_id || "",  // Ensure required field has a value
        created_at: session.created_at,
        media_url: session.media_url || [],
        username: session.username,
        avatar_url: session.avatar_url,
        content: session.content,
        content_type: session.content_type,
        status: session.status,
        message_type: session.message_type,
        recipient_id: session.recipient_id,
        recipient_username: session.recipient_username,
        sender_username: session.sender_username,
        title: session.title,
        description: session.description,
        location: session.location,
        tags: session.tags,
        viewer_count: session.viewer_count,
        duration: session.duration,
        started_at: session.started_at || session.created_at,  // Fallback to created_at
        creator_id: session.creator_id,
        creator_username: session.creator_username,
        about_me: session.about_me,
        video_url: session.video_url,
      };
      
      await startSurveillance(validSession);
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    }
  };
  
  const handleStopWatching = async () => {
    try {
      await stopSurveillance();
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    }
  };

  const handleSelectAlert = (alert: LiveAlert) => {
    if (alert.session) {
      handleStartWatching(alert.session);
    }
  };

  // If ghost mode is not active, show prompt
  if (!isGhostMode) {
    return <GhostModePrompt />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {/* Alerts sidebar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AI Alerts</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loadingRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingRefresh ? 'animate-spin' : ''}`} />
            {loadingRefresh ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        <AlertsList 
          alerts={liveAlerts} 
          isLoading={loadingRefresh}
          onSelect={handleSelectAlert} 
        />
        
        {activeSurveillance.isWatching && (
          <div className="mt-4 p-4 bg-red-950/20 border border-red-800/30 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-400 font-medium">Active Surveillance</h3>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleStopWatching}
              >
                <PowerOff className="h-3.5 w-3.5 mr-1.5" />
                Stop
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mb-1">
              Watching: <span className="text-white">{activeSurveillance.session?.username || 'User'}</span>
            </p>
            <p className="text-sm text-gray-400">
              Since: <span className="text-white">{activeSurveillance.startTime && 
                new Date(activeSurveillance.startTime).toLocaleTimeString()}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Main surveillance content */}
      <div className="lg:col-span-3 space-y-4">
        <SurveillanceProvider
          liveAlerts={liveAlerts}
          refreshAlerts={refreshAlerts}
          startSurveillance={startSurveillance as (session: LiveSession) => Promise<boolean>}
        >
          <SurveillanceTabs 
            liveAlerts={liveAlerts} 
            onSelectAlert={handleSelectAlert}
          />
          <SessionList 
            sessions={sessions}
            isLoading={isLoading}
            onMonitorSession={handleStartWatching}
            error={null}
          />
        </SurveillanceProvider>
      </div>
    </div>
  );
};
