
export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string;
  status?: string;
  title?: string;
  description?: string;
  viewer_count?: number;
  participants?: number;
  recipient_username?: string;
  sender_username?: string;
  content?: string;
  content_type?: string;
  location?: string;
  tags?: string[];
  created_at?: string;
  // New fields for better profile handling
  sender_profiles?: {
    username: string;
    avatar_url: string | null;
  };
  receiver_profiles?: {
    username: string;
    avatar_url: string | null;
  };
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
