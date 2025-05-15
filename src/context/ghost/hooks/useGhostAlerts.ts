
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toDbValue } from '@/utils/supabase/helpers';

export interface GhostAlert {
  id: string;
  type: string;
  message: string;
  target_id: string;
  created_at: string;
  is_read: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useGhostAlerts = () => {
  const [alerts, setAlerts] = useState<GhostAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const session = useSession();

  // Fetch alerts
  const { data, refetch } = useQuery({
    queryKey: ['ghost-alerts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (data) {
      setAlerts(data as GhostAlert[]);
      const unread = data.filter(alert => !alert.is_read).length;
      setUnreadCount(unread);
    }
  }, [data]);

  // Subscribe to new alerts
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = supabase
      .channel('ghost-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_alerts',
      }, payload => {
        const newAlert = payload.new as GhostAlert;
        setAlerts(prev => [newAlert, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const markAsRead = async (alertId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ is_read: true })
        .eq('id', toDbValue(alertId));
        
      if (error) throw error;
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!session?.user?.id || alerts.length === 0) return;
    
    try {
      const unreadAlertIds = alerts
        .filter(alert => !alert.is_read)
        .map(alert => alert.id);
        
      if (unreadAlertIds.length === 0) return;
      
      const { error } = await supabase
        .from('admin_alerts')
        .update({ is_read: true })
        .in('id', unreadAlertIds);
        
      if (error) throw error;
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => ({ ...alert, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  return {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  };
};
