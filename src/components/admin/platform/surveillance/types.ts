
// Re-export all surveillance types from central location
export type { 
  SurveillanceTab,
  LiveSessionType,
  LiveSession,
  ContentType,
  SurveillanceContentItem,
  ModerationAction
} from "@/types/surveillance";

// Local interfaces that are specific to components
export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (content: LiveSession | SurveillanceContentItem, action: string, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}
