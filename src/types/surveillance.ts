
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content';

// Define LiveSession properties with all required properties
export interface LiveSession {
  id: string;
  username?: string;
  avatar_url?: string;
  user_id: string;
  type: LiveSessionType;
  status: 'active' | 'inactive';
  room_id?: string;
  title?: string;
  description?: string;
  viewer_count?: number;
  started_at: string;
  thumbnail_url?: string;
  
  // Add missing properties that were referenced in components
  created_at?: string;
  is_active?: boolean;
  is_paused?: boolean;
  media_url?: string[] | string;
  video_url?: string;
  content?: string;
  content_type?: string;
  message_type?: string;
  recipient_username?: string;
  recipient_id?: string;
  sender_username?: string;
  participants?: number;
  location?: string;
  tags?: string[];
  visibility?: string;
}

export interface SurveillanceContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  creator_id: string;
  creator_username?: string;
  creator_avatar?: string;
  created_at: string;
  flagged: boolean;
  reason?: string;
  media_url?: string[];
  video_url?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'reviewed' | 'removed' | 'flagged';
  
  // Add missing properties that were referenced in components
  user_id?: string;
  username?: string;
  avatar_url?: string;
  content?: string;
  content_type?: string;
  creator_avatar_url?: string;
  visibility?: string;
}

export type ContentType = 'image' | 'video' | 'text' | 'audio';

export interface MediaSource {
  url?: string;
  type: string;
  media_type?: string;
}

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
