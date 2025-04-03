
import { ReactNode } from "react";
import { LiveAlert } from "@/types/alerts";
import { SurveillanceContentItem, SessionModerationActionProps } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";

// LiveSession types
export type LiveSessionType = 'stream' | 'call' | 'chat' | 'content' | 'bodycontact';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  created_at: string;
  started_at?: string;
  media_url?: string[] | string;
  username?: string;
  avatar_url?: string;
  content?: string;
  content_type?: string;
  status?: string;
  message_type?: string;
  title?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  location?: string;
  tags?: string[];
  video_url?: string;
  viewer_count?: number;
  participants?: number;
}

// Content types
export type ContentType = 'posts' | 'stories' | 'videos' | 'audios';
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

// Re-export from centralized type
export type { SurveillanceContentItem };

// Define the shape of a content icon
export interface ContentIcon {
  icon: string;
  className: string;
}

// Creator earnings types
export interface CreatorEarnings {
  id: string;
  user_id: string;
  creator_id: string; // Added for compatibility
  username: string;
  avatar_url?: string;
  total_earnings: number;
  current_balance: number;
  last_payout_date?: string;
  last_payout_amount?: number;
  subscriber_count: number;
  tip_count: number;
  ppv_count: number;
  subscription_earnings?: number; // Added for compatibility
  tip_earnings?: number; // Added for compatibility
  ppv_earnings?: number; // Added for compatibility
}

// Payout request types
export interface PayoutRequest {
  id: string;
  creator_id: string;
  amount: number;
  platform_fee: number;
  final_amount: number;
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  processed_by?: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  notes?: string;
  username?: string;
  creator_username?: string; // Added for compatibility
  avatar_url?: string;
}

export interface SearchFilterProps {
  username?: string;
  userId?: string;
  type?: string;
  status?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Re-export for compatibility
export type { SessionModerationActionProps };
