export interface Reaction {
  emoji: string;
  users: string[];
  count?: number;
}

export type MessageType = 
  | 'text'
  | 'media'
  | 'video'
  | 'audio'
  | 'snap'
  | 'document'
  | 'location'
  | 'ad_message'
  | 'system';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  viewed_at?: string;
  deleted_at?: string;
  media_url?: string[];
  video_url?: string;
  document_url?: string;
  message_type?: MessageType;
  reply_to_id?: string;
  reply_to?: DirectMessage;
  reactions?: Reaction[];
  is_read?: boolean;
  delivery_status?: 'sent' | 'delivered' | 'seen';
  original_content?: string;
  expires_at?: string;
}
