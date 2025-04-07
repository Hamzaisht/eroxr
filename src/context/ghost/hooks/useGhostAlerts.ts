
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveAlert } from "@/types/alerts";
import { LiveSession } from "@/components/admin/platform/surveillance/types";
import { formatFlaggedContentAsAlert, formatReportAsAlert } from "../utils/alertFormatters";

export const useGhostAlerts = (isGhostMode: boolean) => {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();

  const refreshAlerts = useCallback(async () => {
    if (!isGhostMode || !session?.user?.id) {
      setLiveAlerts([]);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch flagged content
      const { data: flaggedContent, error: flaggedError } = await supabase
        .from('flagged_content')
        .select(`
          *,
          user:user_id(username, avatar_url),
          flagger:flagged_by(username, avatar_url)
        `)
        .order('flagged_at', { ascending: false })
        .limit(10);
      
      if (flaggedError) {
        console.error("Error fetching flagged content:", flaggedError);
      }

      // Fetch reports
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id(username, avatar_url),
          reported:reported_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (reportsError) {
        console.error("Error fetching reports:", reportsError);
      }

      // Fetch live streams with high viewer counts (potential alerts)
      const { data: activeStreams, error: streamsError } = await supabase
        .from('live_streams')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false })
        .limit(5);
      
      if (streamsError) {
        console.error("Error fetching active streams:", streamsError);
      }

      // Format all alerts
      const formattedAlerts: LiveAlert[] = [
        ...(flaggedContent || []).map(content => ({
          ...formatFlaggedContentAsAlert(content),
          alert_type: 'violation' as const
        })),
        ...(reports || []).map(report => ({
          ...formatReportAsAlert(report),
          alert_type: 'risk' as const
        })),
        ...(activeStreams || []).filter(stream => stream.viewer_count > 10).map(stream => ({
          id: stream.id,
          type: 'information',
          alert_type: 'information' as const,
          user_id: stream.creator_id,
          username: stream.profiles?.username || 'Unknown',
          avatar_url: stream.profiles?.avatar_url,
          timestamp: stream.created_at,
          created_at: stream.created_at,
          title: `Active Stream: ${stream.title || 'Untitled'}`,
          description: `Live stream with ${stream.viewer_count} viewers`,
          content_type: 'stream',
          content_id: stream.id,
          reason: 'High activity stream',
          severity: 'low',
          message: `Live stream by ${stream.profiles?.username || 'Unknown'} has ${stream.viewer_count} viewers`,
          status: 'active',
          is_viewed: false,
          urgent: false,
          session: {
            id: stream.id,
            type: 'stream' as const,
            user_id: stream.creator_id,
            username: stream.profiles?.username || 'Unknown',
            avatar_url: stream.profiles?.avatar_url,
            title: stream.title,
            media_url: stream.playback_url ? [stream.playback_url] : [],
            created_at: stream.started_at || stream.created_at,
            status: 'live',
            viewer_count: stream.viewer_count
          } as LiveSession
        }))
      ];

      // Sort alerts by severity and timestamp
      formattedAlerts.sort((a, b) => {
        const severityRank = { high: 0, medium: 1, low: 2 };
        const severityDiff = severityRank[a.severity as 'high' | 'medium' | 'low'] - 
                           severityRank[b.severity as 'high' | 'medium' | 'low'];
        
        if (severityDiff !== 0) return severityDiff;
        
        // If same severity, sort by timestamp (newest first)
        return new Date(b.timestamp || b.created_at).getTime() - 
               new Date(a.timestamp || a.created_at).getTime();
      });

      console.log(`Fetched ${formattedAlerts.length} live alerts for ghost mode`);
      setLiveAlerts(formattedAlerts);
    } catch (error) {
      console.error("Error refreshing ghost alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, session?.user?.id]);

  // Refresh alerts when ghost mode changes
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
    } else {
      setLiveAlerts([]);
    }
  }, [isGhostMode, refreshAlerts]);
  
  // Set up realtime subscriptions for alerts
  useEffect(() => {
    if (!isGhostMode) return;
    
    const flaggedChannel = supabase
      .channel('ghost-flagged-content')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flagged_content'
      }, () => {
        console.log('Flagged content changes, refreshing alerts');
        refreshAlerts();
      })
      .subscribe();
      
    const reportsChannel = supabase
      .channel('ghost-reports')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports'
      }, () => {
        console.log('Reports changes, refreshing alerts');
        refreshAlerts();
      })
      .subscribe();
      
    const streamsChannel = supabase
      .channel('ghost-live-streams')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_streams'
      }, () => {
        console.log('Streams changes, refreshing alerts');
        refreshAlerts();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(flaggedChannel);
      supabase.removeChannel(reportsChannel);
      supabase.removeChannel(streamsChannel);
    };
  }, [isGhostMode, refreshAlerts]);

  return { liveAlerts, isLoading, refreshAlerts };
};

import { useEffect } from 'react';
