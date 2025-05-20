
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { safeString, isQueryError } from "@/utils/supabase/typeSafeOperations";
import { Database } from "@/integrations/supabase/types/database.types";

// Define type for admin log rows with safe fallback
type AdminLogRow = 'admin_logs' extends keyof Database['public']['Tables'] 
  ? Database['public']['Tables']['admin_logs']['Row'] 
  : { id: string; admin_id: string; action: string; action_type: string; created_at: string; target_id?: string; target_type?: string; details?: Record<string, any>; };

// Define type for profile with username
interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
  admin_name?: string;
}

export const AdminLogsTable = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Check if admin_logs table exists in the database schema
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          id,
          admin_id,
          action,
          action_type,
          target_id,
          target_type,
          details,
          created_at,
          profiles:admin_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        // This could occur if the table doesn't exist or other query issues
        console.error("Failed to fetch admin logs:", error.message);
        throw new Error(`Failed to fetch admin logs: ${error.message}`);
      }

      // Check if data is valid
      if (!data || isQueryError(data)) {
        console.error("Invalid data returned from admin logs query");
        throw new Error(`Failed to fetch admin logs: Invalid data returned`);
      }

      // Safely transform data with type checking
      const formattedLogs: AdminLog[] = [];
      if (Array.isArray(data)) {
        data.forEach(log => {
          if (log && typeof log === 'object' && 'id' in log) {
            // Check for profile data safely
            let adminUsername = 'Unknown Admin';
            
            if (log.profiles) {
              // Handle various possible shapes of the profiles data
              if (Array.isArray(log.profiles) && log.profiles.length > 0) {
                // If profiles is an array with items
                adminUsername = safeString(log.profiles[0]?.username) || 'Unknown Admin';
              } 
              else if (typeof log.profiles === 'object' && log.profiles !== null) {
                // If profiles is a direct object with username
                adminUsername = safeString((log.profiles as any).username) || 'Unknown Admin';
              }
            }
            
            const adminLog: AdminLog = {
              id: safeString(log.id),
              admin_id: safeString(log.admin_id),
              action: safeString(log.action),
              action_type: safeString(log.action_type),
              target_type: safeString(log.target_type || ''),
              target_id: safeString(log.target_id || ''),
              details: log.details || {},
              created_at: safeString(log.created_at),
              admin_name: adminUsername
            };
            formattedLogs.push(adminLog);
          }
        });
      }

      setLogs(formattedLogs);
    } catch (err: any) {
      console.error("Error fetching admin logs:", err);
      setError(err);
      
      toast({
        title: "Error",
        description: "Could not load admin logs. The table might not exist or there was a query error.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Format action for display
  const formatAction = (action: string): string => {
    return action.replace(/_/g, " ");
  };

  return (
    <div className="rounded-lg border bg-slate-800/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">Admin Activity Logs</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-luxury-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-gray-400">Loading logs...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-400">Failed to load admin logs</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Target</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-sm">{log.admin_name}</td>
                    <td className="px-4 py-3 text-sm">{formatAction(log.action)}</td>
                    <td className="px-4 py-3 text-sm">{log.target_type}</td>
                    <td className="px-4 py-3 text-sm">{log.action_type}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.details ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Action Details",
                              description: <pre className="max-h-80 overflow-auto p-2 text-xs bg-slate-900 rounded">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>,
                            });
                          }}
                        >
                          View
                        </Button>
                      ) : (
                        "No details"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLogsTable;
