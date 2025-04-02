// Creating this file if it doesn't exist or updating it if it does
export type ContentType = 'post' | 'story' | 'video' | 'ppv' | 'audio';
export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';
export type ModerationAction = 
  | 'flag' 
  | 'warn' 
  | 'ban' 
  | 'delete' 
  | 'edit' 
  | 'shadowban' 
  | 'restore' 
  | 'force_delete' 
  | 'view';

export interface SessionMetadata {
  // For BodyContact ads
  latitude?: number;
  longitude?: number;
  view_count?: number;
  click_count?: number;
  message_count?: number;
  verification_status?: string;
  
  // For chat messages
  message_source?: string;
  viewed_at?: string;
  original_content?: string;
  sender_verification?: string;
  recipient_verification?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string;
  status?: string;
  title?: string;
  description?: string;
  viewer_count?: number;
  content_type?: string;
  created_at?: string;
  // Additional properties for different types
  participants?: number;
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string;
  sender_username?: string;
  content?: string;
  media_url: string[];
  video_url?: string;
  about_me?: string;
  location?: string;
  tags?: string[];
  metadata?: SessionMetadata;
  // User profiles for chats
  sender_profiles?: {
    username: string;
    avatar_url: string | null;
  };
  receiver_profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id: string;
  creator_username?: string;
  username?: string;
  avatar_url?: string | null;
  creator_avatar_url?: string | null;
  created_at: string;
  title: string;
  description: string;
  content?: string;
  location?: string;
  media_urls?: string[];
  video_url?: string | null;
  video_urls?: string[];
  audio_url?: string | null;
  visibility?: string;
  is_ppv: boolean;
  ppv_amount?: number;
  likes_count?: number;
  comments_count?: number;
  view_count?: number;
  is_draft?: boolean;
  is_deleted?: boolean;
  is_active?: boolean;
  is_flagged?: boolean;
  expires_at?: string;
  tags?: string[];
  use_count?: number;
  duration?: number;
  user_id?: string; // Adding missing property
}

export interface LiveAlert {
  id: string;
  type: string;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: string;
  content_id: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
  source: string;
  details?: any;
  alert_type: string;  // Adding missing property
  status: string;      // Adding missing property
  title: string;       // Adding missing property
}

export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export interface CreatorEarnings {
  id: string;
  username: string;
  avatar_url: string | null;
  gross_earnings: number;
  net_earnings: number;
  platform_fee: number;
  subscription_count: number;
  ppv_count: number;
  tip_count: number;
  last_payout_date?: string;
  last_payout_amount: number;
  payout_status: string;
  stripe_connected: boolean;
  user_id: string;    // Adding to ensure it's available
  source: string;     // Adding to ensure it's available
  status: string;     // Adding to ensure it's available
  amount: string;     // Adding to ensure it's available
  description: string; // Adding to ensure it's available
  created_at: string; // Adding the missing property
}

export interface PayoutRequest {
  id: string;
  creator_id: string;
  creator_username: string;
  creator_avatar_url: string | null;
  amount: number;
  platform_fee: number;
  final_amount: number;
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  notes?: string;
}

export interface StripeAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  created_at: string;
  is_verified: boolean;
  country: string;
  default_currency: string;
  status?: string;
  currency?: string;
}

export interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  onMonitorSession?: (session: LiveSession) => Promise<boolean>;
  activeTab: string;
}

export interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
  liveSessions: LiveSession[];
  isLoading: boolean;
  isRefreshing: boolean;
  setIsRefreshing: (value: boolean) => void;
  error: string | null;
  fetchLiveSessions: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
  liveAlerts?: LiveAlert[];
}

export interface ContentInteractionUser {
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface ContentPurchaseUser extends ContentInteractionUser {
  amount: number;
}

export interface ContentInteractions {
  viewers: ContentInteractionUser[];
  likers: ContentInteractionUser[];
  buyers: ContentPurchaseUser[];
}
