
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { replaceAllString } from "@/utils/stringUtils";

interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
  admin_name?: string; // Adding optional field for displaying admin name
}

export const AdminLogsTable = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform data to include admin_name from profiles
      const formattedLogs = data.map(log => ({
        ...log,
        admin_name: log.profiles?.username || 'Unknown Admin'
      }));

      setLogs(formattedLogs);
    } catch (error: any) {
      console.error("Error fetching admin logs:", error);
      setError(error);
      toast({
        title: "Error",
        description: "Could not load admin logs. Please try again.",
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
    return replaceAllString(action, "_", " ");
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
