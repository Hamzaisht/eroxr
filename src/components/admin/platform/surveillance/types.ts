
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact' | 'content';

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
}
