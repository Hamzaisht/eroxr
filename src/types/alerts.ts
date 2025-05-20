
export interface LiveAlert {
  id: string;
  type: 'content' | 'security' | 'system' | 'user' | 'violation' | 'risk' | 'information';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  contentId?: string;
  source?: string;
  requiresAction?: boolean;
  metadata?: Record<string, any>;
  session?: any;
  created_at?: string;
  
  // Additional fields allowed for compatibility
  username?: string;
  avatar_url?: string;
  content_type?: string;
  reason?: string;
  status?: string;
  alert_type?: 'violation' | 'risk' | 'information';
  user_id?: string; // For backward compatibility
  content_id?: string; // For backward compatibility
}
