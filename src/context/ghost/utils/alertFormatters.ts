
import { LiveAlert } from '@/types/alerts';

/**
 * Format flagged content as a LiveAlert
 */
export function formatFlaggedContentAsAlert(flaggedContent: any): Partial<LiveAlert> {
  return {
    id: flaggedContent.id,
    type: 'violation',
    severity: flaggedContent.severity || 'medium',
    title: flaggedContent.reason || 'Content Flagged',
    description: flaggedContent.notes || 'No additional details',
    timestamp: flaggedContent.flagged_at,
    created_at: flaggedContent.flagged_at,
    userId: flaggedContent.user_id,
    username: flaggedContent.user?.username,
    contentId: flaggedContent.content_id,
    isRead: false,
    alert_type: 'violation'
  };
}

/**
 * Format a report as a LiveAlert
 */
export function formatReportAsAlert(report: any): Partial<LiveAlert> {
  return {
    id: report.id,
    type: 'risk',
    severity: report.is_emergency ? 'critical' : 'medium',
    title: `Report: ${report.reason}`,
    description: report.description || 'No additional details',
    timestamp: report.created_at,
    created_at: report.created_at,
    userId: report.reported_id,
    username: report.reported?.username,
    contentId: report.content_id,
    isRead: false,
    alert_type: 'risk'
  };
}

/**
 * Map priority to severity level
 */
export function mapPriorityToSeverity(priority: string): 'low' | 'medium' | 'high' | 'critical' {
  switch (priority) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
}

/**
 * Format system alert to LiveAlert
 */
export function formatSystemAlertToLiveAlert(alert: any): LiveAlert {
  return {
    id: alert.id || String(Math.random()),
    type: alert.type || 'system',
    severity: mapPriorityToSeverity(alert.priority || 'medium'),
    title: alert.message || alert.title || 'System Alert',
    description: alert.details || alert.description || '',
    timestamp: alert.timestamp || new Date().toISOString(),
    created_at: alert.created_at || new Date().toISOString(),
    userId: alert.userId || alert.user_id || '',
    username: alert.username || 'System',
    contentId: alert.contentId || alert.content_id || '',
    isRead: alert.isRead || alert.read || false,
    alert_type: alert.alert_type || 'information',
    source: alert.source || null,
    avatar_url: alert.avatar_url || null
  };
}
