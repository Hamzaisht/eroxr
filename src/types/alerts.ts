
import { LiveSession } from './surveillance';

export interface LiveAlert {
  id: string;
  type: 'violation' | 'risk' | 'information' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  created_at: string;
  userId: string;
  username?: string;
  contentId?: string;
  isRead: boolean;
  alert_type: 'violation' | 'risk' | 'information';
  session?: LiveSession;
}
