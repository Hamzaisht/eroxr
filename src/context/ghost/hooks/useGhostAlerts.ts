import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveAlert } from "@/types/alerts";

interface UseGhostAlertsProps {
  userId?: string;
  isGhostMode: boolean;
}

export const useGhostAlerts = ({ userId, isGhostMode }: UseGhostAlertsProps) => {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLiveAlerts = useCallback(async () => {
    if (!userId || !isGhostMode) {
      setLiveAlerts([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_alerts')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching live alerts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch live alerts.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const formattedAlerts: LiveAlert[] = data.map(alert => {
          const profiles = alert.profiles as any;
          return {
            id: alert.id,
            type: alert.type as "violation" | "risk" | "information",
            user_id: alert.user_id,
            username: profiles?.[0]?.username || 'Unknown',
            avatar_url: profiles?.[0]?.avatar_url || null,
            timestamp: alert.timestamp,
            created_at: alert.created_at,
            content_type: alert.content_type,
            reason: alert.reason,
            severity: alert.severity as "high" | "medium" | "low",
            content_id: alert.content_id,
            title: alert.title,
            message: alert.message || 'Alert triggered',
            status: alert.status || 'new',
            description: alert.description || alert.reason || '',
            is_viewed: alert.is_viewed || false,
            alert_type: alert.type,
            session_id: alert.session_id,
            session: alert.session
          };
        });
        setLiveAlerts(formattedAlerts);
      }
    } catch (error) {
      console.error("Unexpected error fetching live alerts:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to fetch live alerts due to an unexpected error.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, isGhostMode, toast]);

  useEffect(() => {
    if (isGhostMode) {
      fetchLiveAlerts();
    } else {
      setLiveAlerts([]);
    }
  }, [isGhostMode, fetchLiveAlerts]);

  return { liveAlerts, isLoading, refreshAlerts: fetchLiveAlerts };
};
