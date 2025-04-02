
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  action_type: string;
  created_at: string;
  target_id?: string;
  target_type?: string;
  details?: Record<string, any>;
  profiles?: {
    username: string;
    avatar_url?: string;
  } | null;
}

export const useAdminLogs = (timeWindow = 30) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate time window (default 30 days)
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - timeWindow);
        
        // Fetch admin logs with admin usernames
        const { data, error } = await supabase
          .from('admin_logs')
          .select(`
            id,
            admin_id,
            action,
            action_type,
            created_at,
            target_id,
            target_type,
            details,
            profiles:admin_id(username, avatar_url)
          `)
          .gte('created_at', fromDate.toISOString())
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the returned data to match our expected types
        const transformedData = data?.map(item => ({
          ...item,
          // Convert profiles array to a single object if it exists
          profiles: Array.isArray(item.profiles) && item.profiles.length > 0 
            ? item.profiles[0] 
            : null
        })) || [];
        
        setLogs(transformedData);
      } catch (err) {
        console.error("Error fetching admin logs:", err);
        setError(err as Error);
        
        toast({
          title: "Error fetching admin logs",
          description: (err as Error).message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    
    // Set up real-time subscription for new logs
    const subscription = supabase
      .channel('admin-logs-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_logs' 
      }, () => {
        fetchLogs();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [timeWindow, toast]);

  return { logs, isLoading, error };
};
