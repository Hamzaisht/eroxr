
import { useEffect } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhostModePrompt } from "./surveillance/GhostModePrompt";
import { SurveillanceProvider, useSurveillance } from "./surveillance/SurveillanceContext";
import { SurveillanceTabs } from "./surveillance/SurveillanceTabs";
import { ActiveSurveillanceCard } from "./surveillance/ActiveSurveillanceCard";
import { LiveSession, LiveAlert } from "./surveillance/types";

export const LiveSurveillance = () => {
  const { isSuperAdmin } = useSuperAdminCheck();
  const { 
    isGhostMode, 
    activeSurveillance, 
    startSurveillance, 
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  } = useGhostMode();
  
  // Show ghost mode prompt if not in ghost mode or not a super admin
  if (!isGhostMode || !isSuperAdmin) {
    return <GhostModePrompt />;
  }
  
  return (
    <div className="p-4 space-y-4">
      <SurveillanceProvider
        liveAlerts={liveAlerts as unknown as LiveAlert[]} // Type conversion to match our interface
        refreshAlerts={refreshAlerts}
        startSurveillance={startSurveillance as (session: LiveSession) => Promise<boolean>}
      >
        <SurveillanceContent
          activeSurveillance={activeSurveillance as {
            session?: LiveSession;
            isWatching: boolean;
            startTime?: string;
          }}
          stopSurveillance={stopSurveillance}
          liveAlerts={liveAlerts as unknown as LiveAlert[]} // Type conversion to match our interface
        />
      </SurveillanceProvider>
    </div>
  );
};

interface SurveillanceContentProps {
  activeSurveillance: {
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  };
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
}

const SurveillanceContent = ({
  activeSurveillance,
  stopSurveillance,
  liveAlerts
}: SurveillanceContentProps) => {
  const { 
    fetchLiveSessions, 
    handleRefresh, 
    activeTab,
    isRefreshing 
  } = useSurveillance();
  
  useEffect(() => {
    fetchLiveSessions();
    
    const interval = setInterval(fetchLiveSessions, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [activeTab, fetchLiveSessions]);
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Ghost Mode Surveillance</h1>
          <p className="text-gray-400">Monitor real-time platform activity while invisible</p>
        </div>
        
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {activeSurveillance.isWatching && activeSurveillance.session && (
        <ActiveSurveillanceCard
          session={activeSurveillance.session as LiveSession} // Type assertion to match our interface
          onEndSurveillance={stopSurveillance}
        />
      )}
      
      <SurveillanceTabs
        liveAlerts={liveAlerts}
      />
    </>
  );
};
