
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "@/components/admin/platform/GhostModeToggle";

export default function Surveillance() {
  const { liveAlerts } = useGhostMode();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Surveillance</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <GhostModeToggle />
      </div>
      
      <h1 className="text-2xl font-bold">Ghost Mode Surveillance</h1>
      <SurveillanceTabs liveAlerts={liveAlerts} />
    </div>
  );
}
