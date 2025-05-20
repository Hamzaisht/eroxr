
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from 'date-fns';

interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  action_type: string;
  details: any;
  created_at: string;
  target_id?: string;
  target_type?: string;
}

interface AdminLogsTableProps {
  logs?: AdminLog[];
  isLoading?: boolean;
}

const AdminLogsTable: React.FC<AdminLogsTableProps> = ({ logs = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">Loading admin logs...</p>
      </div>
    );
  }
  
  if (!logs || logs.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">No admin logs available</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date / Time</TableHead>
            <TableHead>Admin ID</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs">
                {log.created_at ? format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                {log.admin_id || 'N/A'}
              </TableCell>
              <TableCell>{log.action || 'N/A'}</TableCell>
              <TableCell>{log.action_type || 'N/A'}</TableCell>
              <TableCell className="max-w-[100px] truncate">
                {log.target_id ? (
                  <span title={log.target_id}>
                    {log.target_type ? `${log.target_type}:` : ''} {log.target_id}
                  </span>
                ) : 'N/A'}
              </TableCell>
              <TableCell>
                {log.details ? (
                  <pre className="max-w-[200px] truncate text-xs">
                    {typeof log.details === 'object' 
                      ? JSON.stringify(log.details, null, 2) 
                      : log.details}
                  </pre>
                ) : 'No details'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminLogsTable;
