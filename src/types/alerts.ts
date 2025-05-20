
export interface LiveAlert {
  id: string;
  type: 'violation' | 'risk' | 'information';
  alert_type: 'violation' | 'risk' | 'information';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  created_at: string;
  userId: string;
  username: string;
  contentId: string;
  isRead: boolean;
  content_type?: string;
  reason?: string;
  user_id?: string;
  content_id?: string;
  session?: any;
}
