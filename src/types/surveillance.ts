
import { LiveSessionType, SurveillanceContentItem as BaseSurveillanceContentItem } from "@/components/admin/platform/surveillance/types";
import { ModerationAction } from "@/types/moderation";

export interface SessionModerationActionProps {
  session: BaseSurveillanceContentItem | any;
  onModerate: (content: BaseSurveillanceContentItem | any, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export interface FlaggedContent {
  id: string;
  content_id: string;
  user_id?: string;
  flagged_by?: string;
  content_type: string;
  status: string;
  reason: string;
  severity: string;
  notes?: string;
  flagged_at: string;
}

// Export the LiveSession type
export interface LiveSession {
  id: string;
  type: LiveSessionType | 'content';
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  created_at: string;
  started_at?: string;
  title?: string;
  description?: string;
  status: string;
  viewer_count?: number;
  participants?: number;
  is_paused?: boolean;
  content_type?: string;
  content?: string;
  media_url: string[];
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string | null;
  message_type?: string;
  tags?: string[];
  thumbnail_url?: string;
  is_private?: boolean;
  sender_username?: string;
  location?: string;
  creator_id?: string;
}

// Export the SurveillanceContentItem type from the platform/surveillance folder
export type { SurveillanceContentItem } from "@/components/admin/platform/surveillance/types";

// Export the LiveSessionType
export type { LiveSessionType } from "@/components/admin/platform/surveillance/types";

// Extend ModerationAction to include pause/unpause
export type ExtendedModerationAction = ModerationAction | "pause" | "unpause";

// Define new types for proper typing
export type BaseSurveillanceContentItem = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  content_type: string;
  created_at: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  creator_id?: string;
  creator_username?: string;
  username?: string;
  creator_avatar_url?: string;
  avatar_url?: string;
  content?: string;
  description?: string;
  visibility?: string;
  media_url: string[];
};

export type ContentType = 'story' | 'post' | 'video' | 'audio' | 'all';
