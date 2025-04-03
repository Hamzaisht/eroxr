
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact';

export type ContentType = 'posts' | 'stories' | 'videos' | 'audios' | 'post' | 'story' | 'video' | 'ppv' | 'audio';

export interface LiveSession {
  id: string;
  user_id: string;
  type: "stream" | "call" | "chat" | "bodycontact";
  username?: string;
  avatar_url?: string;
  created_at?: string;
  content?: string;
  media_url: string[] | string;
  status?: string;
  message_type?: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  title?: string;
  description?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  duration?: number;
  metadata?: Record<string, any>;
  started_at?: string;
  creator_id?: string;
  creator_username?: string;
  about_me?: string;
  video_url?: string;
  participants?: any[];
}

export interface SurveillanceContentItem {
  id: string;
  type: string;
  content_type?: string;
  creator_id?: string;
  user_id?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  content?: string;
  media_url: string[] | string;
  status?: string;
  title?: string;
  description?: string;
  creator_username?: string;
  creator_avatar_url?: string;
  visibility?: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  likes_count?: number;
  comments_count?: number;
  view_count?: number;
  duration?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  is_draft?: boolean;
  is_flagged?: boolean;
  video_url?: string;
  audio_url?: string;
  tags?: string[];
  location?: string;
  use_count?: number;
  expires_at?: string;
}

export interface CreatorEarnings {
  id: string;
  creator_id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  total_earnings: number;
  this_month: number;
  pending_earnings: number;
  available_for_payout: number;
  fan_count: number;
  subscription_earnings: number;
  ppv_earnings: number;
  tip_earnings: number;
  subscription_count: number;
  ppv_count: number;
  tip_count: number;
  source?: string;
  status?: string;
  description?: string;
  amount?: number;
  created_at?: string;
}

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
  status: string;
  notes?: string;
  creator_username?: string;
}

export interface LiveAlert {
  id: string;
  timestamp: string;
  type: 'violation' | 'risk' | 'information';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  session_id?: string;
  user_id: string;
  is_viewed: boolean;
  session?: LiveSession;
  username: string;
  avatar_url: string | null;
  created_at: string;
  content_type: string;
  reason: string;
  content_id: string;
  message?: string;
  status?: string;
  alert_type?: string;
}

export interface SessionModerationActionProps {
  session: LiveSession;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export type ModerationAction = 
  | "view" 
  | "edit"
  | "flag"
  | "warn"
  | "shadowban"
  | "delete"
  | "ban"
  | "restore"
  | "force_delete"
  | "pause"
  | "unpause";
