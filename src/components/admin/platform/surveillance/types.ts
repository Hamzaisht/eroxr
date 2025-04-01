
import { LiveSession } from "../user-analytics/types";

export interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: React.Dispatch<React.SetStateAction<SurveillanceTab>>;
  liveSessions: LiveSession[];
  setLiveSessions: (sessions: LiveSession[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  fetchLiveSessions: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
}

export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'alerts';

export interface SessionModerationActionProps {
  session: LiveSession;
  onModerate: (session: LiveSession, action: string) => Promise<void>;
  actionInProgress: string | null;
}

export interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: string) => Promise<void>;
  actionInProgress: string | null;
}

export interface MediaPreviewDialogProps {
  session: LiveSession | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}
