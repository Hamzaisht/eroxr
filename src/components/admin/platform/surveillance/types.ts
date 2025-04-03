export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact' | 'content';

export type ModerationAction = 
  | 'view' 
  | 'flag' 
  | 'ban' 
  | 'delete' 
  | 'force_delete' 
  | 'edit' 
  | 'warn'
  | 'shadowban'
  | 'restore'
  | 'unpause'
  | 'pause';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  user_id: string;
  created_at: string;
  media_url: string[];
  username?: string;
  avatar_url?: string;
  content?: string;
  content_type?: string;
  status?: string;
  message_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  title?: string;
  description?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  duration?: number;
  started_at?: string;
  creator_id?: string;
  creator_username?: string;
  about_me?: string;
  video_url?: string;
  metadata?: Record<string, any>;
  participants?: number;
}

// Content-specific type for content surveillance
export type ContentType = 'posts' | 'stories' | 'videos' | 'audios' | 'ppv' | 'post' | 'story' | 'video' | 'audio';

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id?: string;
  user_id?: string;
  created_at: string;
  media_url?: string[];
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar_url?: string;
  content?: string;
  title?: string;
  description?: string;
  visibility?: string;
  is_draft?: boolean;
  is_ppv?: boolean;
  ppv_amount?: number;
  location?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
  type?: string; // Adding type property
  status?: string; // Adding status property
  source?: string; // Adding source property
  amount?: number; // Adding amount property for earnings entries
}

export interface SessionModerationActionProps {
  session: LiveSession;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export interface ContentModerationActionProps {
  content: SurveillanceContentItem;
  onModerate: (content: SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

// Add the LiveAlert interface
export interface LiveAlert {
  id: string;
  type: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: "high" | "medium" | "low";
  content_id: string;
  title: string;
  message?: string;
  status?: string;
  description: string;
  is_viewed: boolean;
  alert_type?: string;
  session_id?: string;
  session?: LiveSession;
}

// Add PayoutRequest interface
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
  creator_username?: string;
}

// Add CreatorEarnings interface
export interface CreatorEarnings {
  creator_id: string;
  username: string;
  avatar_url?: string;
  total_earnings: number;
  subscription_earnings: number;
  tip_earnings: number;
  ppv_earnings: number;
  last_payout_date?: string;
  last_payout_amount?: number;
}
