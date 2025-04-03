
import React from 'react';
import { AdminHeader } from "./AdminHeader";
import { AdminLogsTable } from "./AdminLogsTable";

export const AdminLogs = () => {
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Admin Activity Logs" 
        section="Monitoring & Supervision" 
      />
      
      <div className="space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
          <p className="text-gray-400">
            This page shows a detailed record of all actions performed by administrators on the platform.
            Actions are logged with timestamps and complete details for accountability and audit purposes.
          </p>
        </div>
        
        <AdminLogsTable />
      </div>
    </div>
  );
};
