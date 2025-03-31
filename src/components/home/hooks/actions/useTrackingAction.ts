
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for tracking user interactions with shorts
 * This handles view tracking and provides a mechanism for other tracking actions
 */
export const useTrackingAction = () => {
  const [trackedViews, setTrackedViews] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  /**
   * Track view for a short
   * This ensures each short is only counted once per session
   */
  const handleView = useCallback(async (shortId: string) => {
    try {
      // Don't count repeated views in the same session
      if (trackedViews[shortId]) {
        return true;
      }

      // Record view in local state to prevent duplicate counts
      setTrackedViews(prev => ({ ...prev, [shortId]: true }));

      // Update view count in the database
      const { error: updateError } = await supabase
        .rpc('increment_counter', { 
          row_id: shortId, 
          counter_name: 'view_count', 
          table_name: 'posts' 
        });

      if (updateError) {
        console.error("Error tracking view:", updateError);
        return false;
      }
      
      // Invalidate the query to update the UI with the new count
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      return true;
    } catch (error) {
      console.error("Error tracking view:", error);
      return false;
    }
  }, [trackedViews, queryClient]);

  /**
   * Track a share action
   */
  const handleShareTracking = useCallback(async (shortId: string) => {
    try {
      // Update share count in the database
      const { error: updateError } = await supabase
        .rpc('increment_counter', { 
          row_id: shortId, 
          counter_name: 'share_count', 
          table_name: 'posts' 
        });

      if (updateError) {
        console.error("Error tracking share:", updateError);
        return false;
      }
      
      // Invalidate the query to update the UI with the new count
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      return true;
    } catch (error) {
      console.error("Error tracking share:", error);
      return false;
    }
  }, [queryClient]);

  return { 
    handleView,
    handleShareTracking,
    trackedViews
  };
};
