
import React, { useState, useEffect, useCallback } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { AlertsList } from "./surveillance/AlertsList";
import { Button } from "@/components/ui/button";
import { PowerOff, RefreshCw } from "lucide-react";
import { LiveSession, LiveSessionType } from "./surveillance/types";
import { LiveAlert } from "@/types/alerts";
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
  
  const fetchActiveSessions = useCallback(async () => {
    if (!isGhostMode) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching active surveillance sessions...");
      
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
      
      const messageSessions: LiveSession[] = (messages || []).map(msg => ({
        id: msg.id,
        type: "chat" as LiveSessionType,
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
      
      const postSessions: LiveSession[] = (posts || []).map(post => ({
        id: post.id,
        type: "content" as LiveSessionType,
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
      
      const allSessions = [...messageSessions, ...postSessions];
      
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
  
  useEffect(() => {
    if (!isGhostMode) return;
    
    console.log("Setting up realtime subscriptions for surveillance data");
    
    const messagesChannel = supabase
      .channel('surveillance-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
      }, () => {
        console.log('Message activity detected, refreshing data');
        fetchActiveSessions();
      })
      .subscribe();
      
    const postsChannel = supabase
      .channel('surveillance-posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, () => {
        console.log('Post activity detected, refreshing data');
        fetchActiveSessions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(postsChannel);
    };
  }, [isGhostMode, supabase, fetchActiveSessions]);
  
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await Promise.all([refreshAlerts(), fetchActiveSessions()]);
    setLoadingRefresh(false);
  };
  
  const handleStartWatching = async (session: LiveSession) => {
    try {
      console.log("Starting surveillance for session:", session);
      return await startSurveillance(session);
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    }
  };
  
  const handleStopWatching = async () => {
    try {
      return await stopSurveillance();
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

  if (!isGhostMode) {
    return <GhostModePrompt />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
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
