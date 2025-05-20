
import React, { useState } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { LiveSession, SessionType, LiveAlert as SurveillanceLiveAlert } from "@/types/surveillance";
import { LiveAlert } from "@/types/alerts"; // Use surveillance LiveAlert to match the context
import { useLiveSurveillanceData } from "./surveillance/hooks/useLiveSurveillanceData";
import { SurveillanceAlerts } from "./surveillance/components/SurveillanceAlerts";
import { ActiveSessionMonitor } from "./surveillance/components/ActiveSessionMonitor";

export const LiveSurveillance = () => {
  const { isGhostMode } = useGhostMode();

  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { sessions, isLoading, fetchActiveSessions } = useLiveSurveillanceData();
  
  // Mock data since we removed the advanced functionality
  const [activeSurveillance, setActiveSurveillance] = useState({
    isWatching: false,
    session: null as LiveSession | null,
    startTime: null as string | null
  });
  
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await fetchActiveSessions();
    setLoadingRefresh(false);
  };
  
  const handleStartWatching = async (session: LiveSession) => {
    try {
      console.log("Starting surveillance for session:", session);
      setActiveSurveillance({
        isWatching: true,
        session: session,
        startTime: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    }
  };
  
  const handleStopWatching = async () => {
    try {
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null
      });
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    }
  };

  // Update this to handle the type conversion
  const handleSelectAlert = (alert: LiveAlert) => {
    // Only try to start surveillance if the alert has appropriate session data
    if (alert.userId || alert.user_id) {
      // Create a minimal session object from the alert data
      const sessionFromAlert: LiveSession = {
        id: alert.id,
        type: SessionType.USER,  // Use the enum value instead of string
        user_id: alert.userId || alert.user_id || '',
        username: alert.username || 'Unknown',
        status: 'active',
        started_at: alert.timestamp,
        created_at: alert.created_at || alert.timestamp || new Date().toISOString(),
        is_active: true,
      };
      
      handleStartWatching(sessionFromAlert);
    }
  };

  const refreshAlerts = async () => {
    console.log("Refreshing alerts (mock function)");
    return true;
  };

  if (!isGhostMode) {
    return <GhostModePrompt />;
  }

  // Format alerts to match LiveAlert type from alerts.ts to surveillance.ts
  const formattedAlertsForSurveillance: SurveillanceLiveAlert[] = liveAlerts.map(alert => ({
    id: alert.id,
    type: (alert.type === 'security' || alert.type === 'system') ? 'information' : alert.type as 'violation' | 'risk' | 'information',
    alert_type: alert.alert_type || ((alert.type === 'violation' || alert.type === 'risk') ? alert.type : 'information') as 'violation' | 'risk' | 'information',
    user_id: alert.user_id || alert.userId || '',
    userId: alert.userId || alert.user_id || '',
    contentId: alert.contentId || alert.content_id || '',
    content_id: alert.content_id || alert.contentId || '',
    username: alert.username || 'Unknown',
    timestamp: alert.timestamp,
    created_at: typeof alert.created_at === 'string' ? alert.created_at : new Date().toISOString(),
    severity: alert.severity || 'medium', 
    title: alert.title || 'Alert',
    description: alert.description || '',
    isRead: !!alert.isRead,
    session: alert.session
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      <div className="space-y-4">
        <SurveillanceAlerts
          liveAlerts={liveAlerts}
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
          liveAlerts={formattedAlertsForSurveillance}
          refreshAlerts={async () => {
            return await refreshAlerts();
          }}
          startSurveillance={async (session: LiveSession) => {
            return await handleStartWatching(session);
          }}
        >
          <SurveillanceTabs 
            liveAlerts={formattedAlertsForSurveillance}
            onSelectAlert={alert => handleSelectAlert(alert as unknown as LiveAlert)}
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
