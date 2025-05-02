
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content' | 'user' | string;

export type ContentType = 'post' | 'story' | 'video' | 'audio' | 'message' | 'profile' | 'comment';

export type ModerationAction = 
  | 'view'
  | 'edit'
  | 'flag'
  | 'warn'
  | 'pause'
  | 'unpause'
  | 'shadowban'
  | 'ban'
  | 'delete'
  | 'force_delete'
  | 'restore';

export interface LiveSession {
  id: string;
  user_id: string;
  username: string;
  type: LiveSessionType;
  created_at?: string;
  last_active?: string;
  ip_address?: string;
  device_info?: any;
  status?: string;
  avatar_url?: string;
  // Adding missing properties from the error messages
  title?: string;
  description?: string;
  content?: string;
  started_at?: string;
  is_active?: boolean;
  media_url?: string | string[];
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  is_paused?: boolean;
}

export interface LiveAlert {
  id: string;
  type: string;
  alert_type?: 'violation' | 'risk' | 'information';
  user_id: string;
  username: string;
  timestamp: string | number;
  created_at?: string;
  content_type?: string;
  reason?: string;
  severity: 'high' | 'medium' | 'low';
  content_id?: string;
  message: string;
  status?: string;
  title?: string;
  description?: string;
  is_viewed?: boolean;
  urgent?: boolean;
  session?: LiveSession | null;
}

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  user_id: string;
  creator_id: string;
  creator_username: string;
  creator_avatar_url?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  title: string;
  description: string;
  content?: string;
  media_url: string[];
  tags?: string[];
  visibility: string;
  status?: string;
  views?: number;
  likes?: number;
  comments?: number;
  location?: string;
}
