
// Define the enum values for surveillance tabs
export enum SurveillanceTab {
  STREAMS = 'streams',
  MESSAGES = 'messages',
  CALLS = 'calls',
  ALERTS = 'alerts',
  REPORTS = 'reports',
  CONTENT = 'content'
}

// Define the enum values for session types
export enum SessionType {
  STREAM = 'stream',
  CALL = 'call',
  CHAT = 'chat',
  BODYCONTACT = 'bodycontact',
  USER = 'user',
  CONTENT = 'content'
}

// Define the enum values for session status
export enum SessionStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  ENDED = 'ended',
  FLAGGED = 'flagged',
  PAUSED = 'paused'
}

// Define the enum values for content types
export enum ContentType {
  POST = 'post',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  TEXT = 'text',
  DOCUMENT = 'document',
  USER = 'user',
  MESSAGE = 'message',
  STREAM = 'stream'
}

// Define the allowed moderation actions
export type ModerationAction = 
  | 'view' 
  | 'flag' 
  | 'warn' 
  | 'ban' 
  | 'delete' 
  | 'edit' 
  | 'shadowban' 
  | 'force_delete' 
  | 'restore'
  | 'pause'
  | 'unpause';

export interface LiveSession {
  id: string;
  user_id: string;
  username?: string;
  type: SessionType | string;
  title?: string;
  description?: string;
  started_at: string;
  status: 'active' | 'idle' | 'ended';
  metadata?: Record<string, any>;
  participant_count?: number;
  content_id?: string;
  room_id?: string;
  
  // Additional properties used in components
  avatar_url?: string;
  content?: string;
  created_at?: string;
  media_url?: string | string[];
  video_url?: string;
  content_type?: string;
  is_active?: boolean;
  is_paused?: boolean;
  viewer_count?: number;
  viewers_count?: number;
  sender_username?: string;
  recipient_username?: string;
  recipient_id?: string;
  message_type?: string;
  participants?: number;
  recipient_avatar?: string;
  session?: any;
}

// Define the media source interface
export interface MediaSource {
  url: string;
  type: string;
  creator_id?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  content_type?: string;
}

// Define the surveillance content item interface
export interface SurveillanceContentItem {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  created_at: string;
  user_id: string;
  creator_username?: string;
  creator_avatar_url?: string;
  creator_avatar?: string;
  username?: string;
  avatar_url?: string;
  media_url?: string[];
  video_url?: string;
  content_type?: string;
  type: string;
  status?: string;
  flagged?: boolean;
  reason?: string;
  severity?: string;
  is_active?: boolean;
}
