import { ModerationAction } from "@/types/moderation";

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'content' | 'bodycontact';

export type ContentType = 'posts' | 'stories' | 'videos' | 'audios';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  created_at: string;
  started_at?: string;
  content?: string;
  media_url: string[] | string;
  username: string;
  sender_username?: string;
  recipient_username?: string;
  avatar_url?: string;
  content_type: string;
  message_type?: string;
  title?: string;
  description?: string;
  status?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  participants?: number;
  recipient_id?: string;
  creator_id?: string;
  is_paused?: boolean;
  visibility?: string;
}

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id: string;
  user_id?: string; 
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
  type?: string; // For compatibility with LiveSession
  status?: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  original_content?: any;
  content_id?: string;
  is_paused?: boolean;
}

export interface SessionModerationActionProps {
  session: SurveillanceContentItem | LiveSession;
  onModerate: (content: SurveillanceContentItem | LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export interface FlaggedContent {
  id: string;
  content_id: string;
  user_id?: string;
  flagged_by?: string;
  content_type: string;
  status: string;
  reason: string;
  severity: string;
  notes?: string;
  flagged_at: string;
}

// Export any other types needed throughout the surveillance component tree
export interface ContentIcon {
  name: string;
  icon: JSX.Element;
}

export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type ModerationAction = 'ban' | 'flag' | 'delete' | 'edit' | 'shadowban' | 'force_delete' | 'review' | 'dismiss';
