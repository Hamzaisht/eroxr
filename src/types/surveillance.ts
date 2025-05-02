
export interface LiveSession {
  id: string;
  type: 'stream' | 'chat' | 'call' | 'bodycontact' | string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  started_at: string;
  title?: string;
  description?: string;
  status: string;
  is_active: boolean;
  session_data?: any;
}
