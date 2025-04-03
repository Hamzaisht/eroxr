
import { ReactNode } from "react";
import { LiveAlert } from "@/types/alerts";

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

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id: string;
  created_at: string;
  media_url: string[];
  username: string;
  creator_username: string;
  avatar_url?: string;
  creator_avatar_url?: string;
  content: string;
  title: string;
  description: string;
  visibility: string;
  is_draft?: boolean;
  location: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  user_id?: string; // Added for compatibility
  type?: string; // Added for compatibility
  status?: string; // Added for compatibility
  is_ppv?: boolean; // Added for compatibility
  ppv_amount?: number; // Added for compatibility
  original_content?: string; // Added for compatibility
}

// Moderation action types
export type ModerationAction = 
  | 'delete' 
  | 'flag' 
  | 'ban' 
  | 'warn' 
  | 'shadowban' 
  | 'edit'
  | 'view'
  | 'restore'
  | 'force_delete'
  | 'pause'
  | 'unpause';

// Ghost Mode Context Type
export interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  syncGhostModeFromSupabase: () => Promise<void>;
}

// Surveillance and moderation props interfaces
export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

// Define the shape of a content icon
export interface ContentIcon {
  icon: React.ComponentType<any>;
  className: string;
}

// Creator earnings types
export interface CreatorEarnings {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  total_earnings: number;
  current_balance: number;
  last_payout_date?: string;
  last_payout_amount?: number;
  subscriber_count: number;
  tip_count: number;
  ppv_count: number;
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
