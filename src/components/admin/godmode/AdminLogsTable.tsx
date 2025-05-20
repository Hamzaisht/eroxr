
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface AdminLogEntry {
  id: string;
  action: string;
  admin: string;
  timestamp: string;
  details: string;
}

export const AdminLogsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data for admin logs
  const mockLogs: AdminLogEntry[] = [
    {
      id: '1',
      action: 'User Banned',
      admin: 'admin@example.com',
      timestamp: new Date().toISOString(),
      details: 'Banned user for violation of community guidelines'
    },
    {
      id: '2',
      action: 'Content Removed',
      admin: 'moderator@example.com',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      details: 'Removed inappropriate content'
    },
    {
      id: '3',
      action: 'Settings Updated',
      admin: 'admin@example.com',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      details: 'Updated platform settings'
    }
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Activity Logs</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Logs'}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead className="hidden md:table-cell">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No activity logs found
              </TableCell>
            </TableRow>
          ) : (
            mockLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.admin}</TableCell>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell className="hidden md:table-cell">{log.details}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {mockLogs.length > 0 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
