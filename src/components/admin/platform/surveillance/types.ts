
import { ReactNode } from "react";

// LiveSession types
export type LiveSessionType = 'stream' | 'call' | 'chat' | 'content' | 'bodycontact';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  created_at: string;
  started_at?: string;
  media_url?: string[] | string;
  username?: string;
  avatar_url?: string;
  content?: string;
  content_type?: string;
  status?: string;
  message_type?: string;
  title?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  location?: string;
  tags?: string[];
}

// LiveAlert types
export interface LiveAlert {
  id: string;
  type: string;
  alert_type: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  content_id: string;
  message: string;
  status: string;
  title: string;
  description: string;
  is_viewed: boolean;
  session?: LiveSession;
}

// Content types
export type ContentType = 'posts' | 'stories' | 'videos' | 'audios';

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id: string;
  created_at: string;
  media_url: string[];
  username: string;
  creator_username: string;
  avatar_url?: string;
  creator_avatar_url?: string;
  content: string;
  title: string;
  description: string;
  visibility: string;
  is_draft?: boolean;
  location: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
}

// Moderation action types
export type ModerationAction = 'delete' | 'flag' | 'ban' | 'warn' | 'shadowban' | 'edit';

// Ghost Mode Context Type
export interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  syncGhostModeFromSupabase: () => Promise<void>;
}

// Define the shape of a content icon
export interface ContentIcon {
  icon: React.ComponentType<any>;
  className: string;
}
