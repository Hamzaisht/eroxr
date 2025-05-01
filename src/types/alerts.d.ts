
export interface LiveAlert {
  id: string;
  user_id: string;
  content: string;
  type: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  details?: any;
  is_read?: boolean;
}
