
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveAlert } from "@/types/alerts";
import { 
  formatFlaggedContentAlert, 
  formatReportAlert, 
  formatDmcaAlert,
  sortAlertsBySeverityAndTime 
} from "../utils/alertFormatters";
import { 
  fetchFlaggedContent, 
  fetchReports, 
  fetchDmcaRequests 
} from "../utils/alertDataFetchers";

export const useGhostAlerts = (isGhostMode: boolean) => {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  // Function to fetch live alerts
  const refreshAlerts = useCallback(async (): Promise<void> => {
    if (!isGhostMode || !session?.user?.id) {
      setLiveAlerts([]);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch alerts from different sources
      const [flaggedContentRes, reportsRes, dmcaRes] = await Promise.all([
        fetchFlaggedContent(),
        fetchReports(),
        fetchDmcaRequests()
      ]);

      // Process and combine alerts
      const flaggedAlerts: LiveAlert[] = (flaggedContentRes.data || [])
        .map(formatFlaggedContentAlert);

      const reportAlerts: LiveAlert[] = (reportsRes.data || [])
        .map(formatReportAlert);

      const dmcaAlerts: LiveAlert[] = (dmcaRes.data || [])
        .map(formatDmcaAlert);

      // Combine all alerts and sort by severity and timestamp
      const allAlerts: LiveAlert[] = sortAlertsBySeverityAndTime([
        ...flaggedAlerts, 
        ...reportAlerts, 
        ...dmcaAlerts
      ]);

      setLiveAlerts(allAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, session?.user?.id]);

  // Set up subscription to real-time updates
  useEffect(() => {
    if (!isGhostMode || !session?.user?.id) return;

    // Initial fetch
    refreshAlerts();

    // Set up real-time subscriptions for new alerts
    const setupRealtimeSubscriptions = () => {
      const flaggedChannel = supabase
        .channel('flagged-content-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'flagged_content',
        }, () => refreshAlerts())
        .subscribe();

      const reportsChannel = supabase
        .channel('reports-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'reports',
        }, () => refreshAlerts())
        .subscribe();

      const dmcaChannel = supabase
        .channel('dmca-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'dmca_requests',
        }, () => refreshAlerts())
        .subscribe();

      return {
        flaggedChannel,
        reportsChannel,
        dmcaChannel
      };
    };

    const subscriptions = setupRealtimeSubscriptions();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(subscriptions.flaggedChannel);
      supabase.removeChannel(subscriptions.reportsChannel);
      supabase.removeChannel(subscriptions.dmcaChannel);
    };
  }, [isGhostMode, session?.user?.id, refreshAlerts]);

  return { liveAlerts, refreshAlerts, isLoading };
};
