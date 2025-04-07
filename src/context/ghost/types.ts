
import { LiveAlert } from "@/types/alerts";
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
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
  syncGhostModeFromSupabase: () => Promise<void>;
}
