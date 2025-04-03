
import React from 'react';
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { AdminLogsTable } from "@/components/admin/godmode/logs/AdminLogsTable";

export default function AdminLogs() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Admin Activity Logs" section="Admin Logs" />
      <AdminLogsTable />
    </div>
  );
}
