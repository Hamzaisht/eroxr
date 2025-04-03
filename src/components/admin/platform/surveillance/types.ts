
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact' | 'content';

export type ModerationAction = 
  | 'view' 
  | 'flag' 
  | 'ban' 
  | 'delete' 
  | 'force_delete' 
  | 'edit' 
  | 'warn'
  | 'shadowban'
  | 'restore'
  | 'unpause'
  | 'pause';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  created_at: string;
  media_url: string[];
  username?: string;
  avatar_url?: string;
  content?: string;
  content_type?: string;
  status?: string;
  message_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  title?: string;
  description?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  duration?: number;
  started_at?: string;
  creator_id?: string;
  creator_username?: string;
  about_me?: string;
  video_url?: string;
  metadata?: Record<string, any>;
}

// Content-specific type for content surveillance
export type ContentType = 'posts' | 'stories' | 'videos' | 'audios' | 'ppv';

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id?: string;
  user_id?: string;
  created_at: string;
  media_url?: string[];
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar_url?: string;
  content?: string;
  title?: string;
  description?: string;
  visibility?: string;
  is_draft?: boolean;
  is_ppv?: boolean;
  ppv_amount?: number;
  location?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
}

export interface SessionModerationActionProps {
  session: LiveSession;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export interface ContentModerationActionProps {
  content: SurveillanceContentItem;
  onModerate: (content: SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}
