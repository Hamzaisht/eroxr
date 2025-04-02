
import { AdminLogsTable } from "@/components/admin/godmode/logs/AdminLogsTable";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";

export default function AdminLogs() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Admin Activity Logs" section="Admin Logs" />
      <AdminLogsTable />
    </div>
  );
}
