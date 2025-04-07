import React, { useState } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { SessionList } from "./surveillance/SessionList";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider } from "./surveillance/SurveillanceContext";
import { LiveSession } from "@/types/surveillance";
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
