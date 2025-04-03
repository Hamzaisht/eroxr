
import { GodModeHeader } from "./sidebar/GodModeHeader";
import { GodModeToggle } from "./sidebar/GodModeToggle";
import { GodModeNavigation } from "./sidebar/GodModeNavigation";
import { GodModeAdminInfo } from "./sidebar/GodModeAdminInfo";

export function GodmodeSidebar() {
  return (
    <div className="w-64 border-r border-luxury-primary/10 bg-gradient-to-b from-[#0D1117] to-[#161B22] h-screen overflow-y-auto">
      <div className="p-6">
        {/* Header with title */}
        <GodModeHeader />

        {/* Ghost Mode Toggle */}
        <GodModeToggle />

        {/* Navigation */}
        <GodModeNavigation />

        {/* Super Admin Info */}
        <GodModeAdminInfo />
      </div>
    </div>
  );
}
