
import { useState, useEffect } from "react";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function to replace .replaceAll() which might not be available
const replaceAllString = (str: string, find: string, replace: string): string => {
  return str.split(find).join(replace);
};

interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  action_type: string;
  target_id?: string;
  target_type?: string;
  details?: any;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export function AdminLogsTable() {
  const { logs, isLoading, error, fetchLogs } = useAdminLogs();
  const [filteredLogs, setFilteredLogs] = useState<AdminLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setIsFiltering(true);
        const filtered = logs.filter(log => {
          // Search in log fields
          const searchIn = [
            log.action,
            log.action_type,
            log.target_type,
            log.username,
            log.details ? JSON.stringify(log.details) : ""
          ].join(" ").toLowerCase();
          
          return searchIn.includes(searchTerm.toLowerCase());
        });
        setFilteredLogs(filtered);
        setIsFiltering(false);
      } else {
        setFilteredLogs(logs);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, logs]);

  const formatActionType = (type: string) => {
    // Convert snake_case to Title Case
    return replaceAllString(type, "_", " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionVariant = (actionType: string): "default" | "destructive" | "outline" => {
    if (actionType.includes("delete") || actionType.includes("ban")) {
      return "destructive";
    }
    return "outline";
  };

  const viewLogDetails = (log: AdminLog) => {
    toast({
      title: `Log Details: ${formatActionType(log.action)}`,
      description: (
        <div className="mt-2 space-y-1 text-sm max-h-[300px] overflow-auto">
          <p><strong>Admin:</strong> {log.username || log.admin_id}</p>
          <p><strong>Action:</strong> {formatActionType(log.action)}</p>
          <p><strong>Type:</strong> {formatActionType(log.action_type)}</p>
          {log.target_type && <p><strong>Target Type:</strong> {formatActionType(log.target_type)}</p>}
          {log.target_id && <p><strong>Target ID:</strong> {log.target_id}</p>}
          {log.details && (
            <div>
              <strong>Details:</strong>
              <pre className="mt-1 p-2 bg-slate-800 rounded text-xs overflow-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error Loading Logs</h3>
        <p>{error.message}</p>
        <Button 
          onClick={() => fetchLogs()} 
          variant="outline" 
          className="mt-4 border-red-600 text-red-400 hover:bg-red-950/30"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          onClick={() => fetchLogs()} 
          variant="outline" 
          size="sm"
          className="w-24"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {isFiltering ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-6 bg-slate-800/50 rounded-lg text-center text-gray-400">
          <p className="text-lg">No logs found</p>
          <p className="text-sm mt-1">Try different search terms or refresh the logs</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>Admin activity logs with most recent first</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Time</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Target</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={log.avatar_url || undefined} />
                        <AvatarFallback>
                          {log.username?.substring(0, 2).toUpperCase() || "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{log.username || "Admin"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionVariant(log.action_type)}>
                      {formatActionType(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.target_type ? (
                      <span className="text-sm">
                        {formatActionType(log.target_type)}
                        {log.details?.username && (
                          <span className="ml-1 text-primary">
                            @{log.details.username}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewLogDetails(log)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
