import { LiveSession } from "@/components/admin/platform/surveillance/types";
import { LiveAlert } from "@/types/alerts";

export interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  isLoading: boolean;
  activeSurveillance: {
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  setIsGhostMode: (state: boolean) => void;
  syncGhostModeFromSupabase: () => Promise<void>;
  canUseGhostMode: boolean;
}
