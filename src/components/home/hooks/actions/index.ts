
import { useLikeAction } from "./useLikeAction";
import { useSaveAction } from "./useSaveAction";
import { useDeleteAction } from "./useDeleteAction";
import { useViewAction } from "./useViewAction";

/**
 * Combined hook for all short video actions
 * This hook aggregates all the individual action hooks to provide a unified API
 */
export const useShortActions = () => {
  const { handleLike } = useLikeAction();
  const { handleSave } = useSaveAction();
  const { handleDelete } = useDeleteAction();
  const { handleView } = useViewAction();

  return {
    handleLike,
    handleSave,
    handleDelete,
    handleView,
  };
};

// Export individual hooks for direct use when needed
export { useLikeAction, useSaveAction, useDeleteAction, useViewAction };
