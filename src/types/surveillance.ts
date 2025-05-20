
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content';

// Define LiveSession properties
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
  // Additional properties needed
  created_at?: string;
  is_active?: boolean;
  media_url?: string[];
  content?: string;
  content_type?: string;
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
  status?: 'pending' | 'reviewed' | 'removed';
}

export type ContentType = 'image' | 'video' | 'text' | 'audio';

export interface MediaSource {
  url?: string;
  type: string;
  media_type?: string;
}
