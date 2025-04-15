
import { useState } from "react";
import { useToast } from "./use-toast";
import { ContentService } from "@/services/contentService";

/**
 * Hook for interacting with posts, shorts, and other content
 */
export const useContent = (contentType: 'post' | 'short' = 'post') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  /**
   * Handle error from service calls
   */
  const handleError = (error: string, action: string) => {
    setError(error);
    toast({
      title: `Error ${action}`,
      description: error,
      variant: "destructive",
    });
  };
  
  /**
   * Like/unlike a piece of content
   */
  const likeContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ContentService.likeContent(contentId, contentType);
      
      if (!result.success) {
        handleError(result.error || 'Failed to like content', 'liking content');
        return null;
      }
      
      return result.data;
    } catch (error: any) {
      handleError(error.message || 'An unexpected error occurred', 'liking content');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Save/unsave a piece of content
   */
  const saveContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ContentService.saveContent(contentId, contentType);
      
      if (!result.success) {
        handleError(result.error || 'Failed to save content', 'saving content');
        return null;
      }
      
      return result.data;
    } catch (error: any) {
      handleError(error.message || 'An unexpected error occurred', 'saving content');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Track a view for a piece of content
   */
  const trackView = async (contentId: string) => {
    try {
      setError(null);
      
      const result = await ContentService.trackView(contentId, contentType);
      
      if (!result.success) {
        console.error('Failed to track view:', result.error);
      }
    } catch (error: any) {
      console.error('Error tracking view:', error);
    }
  };
  
  /**
   * Track a share for a piece of content
   */
  const trackShare = async (contentId: string) => {
    try {
      setError(null);
      
      const result = await ContentService.trackShare(contentId, contentType);
      
      if (!result.success) {
        console.error('Failed to track share:', result.error);
      }
    } catch (error: any) {
      console.error('Error tracking share:', error);
    }
  };
  
  /**
   * Delete a piece of content
   */
  const deleteContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ContentService.deleteContent(contentId, contentType);
      
      if (!result.success) {
        handleError(result.error || 'Failed to delete content', 'deleting content');
        return false;
      }
      
      return true;
    } catch (error: any) {
      handleError(error.message || 'An unexpected error occurred', 'deleting content');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    likeContent,
    saveContent,
    trackView,
    trackShare,
    deleteContent,
    isLoading,
    error
  };
};
