
import { useLikeAction } from "./useLikeAction";
import { useDeleteAction } from "./useDeleteAction";
import { useTrackingAction } from "./useTrackingAction";
import { useViewAction } from "./useViewAction";

export const useShortActions = () => {
  const { handleLike } = useLikeAction();
  const { handleDelete } = useDeleteAction();
  const { handleView } = useViewAction();
  const { handleShareTracking } = useTrackingAction();

  const handleSave = async (shortId: string) => {
    // This is a placeholder - to be implemented when save functionality is needed
    console.log(`Save functionality for short ${shortId} not yet implemented`);
    return true;
  };

  const handleShare = (shortId: string) => {
    // Placeholder for actual share implementation
    // Currently just tracks the share action
    handleShareTracking(shortId);
    // Return the URL that can be shared
    return `${window.location.origin}/shorts?id=${shortId}`;
  };

  return {
    handleLike,
    handleDelete,
    handleSave,
    handleShare,
    handleShareTracking,
    handleView
  };
};
