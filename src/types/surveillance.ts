
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

// Export the SurveillanceContentItem type from the platform/surveillance folder
export type { SurveillanceContentItem } from "@/components/admin/platform/surveillance/types";

// Extend ModerationAction to include pause/unpause
export type ExtendedModerationAction = ModerationAction | "pause" | "unpause";
