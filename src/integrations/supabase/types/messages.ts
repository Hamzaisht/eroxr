
/**
 * Message type definitions for the chat system
 */

import { AvailabilityStatus } from "@/utils/media/types";

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  text?: string;
  created_at: string;
  image_urls?: string[];
  video_urls?: string[];
  audio_urls?: string[];
  video_url?: string;
  is_read?: boolean;
  is_deleted?: boolean;
  status?: string;
  message_type?: string;
}

export interface Thread {
  id: string;
  participant_ids: string[];
  created_at: string;
  last_message?: Message;
  unread_count: number;
  is_active: boolean;
}

export interface MessageParticipant {
  id: string;
  username: string;
  avatar_url?: string;
  status?: AvailabilityStatus;
  last_seen?: string;
  is_typing?: boolean;
}
