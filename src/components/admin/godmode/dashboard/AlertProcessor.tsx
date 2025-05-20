
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
      isRead: alert.isRead || false
    };
  });
};

// Mock alerts for development/testing purposes
const mockAlerts: Partial<LiveAlert>[] = [
  {
    id: "1",
    // Using supported type for LiveAlert
    type: 'security',
    user_id: "user-123",
    username: "suspicious_user",
    avatar_url: "https://i.pravatar.cc/150?u=1",
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    content_type: "post",
    reason: "Inappropriate content",
    severity: "high",
    content_id: "post-456",
    message: "This post contains inappropriate images",
    status: "pending",
    title: "Content Violation",
    description: "Post with inappropriate content detected",
    is_viewed: false,
    urgent: true
  },
  {
    id: "2",
    // Using supported type for LiveAlert
    type: 'system',
    user_id: "user-234",
    username: "potential_bot",
    avatar_url: "https://i.pravatar.cc/150?u=2",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    content_type: "message",
    reason: "Spam behavior",
    severity: "medium",
    content_id: "message-789",
    message: "User sending identical messages to multiple profiles",
    status: "investigating",
    title: "Potential Spam",
    description: "Multiple identical messages sent in short timeframe",
    is_viewed: false,
    urgent: false
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
      const formattedAlerts: LiveAlert[] = [
        ...(flaggedContent || []).map((content: any) => {
          const baseAlert = formatFlaggedContentAsAlert(content);
          return {
            ...baseAlert,
            // Use valid type values for LiveAlert
            type: 'system',
            isRead: false
          } as LiveAlert;
        }),
        ...(reports || []).map((report: any) => {
          const baseAlert = formatReportAsAlert(report);
          return {
            ...baseAlert,
            // Use valid type values for LiveAlert
            type: 'security',
            isRead: false
          } as LiveAlert;
        })
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
