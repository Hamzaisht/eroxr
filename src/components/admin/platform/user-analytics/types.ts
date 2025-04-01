export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username: string;
  avatar_url: string | null;
  started_at: string;
  status: string;
  title?: string;
  content_type: string;
  participants?: number;
  created_at: string;
}

export interface LiveAlert {
  id: string;
  type: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  content_type: string;
  reason: string;
  severity: string;
  content_id: string;
}
