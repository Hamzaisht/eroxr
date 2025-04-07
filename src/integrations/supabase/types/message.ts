
export type DirectMessage = {
  id: string;
  sender_id: string | null;
  recipient_id: string | null;
  content: string | null;
  media_url: string[] | null;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'snap' | 'call' | 'file' | null;
  created_at: string | null;
  expires_at: string | null;
  is_expired: boolean | null;
  video_url: string | null;
  duration: number | null;
  viewed_at: string | null;
  original_content: string | null;
  updated_at: string | null;
  message_source?: string | null;
  call_duration?: number | null;
  call_status?: 'missed' | 'answered' | 'declined' | null;
  delivery_status?: 'sent' | 'delivered' | 'seen' | null;
  call_type?: 'audio' | 'video' | null;
};
