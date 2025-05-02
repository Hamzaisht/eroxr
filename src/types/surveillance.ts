
// Define available types of surveillance sessions
export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content' | 'user' | string;

// Define surveillance tab types
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

// Define content type for surveillance content items
export type ContentType = 'post' | 'story' | 'video' | 'audio' | 'message' | 'profile' | 'comment';

// Define moderation actions
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

// Main LiveSession interface for various session types
export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  username?: string;
  avatar_url?: string;
  started_at: string;
  title?: string;
  description?: string;
  status: string;
  is_active: boolean;
  session_data?: any;
  
  // Additional properties needed by components
  content?: string;
  media_url?: string | string[];
  content_type?: string;
  created_at?: string;
  is_paused?: boolean;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string;
  message_type?: string;
  
  // For bodycontact sessions
  location?: string;
  last_active?: string;
  updated_at?: string;
  
  // For video content
  video_url?: string;
  video_thumbnail_url?: string;
  duration?: number;
}

// Interface for content items in surveillance
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
  is_paused?: boolean;
}
