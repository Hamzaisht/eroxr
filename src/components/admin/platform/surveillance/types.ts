
// Main session types
export interface LiveSession {
  id: string;
  creator_id?: string;
  user_id?: string;
  username?: string;
  creator_username?: string;
  type: "stream" | "call" | "chat" | "bodycontact";
  content?: string;
  content_type?: string;
  created_at: string;
  started_at?: string;
  title?: string;
  description?: string;
  status?: string;
  media_url?: string[] | string;
  avatar_url?: string;
  is_suspended?: boolean;
  is_paused?: boolean;
  pause_end_at?: string;
  pause_reason?: string;
  recipient_username?: string;
  recipient_id?: string;
  sender_username?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  participants?: number;
  metadata?: Record<string, any>;
  about_me?: string;
  video_url?: string;
}

export interface SurveillanceContentItem extends LiveSession {
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
  audio_url?: string;
  creator_avatar_url?: string;
  creator_username?: string;
}

export type ModerationAction = 
  | 'view' 
  | 'edit' 
  | 'flag' 
  | 'warn' 
  | 'pause'
  | 'unpause' 
  | 'shadowban' 
  | 'delete' 
  | 'ban' 
  | 'restore' 
  | 'force_delete';

export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

// Alert and notification types
export interface LiveAlert {
  id: string;
  type: string;
  user_id?: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  created_at: string;
  content_type?: string;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
  content_id?: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
  source: string;
  alert_type: string;
  status: string;
  title: string;
}

// Surveillance tab types
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';
export type ContentType = 'post' | 'story' | 'video' | 'ppv' | 'audio';

// Creator earnings types
export interface CreatorEarnings {
  id: string;
  creator_id: string;
  username: string;
  avatar_url?: string;
  total_earnings: number;
  this_month: number;
  pending_earnings: number;
  last_payout_amount?: number;
  last_payout_date?: string;
  fan_count: number;
  payout_status?: string;
  // Additional fields needed by components
  user_id?: string;
  amount?: number;
  source?: string;
  status?: string;
  description?: string;
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
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  notes?: string;
  creator_username?: string;
}
