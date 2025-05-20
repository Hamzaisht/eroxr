
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'content' | 'bodycontact' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'chat' | 'call' | 'bodycontact' | 'content' | 'user' | string;

export type ContentType = 'post' | 'story' | 'video' | 'image' | 'audio' | 'message' | 'profile' | 'comment' | 'text';

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

export interface MediaSource {
  url: string | null;
  type: 'image' | 'video' | 'audio' | 'text';
  media_type?: string;
}

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string; // Required field
  title?: string;
  description?: string;
  status: string;
  is_active: boolean; // Required field
  content?: string;
  media_url?: string[] | string;
  created_at?: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  is_paused?: boolean;
  sender_username?: string;
  participants?: number;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  video_url?: string;
}

export interface SurveillanceContentItem {
  id: string;
  type: string;
  content_type?: string;
  user_id?: string;
  creator_id?: string;
  created_at: string;
  updated_at?: string;
  media_url: string[];
  video_url?: string;
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar?: string;
  creator_avatar_url?: string;
  content?: string;
  title?: string;
  description?: string;
  status?: string;
  visibility?: string;
  tags?: string[];
  flagged?: boolean;
  flagged_reason?: string;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export type ModerationAction = 
  | 'delete'
  | 'hide'
  | 'suspend'
  | 'warn'
  | 'approve'
  | 'flag'
  | 'reject'
  | 'review'
  | 'mark_safe'
  | 'escalate'
  | 'view'
  | 'edit'
  | 'pause'
  | 'unpause'
  | 'shadowban'
  | 'ban'
  | 'force_delete'
  | 'restore';

export interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  actionInProgress: string | null;
  onRefresh: () => void;
}
