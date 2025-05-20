
import { LiveAlert } from '@/types/surveillance';

export function formatSystemEventAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  details: any
): LiveAlert {
  const baseAlert = {
    id,
    timestamp,
    priority,
    read: false,
    details,
  };

  return {
    ...baseAlert,
    alert_type: 'system_event',
    message: details?.message || 'System event detected',
    userId: details?.userId || '',
    username: details?.username || 'System',
  } as LiveAlert;
}

export function formatSecurityAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  details: any
): LiveAlert {
  const baseAlert = {
    id,
    timestamp,
    priority,
    read: false,
    details,
  };

  return {
    ...baseAlert,
    alert_type: 'security_alert',
    message: details?.message || 'Security alert detected',
    userId: details?.userId || '',
    contentId: details?.contentId || '',
    username: details?.username || 'Security System',
  } as LiveAlert;
}

export function formatUserActionAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  userId: string,
  username: string,
  details: any
): LiveAlert {
  return {
    id,
    alert_type: 'user_action',
    timestamp,
    priority,
    read: false,
    message: details?.message || `Action by ${username}`,
    details,
    userId,
    username,
    contentId: details?.contentId || '',
  };
}

/**
 * Format flagged content as an alert
 * @param content Flagged content from database
 * @returns Formatted LiveAlert
 */
export function formatFlaggedContentAsAlert(content: any): LiveAlert {
  return {
    id: content.id,
    alert_type: 'security_alert',
    timestamp: content.created_at,
    priority: content.severity || 'medium',
    read: false,
    message: `Flagged content: ${content.reason || 'Inappropriate content'}`,
    details: content,
    userId: content.user_id,
    username: content.user?.username || 'Unknown User',
    contentId: content.content_id,
  };
}

/**
 * Format user report as an alert
 * @param report Report data from database
 * @returns Formatted LiveAlert
 */
export function formatReportAsAlert(report: any): LiveAlert {
  return {
    id: report.id,
    alert_type: 'user_action',
    timestamp: report.created_at,
    priority: report.severity || 'medium',
    read: false,
    message: `Report: ${report.reason || 'User reported'}`,
    details: report,
    userId: report.reported_id,
    username: report.reported?.username || 'Unknown User',
    contentId: report.content_id,
  };
}
