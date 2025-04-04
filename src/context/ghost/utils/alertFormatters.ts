
import { LiveAlert } from '@/types/alerts';

// Format flagged content as an alert
export const formatFlaggedContentAsAlert = (content: any): LiveAlert => {
  const severity = getSeverityFromReason(content.reason);
  
  return {
    id: content.id,
    type: 'flagged_content',
    alert_type: 'flagged_content',
    user_id: content.user_id || content.content_owner_id,
    username: content.username || 'Unknown User',
    avatar_url: content.avatar_url || null,
    timestamp: content.flagged_at,
    created_at: content.flagged_at,
    content_type: content.content_type,
    reason: content.reason,
    severity: severity,
    content_id: content.content_id,
    message: `Content flagged: ${content.reason}`,
    status: content.status || 'pending',
    title: `Flagged ${content.content_type}`,
    description: content.notes,
    is_viewed: false,
    urgent: severity === 'high'
  };
};

// Format a report as an alert
export const formatReportAsAlert = (report: any): LiveAlert => {
  const severity = report.is_emergency ? 'high' : 'medium';
  
  return {
    id: report.id,
    type: 'report',
    alert_type: 'report',
    user_id: report.reported_id,
    username: report.reported_username || 'Reported User',
    avatar_url: report.avatar_url,
    timestamp: report.created_at,
    created_at: report.created_at,
    content_type: report.content_type,
    reason: report.reason,
    severity: severity,
    content_id: report.content_id,
    message: `Report: ${report.reason}`,
    status: report.status || 'pending',
    title: `User Report`,
    description: report.description,
    is_viewed: false,
    urgent: report.is_emergency
  };
};

// Format a DMCA request as an alert
export const formatDMCAAsAlert = (dmca: any): LiveAlert => {
  // Determine severity based on any available information
  const severity = dmca.status === 'urgent' ? 'high' : 'medium';
  
  return {
    id: dmca.id,
    type: 'dmca',
    alert_type: 'dmca',
    user_id: dmca.content_owner_id || dmca.user_id,
    username: dmca.content_owner_username || 'Content Owner',
    avatar_url: dmca.avatar_url,
    timestamp: dmca.created_at,
    created_at: dmca.created_at,
    content_type: dmca.content_type,
    reason: 'Copyright Infringement',
    severity: severity,
    content_id: dmca.content_id,
    message: `DMCA Takedown Request`,
    status: dmca.status || 'pending',
    title: `Copyright Claim`,
    description: dmca.description || dmca.notes,
    is_viewed: false,
    urgent: severity === 'high'
  };
};

// Helper function to determine severity from reason
const getSeverityFromReason = (reason: string): 'high' | 'medium' | 'low' => {
  const highSeverityKeywords = [
    'underage', 'minor', 'child', 'illegal', 'violence', 
    'abuse', 'harm', 'threat', 'urgent', 'emergency'
  ];
  
  const mediumSeverityKeywords = [
    'harassment', 'hate', 'spam', 'scam', 'impersonation', 
    'copyright', 'report'
  ];
  
  const reasonLower = reason.toLowerCase();
  
  if (highSeverityKeywords.some(keyword => reasonLower.includes(keyword))) {
    return 'high';
  }
  
  if (mediumSeverityKeywords.some(keyword => reasonLower.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
};

// Sort alerts by severity and time
export const sortAlertsBySeverityAndTime = (alerts: LiveAlert[]): LiveAlert[] => {
  const severityRank = {
    'high': 0,
    'medium': 1,
    'low': 2
  };
  
  return [...alerts].sort((a, b) => {
    // First sort by severity
    const severityDiff = severityRank[a.severity] - severityRank[b.severity];
    if (severityDiff !== 0) return severityDiff;
    
    // Then sort by urgency
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    
    // Then sort by created_at (most recent first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
