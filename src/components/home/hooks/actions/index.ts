
import { useLikeAction } from "./useLikeAction";
import { useSaveAction } from "./useSaveAction";
import { useDeleteAction } from "./useDeleteAction";
import { useViewAction } from "./useViewAction";
import { useTrackingAction } from "./useTrackingAction";
import { useShareAction } from "./useShareAction";

/**
 * Combined hook for all short video actions
 * This hook aggregates all the individual action hooks to provide a unified API
 */
export const useShortActions = () => {
  const { handleLike } = useLikeAction();
  const { handleSave } = useSaveAction();
  const { handleDelete } = useDeleteAction();
  const { handleView } = useViewAction();
  const { handleShareTracking } = useTrackingAction();
  const { handleShare } = useShareAction();

  return {
    handleLike,
    handleSave,
    handleDelete,
    handleView,
    handleShareTracking,
    handleShare,
  };
};

// Export individual hooks for direct use when needed
export { 
  useLikeAction, 
  useSaveAction, 
  useDeleteAction, 
  useViewAction,
  useTrackingAction,
  useShareAction
};
