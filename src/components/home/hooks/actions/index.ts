
import { useLikeAction } from "./useLikeAction";
import { useDeleteAction } from "./useDeleteAction";
import { useTrackingAction } from "./useTrackingAction";
import { useViewAction } from "./useViewAction";
import { useShortActions as useShortActionsHook } from "./useShortActions";
import { supabase } from "@/integrations/supabase/client";

export const useShortActions = () => {
  const { handleLike } = useLikeAction();
  const { handleDelete } = useDeleteAction();
  const { handleView } = useViewAction();
  const { handleShareTracking } = useTrackingAction();
  const { 
    likeShort, 
    unlikeShort,
    saveShort,
    unsaveShort,
    isProcessing 
  } = useShortActionsHook();

  const handleSave = async (shortId: string) => {
    const isCurrentlySaved = await checkIfSaved(shortId);
    if (isCurrentlySaved) {
      await unsaveShort(shortId);
    } else {
      await saveShort(shortId);
    }
    return true;
  };

  const checkIfSaved = async (shortId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_saves')
        .select('id')
        .eq('post_id', shortId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if short is saved:", error);
      return false;
    }
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
    handleView,
    isProcessing
  };
};

// Re-export the individual hooks
export { 
  useLikeAction,
  useDeleteAction,
  useTrackingAction,
  useViewAction
};
