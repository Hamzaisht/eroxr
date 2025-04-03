
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "@/components/admin/platform/GhostModeToggle";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export default function Surveillance() {
  const { liveAlerts, refreshAlerts, startSurveillance } = useGhostMode();
  
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
