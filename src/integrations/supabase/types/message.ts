
import { Profile } from './profile';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'seen' | 'failed';
export type MessageType = 'text' | 'media' | 'video' | 'audio' | 'snap' | 'document' | 'location';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string | null;
  media_url: string[] | null;
  video_url: string | null;
  audio_url?: string | null;
  document_url?: string | null;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  } | null;
  message_type?: MessageType;
  delivery_status?: MessageDeliveryStatus;
  created_at: string;
  updated_at?: string | null;
  viewed_at?: string | null;
  expires_at?: string | null;
  original_content?: string | null;
  sender?: Profile;
  recipient?: Profile;
}

export interface MessageAudit {
  id: string;
  user_id: string;
  message_id: string;
  action: string;
  details?: any;
  created_at: string;
}

export interface ConversationMeta {
  id: string;
  last_message_id: string;
  last_message_at: string;
  last_message_preview: string;
  participant_ids: string[];
  unread_count: number;
}
