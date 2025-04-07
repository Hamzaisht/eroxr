
// First import all types from central location
import type { 
  SurveillanceTab,
  LiveSessionType,
  LiveSession,
  ContentType,
  SurveillanceContentItem,
  ModerationAction
} from "@/types/surveillance";

// Re-export all surveillance types for convenience
export type { 
  SurveillanceTab,
  LiveSessionType,
  LiveSession,
  ContentType,
  SurveillanceContentItem,
  ModerationAction
};

// Local interfaces that are specific to components - these use the imported types
export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (content: LiveSession | SurveillanceContentItem, action: string, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}
