
import { LiveSession, SurveillanceTab } from "@/types/surveillance";

export interface SurveillanceData {
  liveSessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  activeTab?: SurveillanceTab;
  liveAlerts: any[];
}

export interface SessionData {
  id: string;
  type: string;
  user_id: string;
  username: string;
  created_at: string;
  title?: string;
  description?: string;
  content?: string;
  status: string;
  media_url: string[];
  recipient_username?: string;
  message_type?: string;
}
