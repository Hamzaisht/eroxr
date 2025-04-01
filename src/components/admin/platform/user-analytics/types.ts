
export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username: string;
  avatar_url: string | null;
  started_at: string;
  status: string;
  title?: string;
  description?: string;
  content_type: string;
  participants?: number;
  created_at: string;
  
  // Newly added properties to address the TypeScript errors
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  content?: string;
  media_url?: string[];
  video_url?: string;
  about_me?: string;
}
