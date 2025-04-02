
import { PlatformControl as PlatformControlComponent } from "@/components/admin/platform/PlatformControl";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function PlatformControl() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Platform Control</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Platform Control</h1>
      <PlatformControlComponent />
    </div>
  );
}
