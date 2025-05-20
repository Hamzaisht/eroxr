
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveAlert } from '@/types/surveillance';

interface UseGhostAlertsResult {
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
}

export const useGhostAlerts = (): UseGhostAlertsResult => {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAlerts = useCallback(async (): Promise<boolean> => {
    setIsRefreshing(true);
    try {
      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error("Error fetching alerts:", error);
        setIsRefreshing(false);
        return false;
      }

      if (alerts) {
        // Type assertion to LiveAlert[]
        setLiveAlerts(alerts as LiveAlert[]);
      } else {
        setLiveAlerts([]);
      }

      setIsRefreshing(false);
      return true;
    } catch (err) {
      console.error("Unexpected error refreshing alerts:", err);
      setIsRefreshing(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch of alerts
    refreshAlerts();

    // Setup real-time subscription
    const alertsChannel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
      }, (payload) => {
        console.log('New alert activity:', payload);
        refreshAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, [refreshAlerts]);

  return {
    liveAlerts,
    refreshAlerts,
  };
};
