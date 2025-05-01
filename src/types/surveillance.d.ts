
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  created_at: string;
  started_at?: string;
  status?: string;
  media_url?: string | string[];
  content?: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string;
}
