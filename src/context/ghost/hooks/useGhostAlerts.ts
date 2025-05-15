
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { toDbValue } from '@/utils/supabase/helpers';

interface GhostAlert {
  id: string;
  alert_type: string;
  content: string;
  created_at: string;
}

export function useGhostAlerts() {
  const [alerts, setAlerts] = useState<GhostAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const fetchAlerts = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .eq('admin_id', toDbValue(session.user.id))
        .eq('is_read', toDbValue(false))
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setAlerts(data as GhostAlert[]);
    } catch (error: any) {
      console.error('Error fetching ghost mode alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ is_read: true })
        .eq('id', toDbValue(alertId));
        
      if (error) throw error;
      
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    } catch (error: any) {
      console.error('Error marking alert as read:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAlerts();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('alerts-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'admin_alerts',
            filter: `admin_id=eq.${session.user.id}`,
          },
          (payload) => {
            setAlerts((prev) => [payload.new as GhostAlert, ...prev]);
            
            toast({
              title: 'New Alert',
              description: (payload.new as GhostAlert).content,
            });
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id]);

  return {
    alerts,
    loading,
    markAsRead,
    refreshAlerts: fetchAlerts,
  };
}
