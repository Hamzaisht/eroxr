
import { LiveSessionType } from "@/components/admin/platform/surveillance/types";
import { ModerationAction } from "@/types/moderation";

export interface SurveillanceContentItem {
  id: string;
  content_type: string;
  creator_id: string;
  user_id?: string; 
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
  type?: string; // For compatibility with LiveSession
  status?: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  original_content?: any;
  content_id?: string;
  is_paused?: boolean;
}

export interface SessionModerationActionProps {
  session: SurveillanceContentItem | any;
  onModerate: (content: SurveillanceContentItem | any, action: ModerationAction, editedContent?: string) => Promise<void>;
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
