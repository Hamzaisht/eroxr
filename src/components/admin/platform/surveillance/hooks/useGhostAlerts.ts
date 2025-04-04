
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { LiveAlert } from '@/types/alerts';

export function useGhostAlerts(isGhostMode: boolean) {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const supabase = useSupabaseClient();
  
  const refreshAlerts = useCallback(async () => {
    if (!isGhostMode) {
      setLiveAlerts([]);
      return;
    }
    
    try {
      console.log('Refreshing alerts data for ghost mode');
      
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(username, avatar_url), reported:reported_id(username, avatar_url)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      }
      
      // Fetch flagged content
      const { data: flaggedData, error: flaggedError } = await supabase
        .from('flagged_content')
        .select('*, user:user_id(username, avatar_url)')
        .eq('status', 'flagged')
        .order('flagged_at', { ascending: false })
        .limit(20);
        
      if (flaggedError) {
        console.error('Error fetching flagged content:', flaggedError);
      }
      
      // Transform reports to LiveAlert format
      const reportAlerts: LiveAlert[] = (reportsData || []).map(report => ({
        id: report.id,
        type: "violation", // Changed from "report" to match LiveAlert type
        alert_type: "report",
        user_id: report.reported_id,
        username: report.reported?.username || 'Unknown',
        avatar_url: report.reported?.avatar_url || '',
        timestamp: report.created_at,
        created_at: report.created_at,
        content_type: report.content_type || '',
        reason: report.reason || '',
        severity: report.is_emergency ? 'high' : 'medium',
        content_id: report.content_id || '',
        message: `${report.reason}: ${report.description || ''}`,
        status: report.status || '',
        title: `Content Report`,
        description: report.description || 'No description provided',
        is_viewed: false,
        urgent: report.is_emergency || false
      }));
      
      // Transform flagged content to LiveAlert format
      const flaggedAlerts: LiveAlert[] = (flaggedData || []).map(flagged => ({
        id: flagged.id,
        type: "risk", // Changed from "flagged" to match LiveAlert type
        alert_type: "content",
        user_id: flagged.user_id || '',
        username: flagged.user?.username || 'Unknown',
        avatar_url: flagged.user?.avatar_url || '',
        timestamp: flagged.flagged_at,
        created_at: flagged.flagged_at,
        content_type: flagged.content_type || '',
        reason: flagged.reason || '',
        severity: flagged.severity as 'high' | 'medium' | 'low',
        content_id: flagged.content_id || '',
        message: flagged.reason || '',
        status: flagged.status || '',
        title: `Flagged ${flagged.content_type}`,
        description: flagged.notes || flagged.reason || '',
        is_viewed: false,
        urgent: flagged.severity === 'high'
      }));
      
      // Combine all alerts
      const allAlerts = [...reportAlerts, ...flaggedAlerts];
      
      // Sort by timestamp, newest first
      allAlerts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      
      setLiveAlerts(allAlerts);
      console.log(`Loaded ${allAlerts.length} alerts for ghost mode`);
      
    } catch (error) {
      console.error('Error refreshing alerts:', error);
    }
  }, [isGhostMode, supabase]);
  
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
    } else {
      setLiveAlerts([]);
    }
  }, [isGhostMode, refreshAlerts]);
  
  return { liveAlerts, refreshAlerts };
}
