
import { LiveSession } from "../user-analytics/types";

export interface SurveillanceContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveSessions: LiveSession[];
  setLiveSessions: (sessions: LiveSession[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
  fetchLiveSessions: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
}

export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'alerts';
