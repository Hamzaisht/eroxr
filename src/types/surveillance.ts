
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
 * Moderation action types that can be performed
 */
export enum ModerationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  DELETE = 'delete',
  FLAG = 'flag',
  WARN = 'warn',
  BAN = 'ban',
  SUSPEND = 'suspend'
}

/**
 * LiveSession interface for monitoring active sessions
 */
export interface LiveSession {
  id: string;
  type: SessionType | string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  content?: string;
  content_type?: string;
  message_type?: string;
  status: SessionStatus | string;
  is_active?: boolean;
  is_paused?: boolean;
  title?: string;
  description?: string;
  media_url?: string | string[];
  video_url?: string;
  tags?: string[];
  viewers_count?: number;
  messages_count?: number;
}

/**
 * Interface for content items being monitored
 */
export interface SurveillanceContentItem {
  id: string;
  type: string;
  content_type: string;
  user_id: string;
  creator_id: string;
  created_at: string;
  media_url?: string | string[];
  video_url?: string;
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar?: string;
  creator_avatar_url?: string;
  content?: string;
  title?: string;
  description?: string;
  tags?: string[];
  status?: string;
  flagged?: boolean;
  severity?: string;
  reason?: string;
  viewers_count?: number;
  likes_count?: number;
  comments_count?: number;
  comments?: any[];
}

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
  BODYCONTACT = 'bodycontact'
}
