
import { LiveSession } from "@/types/surveillance";
import { LiveAlert } from "@/types/alerts";

export interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (state: boolean) => void;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: LiveAlert[] | null;
  refreshAlerts: () => Promise<void>;
  syncGhostModeFromSupabase: () => Promise<void>;
}
