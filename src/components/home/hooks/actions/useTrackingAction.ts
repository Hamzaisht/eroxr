
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
      
      // Use the get_current_count function with direct error handling
      const { data: currentCount, error: countError } = await supabase.rpc('get_current_count', { 
        p_table: 'posts', 
        p_column: 'view_count', 
        p_id: contentId 
      });
      
      // If error in getting current count, use direct update with increment
      if (countError) {
        console.warn("Error getting current view count, using direct increment:", countError);
        
        // Fallback to direct increment
        const { error: directUpdateError } = await supabase
          .from('posts')
          .update({ 
            view_count: supabase.sql`COALESCE(view_count, 0) + 1`,
            last_engagement_at: new Date().toISOString()
          })
          .eq('id', contentId);
          
        if (directUpdateError) {
          console.error("Error incrementing view count directly:", directUpdateError);
          throw directUpdateError;
        }
        
        return;
      }
      
      // Add 1 to the current count
      const newCount = (currentCount || 0) + 1;
      
      // Direct update approach with the new count
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          view_count: newCount,
          last_engagement_at: new Date().toISOString()
        })
        .eq('id', contentId);
      
      if (updateError) {
        console.error("Error updating view count:", updateError);
        throw updateError;
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
      // Get current count safely
      const { data: currentCount, error: countError } = await supabase.rpc('get_current_count', { 
        p_table: 'posts', 
        p_column: 'share_count', 
        p_id: contentId 
      });
      
      // If error in getting current count, use direct update with increment
      if (countError) {
        console.warn("Error getting current share count, using direct increment:", countError);
        
        // Fallback to direct increment
        const { error: directUpdateError } = await supabase
          .from('posts')
          .update({ 
            share_count: supabase.sql`COALESCE(share_count, 0) + 1`,
            last_engagement_at: new Date().toISOString()
          })
          .eq('id', contentId);
          
        if (directUpdateError) {
          console.error("Error incrementing share count directly:", directUpdateError);
          throw directUpdateError;
        }
        
        return;
      }
      
      // Add 1 to current count
      const newCount = (currentCount || 0) + 1;
      
      // Direct update with new count  
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          share_count: newCount,
          last_engagement_at: new Date().toISOString()
        })
        .eq('id', contentId);
        
      if (updateError) {
        console.error("Error updating share count:", updateError);
        throw updateError;
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
