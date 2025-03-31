
import { useTrackingAction } from "./useTrackingAction";

/**
 * Hook for tracking views on shorts
 * This is a thin wrapper around the tracking functionality to maintain backward compatibility
 */
export const useViewAction = () => {
  const { handleView: trackView } = useTrackingAction();

  // Simply delegate to the tracking action
  const handleView = async (shortId: string) => {
    return trackView(shortId);
  };

  return { handleView };
};
