
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTrackingAction = () => {
  const { toast } = useToast();
  
  const handleView = useCallback(async (contentId: string | undefined) => {
    // Skip tracking if no contentId provided
    if (!contentId) {
      console.warn('View tracking skipped: No content ID provided');
      return;
    }
    
    try {
      console.log(`Tracking view for content: ${contentId}`);
      
      // Get the current count directly using select
      const { data: currentData, error: fetchError } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', contentId)
        .single();
      
      // If we were able to get the current count, use it, otherwise default to 0
      const viewCount = fetchError ? 0 : (currentData?.view_count || 0);
      const newCount = viewCount + 1;
      
      // Use direct update with the calculated value
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          view_count: newCount,
          last_engagement_at: new Date().toISOString()
        })
        .eq('id', contentId);
      
      if (updateError) {
        console.error("Error updating view count:", updateError);
        // Try fallback method without timestamp if there's an error
        const { error: fallbackError } = await supabase
          .from('posts')
          .update({ view_count: newCount })
          .eq('id', contentId);
        
        if (fallbackError) {
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Don't show toast to user for view tracking errors
    }
  }, []);
  
  const handleShareTracking = useCallback(async (contentId: string | undefined) => {
    if (!contentId) {
      console.warn('Share tracking skipped: No content ID provided');
      return;
    }
    
    try {
      // Get the current count directly using select
      const { data: currentData, error: fetchError } = await supabase
        .from('posts')
        .select('share_count')
        .eq('id', contentId)
        .single();
      
      // If we were able to get the current count, use it, otherwise default to 0
      const shareCount = fetchError ? 0 : (currentData?.share_count || 0);
      const newCount = shareCount + 1;
      
      // Use direct update with the calculated value
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          share_count: newCount,
          last_engagement_at: new Date().toISOString()
        })
        .eq('id', contentId);
      
      if (updateError) {
        console.error("Error updating share count:", updateError);
        // Try fallback method without timestamp if there's an error
        const { error: fallbackError } = await supabase
          .from('posts')
          .update({ share_count: newCount })
          .eq('id', contentId);
        
        if (fallbackError) {
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  }, []);

  return { 
    handleView,
    handleShareTracking
  };
};
