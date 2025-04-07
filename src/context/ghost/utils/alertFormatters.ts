
import { LiveAlert } from "@/types/alerts";

/**
 * Formats flagged content data into a standardized alert format
 */
export const formatFlaggedContentAsAlert = (content: any): Omit<LiveAlert, "alert_type"> => {
  return {
    id: content.id,
    type: 'violation',
    user_id: content.user_id,
    username: content.user?.username || 'Unknown user',
    avatar_url: content.user?.avatar_url || null,
    timestamp: content.flagged_at,
    created_at: content.flagged_at,
    title: `Flagged ${content.content_type}`,
    description: content.reason || 'Content was flagged',
    content_type: content.content_type,
    content_id: content.content_id,
    reason: content.reason,
    severity: content.severity || 'medium',
    message: `${content.content_type} was flagged for ${content.reason}`,
    status: content.status || 'pending',
    is_viewed: false,
    urgent: content.severity === 'high',
  };
};

/**
 * Formats user report data into a standardized alert format
 */
export const formatReportAsAlert = (report: any): Omit<LiveAlert, "alert_type"> => {
  return {
    id: report.id,
    type: 'risk',
    user_id: report.reported_id,
    username: report.reported?.username || 'Unknown user',
    avatar_url: report.reported?.avatar_url || null,
    timestamp: report.created_at,
    created_at: report.created_at,
    title: `Report: ${report.reason || 'Violation'}`,
    description: report.description || `${report.reason} reported by user`,
    content_type: report.content_type || 'user',
    content_id: report.content_id || report.reported_id,
    reason: report.reason,
    severity: report.is_emergency ? 'high' : 'medium',
    message: report.description || `${report.reported?.username || 'User'} was reported for ${report.reason}`,
    status: report.status || 'pending',
    is_viewed: false,
    urgent: report.is_emergency,
    reporter: {
      id: report.reporter_id,
      username: report.reporter?.username,
      avatar_url: report.reporter?.avatar_url
    }
  };
};
