
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { useContent } from "@/hooks/useContent";

/**
 * Hook for short video actions
 */
export const useShortActions = () => {
  const { toast } = useToast();
  const { 
    likeContent, 
    saveContent, 
    deleteContent, 
    trackView, 
    trackShare, 
    isLoading 
  } = useContent('short');
  
  /**
   * Handle like action
   */
  const handleLike = useCallback(async (shortId: string) => {
    const result = await likeContent(shortId);
    return result;
  }, [likeContent]);

  /**
   * Handle save action
   */
  const handleSave = useCallback(async (shortId: string) => {
    const result = await saveContent(shortId);
    return result;
  }, [saveContent]);
  
  /**
   * Handle delete action
   */
  const handleDelete = useCallback(async (shortId: string) => {
    const success = await deleteContent(shortId);
    
    if (!success) {
      throw new Error("Failed to delete short");
    }
    
    return true;
  }, [deleteContent]);
  
  /**
   * Handle share action
   */
  const handleShare = useCallback(async (shortId: string) => {
    try {
      // Implementation depends on share functionality, this is a placeholder
      return true;
    } catch (error) {
      console.error("Error sharing short:", error);
      toast({
        title: "Share failed",
        description: "Failed to share this short. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);
  
  /**
   * Track share
   */
  const handleShareTracking = useCallback((shortId: string) => {
    trackShare(shortId);
  }, [trackShare]);
  
  /**
   * Track view
   */
  const handleView = useCallback((shortId: string) => {
    return trackView(shortId);
  }, [trackView]);
  
  return {
    handleLike,
    handleSave,
    handleDelete,
    handleShare,
    handleShareTracking,
    handleView,
    isLoading
  };
};
