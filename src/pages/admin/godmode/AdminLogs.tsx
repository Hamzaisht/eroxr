
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { AdminLogsTable } from "@/components/admin/godmode/logs/AdminLogsTable";

export default function AdminLogs() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Admin Logs</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Administration Logs</h1>
      <AdminLogsTable />
    </div>
  );
}
