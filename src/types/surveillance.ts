
// Re-export types from declaration file
import type {
  SurveillanceTab,
  LiveSessionType,
  ContentType,
  ModerationAction
} from './surveillance.d';

export type {
  SurveillanceTab,
  LiveSessionType,
  ContentType,
  ModerationAction
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
}

export interface AlertFilter {
  priority?: 'low' | 'medium' | 'high';
  read?: boolean;
  alert_type?: 'user_action' | 'system_event' | 'security_alert';
  fromDate?: Date;
  toDate?: Date;
}

// LiveSession definition with all required fields
export interface LiveSession {
  id: string;
  admin_id?: string;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  status: string;
  is_active: boolean;
  type: LiveSessionType;
  title?: string;
  description?: string;
  content?: string;
  media_url?: string | string[];
  video_url?: string;
  created_at?: string;
  started_at: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  is_paused?: boolean;
  viewer_count?: number;
  last_active_at?: string;
  ghost_mode?: boolean;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

// SurveillanceContentItem definition
export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  user_id: string;
  creator_id: string;
  creator_username: string;
  creator_avatar_url?: string;
  creator_avatar?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  title: string;
  description: string;
  content?: string;
  media_url: string[];
  video_url?: string;
  tags?: string[];
  visibility: string;
  status?: string;
  views?: number;
  likes?: number;
  comments?: number;
  location?: string;
  flagged?: boolean;
  reason?: string;
  severity?: string;
  type?: string;
}

// Update MediaSource to extend the global MediaSource with relevant properties
export interface MediaSource {
  url: string;
  type: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  creator_id?: string;
  media_type?: string;
  thumbnail?: string;
  poster?: string;
  thumbnail_url?: string;
  contentCategory?: string;
}
