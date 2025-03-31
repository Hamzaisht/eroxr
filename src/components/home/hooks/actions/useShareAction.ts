
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for handling share actions on shorts
 * Tracks shares and provides share functionality
 */
export const useShareAction = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Track share and return share URL
   * @param shortId The ID of the short being shared
   * @returns Share URL for the short
   */
  const handleShare = async (shortId: string) => {
    try {
      // Track the share action
      const { error } = await supabase
        .from("posts")
        .update({ share_count: supabase.rpc('increment', { count: 1 }) })
        .eq("id", shortId);

      if (error) {
        console.error("Error tracking share:", error);
      } else {
        // Invalidate query to refresh data
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }

      // Create share URL
      const shareUrl = `${window.location.origin}/shorts?id=${shortId}`;
      return shareUrl;
    } catch (error) {
      console.error("Error handling share:", error);
      toast({
        title: "Action failed",
        description: "Failed to share the video",
        variant: "destructive",
      });
      return null;
    }
  };

  return { handleShare };
};
