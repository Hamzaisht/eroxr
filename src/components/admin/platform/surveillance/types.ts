
import { LiveAlert, LiveSession as AnalyticsLiveSession } from "../user-analytics/types";

// Extend the existing LiveSession type with additional properties needed for surveillance
export interface LiveSession extends AnalyticsLiveSession {
  username: string | null;
  type: string;
  user_id: string;
  creator_id?: string;
  creator_username?: string;
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

// Add missing interface definitions
export interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: string) => void;
  actionInProgress: string | null;
}

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
