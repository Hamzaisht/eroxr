
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content' | 'user' | string;

export type ContentType = 'post' | 'story' | 'video' | 'audio' | 'message' | 'profile' | 'comment' | 'image' | 'text';

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
  type: LiveSessionType;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string;
  title?: string;
  description?: string;
  status: string;
  is_active: boolean;
  content?: string;
  media_url?: string | string[];
  video_url?: string;
  created_at?: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  is_paused?: boolean;
  viewer_count?: number;
  participants?: number;
  sender_username?: string;
  location?: string;
  tags?: string[];
  thumbnail_url?: string;
  ghost_mode?: boolean;
  last_active_at?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

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
