import { useEffect, useState } from "react";
import { LiveAlert } from "@/types/alerts";
import { supabase } from "@/integrations/supabase/client";
import { formatFlaggedContentAsAlert, formatReportAsAlert } from "@/context/ghost/utils/alertFormatters";

// Helper to map from raw alerts to typed alerts
const mapToLiveAlerts = (alerts: Partial<LiveAlert>[]): LiveAlert[] => {
  return alerts.map(alert => {
    // Ensure each alert has all required properties
    return {
      id: alert.id || String(Math.random()),
      type: alert.type || 'system',
      severity: alert.severity || 'medium',
      title: alert.title || 'Alert',
      description: alert.description || '',
      timestamp: alert.timestamp || new Date().toISOString(),
      isRead: alert.isRead || false,
      userId: alert.userId || alert.user_id,
      contentId: alert.contentId || alert.content_id
    };
  });
};

// Mock alerts for development/testing purposes
const mockAlerts: Partial<LiveAlert>[] = [
  {
    id: "1",
    type: 'security',
    userId: "user-123",
    username: "suspicious_user",
    avatar_url: "https://i.pravatar.cc/150?u=1",
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    content_type: "post", 
    reason: "Inappropriate content",
    severity: "high",
    contentId: "post-456",
    title: "Content Violation",
    description: "Post with inappropriate content detected",
    isRead: false,
    requiresAction: true
  },
  {
    id: "2",
    type: 'system',
    userId: "user-234",
    username: "potential_bot",
    avatar_url: "https://i.pravatar.cc/150?u=2",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    content_type: "message",
    reason: "Spam behavior",
    severity: "medium",
    contentId: "message-789",
    title: "Potential Spam",
    description: "Multiple identical messages sent in short timeframe",
    isRead: false,
    requiresAction: false
  },
];

export const useAlertProcessor = () => {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  // Fetch real alerts from Supabase
  const fetchRealAlerts = async () => {
    try {
      // Fetch flagged content
      const { data: flaggedContent } = await supabase
        .from('flagged_content')
        .select('*, user:user_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch user reports
      const { data: reports } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(username, avatar_url), reported:reported_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Format alerts
      const formattedAlerts = [
        ...(flaggedContent || []).map((content: any) => formatSystemAlertToLiveAlert({
          ...formatFlaggedContentAsAlert(content),
          type: 'system'
        })),
        ...(reports || []).map((report: any) => formatSystemAlertToLiveAlert({
          ...formatReportAsAlert(report),
          type: 'security'
        }))
      ];

      // Sort by severity
      formattedAlerts.sort((a, b) => {
        const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };
        return (severityRank[a.severity] || 999) - (severityRank[b.severity] || 999);
      });

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Load alerts based on environment
  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      fetchRealAlerts();
    } else {
      // In development, use mock data
      setAlerts(mapToLiveAlerts(mockAlerts));
    }
  }, []);

  return { alerts };
};
