
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
  
  // Additional properties for backward compatibility
  user_id?: string; // Backward compatibility for userId
  content_id?: string; // Backward compatibility for contentId
  timestamp?: string; // Backward compatibility for created_at
  alert_type?: 'violation' | 'risk' | 'information'; // Specific alert type
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
    user_id: alert.user_id || alert.userId || '', // For backward compatibility
    username: alert.username || 'System',
    avatar_url: alert.avatar_url || null,
    created_at: alert.created_at || alert.timestamp || new Date().toISOString(),
    timestamp: alert.timestamp || alert.created_at || new Date().toISOString(), // For backward compatibility
    contentId: alert.contentId || alert.content_id || '',
    content_id: alert.content_id || alert.contentId || '', // For backward compatibility
    content_type: alert.content_type || 'system',
    reason: alert.reason || alert.description || '',
    title: alert.title || 'System Alert',
    description: alert.description || '',
    isRead: alert.isRead || false,
    source: alert.source || 'system',
    alert_type: alert.alert_type || 'information'
  };
}
