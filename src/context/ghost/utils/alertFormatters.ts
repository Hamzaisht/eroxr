
import { LiveAlert } from "@/types/alerts";

// Add missing utility to handle the potential "critical" severity
const mapSeverity = (severity: string): 'low' | 'medium' | 'high' | 'critical' => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'low':
      return 'low';
    case 'medium':
    default:
      return 'medium';
  }
};

export const formatFlaggedContentAsAlert = (content: any) => {
  return {
    id: content.id,
    type: 'violation',
    alert_type: 'violation',
    user_id: content.user_id || '',
    userId: content.user_id || '',
    username: content.user?.username || 'Unknown',
    avatar_url: content.user?.avatar_url,
    timestamp: content.flagged_at || content.created_at,
    created_at: content.flagged_at || content.created_at,
    content_type: content.content_type || '',
    reason: content.reason || '',
    severity: mapSeverity(content.severity || 'medium'),
    contentId: content.content_id || '',
    content_id: content.content_id || '',
    title: `Flagged ${content.content_type || 'Content'}`,
    description: content.details || content.notes || content.reason || '',
    isRead: !!content.is_read,
  };
};

export const formatReportAsAlert = (report: any) => {
  return {
    id: report.id,
    type: 'violation',
    alert_type: 'violation',
    user_id: report.reported_id || '',
    userId: report.reported_id || '',
    username: report.reported?.username || 'Unknown User',
    avatar_url: report.reported?.avatar_url,
    timestamp: report.created_at,
    created_at: report.created_at,
    content_type: report.content_type || '',
    reason: report.reason || '',
    severity: report.is_emergency ? 'high' : mapSeverity(report.severity || 'medium'),
    contentId: report.content_id || '',
    content_id: report.content_id || '',
    title: `Content Report`,
    description: report.description || 'No description provided',
    isRead: !!report.is_read,
    requiresAction: report.is_emergency || false
  };
};

export const formatSystemAlertToLiveAlert = (alert: any): LiveAlert => {
  return {
    ...alert,
    user_id: alert.user_id || alert.userId || '',
    userId: alert.userId || alert.user_id || '',
    content_id: alert.content_id || alert.contentId || '',
    contentId: alert.contentId || alert.content_id || '',
    isRead: !!alert.isRead,
    alert_type: alert.alert_type || (alert.type === 'violation' || alert.type === 'risk' ? alert.type : 'information')
  } as LiveAlert;
};
