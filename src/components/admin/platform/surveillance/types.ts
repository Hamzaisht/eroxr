
// Import LiveAlert from user-analytics types
import { LiveAlert as UserAnalyticsLiveAlert } from "../user-analytics/types";

// Re-export LiveAlert for use in surveillance components
export type LiveAlert = UserAnalyticsLiveAlert;

// Define consistent LiveSession interface that extends the user-analytics LiveSession
export interface LiveSession {
  id: string;
  type: "stream" | "call" | "chat" | "bodycontact";
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string;
  status?: string;
  title?: string;
  description?: string;
  viewer_count?: number;
  participants?: number;
  recipient_username?: string;
  sender_username?: string;
  content?: string;
  content_type?: string;
  location?: string;
  tags?: string[];
  created_at?: string;
  // Additional fields needed for surveillance
  creator_id?: string;
  creator_username?: string;
  creator_avatar_url?: string;
  media_url?: string[];
  video_url?: string;
  about_me?: string;
}

export type ContentType = 'post' | 'story' | 'video' | 'ppv';

export type SurveillanceContentItem = {
  id: string;
  content_type: ContentType;
  creator_id: string;
  creator_username?: string;
  creator_avatar_url?: string;
  content: string;
  media_urls?: string[];
  created_at: string;
  updated_at?: string | null;
  is_ppv: boolean;
  is_draft: boolean;
  is_deleted: boolean;
  visibility?: string;
  ppv_amount?: number | null;
  location?: string;
  ip_address?: string;
  expires_at?: string;
};

// Define SessionItemProps interface
export interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: string) => void;
  actionInProgress: string | null;
}

// Define SessionModerationActionProps interface
export interface SessionModerationActionProps {
  session: LiveSession;
  onModerate: (session: LiveSession, action: string) => void;
  actionInProgress: string | null;
}

// Types for earning analytics
export type CreatorEarnings = {
  id: string;
  username: string;
  avatar_url?: string;
  gross_earnings: number;
  net_earnings: number;
  platform_fee: number;
  subscription_count: number;
  ppv_count: number;
  tip_count: number;
  last_payout_date?: string;
  last_payout_amount?: number;
  payout_status?: string;
  stripe_connected: boolean;
};

export type PayoutRequest = {
  id: string;
  creator_id: string;
  creator_username?: string;
  creator_avatar_url?: string;
  amount: number;
  platform_fee: number;
  final_amount: number;
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  notes?: string;
};

export interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
  liveSessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  setIsRefreshing: (value: boolean) => void;
  fetchLiveSessions: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
}

export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'alerts' | 'content' | 'earnings';

// Add monetization types
export type StripeAccount = {
  id: string;
  creator_id: string;
  stripe_account_id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'verified' | 'rejected';
  country: string;
  currency: string;
  details_submitted: boolean;
  payouts_enabled: boolean;
};

export type Transaction = {
  id: string;
  creator_id: string;
  user_id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  transaction_type: 'subscription' | 'tip' | 'ppv' | 'other';
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  stripe_transaction_id?: string;
  error_message?: string;
};
