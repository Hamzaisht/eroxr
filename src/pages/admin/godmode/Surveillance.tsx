
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useGhostMode } from "@/hooks/useGhostMode";

export default function Surveillance() {
  const { liveAlerts } = useGhostMode();
  
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Godmode</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Surveillance</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Ghost Mode Surveillance</h1>
      <SurveillanceTabs liveAlerts={liveAlerts} />
    </div>
  );
}
