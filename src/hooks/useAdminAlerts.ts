
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminAlert {
  id: string;
  type: string;
  user_id: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: string;
  content_id: string;
  username?: string;
  avatar_url?: string;
}

export const useAdminAlerts = (timeWindow = 15) => {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate time window (15 minutes ago by default)
        const fromTime = new Date();
        fromTime.setMinutes(fromTime.getMinutes() - timeWindow);
        
        // Try to get alerts directly with a join
        const { data, error } = await supabase
          .from('admin_alerts')
          .select(`
            id,
            type,
            user_id,
            created_at,
            content_type,
            reason,
            severity,
            content_id
          `)
          .gte('created_at', fromTime.toISOString())
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // If we have alerts, fetch the profiles separately
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(alert => alert.user_id))];
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', userIds);
            
          if (profilesError) throw profilesError;
          
          // Map profiles to alerts
          const alertsWithProfiles = data.map(alert => {
            const profile = profilesData?.find(p => p.id === alert.user_id);
            return {
              ...alert,
              username: profile?.username,
              avatar_url: profile?.avatar_url
            };
          });
          
          setAlerts(alertsWithProfiles);
        } else {
          setAlerts(data || []);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError(err as Error);
        
        // Only show toast for actual errors, not just empty results
        if ((err as any).code !== 'PGRST204') {
          toast({
            title: "Error fetching alerts",
            description: (err as Error).message,
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('admin-alerts-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_alerts' 
      }, payload => {
        fetchAlerts(); // Refetch all data when we get a new alert
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [timeWindow, toast]);

  return { alerts, isLoading, error };
};
