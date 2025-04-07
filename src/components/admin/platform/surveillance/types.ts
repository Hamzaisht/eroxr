
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact' | 'content';

export type ContentType = 'posts' | 'stories' | 'videos' | 'audios' | 'all';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  created_at: string;
  started_at?: string;
  title?: string;
  description?: string;
  status: string;
  viewer_count?: number;
  participants?: number;
  is_paused?: boolean;
  content_type?: string;
  content?: string;
  media_url: string[];
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  tags?: string[];
  thumbnail_url?: string;
  is_private?: boolean;
  sender_username?: string;
  location?: string;
  creator_id?: string;
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
  type?: string;
  status?: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  original_content?: any;
  content_id?: string;
  is_paused?: boolean;
}

export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (content: LiveSession | SurveillanceContentItem, action: string, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}
