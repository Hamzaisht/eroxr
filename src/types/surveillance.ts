
export interface LiveSession {
  id: string;
  user_id: string;
  username?: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  title?: string;
  started_at: string;
  status: 'active' | 'idle' | 'ended';
  metadata?: Record<string, any>;
  participant_count?: number;
  content_id?: string;
  room_id?: string;
}
