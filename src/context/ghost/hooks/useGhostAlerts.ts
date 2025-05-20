
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveAlert } from '@/types/surveillance';  // Import from surveillance types

export function useGhostAlerts(userId: string | null) {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAlerts = useCallback(async () => {
    if (!userId) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch reports where the user is reported
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(username, avatar_url)')
        .eq('reported_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (reportsError) throw reportsError;
      
      // Fetch flagged content from the user
      const { data: flaggedContent, error: flaggedError } = await supabase
        .from('flagged_content')
        .select('*')
        .eq('user_id', userId)
        .order('flagged_at', { ascending: false })
        .limit(10);
        
      if (flaggedError) throw flaggedError;
      
      // Transform data to LiveAlert format
      const reportAlerts: LiveAlert[] = (reports || []).map(report => ({
        id: report.id,
        type: 'violation',
        alert_type: 'violation',
        user_id: report.reported_id,
        userId: report.reported_id,
        username: report.reporter?.username || 'Unknown',
        avatar_url: report.reporter?.avatar_url || '',
        timestamp: report.created_at,
        created_at: report.created_at,
        content_type: report.content_type || '',
        reason: report.reason || '',
        severity: 'high',
        contentId: report.content_id || '',
        content_id: report.content_id || '',
        title: `Report: ${report.reason}`,
        description: report.description || 'No description provided'
      }));
      
      const flaggedAlerts: LiveAlert[] = (flaggedContent || []).map(item => ({
        id: item.id,
        type: 'risk',
        alert_type: 'risk',
        user_id: item.user_id || '',
        userId: item.user_id || '',
        username: 'System',
        avatar_url: '',
        timestamp: item.flagged_at,
        created_at: item.flagged_at,
        content_type: item.content_type || '',
        reason: item.reason || '',
        severity: 'medium',
        contentId: item.content_id || '',
        content_id: item.content_id || '',
        title: `Flagged: ${item.content_type}`,
        description: item.notes || item.reason || ''
      }));
      
      // Combine and sort alerts
      const combinedAlerts = [...reportAlerts, ...flaggedAlerts];
      combinedAlerts.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAlerts(combinedAlerts);
    } catch (error) {
      console.error('Error fetching ghost alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  
  return {
    alerts,
    isLoading,
    refreshAlerts: fetchAlerts
  };
}
