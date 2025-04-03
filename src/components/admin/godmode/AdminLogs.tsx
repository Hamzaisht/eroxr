
import { AdminHeader } from "./AdminHeader";
import { AdminLogsTable } from "./logs/AdminLogsTable";

export const AdminLogs = () => {
  return (
    <div className="space-y-4">
      <AdminHeader title="Admin Logs" section="Audit Trail" />
      <div className="p-4 bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg">
        <AdminLogsTable />
      </div>
    </div>
  );
};
