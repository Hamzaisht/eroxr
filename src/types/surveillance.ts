
import { LiveSessionType, SurveillanceContentItem } from "@/components/admin/platform/surveillance/types";
import { ModerationAction } from "@/types/moderation";

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
