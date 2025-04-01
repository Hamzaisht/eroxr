
export type DirectMessage = {
  id: string;
  sender_id: string | null;
  recipient_id: string | null;
  content: string | null;
  media_url: string[] | null;
  message_type: string | null;
  created_at: string | null;
  expires_at: string | null;
  is_expired: boolean | null;
  video_url: string | null;
  duration: number | null;
  viewed_at: string | null; // Add this property
  original_content: string | null; // Add this property
  updated_at: string | null;
};
