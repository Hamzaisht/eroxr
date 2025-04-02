
import { UsersManagement } from "@/components/admin/platform/UsersManagement";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function Moderation() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Moderation</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">User Moderation</h1>
      <UsersManagement />
    </div>
  );
}
