
/**
 * LiveAlert interface for system alerts and notifications
 */
export interface LiveAlert {
  id: string;
  type: string;
  severity: string;
  userId: string;
  username: string;
  avatar_url?: string | null;
  created_at: string;
  contentId: string;
  content_type: string;
  reason: string;
  title?: string;
  description?: string;
  isRead?: boolean;
  source?: string;
}

/**
 * Helper function to format system alerts to LiveAlert format
 */
export function formatSystemAlertToLiveAlert(alert: any): LiveAlert {
  return {
    id: alert.id || `alert-${Date.now()}`,
    type: alert.type || 'system',
    severity: alert.severity || 'medium',
    userId: alert.userId || alert.user_id || '',
    username: alert.username || 'System',
    avatar_url: alert.avatar_url || null,
    created_at: alert.timestamp || alert.created_at || new Date().toISOString(),
    contentId: alert.contentId || alert.content_id || '',
    content_type: alert.content_type || 'system',
    reason: alert.reason || alert.description || '',
    title: alert.title || 'System Alert',
    description: alert.description || '',
    isRead: alert.isRead || false,
    source: alert.source || 'system'
  };
}
