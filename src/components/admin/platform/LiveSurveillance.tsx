
import React, { useState, useEffect } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { AlertsList } from "./surveillance/AlertsList";
import { Button } from "@/components/ui/button";
import { PowerOff, RefreshCw } from "lucide-react";
import { LiveSession, LiveAlert } from "./surveillance/types";

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
  
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
    }
  }, [isGhostMode, refreshAlerts]);
  
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await refreshAlerts();
    setLoadingRefresh(false);
  };
  
  const handleStartWatching = async (session: LiveSession) => {
    try {
      // Type safety: Create a properly typed session object 
      const validSession: LiveSession = {
        id: session.id,
        type: session.type as "stream" | "call" | "chat" | "bodycontact",
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
        
        <AlertsList alerts={liveAlerts} onSelect={(alert: LiveAlert) => {
          if (alert.session) {
            handleStartWatching(alert.session);
          }
        }} />
        
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
        <SurveillanceProvider>
          <SurveillanceTabs />
          <SessionList 
            onMonitorSession={handleStartWatching}
          />
        </SurveillanceProvider>
      </div>
    </div>
  );
};
