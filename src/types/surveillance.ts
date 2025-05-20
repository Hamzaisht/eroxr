
/**
 * Session type enum for different types of sessions
 */
export enum SessionType {
  STREAM = 'stream',
  CALL = 'call',
  CHAT = 'chat',
  BODYCONTACT = 'bodycontact',
  CONTENT = 'content'
}

/**
 * Session status enum for different states of sessions
 */
export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  FLAGGED = 'flagged',
  LIVE = 'live',
  OFFLINE = 'offline'
}

/**
 * Content type enum for different types of content
 */
export enum ContentType {
  POST = 'post',
  STORY = 'story',
  VIDEO = 'video',
  AUDIO = 'audio',
  MESSAGE = 'message',
  PROFILE = 'profile',
  COMMENT = 'comment',
  IMAGE = 'image',
  TEXT = 'text'
}

/**
 * Moderation action types that can be performed
 * Using string literal union type for better compatibility with component usage
 */
export type ModerationAction =
  | 'approve' 
  | 'reject' 
  | 'flag' 
  | 'ban' 
  | 'warning'
  | 'delete'
  | 'edit'
  | 'hide'
  | 'restrict'
  | 'view'
  | 'warn'
  | 'shadowban'
  | 'force_delete'
  | 'restore'
  | 'pause'
  | 'unpause';

/**
 * Named tabs for surveillance interface
 */
export enum SurveillanceTab {
  LIVE = 'live',
  CONTENT = 'content',
  FLAGGED = 'flagged',
  STREAMS = 'streams',
  CALLS = 'calls',
  CHATS = 'chats',
  BODYCONTACT = 'bodycontact',
  EARNINGS = 'earnings',
  ALERTS = 'alerts'
}

/**
 * LiveSession interface for monitoring active sessions
 */
export interface LiveSession {
  id: string;
  type: string;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  content?: string;
  content_type?: string;
  message_type?: string;
  status: string;
  is_active?: boolean;
  is_paused?: boolean;
  title?: string;
  description?: string;
  media_url?: string | string[];
  video_url?: string;
  tags?: string[];
  viewers_count?: number;
  viewer_count?: number; // Added for compatibility
  messages_count?: number;
  participants?: number;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  sender_username?: string;
  location?: string;
  thumbnail_url?: string;
  ghost_mode?: boolean;
  last_active_at?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Interface for content items being monitored
 */
export interface SurveillanceContentItem {
  id: string;
  type?: string;
  content_type: string;
  user_id: string;
  creator_id: string;
  created_at: string;
  updated_at?: string;
  media_url: string[];
  video_url?: string;
  username?: string;
  creator_username: string;
  avatar_url?: string;
  creator_avatar?: string;
  creator_avatar_url?: string;
  content?: string;
  title: string;
  description: string;
  tags?: string[];
  visibility: string; // Adding this property
  status?: string;
  flagged?: boolean;
  severity?: string;
  reason?: string;
  viewers_count?: number;
  views?: number;
  likes?: number;
  likes_count?: number;
  comments?: number;
  comments_count?: number;
  location?: string;
}

/**
 * Media source interface definition
 */
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
  content_type?: string;
}
