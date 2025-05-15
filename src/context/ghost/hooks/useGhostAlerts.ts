
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";

export const useGhostAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // Simplified fetch for alerts
        const { data, error } = await supabase
          .from("ghost_alerts")
          .select("*")
          .eq("admin_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching ghost alerts:", error);
        } else {
          setAlerts(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch ghost alerts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();

    // Set up a real-time subscription for new alerts
    const channel = supabase
      .channel('ghost_alerts_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ghost_alerts',
        filter: `admin_id=eq.${session.user.id}` 
      }, (payload) => {
        setAlerts(prevAlerts => [payload.new, ...prevAlerts]);
        toast({
          title: "New Ghost Alert",
          description: `Alert type: ${payload.new.alert_type}`,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return { alerts, isLoading };
};
