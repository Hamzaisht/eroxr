
import React, { useState } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { LiveSession, SessionType } from "@/types/surveillance";
import { LiveAlert } from "@/types/alerts";
import { useLiveSurveillanceData } from "./surveillance/hooks/useLiveSurveillanceData";
import { SurveillanceAlerts } from "./surveillance/components/SurveillanceAlerts";
import { ActiveSessionMonitor } from "./surveillance/components/ActiveSessionMonitor";

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
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { sessions, isLoading, fetchActiveSessions } = useLiveSurveillanceData();
  
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
    // Only try to start surveillance if the alert has appropriate session data
    if (alert.userId) {
      // Create a minimal session object from the alert data
      const sessionFromAlert: LiveSession = {
        id: alert.id,
        type: SessionType.USER,  // Use the enum value instead of string
        user_id: alert.userId,
        username: alert.username || 'Unknown',
        status: 'active',
        started_at: alert.timestamp,
        created_at: alert.created_at || alert.timestamp || new Date().toISOString(),
        is_active: true,
      };
      
      handleStartWatching(sessionFromAlert);
    }
  };

  if (!isGhostMode) {
    return <GhostModePrompt />;
  }

  // Format alerts to match LiveAlert type
  const formattedAlerts = liveAlerts.map(alert => ({
    ...alert,
    isRead: alert.isRead || false,
    alert_type: alert.alert_type || (alert.type === 'violation' ? 'violation' : 
                alert.type === 'risk' ? 'risk' : 'information') as 'violation' | 'risk' | 'information',
    userId: alert.userId || alert.user_id || '',
    contentId: alert.contentId || alert.content_id || '',
    username: alert.username || 'Unknown',
    created_at: typeof alert.created_at === 'string' ? alert.created_at : new Date().toISOString(),
  })) as LiveAlert[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      <div className="space-y-4">
        <SurveillanceAlerts
          liveAlerts={formattedAlerts}
          loadingRefresh={loadingRefresh}
          onRefresh={handleRefresh}
          onSelectAlert={handleSelectAlert}
        />
        
        <ActiveSessionMonitor
          isWatching={activeSurveillance.isWatching}
          session={activeSurveillance.session}
          startTime={activeSurveillance.startTime}
          onStopWatching={handleStopWatching}
        />
      </div>
      
      <div className="lg:col-span-3 space-y-4">
        <SurveillanceProvider
          liveAlerts={formattedAlerts}
          refreshAlerts={async () => {
            return await refreshAlerts();
          }}
          startSurveillance={async (session: LiveSession) => {
            return await startSurveillance(session);
          }}
        >
          <SurveillanceTabs 
            liveAlerts={formattedAlerts} 
            onSelectAlert={handleSelectAlert}
          />
        </SurveillanceProvider>
        
        <SessionList 
          sessions={sessions}
          isLoading={isLoading}
          error={null}
          onMonitorSession={handleStartWatching}
          actionInProgress={actionInProgress}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};
