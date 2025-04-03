export type SurveillanceTab = 'streams' | 'calls' | 'chats' | 'bodycontact' | 'content' | 'earnings' | 'alerts';

export interface LiveSession {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  title?: string;
  description?: string;
  status?: string;
  is_private?: boolean;
  viewer_count?: number;
  started_at: string;
  created_at: string;
  media_url: string[];
  content_type: string;
}

export interface LiveAlert {
  id: string;
  type: string;
  alert_type: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: string;
  content_id: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  source: string;
  status: string;
  title: string;
}

export interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
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
  liveAlerts: LiveAlert[];
}

export type ModerationAction = 
  | 'view' 
  | 'edit' 
  | 'flag' 
  | 'warn' 
  | 'delete' 
  | 'ban' 
  | 'shadowban' 
  | 'restore' 
  | 'pause'
  | 'force_delete';

export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}
