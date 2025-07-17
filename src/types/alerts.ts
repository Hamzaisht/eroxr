
export interface LiveAlert {
  id: string;
  type: 'violation' | 'risk' | 'information' | 'security' | 'system';
  alert_type?: 'violation' | 'risk' | 'information';
  user_id: string;
  userId: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  created_at: string;
  content_type?: string;
  reason?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  contentId?: string;
  content_id?: string;
  title: string;
  description: string;
  isRead: boolean;
  requiresAction?: boolean;
  session?: {
    id: string;
    type: string;
    status: string;
    user_id: string;
    started_at: string;
  };
}
