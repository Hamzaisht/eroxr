
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
  user_id?: string; // For backward compatibility
  username?: string;
  contentId?: string;
  content_id?: string; // For backward compatibility
  isRead: boolean;
  alert_type: 'violation' | 'risk' | 'information';
  session?: LiveSession;
  source?: any; // For source information
  avatar_url?: string; // For user avatar
}
