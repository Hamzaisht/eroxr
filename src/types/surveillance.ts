
// Re-export types from declaration file
import type {
  SurveillanceTab,
  LiveSessionType,
  ContentType,
  ModerationAction,
  LiveSession,
  SurveillanceContentItem,
  MediaSource
} from './surveillance.d';

export type {
  SurveillanceTab,
  LiveSessionType,
  ContentType,
  ModerationAction,
  LiveSession,
  SurveillanceContentItem,
  MediaSource
};

// LiveAlert definition 
export interface LiveAlert {
  id: string;
  alert_type: 'user_action' | 'system_event' | 'security_alert';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  message: string;
  details?: Record<string, any>;
  user_id?: string;
  userId?: string;
  username?: string;
  contentId?: string;
  content_id?: string;
  isRead?: boolean;
  created_at?: string;
  session?: LiveSession;
}

export interface AlertFilter {
  priority?: 'low' | 'medium' | 'high';
  read?: boolean;
  alert_type?: 'user_action' | 'system_event' | 'security_alert';
  fromDate?: Date;
  toDate?: Date;
}
