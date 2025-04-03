
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveAlert } from "@/types/alerts";

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
        supabase
          .from('flagged_content')
          .select(`
            id, 
            content_id,
            content_type,
            reason,
            status,
            severity,
            flagged_at,
            user_id,
            profiles:user_id(username, avatar_url)
          `)
          .eq('status', 'flagged')
          .order('flagged_at', { ascending: false })
          .limit(50),
          
        supabase
          .from('reports')
          .select(`
            id,
            content_type,
            content_id,
            reason,
            description,
            status,
            created_at,
            is_emergency,
            reporter_id,
            reported_id,
            profiles:reporter_id(username, avatar_url)
          `)
          .eq('status', 'pending')
          .order('is_emergency', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(50),
          
        supabase
          .from('dmca_requests')
          .select(`
            id,
            content_type,
            status,
            created_at,
            reporter_id,
            content_id,
            profiles:reporter_id(username, avatar_url)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      // Process and combine alerts
      const flaggedAlerts: LiveAlert[] = (flaggedContentRes.data || []).map(item => ({
        id: item.id,
        type: "violation", // Changed from "flagged_content" to match LiveAlert type
        content_type: item.content_type,
        content_id: item.content_id,
        reason: item.reason,
        severity: item.severity as "high" | "medium" | "low",
        timestamp: item.flagged_at,
        created_at: item.flagged_at,
        status: item.status,
        user_id: item.user_id,
        username: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].username || 'Unknown User' 
          : 'Unknown User',
        avatar_url: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].avatar_url || '' 
          : '',
        title: `Flagged ${item.content_type}`,
        description: item.reason || '',
        is_viewed: false
      }));

      const reportAlerts: LiveAlert[] = (reportsRes.data || []).map(item => ({
        id: item.id,
        type: "risk", // Changed from "report" to match LiveAlert type
        content_type: item.content_type,
        content_id: item.content_id || '', // Ensure content_id is provided
        reason: item.reason,
        severity: item.is_emergency ? 'high' : 'medium',
        timestamp: item.created_at,
        created_at: item.created_at,
        status: item.status,
        user_id: item.reporter_id,
        username: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].username || 'Unknown User' 
          : 'Unknown User',
        avatar_url: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].avatar_url || '' 
          : '',
        title: `${item.is_emergency ? 'URGENT: ' : ''}Report on ${item.content_type}`,
        description: item.description || item.reason || '',
        is_viewed: false
      }));

      const dmcaAlerts: LiveAlert[] = (dmcaRes.data || []).map(item => ({
        id: item.id,
        type: "information", // Changed from "dmca" to match LiveAlert type
        content_type: item.content_type,
        content_id: item.content_id,
        reason: 'Copyright Violation',
        severity: 'high',
        timestamp: item.created_at,
        created_at: item.created_at,
        status: item.status,
        user_id: item.reporter_id,
        username: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].username || 'Unknown User' 
          : 'Unknown User',
        avatar_url: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0].avatar_url || '' 
          : '',
        title: `DMCA Takedown Request`,
        description: `Copyright claim on ${item.content_type}`,
        is_viewed: false
      }));

      // Combine all alerts and sort by severity and timestamp
      const allAlerts: LiveAlert[] = [...flaggedAlerts, ...reportAlerts, ...dmcaAlerts]
        .sort((a, b) => {
          // First sort by severity
          const severityOrder = { high: 0, medium: 1, low: 2 };
          const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - 
                              severityOrder[b.severity as keyof typeof severityOrder];
          
          if (severityDiff !== 0) return severityDiff;
          
          // Then sort by timestamp (most recent first)
          return new Date(b.timestamp || b.created_at).getTime() - 
                new Date(a.timestamp || a.created_at).getTime();
        });

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

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(flaggedChannel);
      supabase.removeChannel(reportsChannel);
      supabase.removeChannel(dmcaChannel);
    };
  }, [isGhostMode, session?.user?.id, refreshAlerts]);

  return { liveAlerts, refreshAlerts, isLoading };
};
