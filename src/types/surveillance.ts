
import { MediaType } from '@/utils/media/types';

export type SessionStatus = 'active' | 'inactive' | 'pending' | 'completed';
export type SessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'user';
export type ContentType = 'image' | 'video' | 'text' | 'audio';
export type ModerationAction = 'warn' | 'suspend' | 'ban' | 'delete' | 'restrict' | 'none' | 'flag';
export type SurveillanceTab = 'all' | 'streams' | 'chats' | 'calls' | 'dating';

export interface MediaSource {
  url: string;
  type: MediaType | string;
  thumbnail?: string;
}

export interface LiveSession {
  id: string;
  type: SessionType;
  user_id: string;
  username: string;
  status: SessionStatus;
  avatar_url?: string;
  title?: string;
  description?: string;
  content?: string;
  started_at: string;
  created_at?: string;
  is_active: boolean;
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
}

export interface SurveillanceContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  content?: string;
  content_type: string;
  creator_id: string;
  creator_username: string;
  creator_avatar: string;
  user_id: string;
  created_at: string;
  flagged: boolean;
  reason?: string;
  media_url: string[];
  video_url?: string;
  severity: string;
  status: string;
  visibility: string;
}
