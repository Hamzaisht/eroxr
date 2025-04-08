
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTrackingAction = () => {
  const { toast } = useToast();
  
  const handleView = useCallback(async (contentId: string) => {
    try {
      console.log(`View tracked for short: ${contentId}`);
      
      // Direct update approach as a fallback for the RPC function
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          view_count: supabase.rpc('get_current_count', { 
            p_table: 'posts', 
            p_column: 'view_count', 
            p_id: contentId 
          }).then(res => (res.data || 0) + 1),
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
      // Direct update approach
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          share_count: supabase.rpc('get_current_count', { 
            p_table: 'posts', 
            p_column: 'share_count', 
            p_id: contentId 
          }).then(res => (res.data || 0) + 1),
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
