
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
          last_engagement_at: new Date().toISOString(),
          is_public: true // Ensure is_public is set to true to comply with RLS
        })
        .eq('id', contentId);
      
      if (updateError) {
        console.error("Error updating view count:", updateError);
        // Try fallback method without timestamp if there's an error
        const { error: fallbackError } = await supabase
          .from('posts')
          .update({ 
            view_count: newCount, 
            is_public: true // Keep this to comply with RLS policies
          })
          .eq('id', contentId);
        
        if (fallbackError) {
          console.error("Fallback update failed:", fallbackError);
          // Use RPC function as last resort
          try {
            await supabase.rpc('increment_counter', {
              row_id: contentId,
              counter_name: 'view_count',
              table_name: 'posts'
            });
          } catch (rpcError) {
            console.error("RPC increment failed:", rpcError);
          }
        }
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
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
          last_engagement_at: new Date().toISOString(),
          is_public: true // Ensure is_public is set to true to comply with RLS
        })
        .eq('id', contentId);
      
      if (updateError) {
        console.error("Error updating share count:", updateError);
        // Try fallback method without timestamp if there's an error
        const { error: fallbackError } = await supabase
          .from('posts')
          .update({ 
            share_count: newCount, 
            is_public: true // Keep this to comply with RLS policies
          })
          .eq('id', contentId);
        
        if (fallbackError) {
          console.error("Fallback update failed:", fallbackError);
          // Use RPC function as last resort
          try {
            await supabase.rpc('increment_counter', {
              row_id: contentId,
              counter_name: 'share_count',
              table_name: 'posts'
            });
          } catch (rpcError) {
            console.error("RPC increment failed:", rpcError);
          }
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
