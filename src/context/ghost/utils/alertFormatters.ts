
import { LiveAlert } from "@/types/alerts";
import { WithProfile } from "@/integrations/supabase/types/profile";

/**
 * Formats flagged content into LiveAlert format
 */
export const formatFlaggedContentAlert = (item: WithProfile<any>): LiveAlert => {
  // Extract username and avatar_url from profiles or use fallbacks
  const username = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).username || 'Unknown User'
    : 'Unknown User';
  
  const avatarUrl = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).avatar_url || ''
    : '';

  return {
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
    username: username,
    avatar_url: avatarUrl,
    title: `Flagged ${item.content_type}`,
    description: item.reason || '',
    is_viewed: false,
    message: item.reason || ''
  };
};

/**
 * Formats report alerts into LiveAlert format
 */
export const formatReportAlert = (item: WithProfile<any>): LiveAlert => {
  // Extract username and avatar_url from profiles or use fallbacks
  const username = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).username || 'Unknown User'
    : 'Unknown User';
  
  const avatarUrl = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).avatar_url || ''
    : '';

  return {
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
    username: username,
    avatar_url: avatarUrl,
    title: `${item.is_emergency ? 'URGENT: ' : ''}Report on ${item.content_type}`,
    description: item.description || item.reason || '',
    is_viewed: false,
    message: item.description || item.reason || ''
  };
};

/**
 * Formats DMCA alerts into LiveAlert format
 */
export const formatDmcaAlert = (item: WithProfile<any>): LiveAlert => {
  // Extract username and avatar_url from profiles or use fallbacks
  const username = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).username || 'Unknown User'
    : 'Unknown User';
  
  const avatarUrl = item.profiles && typeof item.profiles === 'object' && item.profiles !== null
    ? (item.profiles as any).avatar_url || ''
    : '';

  return {
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
    username: username,
    avatar_url: avatarUrl,
    title: `DMCA Takedown Request`,
    description: `Copyright claim on ${item.content_type}`,
    is_viewed: false,
    message: `Copyright claim on ${item.content_type}`
  };
};

/**
 * Sorts alerts by severity and timestamp
 */
export const sortAlertsBySeverityAndTime = (alerts: LiveAlert[]): LiveAlert[] => {
  return alerts.sort((a, b) => {
    // First sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - 
                         severityOrder[b.severity as keyof typeof severityOrder];
    
    if (severityDiff !== 0) return severityDiff;
    
    // Then sort by timestamp (most recent first)
    return new Date(b.timestamp || b.created_at).getTime() - 
          new Date(a.timestamp || a.created_at).getTime();
  });
};
