
import { useGhostMode } from "@/hooks/useGhostMode";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { AdminHeader } from "./sidebar/AdminHeader";
import { GhostModeToggle } from "./sidebar/GhostModeToggle";
import { GhostModeRoutes } from "./sidebar/GhostModeRoutes";
import { PlatformRoutes } from "./sidebar/PlatformRoutes";
import { GhostModeIndicator } from "./sidebar/GhostModeIndicator";

export const Sidebar = () => {
  const { isSuperAdmin } = useSuperAdminCheck();
  const { isGhostMode, canUseGhostMode } = useGhostMode();

  if (!isSuperAdmin) return null;

  return (
    <div className="w-64 border-r border-luxury-primary/10 bg-gradient-to-b from-[#0D1117] to-[#161B22] h-screen overflow-y-auto">
      <div className="p-6">
        <AdminHeader />

        {/* Ghost Mode Toggle */}
        <GhostModeToggle canUseGhostMode={canUseGhostMode} />

        {/* Ghost Mode Surveillance Routes */}
        <GhostModeRoutes isGhostMode={isGhostMode} />

        {/* Platform Control Routes */}
        <PlatformRoutes />

        {/* Ghost Mode Indicator at Bottom */}
        <GhostModeIndicator isGhostMode={isGhostMode} />
      </div>
    </div>
  );
};
