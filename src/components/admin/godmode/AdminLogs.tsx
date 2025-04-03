
import { useState, useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { replaceAllString } from "@/utils/stringUtils";
import { format } from "date-fns";

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

interface AdminLogsTableProps {
  logs: AdminLog[];
  isLoading: boolean;
}

export const AdminLogsTable = ({ logs, isLoading }: AdminLogsTableProps) => {
  const { toast } = useToast();
  
  const formatActionText = (action: string): string => {
    return replaceAllString(
      action.charAt(0).toUpperCase() + action.slice(1),
      "_",
      " "
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (logs.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/30 rounded-lg">
        <p className="text-lg font-medium">No admin actions found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Admin activity will be logged and displayed here
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-x-auto border border-white/10 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/30">
          <tr>
            <th scope="col" className="px-4 py-3">Admin</th>
            <th scope="col" className="px-4 py-3">Action</th>
            <th scope="col" className="px-4 py-3">Target</th>
            <th scope="col" className="px-4 py-3">Date & Time</th>
            <th scope="col" className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-white/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={log.avatar_url || undefined} />
                    <AvatarFallback>
                      {log.username ? log.username.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{log.username || 'Unknown'}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{formatActionText(log.action)}</span>
                  <span className="text-xs text-muted-foreground">{log.action_type}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[120px]">{log.target_id?.substring(0, 8) || 'System'}</span>
                  <span className="text-xs text-muted-foreground">{log.target_type || 'system'}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {log.created_at && format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
              </td>
              <td className="px-4 py-3">
                {log.details ? (
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    View Details
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">No details</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const AdminLogs = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_logs')
          .select(`
            *,
            admin:admin_id(username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        
        // Format the data to match the AdminLog interface
        const formattedLogs = data.map(log => ({
          ...log,
          username: log.admin?.[0]?.username || 'Unknown',
          avatar_url: log.admin?.[0]?.avatar_url || null
        }));
        
        setLogs(formattedLogs);
      } catch (error) {
        console.error('Error fetching admin logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin logs',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminLogs();
  }, [toast]);

  return (
    <div className="space-y-4">
      <AdminHeader title="Admin Logs" section="Audit Trail" />
      <div className="p-4 bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg">
        <AdminLogsTable logs={logs} isLoading={isLoading} />
      </div>
    </div>
  );
};
