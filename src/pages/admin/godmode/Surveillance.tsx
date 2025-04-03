
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "@/components/admin/platform/GhostModeToggle";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { LiveSession } from "@/components/admin/platform/surveillance/types";
import { GhostModePrompt } from "@/components/admin/platform/surveillance/GhostModePrompt";

export default function Surveillance() {
  const { isGhostMode, liveAlerts, refreshAlerts, startSurveillance, canUseGhostMode } = useGhostMode();
  
  // If ghost mode is not enabled, show the prompt
  if (!isGhostMode && canUseGhostMode) {
    return (
      <div className="space-y-4">
        <AdminHeader 
          title="Ghost Mode Surveillance" 
          section="Surveillance" 
          actionButton={<GhostModeToggle />}
        />
        <GhostModePrompt />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Ghost Mode Surveillance" 
        section="Surveillance" 
        actionButton={<GhostModeToggle />}
      />
      
      <SurveillanceProvider
        liveAlerts={liveAlerts}
        refreshAlerts={refreshAlerts}
        startSurveillance={startSurveillance as (session: LiveSession) => Promise<boolean>}
      >
        <SurveillanceTabs liveAlerts={liveAlerts} />
      </SurveillanceProvider>
    </div>
  );
}
