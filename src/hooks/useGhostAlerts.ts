
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveAlert } from "@/components/admin/platform/user-analytics/types";

export function useGhostAlerts(isGhostMode: boolean, isSuperAdmin: boolean) {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const session = useSession();

  useEffect(() => {
    if (!isGhostMode || !isSuperAdmin || !session?.user?.id) return;
    
    const fetchAlerts = async () => {
      try {
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
            content_id,
            profiles:user_id(username, avatar_url)
          `)
          .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setLiveAlerts(data.map(alert => ({
            id: alert.id,
            type: alert.type,
            user_id: alert.user_id,
            username: alert.profiles?.[0]?.username || 'Unknown',
            avatar_url: alert.profiles?.[0]?.avatar_url || null,
            created_at: alert.created_at,
            content_type: alert.content_type,
            reason: alert.reason,
            severity: alert.severity,
            content_id: alert.content_id
          })));
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, [isGhostMode, isSuperAdmin, session?.user?.id]);

  const refreshAlerts = async () => {
    if (!isGhostMode || !isSuperAdmin || !session?.user?.id) return;
    
    try {
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
          content_id,
          profiles:user_id(username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setLiveAlerts(data.map(alert => ({
          id: alert.id,
          type: alert.type,
          user_id: alert.user_id,
          username: alert.profiles?.[0]?.username || 'Unknown',
          avatar_url: alert.profiles?.[0]?.avatar_url || null,
          created_at: alert.created_at,
          content_type: alert.content_type,
          reason: alert.reason,
          severity: alert.severity,
          content_id: alert.content_id
        })));
      }
    } catch (error) {
      console.error("Error refreshing alerts:", error);
    }
  };

  return { liveAlerts, refreshAlerts };
}
