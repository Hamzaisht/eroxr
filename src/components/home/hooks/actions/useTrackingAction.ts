
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTrackingAction = () => {
  const { toast } = useToast();
  
  const handleView = useCallback(async (contentId: string) => {
    try {
      console.log(`View tracked for short: ${contentId}`);
      
      // Use the get_current_count function to safely get the current count
      const { data: currentCount, error: countError } = await supabase.rpc('get_current_count', { 
        p_table: 'posts', 
        p_column: 'view_count', 
        p_id: contentId 
      });
      
      if (countError) {
        console.error("Error getting current view count:", countError);
        throw countError;
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
        console.error("Error updating view count directly:", updateError);
        throw updateError;
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Don't show toast to user for view tracking errors
    }
  }, []);
  
  const handleShareTracking = useCallback(async (contentId: string) => {
    try {
      // Get current count safely
      const { data: currentCount, error: countError } = await supabase.rpc('get_current_count', { 
        p_table: 'posts', 
        p_column: 'share_count', 
        p_id: contentId 
      });
      
      if (countError) {
        console.error("Error getting current share count:", countError);
        throw countError;
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
