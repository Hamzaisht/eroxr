
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'content' | 'bodycontact';

export interface LiveSession {
  id: string;
  status: 'active' | 'inactive' | 'flagged';
  type: 'stream' | 'call' | 'chat' | 'content' | 'bodycontact';
  creator_id: string;
  user_id: string;
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  media_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  description?: string;
  title?: string;
  is_paused?: boolean;
  message_type?: string;
  recipients?: string[];
  recipient_username?: string;
  sender_username?: string;
  participants?: number;
  location?: string;
  tags?: string[];
  flagged_reason?: string;
  is_encrypted?: boolean;
  risk_score?: number;
  content_type?: string;
}

export interface SurveillanceContentItem {
  id: string;
  type: string;
  content_type?: string;
  user_id?: string;
  creator_id?: string;
  created_at: string;
  updated_at?: string;
  media_url?: string;
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar?: string;
  content?: string;
  title?: string;
  description?: string;
  status?: string;
  visibility?: string;
  tags?: string[];
  flagged: boolean;
  flagged_reason?: string;
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
  | 'escalate';

export interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  actionInProgress: string | null;
  onRefresh: () => void;
}
