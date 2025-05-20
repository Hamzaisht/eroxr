
// Type definitions for SessionType, ContentType, and ModerationAction
export type SessionStatus = 'active' | 'inactive' | 'pending' | 'completed' | 'live' | 'flagged';
export type SessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'user' | 'content';
export type ContentType = 'image' | 'video' | 'text' | 'audio' | 'post' | 'story' | 'message' | 'profile' | 'comment';
export type ModerationAction = 
  | 'warn' 
  | 'suspend' 
  | 'ban' 
  | 'delete' 
  | 'restrict' 
  | 'none' 
  | 'flag' 
  | 'view'
  | 'edit'
  | 'shadowban'
  | 'force_delete'
  | 'restore'
  | 'pause'
  | 'unpause';

export type SurveillanceTab = 
  | 'all' 
  | 'streams' 
  | 'chats' 
  | 'calls' 
  | 'dating' 
  | 'bodycontact'
  | 'content'
  | 'earnings'
  | 'alerts';

export interface MediaSource {
  url: string;
  type: string;
  thumbnail?: string;
  media_url?: string | string[];
  video_url?: string;
  media_type?: string;
  content_type?: string;
  thumbnail_url?: string;
  poster?: string;
}

export interface LiveSession {
  id: string;
  type: SessionType;
  user_id: string;
  username?: string;
  status: SessionStatus;
  avatar_url?: string;
  title?: string;
  description?: string;
  content?: string;
  started_at: string;
  created_at?: string;
  is_active: boolean;
  is_paused?: boolean;
  media_url?: string[] | string;
  video_url?: string;
  content_type?: string;
  thumbnail_url?: string;
  viewer_count?: number;
  participants?: number;
  location?: string;
  tags?: string[];
  sender_username?: string;
  recipient_username?: string;
  message_type?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
  ghost_mode?: boolean;
  last_active_at?: string;
}

export interface SurveillanceContentItem {
  id: string;
  type?: ContentType;
  title: string;
  description: string;
  content?: string;
  content_type: string;
  creator_id: string;
  creator_username: string;
  creator_avatar: string;
  creator_avatar_url?: string;
  username?: string;
  avatar_url?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  flagged: boolean;
  reason?: string;
  media_url: string[];
  video_url?: string;
  severity: string;
  status: string;
  visibility: string;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  location?: string;
}
